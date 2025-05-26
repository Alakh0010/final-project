import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuth } from './context/AuthContext';
import { DatabaseProvider } from './context/DatabaseContext';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastProvider } from './components/ToastNotification';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

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
  requireAdmin = false,
}) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  
  console.log('PrivateRoute - Auth state:', { 
    isAuthenticated, 
    isAdmin, 
    requireAdmin,
    loading,
    path: window.location.pathname 
  });

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('User not authenticated, redirecting to login');
    // Store the intended URL before redirecting to login
    const from = window.location.pathname !== '/' ? window.location.pathname : '/query';
    return <Navigate to="/login" state={{ from }} replace />;
  }

  // For admin routes, check if user is admin
  if (requireAdmin && !isAdmin) {
    console.log('Admin access required, redirecting to admin login');
    return <Navigate to="/admin" replace />;
  }

  console.log('Access granted, rendering children');
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <DatabaseProvider>
            <Suspense fallback={<LoadingSpinner />}>
              <div className="min-h-screen bg-background">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/admin-login" element={<AdminLogin />} />
                
                {/* Home route - redirects to query form */}
                <Route
                  path="/"
                  element={
                    <PrivateRoute>
                      <Navigate to="/query" replace />
                    </PrivateRoute>
                  }
                />
                
                {/* Query form route */}
                <Route
                  path="/query"
                  element={
                    <PrivateRoute>
                      <QueryForm />
                    </PrivateRoute>
                  }
                />
                
                {/* Admin dashboard */}
                <Route
                  path="/admin"
                  element={
                    <PrivateRoute requireAdmin>
                      <AdminDashboard />
                    </PrivateRoute>
                  }
                />
                
                {/* Success page */}
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
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
