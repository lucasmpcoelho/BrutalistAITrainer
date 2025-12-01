import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import Onboarding from "@/pages/Onboarding";
import ActiveSession from "@/pages/ActiveSession";
import Coach from "@/pages/Coach";
import Health from "@/pages/Health";
import NotFound from "@/pages/not-found";
import BottomNav from "@/components/BottomNav";

// Pages that should show the bottom navigation
const PAGES_WITH_NAV = ["/dashboard", "/coach", "/health"];

function Router() {
  const [location] = useLocation();
  const showBottomNav = PAGES_WITH_NAV.some(path => location.startsWith(path));

  return (
    <>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/onboarding" component={Onboarding} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/session" component={ActiveSession} />
        <Route path="/coach" component={Coach} />
        <Route path="/health" component={Health} />
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
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
