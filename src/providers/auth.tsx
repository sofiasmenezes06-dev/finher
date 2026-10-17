import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { backend } from "@/lib/backend";
import { DEFAULT_JURISDICTION, type AppUser, type Jurisdiction, type OnboardingAnswers, type Profile } from "@/lib/domain";

interface AuthState {
  user: AppUser | null;
  profile: Profile | null;
  loading: boolean;
  mode: "supabase" | "demo";
  refreshProfile: () => Promise<void>;
  saveOnboarding: (a: OnboardingAnswers) => Promise<Profile>;
  jurisdiction: Jurisdiction;
  setJurisdiction: (j: Jurisdiction) => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async (u: AppUser | null) => {
    setProfile(u ? await backend.getProfile(u.id).catch(() => null) : null);
  }, []);

  useEffect(() => {
    let active = true;
    backend.getUser().then(async (u) => {
      if (!active) return;
      setUser(u);
      await loadProfile(u);
      if (active) setLoading(false);
    });
    const unsubscribe = backend.onAuthChange(async (u) => {
      setLoading(true);
      setUser(u);
      await loadProfile(u);
      setLoading(false);
    });
    return () => {
      active = false;
      unsubscribe();
    };
  }, [loadProfile]);

  const value = useMemo<AuthState>(
    () => ({
      user,
      profile,
      loading,
      mode: backend.mode,
      refreshProfile: () => loadProfile(user),
      saveOnboarding: async (a) => {
        if (!user) throw new Error("Not signed in");
        const p = await backend.saveOnboarding(user.id, a);
        setProfile(p);
        return p;
      },
      jurisdiction: profile?.jurisdiction ?? DEFAULT_JURISDICTION,
      setJurisdiction: async (j) => {
        if (!user) return;
        setProfile(await backend.setJurisdiction(user.id, j));
      },
    }),
    [user, profile, loading, loadProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
