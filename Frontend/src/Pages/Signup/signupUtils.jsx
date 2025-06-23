// Logic and utility functions have been moved to signupLogic.js for Fast Refresh compliance.

import { useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { handleFormChange, validateRequiredFields, setUserData } from "../../components/common";
import { loginStart, loginSuccess, loginFailure } from '../../store/slices/authSlice';

/**
 * Custom hook to manage signup form state, navigation, and dispatch.
 * @returns {Object} Form state, loading state, setForm, setLoading, navigate, and dispatch function.
 */
export const useSignupForm = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ username: "", password: "", confirmPassword: "" });
    return { form, setForm, loading, setLoading, navigate, dispatch };
};

/**
 * Validates required fields for the signup form.
 * @param {Object} form The form state object.
 * @returns {Object} Validation result with isValid and message.
 */
const validateRequired = (form) =>
    validateRequiredFields(
        form,
        ["username", "password", "confirmPassword"],
        {
            username: "Username is required",
            password: "Password is required",
            confirmPassword: "Password confirmation is required",
        }
    );

/**
 * Validates the signup form.
 * @param {Object} form The form state object.
 * @returns {boolean} True if valid, false otherwise.
 */
export const validateForm = (form) => {
    const validation = validateRequired(form);
    if (!validation.isValid) {
        toast.error(validation.message);
        return false;
    }
    if (form.password !== form.confirmPassword) {
        toast.error("Passwords do not match");
        return false;
    }
    return true;
};

/**
 * Creates HTTP request configuration for signup API endpoint
 * @param {Object} form - Form data object containing username and password
 * @returns {Object} Fetch request configuration
 */
const createSignupRequestConfig = (form) => ({
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: form.username, password: form.password }),
});

/**
 * Processes signup API response and handles error cases
 * @param {Response} response - Fetch API response object from signup endpoint
 * @returns {Promise<Object>} Parsed response data
 * @throws {Error} When HTTP response is not successful
 */
const handleSignupResponse = async (response) => {
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Signup failed");
    return data;
};

/**
 * Performs HTTP request to signup API endpoint
 * @param {Object} form - Form data object containing username and password
 * @returns {Promise<Object>} Signup response data
 * @throws {Error} When API request fails or returns error response
 */
const makeSignupRequest = async (form) => {
    const config = createSignupRequestConfig(form);
    const response = await fetch("http://localhost:5001/api/users", config);
    return handleSignupResponse(response);
};

/**
 * Processes successful signup response and updates application state
 * Stores user data in Redux store and displays success notification
 * @param {Function} dispatch - Redux dispatch function
 * @param {Object} data - Signup response data
 */
const handleSignupSuccess = (dispatch, data) => {
    setUserData(dispatch, loginSuccess, data.token, {
        id: data._id,
        username: data.user_name,
        balances: data.balances,
    });
    toast.success("Account created successfully! 👋");
};

/**
 * Orchestrates the complete signup process
 * @param {Object} form - Form data object
 * @param {Function} setLoading - Function to update loading state
 * @param {Function} navigate - React Router navigation function
 * @param {Function} dispatch - Redux dispatch function
 * @returns {Promise<void>}
 */
export const handleSignup = async (form, setLoading, navigate, dispatch) => {
    try {
        setLoading(true);
        dispatch(loginStart());
        const data = await makeSignupRequest(form);
        handleSignupSuccess(dispatch, data);
        navigate("/");
    } catch (error) {
        dispatch(loginFailure(error.message || "Signup failed"));
        toast.error(error.message || "Signup failed");
    } finally {
        setLoading(false);
    }
};

/**
 * Creates form submission event handler for signup form
 * @param {Object} form - Form data object
 * @param {Function} setLoading - Function to update loading state
 * @param {Function} navigate - React Router navigation function
 * @param {Function} dispatch - Redux dispatch function
 * @returns {Function} Event handler function for form onSubmit
 */
export const handleSubmit = (form, setLoading, navigate, dispatch) => async (e) => {
    e.preventDefault();
    if (!validateForm(form)) return;
    await handleSignup(form, setLoading, navigate, dispatch);
};

/**
 * Handles form field changes.
 * @type {Function}
 */
export const handleChange = handleFormChange; 