import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children, requireAuth = true }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    
    // Only protect dashboard routes
    if (requireAuth && location.pathname.startsWith('/dashboard')) {
      if (!accessToken) {
        navigate('/auth/login', { replace: true });
        return;
      }
    }

    // If user is on login page and has token, redirect to dashboard
    if (location.pathname === '/auth/login' && accessToken) {
      navigate('/dashboard', { replace: true });
      return;
    }
  }, [navigate, location, requireAuth]);

  return <>{children}</>;
};

export default AuthGuard; 