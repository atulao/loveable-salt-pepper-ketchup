
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Index from "@/pages/index";
import MapPage from "@/pages/MapPage";
import EventsPage from "@/pages/EventsPage";
import BuildingsPage from "@/pages/BuildingsPage";
import BuildingDetailPage from "@/pages/BuildingDetailPage";
import NotFound from "@/pages/NotFound";
import AuthPage from "@/pages/AuthPage";
import AuthCallbackPage from "@/pages/AuthCallbackPage";
import Layout from "@/components/layout/Layout";

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/auth" element={user ? <Navigate to="/" replace /> : <AuthPage />} />
      <Route path="/auth/callback" element={<AuthCallbackPage />} />
      
      {/* Protected routes within Layout */}
      <Route element={<Layout />}>
        <Route path="/" element={
          <ProtectedRoute>
            <Index />
          </ProtectedRoute>
        } />
        <Route path="/map" element={
          <ProtectedRoute>
            <MapPage />
          </ProtectedRoute>
        } />
        <Route path="/events" element={
          <ProtectedRoute>
            <EventsPage />
          </ProtectedRoute>
        } />
        <Route path="/buildings" element={
          <ProtectedRoute>
            <BuildingsPage />
          </ProtectedRoute>
        } />
        <Route path="/buildings/:id" element={
          <ProtectedRoute>
            <BuildingDetailPage />
          </ProtectedRoute>
        } />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
