import { Switch, Route, useLocation, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import Onboarding from "@/pages/Onboarding";
import ActiveSession from "@/pages/ActiveSession";
import Coach from "@/pages/Coach";
import Health from "@/pages/Health";
import Auth from "@/pages/Auth";
import NotFound from "@/pages/not-found";
import BottomNav from "@/components/BottomNav";

// Pages that should show the bottom navigation
const PAGES_WITH_NAV = ["/dashboard", "/coach", "/health"];

// Loading screen component
function LoadingScreen() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
        <p className="font-mono text-sm text-gray-500 uppercase">Loading...</p>
      </div>
    </div>
  );
}

// Protected route component - requires authentication AND completed onboarding
function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { isAuthenticated, isReady, needsOnboarding, isProfileLoading } = useAuth();
  
  // Wait until auth and profile are fully loaded
  if (!isReady || isProfileLoading) {
    return <LoadingScreen />;
  }
  
  if (!isAuthenticated) {
    return <Redirect to="/auth" />;
  }
  
  // If user needs onboarding, redirect to onboarding
  if (needsOnboarding) {
    return <Redirect to="/onboarding" />;
  }
  
  return <Component />;
}

// Onboarding route - requires auth but allows incomplete onboarding
function OnboardingRoute() {
  const { isAuthenticated, isReady, needsOnboarding, isProfileLoading } = useAuth();
  
  // Wait until auth and profile are fully loaded
  if (!isReady || isProfileLoading) {
    return <LoadingScreen />;
  }
  
  if (!isAuthenticated) {
    return <Redirect to="/auth" />;
  }
  
  // If onboarding already completed, go to dashboard
  if (!needsOnboarding) {
    return <Redirect to="/dashboard" />;
  }
  
  return <Onboarding />;
}

function Router() {
  const [location] = useLocation();
  const showBottomNav = PAGES_WITH_NAV.some(path => location.startsWith(path));

  return (
    <>
      <Switch>
        {/* Public routes */}
        <Route path="/" component={Home} />
        <Route path="/auth" component={Auth} />
        
        {/* Onboarding - requires auth, redirects if completed */}
        <Route path="/onboarding" component={OnboardingRoute} />
        
        {/* Protected routes - require auth + completed onboarding */}
        <Route path="/dashboard">
          <ProtectedRoute component={Dashboard} />
        </Route>
        <Route path="/session">
          <ProtectedRoute component={ActiveSession} />
        </Route>
        <Route path="/coach">
          <ProtectedRoute component={Coach} />
        </Route>
        <Route path="/health">
          <ProtectedRoute component={Health} />
        </Route>
        
        {/* 404 */}
        <Route component={NotFound} />
      </Switch>
      
      {/* Bottom navigation - only shown on main app screens */}
      {showBottomNav && <BottomNav />}
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
