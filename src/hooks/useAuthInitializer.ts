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
      
      // FOR DEVELOPMENT: Create a mock authenticated user
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
      
      // Store mock token and login user
      localStorage.setItem('authToken', mockToken);
      console.log('SW Setting mock user in store from setTimeout:', mockUser);
      login(mockUser, mockToken);
    }, 100); // Small delay to ensure client-side execution
    
  }); // Removed dependency array to test
};
