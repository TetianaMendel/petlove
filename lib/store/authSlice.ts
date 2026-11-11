import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { User } from "@/types/user";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isAuthChecking: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isAuthChecking: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isAuthChecking = false;
    },

    clearAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isAuthChecking = false;
    },

    finishAuthChecking: (state) => {
      state.isAuthChecking = false;
    },
  },
});

export const { setUser, clearAuth, finishAuthChecking } =
  authSlice.actions;

export default authSlice.reducer;