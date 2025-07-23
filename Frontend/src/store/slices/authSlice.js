import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  token: null,
  loading: false,
  error: null,
  justLoggedOut: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * Initiates the login process by setting loading to true and clearing errors.
     * @param {Object} state The current authentication state.
     */
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    /**
     * Handles successful login by updating authentication state and storing the token.
     * @param {Object} state The current authentication state.
     * @param {Object} action The dispatched action containing the payload with the token.
     */
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.loading = false;
      state.error = null;
      state.justLoggedOut = false;
    },
    /**
     * Handles failed login by updating the error state and resetting authentication.
     * @param {Object} state The current authentication state.
     * @param {Object} action The dispatched action containing the error payload.
     */
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
      state.token = null;
      state.justLoggedOut = false;
    },
    /**
     * Logs out the user and resets authentication state.
     * @param {Object} state The current authentication state.
     */
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.loading = false;
      state.error = null;
      state.justLoggedOut = true;
    },
    /**
     * Clears any authentication errors from the state.
     * @param {Object} state The current authentication state.
     */
    clearError: (state) => {
      state.error = null;
    },
    /**
     * Resets the justLoggedOut flag to false after logout is handled.
     * @param {Object} state The current auth slice state.
     */
    clearJustLoggedOut: (state) => {
      state.justLoggedOut = false;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, clearError, clearJustLoggedOut } = authSlice.actions;
export default authSlice.reducer; 