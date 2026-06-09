import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router'; // React Router v7 imports
import { useAuth } from '../contexts/AuthContext';

function RequireAuth({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // If the user is verified to NOT be authenticated, redirect them to login
    if (!isAuthenticated) {
      navigate('/login', { 
        replace: true, 
        state: { from: location } // Preserves the intended route context
      });
    }
  }, [isAuthenticated, navigate, location]);

  // While navigating away, show a temporary fallback UI
  if (!isAuthenticated) {
    return <div>Loading and redirecting to login...</div>;
  }

  // If authenticated, render the protected component page safely
  return children;
}

export default RequireAuth;