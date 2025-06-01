import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { DataProvider } from "./contexts/DataContext";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import LoginForm from "./components/Authentication/LoginForm";
import MainLayout from "./components/Layout/MainLayout";
import DashboardPage from "./pages/DashboardPage";
import EquipmentPage from "./pages/EquipmentPage";
import RentalsPage from "./pages/RentalsPage";
import MaintenancePage from "./pages/MaintenancePage";
import ReportsPage from "./pages/ReportsPage";
import NotificationsPage from "./pages/NotificationsPage";
import FeedbackPage from "./pages/FeedbackPage";

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

// Login Route Component
const LoginRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? <>{children}</> : <Navigate to="/dashboard" />;
};

const App = () => (
  <TooltipProvider>
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route 
                path="/login" 
                element={
                  <LoginRoute>
                    <LoginForm />
                  </LoginRoute>
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <DashboardPage />
                    </MainLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/equipment" 
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <EquipmentPage />
                    </MainLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/rentals" 
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <RentalsPage />
                    </MainLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/maintenance" 
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <MaintenancePage />
                    </MainLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/reports" 
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <ReportsPage />
                    </MainLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/notifications" 
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <NotificationsPage />
                    </MainLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/feedback" 
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <FeedbackPage />
                    </MainLayout>
                  </ProtectedRoute>
                } 
              />
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
          </div>
          <Toaster />
          <Sonner />
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  </TooltipProvider>
);

export default App;
