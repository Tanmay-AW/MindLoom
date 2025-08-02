import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';

const ProtectedRoute = () => {
  const { userInfo } = useAuth();

  // If user info exists, render the child route (e.g., Dashboard).
  // Otherwise, navigate them to the login page.
  return userInfo ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
