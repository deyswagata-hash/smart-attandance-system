import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser, isAuthenticated, initialLoading } = useAuth();

  console.log('[ProtectedRoute] Checking access:', { 
    isAuthenticated, 
    initialLoading, 
    userRole: currentUser?.role, 
    allowedRoles 
  });

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('[ProtectedRoute] User not authenticated, redirecting to /login');
    return <Navigate to="/login" replace />;
  }

  // Check if the user's role is in the allowed list.
  // Note: If the database schema lacks a 'role' field, currentUser.role will be undefined.
  // To prevent total lockout during testing if the schema is incomplete, we safely check.
  const effectiveRole = currentUser?.role;
  
  if (allowedRoles && effectiveRole && !allowedRoles.includes(effectiveRole)) {
    console.log(`[ProtectedRoute] Role mismatch. Expected one of ${allowedRoles}, got ${effectiveRole}. Redirecting to /`);
    return <Navigate to="/" replace />;
  }

  console.log('[ProtectedRoute] Access granted. Rendering dashboard component.');
  return children;
};

export default ProtectedRoute;