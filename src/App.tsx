import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { BrowserRouter, Outlet, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Index from "./pages/Index";
import MyTeam from "./pages/MyTeam";
import Leaderboard from "./pages/Leaderboard";
import Schedule from "./pages/Schedule";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import Rules from "./pages/Rules";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/AuthContext";
import { ErrorBoundary } from "./components/ErrorBoundary";

const queryClient = new QueryClient();

const RouteTracker = () => {
  const location = useLocation();

  useEffect(() => {
    const bypassRoutes = ["/login", "/signup", "/reset-password"];
    if (!bypassRoutes.includes(location.pathname)) {
      sessionStorage.setItem("last_working_page", location.pathname);
      sessionStorage.setItem("crash_count", "0");
    }
  }, [location]);

  return null;
};

const AppLayout = () => (
  <>
    <Navbar />
    <Outlet />
  </>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <RouteTracker />
        <ErrorBoundary>
        <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route element={<AppLayout />}>
            <Route path="/" element={<Index />} />
            <Route path="/my-team" element={<MyTeam />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/rules" element={<Rules />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
        </AuthProvider>
        </ErrorBoundary>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
