import { describe, expect, it } from "vitest";
import { buildRecommendations, computeGaps } from "./path-engine";
import { SKILLS, type ConfidenceMap, type OnboardingAnswers } from "./domain";

const allConfidence = (level: number) =>
  Object.fromEntries(SKILLS.map((s) => [s, level])) as ConfidenceMap;

const answers = (over: Partial<OnboardingAnswers> = {}): OnboardingAnswers => ({
  careerStage: "growing",
  areas: ["research"],
  goals: ["grow"],
  confidence: allConfidence(3),
  university: "",
  program: "",
  ...over,
});

const gapOf = (gaps: ReturnType<typeof computeGaps>, skill: string) => gaps.find((g) => g.skill === skill)!;

describe("computeGaps", () => {
  it("returns one entry per skill, in skill order", () => {
    const gaps = computeGaps({ areas: ["research"], confidence: allConfidence(3) });
    expect(gaps.map((g) => g.skill)).toEqual([...SKILLS]);
  });

  it("falls back to the notSure targets (all 3) when no area is chosen", () => {
    const gaps = computeGaps({ areas: [], confidence: allConfidence(1) });
    expect(gaps.every((g) => g.target === 3 && g.gap === 2)).toBe(true);
  });

  it("uses the highest target across the chosen areas", () => {
    // research macro = 4, trading macro = 5; trading statements = 3, research statements = 5
    const gaps = computeGaps({ areas: ["research", "trading"], confidence: allConfidence(1) });
    expect(gapOf(gaps, "macro").target).toBe(5);
    expect(gapOf(gaps, "statements").target).toBe(5);
  });

  it("never sets a target below 3", () => {
    const gaps = computeGaps({ areas: ["fintech"], confidence: allConfidence(1) });
    expect(Math.min(...gaps.map((g) => g.target))).toBe(3);
  });

  it("treats a missing confidence as level 1", () => {
    const gaps = computeGaps({ areas: ["research"], confidence: {} as ConfidenceMap });
    expect(gapOf(gaps, "statements")).toEqual({ skill: "statements", current: 1, target: 5, gap: 4 });
  });

  it("clamps the gap at zero when confidence exceeds the target", () => {
    const gaps = computeGaps({ areas: ["notSure"], confidence: allConfidence(5) });
    expect(gaps.every((g) => g.gap === 0 && g.current === 5)).toBe(true);
  });
});

describe("buildRecommendations: trails", () => {
  it("returns the top 4 trails sorted by score", () => {
    const { trails } = buildRecommendations(answers());
    expect(trails).toHaveLength(4);
    const scores = trails.map((t) => t.score);
    expect(scores).toEqual([...scores].sort((a, b) => b - a));
  });

  it("ranks by skill gaps and explains the top trail with its biggest gap", () => {
    const { trails } = buildRecommendations(
      answers({ areas: ["investmentBanking"], goals: ["network"], confidence: allConfidence(1) }),
    );
    // valuation: 4·1·2 + 4·0.4·2 + 1.5 area = 12.7, ahead of every single-skill trail
    expect(trails[0].trail.id).toBe("valuation");
    expect(trails[0].score).toBeCloseTo(12.7);
    expect(trails[0].reason).toEqual({ kind: "gap", skill: "valuation" });
  });

  it("explains a trail by goal when the goal outweighs the gaps", () => {
    const { trails } = buildRecommendations(
      answers({ careerStage: "exploring", areas: ["notSure"], goals: ["understandMarket"], confidence: allConfidence(5) }),
    );
    const marketMap = trails.find((t) => t.trail.id === "market-map")!;
    // 1.5 area + 2 goal + 2 foundation, no gaps
    expect(marketMap.score).toBeCloseTo(5.5);
    expect(marketMap.reason).toEqual({ kind: "goal", goal: "understandMarket" });
    expect(trails[0].trail.id).toBe("market-map");
  });

  it("explains a trail by area when gaps are small and no goal matches", () => {
    const { trails } = buildRecommendations(
      answers({ areas: ["wealthManagement"], goals: ["network"], confidence: allConfidence(4) }),
    );
    const personal = trails.find((t) => t.trail.id === "personal-finance")!;
    expect(personal.reason).toEqual({ kind: "area", area: "wealthManagement" });
  });

  it("does not use notSure as an area reason and falls back to foundation", () => {
    const { trails } = buildRecommendations(
      answers({ careerStage: "exploring", areas: ["notSure"], goals: ["network"], confidence: allConfidence(5) }),
    );
    const marketMap = trails.find((t) => t.trail.id === "market-map")!;
    expect(marketMap.reason).toEqual({ kind: "foundation" });
  });

  it("boosts foundation trails only for early career stages", () => {
    const base = { areas: ["notSure"] as OnboardingAnswers["areas"], goals: ["network"] as OnboardingAnswers["goals"], confidence: allConfidence(5) };
    const score = (careerStage: OnboardingAnswers["careerStage"]) =>
      buildRecommendations(answers({ ...base, careerStage })).trails.find((t) => t.trail.id === "market-map")!.score;
    for (const early of ["exploring", "transition", "returning"] as const) expect(score(early)).toBeCloseTo(3.5);
    expect(score("growing")).toBeCloseTo(1.5);
  });
});

describe("buildRecommendations: journeys", () => {
  const journeys = (over: Partial<OnboardingAnswers>) => buildRecommendations(answers(over)).journeys;
  const playbook = (id: string) => ({ kind: "playbook", id });

  it("suggests growth playbooks for grow or leadership goals", () => {
    expect(journeys({ goals: ["leadership"] })).toEqual([
      playbook("passed-over"),
      playbook("credit"),
      playbook("pay-negotiation"),
    ]);
  });

  it("suggests networking and pay negotiation for a first job", () => {
    expect(journeys({ careerStage: "exploring", goals: ["firstJob"] })).toEqual([
      playbook("networking"),
      playbook("pay-negotiation"),
    ]);
  });

  it("adds the interrupted-career playbook for newcomer, early and growing stages", () => {
    expect(journeys({ careerStage: "newcomer", goals: ["network"] })).toEqual([
      playbook("networking"),
      playbook("interrupted"),
    ]);
  });

  it("falls back to networking and interrupted when nothing matches", () => {
    expect(journeys({ careerStage: "internship", goals: ["certification"] })).toEqual([
      playbook("networking"),
      playbook("interrupted"),
    ]);
  });

  it("puts family first for a balance goal and keeps at most 3", () => {
    expect(journeys({ goals: ["balance", "grow"] })).toEqual([
      { kind: "family" },
      playbook("passed-over"),
      playbook("credit"),
    ]);
  });

  it("puts family first for women returning to work", () => {
    expect(journeys({ careerStage: "returning", goals: ["certification"] })[0]).toEqual({ kind: "family" });
  });
});

describe("buildRecommendations: mentors and groups", () => {
  it("returns the two best matches, best first", () => {
    const { mentors, groups } = buildRecommendations(
      answers({ careerStage: "internship", areas: ["investmentBanking"], goals: ["getInternship"] }),
    );
    expect(mentors).toHaveLength(2);
    expect(groups).toHaveLength(2);
    expect(mentors[0].id).toBe("amara-okafor");
    expect(groups[0].id).toBe("valuation-circle");
  });

  it("matches career changers with transition-focused people", () => {
    const { mentors, groups } = buildRecommendations(
      answers({ careerStage: "transition", areas: ["fintech"], goals: ["changeCareer"] }),
    );
    expect(mentors[0].id).toBe("mei-tan");
    expect(groups[0].id).toBe("transition-circle");
  });
});

describe("buildRecommendations: next steps", () => {
  it("starts with an area guide when no real area is chosen", () => {
    const { nextSteps } = buildRecommendations(answers({ areas: ["notSure"] }));
    expect(nextSteps[0]).toEqual({ key: "areaGuide", area: "assetManagement" });
  });

  it("uses her first real area for the guide when exploring", () => {
    const { nextSteps } = buildRecommendations(answers({ careerStage: "exploring", areas: ["notSure", "trading"] }));
    expect(nextSteps[0]).toEqual({ key: "areaGuide", area: "trading" });
  });

  it("skips the area guide for an established professional and leads with the top trail", () => {
    const recs = buildRecommendations(answers({ careerStage: "growing", areas: ["research"], goals: ["grow"] }));
    expect(recs.nextSteps).toEqual([
      { key: "trail", trail: recs.trails[0].trail.title },
      { key: "playbook", id: "passed-over" },
      { key: "stories" },
      { key: "community" },
    ]);
  });

  it("links to family content when that is the first journey", () => {
    const { nextSteps } = buildRecommendations(answers({ careerStage: "returning", goals: ["balance"] }));
    expect(nextSteps).toContainEqual({ key: "family" });
  });

  it("never returns more than 4 steps", () => {
    const { nextSteps } = buildRecommendations(answers({ careerStage: "exploring", areas: ["notSure"], goals: ["understandMarket"] }));
    expect(nextSteps).toHaveLength(4);
  });
});

describe("buildRecommendations", () => {
  it("is deterministic for the same answers", () => {
    const a = answers({ areas: ["trading", "fintech"], goals: ["changeCareer", "network"] });
    expect(buildRecommendations(a)).toEqual(buildRecommendations(structuredClone(a)));
  });
});
