import toast from "react-hot-toast";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../store/slices/authSlice';
import {
  handleFormChange,
  validateRequiredFields,
  setUserData
} from "../../components/common";
import { AUTH_ENDPOINTS, AUTH_MESSAGES, AUTH_FORMS } from "../../data";

/**
 * Custom hook for managing login form state and navigation
 * Provides centralized state management for login form and related functions
 * @returns {Object} Object containing: navigate (Function), dispatch (Function), 
 * loading (boolean), setLoading (Function), form (Object), setForm (Function)
 */
export const useLoginState = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ username: "", password: "" });

  return { navigate, dispatch, loading, setLoading, form, setForm };
};

/**
 * Creates validation error messages for login form
 * @returns {Object} Validation error messages object
 */
const createValidationMessages = () => ({
  username: AUTH_MESSAGES.VALIDATION.USERNAME_REQUIRED,
  password: AUTH_MESSAGES.VALIDATION.PASSWORD_REQUIRED
});

/**
 * Validates login form fields for required username and password
 * Checks if both fields are present and shows error toast if validation fails
 * @param {Object} form Form data object containing username and password fields
 * @param {string} form.username User's username input
 * @param {string} form.password User's password input
 * @returns {boolean} True if both username and password are provided, false otherwise
 */
export const validateForm = (form) => {
  const validationMessages = createValidationMessages();
  const validation = validateRequiredFields(
    form,
    AUTH_FORMS.LOGIN.FIELDS,
    validationMessages
  );

  if (!validation.isValid) {
    toast.error(validation.message);
    return false;
  }
  return true;
};

/**
 * Creates HTTP request configuration for login API endpoint
 * Sets up POST request with JSON content type and form data in request body
 * @param {Object} form Form data object containing username and password
 * @param {string} form.username User's username for authentication
 * @param {string} form.password User's password for authentication
 * @returns {Object} Fetch request configuration with method, headers, and body
 */
const createLoginRequestConfig = (form) => ({
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(form),
});

/**
 * Determines the appropriate error message based on the API response
 * @param {Object} data API response data containing error information
 * @returns {string} The appropriate error message
 */
const getErrorMessage = (data) => {
  if (data.error) {
    switch (data.error) {
      case 'USER_NOT_FOUND':
        return AUTH_MESSAGES.ERROR.USER_NOT_FOUND;
      case 'INVALID_PASSWORD':
        return AUTH_MESSAGES.ERROR.PASSWORD_INCORRECT;
      case 'NETWORK_ERROR':
        return AUTH_MESSAGES.ERROR.NETWORK_ERROR;
      default:
        return data.message || AUTH_MESSAGES.ERROR.LOGIN_FAILED;
    }
  }
  return data.message || AUTH_MESSAGES.ERROR.LOGIN_FAILED;
};

/**
 * Processes login API response and handles error cases
 * Parses JSON response and throws error if HTTP status is not successful
 * @param {Response} response Fetch API response object from login endpoint
 * @returns {Promise<Object>} Parsed response data containing user info and token
 * @throws {Error} When HTTP response is not successful
 */
const handleLoginResponse = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    const errorMessage = getErrorMessage(data);
    throw new Error(errorMessage);
  }

  return data;
};

/**
 * Performs HTTP request to login API endpoint
 * Orchestrates the complete API call process including request creation and response handling
 * @param {Object} form Form data object containing username and password
 * @param {string} form.username User's username for authentication
 * @param {string} form.password User's password for authentication
 * @returns {Promise<Object>} Login response data with user details and authentication token
 * @throws {Error} When API request fails or returns error response
 */
const makeLoginRequest = async (form) => {
  const config = createLoginRequestConfig(form);
  const response = await fetch(AUTH_ENDPOINTS.LOGIN, config);
  return handleLoginResponse(response);
};

/**
 * Processes successful login response and updates application state
 * Stores user data in Redux store and displays success notification
 * @param {Function} dispatch Redux dispatch function for updating store state
 * @param {Object} data Login response data from successful API call
 * @param {string} data.token JWT authentication token
 * @param {string} data.userid Unique user identifier
 * @param {string} data.username User's display name
 * @param {Object} data.balances User's account balance information
 */
const handleLoginSuccess = (dispatch, data) => {
  setUserData(dispatch, loginSuccess, data.token, {
    id: data.userid,
    username: data.username,
    balances: data.balances
  });

  toast.success(AUTH_MESSAGES.SUCCESS.LOGIN);
};

/**
 * Orchestrates the complete login authentication process
 * Manages loading state, API communication, error handling, and navigation
 * @param {Object} form Form data object containing username and password
 * @param {string} form.username User's username for authentication
 * @param {string} form.password User's password for authentication
 * @param {Function} setLoading Function to update loading state during API call
 * @param {Function} navigate React Router navigation function for redirecting after login
 * @param {Function} dispatch Redux dispatch function for updating authentication state
 * @returns {Promise<void>} Resolves when login process completes (success or failure)
 */
export const handleLogin = async (form, setLoading, navigate, dispatch) => {
  try {
    setLoading(true);
    const data = await makeLoginRequest(form);
    handleLoginSuccess(dispatch, data);
    navigate('/dashboard');
  } catch (error) {
    if (!((error.message || '').toLowerCase().includes('too many requests'))) {
      toast.error(error.message || AUTH_MESSAGES.ERROR.LOGIN_FAILED);
    }
  } finally {
    setLoading(false);
  }
};

/**
 * Creates form submission event handler for login form
 * Prevents default form submission, validates form data, and initiates login process
 * @param {Object} form Form data object containing username and password
 * @param {string} form.username User's username for authentication
 * @param {string} form.password User's password for authentication
 * @param {Function} setLoading Function to update loading state during form submission
 * @param {Function} navigate React Router navigation function for post-login redirect
 * @param {Function} dispatch Redux dispatch function for updating authentication state
 * @param {Function} [handleLoginFn=handleLogin] - Optional injected handleLogin function for testing
 * @returns {Function} Event handler function that can be attached to form onSubmit
 */
export const handleSubmit = (form, setLoading, navigate, dispatch, handleLoginFn = handleLogin) => async (e) => {
  if (e && typeof e.preventDefault === 'function') e.preventDefault();
  if (!validateForm(form)) return;
  await handleLoginFn(form, setLoading, navigate, dispatch);
};

export const handleChange = handleFormChange; 