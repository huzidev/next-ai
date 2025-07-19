import { useAuth } from '@/hooks/useAuth';
import { useEffect, useRef } from 'react';

// This initializes authentication from stored token
export const useAuthInitializer = () => {
  const { login, setAuthLoading } = useAuth();
  const initializeRef = useRef(false);

  console.log('SW useAuthInitializer hook called');
  console.log('SW window type:', typeof window);

  useEffect(() => {
    console.log('SW useAuthInitializer useEffect triggered - window type:', typeof window);
    
    // Use setTimeout to ensure this runs on the client side
    setTimeout(() => {
      console.log('SW useAuthInitializer setTimeout triggered');
      
      // Only run once on mount
      if (initializeRef.current) {
        console.log('SW Auth initializer already ran, skipping');
        return;
      }
      initializeRef.current = true;

      console.log('SW Starting auth initialization in setTimeout');
      
      // Check for existing token in localStorage
      const token = localStorage.getItem('authToken');
      console.log('SW Token from localStorage:', token ? token.substring(0, 20) + '...' : 'No token found');
      
      // Clear any mock tokens from previous testing
      if (token === 'mock-token-for-development') {
        console.log('SW Clearing mock token from localStorage');
        localStorage.removeItem('authToken');
      } else if (token && token !== 'mock-token-for-development') {
        console.log('SW Found existing token, attempting to restore session');
        // Validate token with backend and restore user session
        setAuthLoading(true);
        
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
      
      // FOR DEVELOPMENT ONLY - COMMENTED OUT TO FIX AUTO-REDIRECT ISSUE
      // Uncomment the lines below ONLY when you want to test with a mock user
      /*
      const mockUser = {
        id: 'mock-user-id',
        email: 'test@example.com',
        username: 'testuser',
        isVerified: true,
        remainingTries: 95,
        createdAt: new Date().toISOString(),
        lastActiveAt: new Date().toISOString(),
        plan: {
          id: '1',
          name: 'free',
          tries: 100,
          price: 0
        },
        _count: {
          chatSessions: 8
        }
      };
      
      const mockToken = 'mock-token-for-development';
      localStorage.setItem('authToken', mockToken);
      console.log('SW Setting mock user in store from setTimeout:', mockUser);
      login(mockUser, mockToken);
      */
    }, 100); // Small delay to ensure client-side execution
    
  }); // Removed dependency array to test
};
