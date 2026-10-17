/**
 * Turns onboarding answers into personalized recommendations: a skills-gap map,
 * ranked trails, Career Journey content, suggested connections and next steps.
 * Pure and deterministic, so it's easy to test and nothing extra is stored.
 */
import { GROUPS, MENTORS, TRAILS, type GroupMeta, type MentorMeta, type TrailMeta } from "@/content/catalog";
import { SKILLS, type AreaId, type CareerStageId, type GoalId, type OnboardingAnswers, type SkillId } from "./domain";

/** Expected level (1–5) per skill for each area of the market. */
const AREA_TARGETS: Record<AreaId, Record<SkillId, number>> = {
  research:          { statements: 5, valuation: 5, macro: 4, portfolio: 3, tools: 4, interviews: 4 },
  assetManagement:   { statements: 4, valuation: 4, macro: 4, portfolio: 5, tools: 4, interviews: 4 },
  investmentBanking: { statements: 5, valuation: 5, macro: 3, portfolio: 3, tools: 5, interviews: 5 },
  trading:           { statements: 3, valuation: 3, macro: 5, portfolio: 4, tools: 4, interviews: 5 },
  privateEquity:     { statements: 5, valuation: 5, macro: 3, portfolio: 3, tools: 5, interviews: 4 },
  wealthManagement:  { statements: 3, valuation: 3, macro: 4, portfolio: 5, tools: 3, interviews: 5 },
  corporateFinance:  { statements: 5, valuation: 4, macro: 3, portfolio: 3, tools: 5, interviews: 4 },
  riskCompliance:    { statements: 4, valuation: 3, macro: 4, portfolio: 4, tools: 5, interviews: 3 },
  fintech:           { statements: 3, valuation: 3, macro: 3, portfolio: 3, tools: 5, interviews: 4 },
  notSure:           { statements: 3, valuation: 3, macro: 3, portfolio: 3, tools: 3, interviews: 3 },
};

export interface SkillGap {
  skill: SkillId;
  current: number;
  target: number;
  gap: number;
}

export type TrailReason =
  | { kind: "gap"; skill: SkillId }
  | { kind: "area"; area: AreaId }
  | { kind: "goal"; goal: GoalId }
  | { kind: "foundation" };

export interface RankedTrail {
  trail: TrailMeta;
  score: number;
  reason: TrailReason;
}

/** A link into the Career Journeys section. */
export type JourneyRec =
  | { kind: "playbook"; id: string }
  | { kind: "family" };

export type NextStep =
  | { key: "trail"; trail: string }
  | { key: "areaGuide"; area: AreaId }
  | { key: "playbook"; id: string }
  | { key: "family" | "community" | "stories" | "settings" };

export interface Recommendations {
  gaps: SkillGap[];
  trails: RankedTrail[];
  journeys: JourneyRec[];
  mentors: MentorMeta[];
  groups: GroupMeta[];
  nextSteps: NextStep[];
}

const realAreas = (areas: AreaId[]) => areas.filter((a) => a !== "notSure");

export function computeGaps(a: Pick<OnboardingAnswers, "areas" | "confidence">): SkillGap[] {
  const areas = a.areas.length ? a.areas : (["notSure"] as AreaId[]);
  return SKILLS.map((skill) => {
    const target = Math.max(3, ...areas.map((ar) => AREA_TARGETS[ar][skill]));
    const current = a.confidence[skill] ?? 1;
    return { skill, current, target, gap: Math.max(0, target - current) };
  });
}

function rankTrails(a: OnboardingAnswers, gaps: SkillGap[]): RankedTrail[] {
  const gapBy = Object.fromEntries(gaps.map((g) => [g.skill, g.gap])) as Record<SkillId, number>;
  const early: CareerStageId[] = ["exploring", "transition", "returning"];

  return TRAILS.map((trail) => {
    let gapScore = 0;
    let topSkill: SkillId | null = null;
    let topSkillScore = 0;
    for (const [skill, weight] of Object.entries(trail.skills) as [SkillId, number][]) {
      const s = gapBy[skill] * weight * 2;
      gapScore += s;
      if (s > topSkillScore) [topSkill, topSkillScore] = [skill, s];
    }
    const areaHit = trail.areas.find((ar) => a.areas.includes(ar));
    const goalHit = trail.goals.find((g) => a.goals.includes(g));
    const areaScore = trail.areas.filter((ar) => a.areas.includes(ar)).length * 1.5;
    const goalScore = trail.goals.filter((g) => a.goals.includes(g)).length * 2;
    const foundationScore = trail.foundation && early.includes(a.careerStage) ? 2 : 0;

    const score = gapScore + areaScore + goalScore + foundationScore;

    let reason: TrailReason = { kind: "foundation" };
    if (goalHit && goalScore >= gapScore) reason = { kind: "goal", goal: goalHit };
    else if (topSkill && topSkillScore >= 2) reason = { kind: "gap", skill: topSkill };
    else if (areaHit && areaHit !== "notSure") reason = { kind: "area", area: areaHit };
    else if (goalHit) reason = { kind: "goal", goal: goalHit };

    return { trail, score, reason };
  })
    .sort((x, y) => y.score - x.score)
    .slice(0, 4);
}

/** Which Career Journey content fits her goals and stage. */
function pickJourneys(a: OnboardingAnswers): JourneyRec[] {
  const ids = new Set<string>();
  const g = new Set(a.goals);
  if (g.has("grow") || g.has("leadership")) ["passed-over", "credit", "pay-negotiation"].forEach((x) => ids.add(x));
  if (g.has("network") || g.has("getInternship") || g.has("changeCareer") || g.has("firstJob")) ids.add("networking");
  if (g.has("firstJob") || g.has("getInternship")) ids.add("pay-negotiation");
  if (["newcomer", "earlyCareer", "growing"].includes(a.careerStage)) ids.add("interrupted");
  if (ids.size === 0) ["networking", "interrupted"].forEach((x) => ids.add(x));

  const recs: JourneyRec[] = [...ids].slice(0, 3).map((id) => ({ kind: "playbook", id }));
  if (g.has("balance") || a.careerStage === "returning") recs.unshift({ kind: "family" });
  return recs.slice(0, 3);
}

function overlap(item: { areas: AreaId[]; goals: GoalId[]; stages: CareerStageId[] }, a: OnboardingAnswers) {
  return (
    item.stages.filter((s) => s === a.careerStage).length * 3 +
    item.goals.filter((g) => a.goals.includes(g)).length * 2 +
    item.areas.filter((ar) => a.areas.includes(ar)).length
  );
}

function nextStepsFor(a: OnboardingAnswers, trails: RankedTrail[], journeys: JourneyRec[]): NextStep[] {
  const steps: NextStep[] = [];
  const area = realAreas(a.areas)[0];
  if (!area || a.goals.includes("understandMarket") || a.careerStage === "exploring" || a.careerStage === "transition") {
    steps.push({ key: "areaGuide", area: area ?? "assetManagement" });
  }
  steps.push({ key: "trail", trail: trails[0].trail.title });
  const firstJourney = journeys[0];
  if (firstJourney?.kind === "family") steps.push({ key: "family" });
  else if (firstJourney) steps.push({ key: "playbook", id: firstJourney.id });
  steps.push({ key: "stories" });
  steps.push({ key: "community" });
  return steps.slice(0, 4);
}

export function buildRecommendations(a: OnboardingAnswers): Recommendations {
  const gaps = computeGaps(a);
  const trails = rankTrails(a, gaps);
  const journeys = pickJourneys(a);
  const mentors = [...MENTORS].sort((x, y) => overlap(y, a) - overlap(x, a)).slice(0, 2);
  const groups = [...GROUPS].sort((x, y) => overlap(y, a) - overlap(x, a)).slice(0, 2);
  return { gaps, trails, journeys, mentors, groups, nextSteps: nextStepsFor(a, trails, journeys) };
}
