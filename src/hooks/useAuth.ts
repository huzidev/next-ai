import { AppDispatch, RootState } from '@/store';
import {
  clearUser,
  setLoading,
  setToken,
  setUser,
  updateUserProfile,
  updateUserTries,
  User
} from '@/store/slices/authSlice';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { user, isLoading, isAuthenticated, token } = useSelector((state: RootState) => state.auth);

  console.log("SW what is user in useAuth", user);

  const login = (userData: User, authToken: string) => {
    console.log("SW useAuth login called with:", userData, authToken?.substring(0, 20) + '...');
    dispatch(setUser({ user: userData, token: authToken }));
    console.log("SW useAuth login dispatch completed");
  };

  const logout = () => {
    dispatch(clearUser());
    // Redirect to home page and replace history to prevent going back
    router.replace('/');
  };

  const updateTries = (tries: number) => {
    dispatch(updateUserTries(tries));
  };

  const updateProfile = (profileData: Partial<User>) => {
    dispatch(updateUserProfile(profileData));
  };

  const setAuthLoading = (loading: boolean) => {
    dispatch(setLoading(loading));
  };

  const setAuthToken = (authToken: string) => {
    dispatch(setToken(authToken));
  };

  // Helper functions
  const isPremiumUser = user?.plan?.name !== 'free';
  const hasTriesRemaining = (user?.remainingTries || 0) > 0;
  const canPerformAction = isPremiumUser || hasTriesRemaining;

  return {
    // State
    user,
    isLoading,
    isAuthenticated,
    token,
    
    // Actions
    login,
    logout,
    updateTries,
    updateProfile,
    setAuthLoading,
    setAuthToken,
    
    // Computed values
    isPremiumUser,
    hasTriesRemaining,
    canPerformAction,
  };
};
