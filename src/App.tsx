import { Suspense, lazy, useEffect, type ComponentType, type ReactNode } from "react";
import { BrowserRouter, Link, MemoryRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { DemoBanner, DisclaimerBar } from "@/components/layout/disclaimer-bar";
import { Button } from "@/components/ui/button";
import { useT } from "@/i18n";
import { isOnboarded } from "@/lib/domain";
import Landing from "@/pages/landing";

// Every page but the landing page loads on demand, so the first visit only downloads what it shows.
const named = <K extends string>(load: () => Promise<Record<K, ComponentType<any>>>, name: K) =>
  lazy(() => load().then((m) => ({ default: m[name] })));
const LoginPage = named(() => import("@/pages/auth"), "LoginPage");
const SignupPage = named(() => import("@/pages/auth"), "SignupPage");
const Onboarding = lazy(() => import("@/pages/onboarding"));
const OverviewPage = lazy(() => import("@/pages/overview"));
const SettingsPage = lazy(() => import("@/pages/settings"));
const CommunityPage = lazy(() => import("@/pages/community"));
const EducationPage = named(() => import("@/pages/education"), "EducationPage");
const AreaGuidePage = named(() => import("@/pages/education"), "AreaGuidePage");
const FamilyPage = named(() => import("@/pages/family"), "FamilyPage");
const FamilyPhasePage = named(() => import("@/pages/family"), "FamilyPhasePage");
const JourneysPage = named(() => import("@/pages/journeys"), "JourneysPage");
const StoryPage = named(() => import("@/pages/journeys"), "StoryPage");
const NavigatorPage = named(() => import("@/pages/navigator"), "NavigatorPage");
const PlaybookPage = named(() => import("@/pages/navigator"), "PlaybookPage");
import { AuthProvider, useAuth } from "@/providers/auth";
import { ThemeProvider } from "@/providers/theme";

function FullPageLoader() {
  const t = useT();
  return (
    <div className="grid min-h-dvh place-items-center" role="status">
      <Loader2 className="size-8 animate-spin text-primary" aria-hidden="true" />
      <span className="sr-only">{t.common.loading}</span>
    </div>
  );
}

function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <FullPageLoader />;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function GuestOnly({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <FullPageLoader />;
  if (user) return <Navigate to="/app" replace />;
  return <>{children}</>;
}

/** Everything inside the app needs a completed (current-format) onboarding. */
function RequireOnboarding({ children }: { children: ReactNode }) {
  const { profile } = useAuth();
  if (!isOnboarded(profile)) return <Navigate to="/onboarding" replace />;
  return <>{children}</>;
}

function OverviewRoute() {
  const { profile } = useAuth();
  return isOnboarded(profile) ? <OverviewPage profile={profile} /> : null;
}

function NotFound() {
  const t = useT();
  return (
    <main id="main" className="grid min-h-dvh place-items-center px-4 text-center">
      <div>
        <p className="font-mono text-sm text-primary">404</p>
        <h1 className="mt-2 text-3xl font-extrabold">{t.notFound.title}</h1>
        <p className="mt-2 text-muted-foreground">{t.notFound.body}</p>
        <Button asChild className="mt-6">
          <Link to="/">{t.notFound.home}</Link>
        </Button>
      </div>
    </main>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function Chrome() {
  const t = useT();
  const { mode } = useAuth();
  return (
    <>
      <ScrollToTop />
      <a
        href="#main"
        className="sr-only z-50 rounded-full bg-primary px-4 py-2 font-semibold text-primary-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        {t.common.skipToContent}
      </a>
      {mode === "demo" && <DemoBanner />}
      <Suspense fallback={<FullPageLoader />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<GuestOnly><SignupPage /></GuestOnly>} />
          <Route path="/login" element={<GuestOnly><LoginPage /></GuestOnly>} />
          <Route path="/onboarding" element={<RequireAuth><Onboarding /></RequireAuth>} />
          <Route path="/app" element={<RequireAuth><RequireOnboarding><AppShell /></RequireOnboarding></RequireAuth>}>
            <Route index element={<OverviewRoute />} />
            <Route path="education" element={<EducationPage />} />
            <Route path="education/areas/:areaId" element={<AreaGuidePage />} />
            <Route path="community" element={<CommunityPage />} />
            <Route path="journeys" element={<JourneysPage />} />
            <Route path="journeys/stories/:storyId" element={<StoryPage />} />
            <Route path="journeys/challenges" element={<NavigatorPage />} />
            <Route path="journeys/challenges/:playbookId/:savedId?" element={<PlaybookPage />} />
            <Route path="journeys/family" element={<FamilyPage />} />
            <Route path="journeys/family/:phaseId" element={<FamilyPhasePage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <DisclaimerBar />
    </>
  );
}

// Hosted single-file builds (VITE_ROUTER=memory) can't rewrite URLs, so keep routes in memory there.
const Router = import.meta.env.VITE_ROUTER === "memory" ? MemoryRouter : BrowserRouter;

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Chrome />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
