import { AppDispatch, RootState } from '@/store';
import {
    clearUser,
    setLoading,
    setUser,
    updateUserCredits,
    updateUserProfile,
    User
} from '@/store/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isLoading, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const login = (userData: User) => {
    dispatch(setUser(userData));
  };

  const logout = () => {
    dispatch(clearUser());
    // Clear any stored tokens or session data
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('authToken');
    }
  };

  const updateCredits = (credits: number) => {
    dispatch(updateUserCredits(credits));
  };

  const updateProfile = (profileData: Partial<User>) => {
    dispatch(updateUserProfile(profileData));
  };

  const setAuthLoading = (loading: boolean) => {
    dispatch(setLoading(loading));
  };

  // Helper functions
  const isPremiumUser = user?.plan === 'premium' || user?.plan === 'pro';
  const hasCreditsRemaining = (user?.remainingCredits || 0) > 0;
  const canPerformAction = isPremiumUser || hasCreditsRemaining;

  return {
    // State
    user,
    isLoading,
    isAuthenticated,
    
    // Actions
    login,
    logout,
    updateCredits,
    updateProfile,
    setAuthLoading,
    
    // Computed values
    isPremiumUser,
    hasCreditsRemaining,
    canPerformAction,
  };
};
