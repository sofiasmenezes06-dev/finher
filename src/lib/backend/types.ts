import type { AppUser, Jurisdiction, OnboardingAnswers, Profile, SavedSituation, SituationInput } from "@/lib/domain";

export type BackendErrorCode = "invalidCredentials" | "emailTaken" | "generic";

export class BackendError extends Error {
  constructor(
    public code: BackendErrorCode,
    message?: string,
  ) {
    super(message ?? code);
  }
}

export interface SignUpInput {
  email: string;
  password: string;
  displayName: string;
}

/** Everything a user can download about herself. */
export interface DataExport {
  exportedAt: string;
  account: AppUser;
  profile: Profile | null;
  savedSituations: SavedSituation[];
  careerFamilyChecklist: string[];
}

/**
 * Everything the UI needs from the backend. Two implementations:
 * Supabase (production) and a browser-only demo used when no
 * Supabase project is configured.
 */
export interface Backend {
  mode: "supabase" | "demo";
  getUser(): Promise<AppUser | null>;
  onAuthChange(cb: (user: AppUser | null) => void): () => void;
  signUp(input: SignUpInput): Promise<{ user: AppUser | null; needsEmailConfirmation: boolean }>;
  signIn(email: string, password: string): Promise<AppUser>;
  signOut(): Promise<void>;
  getProfile(userId: string): Promise<Profile | null>;
  saveOnboarding(userId: string, answers: OnboardingAnswers): Promise<Profile>;
  setJurisdiction(userId: string, jurisdiction: Jurisdiction): Promise<Profile>;

  listSituations(userId: string): Promise<SavedSituation[]>;
  saveSituation(userId: string, input: SituationInput): Promise<SavedSituation>;
  deleteSituation(userId: string, id: string): Promise<void>;
  deleteAllSituations(userId: string): Promise<void>;

  getChecklist(userId: string): Promise<string[]>;
  setChecklistItem(userId: string, itemId: string, done: boolean): Promise<void>;

  deleteAccount(): Promise<void>;
}

/** Built from the other calls so both implementations export the same shape. */
export async function exportData(b: Backend, user: AppUser): Promise<DataExport> {
  const [profile, savedSituations, careerFamilyChecklist] = await Promise.all([
    b.getProfile(user.id),
    b.listSituations(user.id),
    b.getChecklist(user.id),
  ]);
  return { exportedAt: new Date().toISOString(), account: user, profile, savedSituations, careerFamilyChecklist };
}
