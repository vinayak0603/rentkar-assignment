
import React, { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Partners from "./pages/Partners";
import Orders from "./pages/Orders";
import Assignments from "./pages/Assignments";
import NotFound from "./pages/NotFound";
import AppLayout from "./components/layout/AppLayout";
import { LoadingState } from "./components/ui/loading-state";
import { ErrorState } from "./components/ui/error-state";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Error boundary component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode, fallback?: React.ReactNode },
  { hasError: boolean, error: Error | null }
> {
  constructor(props: { children: React.ReactNode, fallback?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("App error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-8">
          <ErrorState 
            message="Something went wrong in the application. Please refresh the page."
            onRetry={() => window.location.reload()}
          />
        </div>
      );
    }
    
    return this.props.children;
  }
}

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<LoadingState message="Loading application..." />}>
            <Routes>
              <Route path="/" element={<AppLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="partners" element={<Partners />} />
                <Route path="orders" element={<Orders />} />
                <Route path="assignments" element={
                  <ErrorBoundary fallback={
                    <div className="space-y-6">
                      <h1 className="text-3xl font-bold tracking-tight">Assignment System</h1>
                      <ErrorState 
                        message="There was a problem loading the assignments module." 
                        onRetry={() => window.location.reload()}
                      />
                    </div>
                  }>
                    <Assignments />
                  </ErrorBoundary>
                } />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
