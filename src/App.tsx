import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './lib/auth/authContext';
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import ForgotPasswordPage from './components/auth/ForgotPasswordPage';
import AdminDashboard from './components/admin/AdminDashboard';
import UserManagement from './components/admin/UserManagement';
import StaffDashboard from './components/staff/StaffDashboard';
import ClientDashboard from './components/client/ClientDashboard';

// Protected route wrapper component
interface ProtectedRouteProps {
  requiredRole?: 'admin' | 'staff' | 'client';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRole }) => {
  const { user, loading } = useAuth();

  // If still loading, show a loading indicator
  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-900">
        <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // If user is not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If a specific role is required, check if the user has that role
  if (requiredRole && user.role !== requiredRole) {
    // Redirect to the proper dashboard based on role
    switch (user.role) {
      case 'admin':
        return <Navigate to="/admin" replace />;
      case 'staff':
        return <Navigate to="/staff" replace />;
      case 'client':
        return <Navigate to="/client" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  // If all checks pass, render the child routes
  return <Outlet />;
};

// Redirect based on user role
const RoleBasedRedirect: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-900">
        <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to the appropriate dashboard
  switch (user.role) {
    case 'admin':
      return <Navigate to="/admin" replace />;
    case 'staff':
      return <Navigate to="/staff" replace />;
    case 'client':
      return <Navigate to="/client" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

// Not Found component
const NotFound = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
    <h1 className="text-6xl font-bold">404</h1>
    <p className="text-xl mt-4">Page not found</p>
    <button 
      onClick={() => window.history.back()} 
      className="mt-8 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
    >
      Go Back
    </button>
  </div>
);

// App component with Supabase connection check
function App() {
  // Skip connection checks and proceed directly to app
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          
          {/* Dashboard routes - protected by role */}
          
          {/* Admin routes */}
          <Route element={<ProtectedRoute requiredRole="admin" />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/users/:id" element={<div>User Details</div>} />
            <Route path="/admin/settings" element={<div>Admin Settings</div>} />
            <Route path="/admin/reports" element={<div>Reports</div>} />
          </Route>
          
          {/* Staff routes */}
          <Route element={<ProtectedRoute requiredRole="staff" />}>
            <Route path="/staff" element={<StaffDashboard />} />
            <Route path="/staff/invoices" element={<div>Invoices</div>} />
            <Route path="/staff/invoices/create" element={<div>Create Invoice</div>} />
            <Route path="/staff/invoices/:id" element={<div>Invoice Details</div>} />
            <Route path="/staff/invoices/:id/edit" element={<div>Edit Invoice</div>} />
            <Route path="/staff/clients" element={<div>Clients</div>} />
          </Route>
          
          {/* Client routes */}
          <Route element={<ProtectedRoute requiredRole="client" />}>
            <Route path="/client" element={<ClientDashboard />} />
            <Route path="/client/invoices" element={<div>My Invoices</div>} />
            <Route path="/client/invoices/:id" element={<div>Invoice Details</div>} />
            <Route path="/client/profile" element={<div>Profile</div>} />
            <Route path="/client/payment-methods" element={<div>Payment Methods</div>} />
          </Route>
          
          {/* Role-based redirect for root */}
          <Route path="/" element={<RoleBasedRedirect />} />
          
          {/* 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
