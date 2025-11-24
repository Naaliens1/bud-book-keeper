import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { GeneticsProvider } from "./contexts/GeneticsContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import { ActiveCultivations } from "./pages/ActiveCultivations";
import { AllCultivations } from "./pages/AllCultivations";
import { AllLogEntries } from "./pages/AllLogEntries";
import { CompletedCultivations } from "./pages/CompletedCultivations";
import { CultivationDetail } from "./pages/CultivationDetail";
import { Settings } from "./pages/Settings";
import { Profile } from "./pages/Profile";
import { Friends } from "./pages/Friends";
import { Themes } from "./pages/Themes";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <AuthProvider>
          <GeneticsProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </GeneticsProvider>
        </AuthProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

const AppRoutes = () => {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/auth" element={user ? <Navigate to="/" /> : <Auth />} />
      <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
      <Route path="/active-cultivations" element={<ProtectedRoute><ActiveCultivations /></ProtectedRoute>} />
      <Route path="/all-cultivations" element={<ProtectedRoute><AllCultivations /></ProtectedRoute>} />
      <Route path="/all-log-entries" element={<ProtectedRoute><AllLogEntries /></ProtectedRoute>} />
      <Route path="/completed-cultivations" element={<ProtectedRoute><CompletedCultivations /></ProtectedRoute>} />
      <Route path="/cultivation/:id" element={<ProtectedRoute><CultivationDetail /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="/settings/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/settings/friends" element={<ProtectedRoute><Friends /></ProtectedRoute>} />
      <Route path="/settings/themes" element={<ProtectedRoute><Themes /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
