import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';

// This initializes authentication from stored token
export const useAuthInitializer = () => {
  const { login, setAuthLoading } = useAuth();

  const initializeAuth = async () => {
    setAuthLoading(true);
    
    try {
      const token = typeof window !== 'undefined' ? 
        localStorage.getItem('authToken') : 
        null;
      
      if (!token) {
        setAuthLoading(false);
        return;
      }

      // Fetch user profile with the stored token
      const response = await fetch('/api/user/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.user) {
          login(data.user, token);
        } else {
          // Invalid token, remove it
          localStorage.removeItem('authToken');
          setAuthLoading(false);
        }
      } else {
        // Invalid token, remove it
        localStorage.removeItem('authToken');
        setAuthLoading(false);
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      localStorage.removeItem('authToken');
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    // Check if user is already authenticated on app load
    const token = typeof window !== 'undefined' ? 
      localStorage.getItem('authToken') : 
      null;
    
    if (token) {
      initializeAuth();
    } else {
      setAuthLoading(false);
    }
  }, []);

  return { initializeAuth };
};
