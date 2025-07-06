import { useAuth } from '@/hooks/useAuth';
import { useEffect, useRef } from 'react';

// This initializes authentication from stored token
export const useAuthInitializer = () => {
  const { login, setAuthLoading } = useAuth();
  const initializeRef = useRef(false);

  useEffect(() => {
    // Only run once on mount
    if (initializeRef.current) return;
    initializeRef.current = true;

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

    const token = typeof window !== 'undefined' ? 
      localStorage.getItem('authToken') : 
      null;
    
    if (token) {
      initializeAuth();
    } else {
      setAuthLoading(false);
    }
  }, []); // Empty dependency array - only run on mount
};
