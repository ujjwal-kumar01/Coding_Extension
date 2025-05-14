import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = !!localStorage.getItem('token'); // or check user object
  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
