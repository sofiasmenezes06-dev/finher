/**
 * Pesquisa "Galapagos por Elas" (outubro de 2026), respondida por universitárias.
 * Perguntas de múltipla escolha: cada pessoa podia marcar mais de uma opção,
 * por isso as porcentagens não somam 100%. Os rótulos ficam em src/i18n.
 */
export const survey = {
  respondents: 21,
  institutions: 8,
  /** Desafios que elas identificam para mulheres no mercado financeiro. */
  challenges: {
    treatment: 11,
    impostor: 9,
    motherhood: 9,
    representation: 8,
    mentors: 8,
    networking: 5,
    information: 5,
  },
  /** O que ajudaria a inserção de mulheres no mercado. */
  wants: {
    leadership: 13,
    internships: 11,
    mentoring: 10,
    courses: 8,
    networking: 7,
  },
} as const;

export type SurveyChallenge = keyof typeof survey.challenges;
export type SurveyWant = keyof typeof survey.wants;

/** Share of respondents, rounded to a whole percent. */
export function surveyPercent(count: number): number {
  return Math.round((count / survey.respondents) * 100);
}
