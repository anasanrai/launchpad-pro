import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Dashboard from "./pages/Dashboard";
import AIInsights from "./pages/AIInsights";
import MarketResearch from "./pages/MarketResearch";
import CourseArchitect from "./pages/CourseArchitect";
import ColdEmailer from "./pages/ColdEmailer";
import ROIPredictor from "./pages/ROIPredictor";
import AssetHistory from "./pages/AssetHistory";
import AssetDetail from "./pages/AssetDetail";
import Pricing from "./pages/Pricing";
import Home from "./pages/Home";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/ai-insights" component={AIInsights} />
      <Route path="/market-research" component={MarketResearch} />
      <Route path="/course-architect" component={CourseArchitect} />
      <Route path="/cold-emailer" component={ColdEmailer} />
      <Route path="/assets" component={AssetHistory} />
      <Route path="/assets/:id" component={AssetDetail} />
      <Route path="/roi-predictor" component={ROIPredictor} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "oklch(0.14 0.012 265)",
                border: "1px solid oklch(0.22 0.012 265)",
                color: "oklch(0.96 0.005 265)",
              },
            }}
          />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
