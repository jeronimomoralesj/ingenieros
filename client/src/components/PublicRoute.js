// /src/components/PublicRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/authUtils';

const PublicRoute = ({ children }) => {
  const user = isAuthenticated();

  if (user) {
    return <Navigate to="/home" />;
  }

  return children;
};

export default PublicRoute;
