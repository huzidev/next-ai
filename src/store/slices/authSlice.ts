import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id: string;
  email: string;
  username: string;
  isVerified: boolean;
  planId?: string;
  remainingTries: number;
  createdAt: string;
  updatedAt?: string;
  lastActiveAt?: string;
  plan?: {
    id: string;
    name: string;
    tries: number;
    price: number;
  };
  _count?: {
    chatSessions: number;
  };
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  token: string | null;
}

const initialState: AuthState = {
  user: null,
  isLoading: true, // Start with loading true to check for existing session
  isAuthenticated: false,
  token: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ user: User; token: string }>) => {
      console.log("SW authSlice setUser called with:", action.payload);
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.isLoading = false;
      // Store token in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('authToken', action.payload.token);
        console.log("SW authSlice stored token in localStorage:", action.payload.token?.substring(0, 20) + '...');
      }
      console.log("SW authSlice setUser completed, state.user:", state.user);
    },
    clearUser: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      // Clear token from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    updateUserTries: (state, action: PayloadAction<number>) => {
      if (state.user) {
        state.user.remainingTries = action.payload;
      }
    },
    updateUserProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('authToken', action.payload);
      }
    },
  },
});

export const {
  setUser,
  clearUser,
  setLoading,
  updateUserTries,
  updateUserProfile,
  setToken,
} = authSlice.actions;

export default authSlice.reducer;
