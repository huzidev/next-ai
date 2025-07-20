import { useAuth } from '@/hooks/useAuth';
import { useEffect, useRef } from 'react';

// This initializes authentication from stored token
export const useAuthInitializer = () => {
  const { login, setAuthLoading } = useAuth();
  const initializeRef = useRef(false);

  console.log('SW useAuthInitializer hook called');

  useEffect(() => {
    console.log('SW useAuthInitializer useEffect triggered');
    
    // Only run once on mount
    if (initializeRef.current) {
      console.log('SW Auth initializer already ran, skipping');
      return;
    }
    initializeRef.current = true;

    console.log('SW Starting auth initialization');
    
    // Set loading to true immediately
    setAuthLoading(true);
    
    // Check for existing token in localStorage
    const token = localStorage.getItem('authToken');
    console.log('SW Token from localStorage:', token ? token.substring(0, 20) + '...' : 'No token found');
    
    // Clear any mock tokens from previous testing
    if (token === 'mock-token-for-development') {
      console.log('SW Clearing mock token from localStorage');
      localStorage.removeItem('authToken');
      setAuthLoading(false);
    } else if (token && token !== 'mock-token-for-development') {
      console.log('SW Found existing token, attempting to restore session');
      
      fetch('/api/user/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      .then(response => response.json())
      .then(data => {
        if (data.success && data.user) {
          console.log('SW Successfully restored user session:', data.user);
          login(data.user, token);
        } else {
          console.log('SW Token validation failed, clearing invalid token');
          localStorage.removeItem('authToken');
        }
      })
      .catch(error => {
        console.error('SW Error validating token:', error);
        localStorage.removeItem('authToken');
      })
      .finally(() => {
        setAuthLoading(false);
      });
    } else {
      console.log('SW No valid token found, user needs to sign in');
      setAuthLoading(false);
    }
  }, []); // Empty dependency array - run only once on mount
};
