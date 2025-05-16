import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { DatabaseProvider } from './context/DatabaseContext';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastProvider } from './components/ToastNotification';

// Lazy load components for better performance
const Login = lazy(() => import('./pages/auth/Login'));
const AdminLogin = lazy(() => import('./pages/auth/AdminLogin'));
const Signup = lazy(() => import('./pages/auth/Signup'));
const QueryForm = lazy(() => import('./pages/customer/QueryForm'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const SuccessPage = lazy(() => import('./pages/customer/SuccessPage'));

// Loading component for Suspense fallback
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

const PrivateRoute: React.FC<{ children: React.ReactNode; requireAdmin?: boolean }> = ({ 
  children, 
  requireAdmin = false 
}) => {
  const { isAuthenticated, isAdmin } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // For admin routes, check if user is admin
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/admin-login" />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <DatabaseProvider>
        <Suspense fallback={<LoadingSpinner />}>
          <div className="min-h-screen bg-background">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <QueryForm />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <PrivateRoute requireAdmin>
                    <AdminDashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/success"
                element={
                  <PrivateRoute>
                    <SuccessPage />
                  </PrivateRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </Suspense>
      </DatabaseProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
};

export default App;