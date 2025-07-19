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

    // Clear any corrupted tokens first
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      if (token && (token === 'undefined' || token === 'null' || token.length < 10)) {
        console.log('Clearing corrupted token');
        localStorage.removeItem('authToken');
      }
    }

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

        console.log('Initializing auth with token:', token.substring(0, 20) + '...');

        // Fetch user profile with the stored token
        const response = await fetch('/api/user/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        console.log('Profile response status:', response.status);

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.user) {
            login(data.user, token);
          } else {
            // Invalid token response, remove it
            localStorage.removeItem('authToken');
          }
        } else {
          // Invalid token, remove it
          localStorage.removeItem('authToken');
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Remove potentially corrupted token
        localStorage.removeItem('authToken');
      } finally {
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
