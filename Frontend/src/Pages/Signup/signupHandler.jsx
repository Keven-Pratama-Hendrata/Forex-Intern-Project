import toast from "react-hot-toast";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AUTH_ENDPOINTS, AUTH_MESSAGES, AUTH_FORMS } from "../../data";
import { handleFormChange, validateRequiredFields } from '../../components/common';

/**
 * Checks if password meets minimum length.
 * @param {string} password - The password string.
 * @param {number} minLength - The minimum length required.
 * @returns {boolean} True if password is long enough.
 */
const validatePasswordLength = (password, minLength = 6) => password.length >= minLength;

/**
 * Checks if password and confirmPassword match.
 * @param {string} password - The password string.
 * @param {string} confirmPassword - The confirmation password string.
 * @returns {boolean} True if passwords match.
 */
const validatePasswordMatch = (password, confirmPassword) => password === confirmPassword;

/**
 * Validates password length and match for signup form.
 * @param {Object} formData - The form data object.
 * @returns {boolean} True if valid, false otherwise.
 */
function validateSignupPasswords(formData) {
    if (!validatePasswordLength(formData.password, AUTH_FORMS.SIGNUP.VALIDATION.MIN_PASSWORD_LENGTH)) {
        toast.error(AUTH_MESSAGES.VALIDATION.PASSWORD_TOO_SHORT);
        return false;
    }
    if (!validatePasswordMatch(formData.password, formData.confirmPassword)) {
        toast.error(AUTH_MESSAGES.VALIDATION.PASSWORDS_DONT_MATCH);
        return false;
    }
    return true;
}

/**
 * Validates signup form fields for required fields and password rules.
 * @param {Object} formData - The form data object.
 * @returns {boolean} True if valid, false otherwise.
 */
const validateSignupForm = (formData) => {
    const requiredFields = ['username', 'password', 'confirmPassword'];
    const requiredMessages = {
        username: AUTH_MESSAGES.VALIDATION.USERNAME_REQUIRED,
        password: AUTH_MESSAGES.VALIDATION.PASSWORD_REQUIRED,
        confirmPassword: AUTH_MESSAGES.VALIDATION.CONFIRM_PASSWORD_REQUIRED,
    };
    const requiredCheck = validateRequiredFields(formData, requiredFields, requiredMessages);
    if (!requiredCheck.isValid) {
        toast.error(requiredCheck.message);
        return false;
    }
    return validateSignupPasswords(formData);
};

/**
 * Creates HTTP request configuration for signup API endpoint.
 * @param {string} method - HTTP method.
 * @param {Object} body - Request body.
 * @returns {Object} Fetch request configuration.
 */
const createRequestConfig = (method, body) => ({
    method,
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
});

/**
 * Creates request body for signup API call.
 * @param {Object} formData - The form data object.
 * @returns {Object} Request body object.
 */
const createSignupRequestBody = (formData) => ({
    username: formData.username,
    password: formData.password
});

/**
 * Makes the signup API request.
 * @param {Object} formData - The form data object.
 * @returns {Promise<Object>} API response data.
 */
const signupUserRequest = async (formData) => {
    const requestBody = createSignupRequestBody(formData);
    const config = createRequestConfig("POST", requestBody);
    const response = await fetch(AUTH_ENDPOINTS.SIGNUP, config);
    const data = await response.json();
    return { ok: response.ok, data };
};

/**
 * Handles input change for signup form fields.
 * @param {Object} params - Parameters object.
 * @param {Object} params.formData - Current form data.
 * @param {Function} params.setFormData - Function to update form state.
 * @returns {Function} Event handler for input change.
 */
export const handleSignupChange = ({ formData, setFormData }) => handleFormChange(formData, setFormData);

/**
 * Determines error message for signup failure.
 * @param {Object} data - API response data.
 * @returns {string} Error message.
 */
const getSignupErrorMessage = (data) => {
    if (data.error === "USERNAME_EXISTS") {
        return AUTH_MESSAGES.ERROR.USERNAME_EXISTS;
    }
    return data.message || AUTH_MESSAGES.ERROR.SIGNUP_FAILED;
};

/**
 * Handles successful signup result.
 * @param {Function} setLoading - Function to update loading state.
 * @param {Function} navigate - Function to redirect after signup.
 */
const handleSignupSuccess = (setLoading, navigate) => {
    toast.success(AUTH_MESSAGES.SUCCESS.SIGNUP);
    navigate("/");
    setLoading(false);
};

/**
 * Handles failed signup result.
 * @param {Object} data - API response data.
 * @param {Function} setLoading - Function to update loading state.
 */
const handleSignupFailure = (data, setLoading) => {
    const errorMsg = getSignupErrorMessage(data);
    toast.error(errorMsg);
    setLoading(false);
};

/**
 * Handles the result of the signup API call and updates UI accordingly.
 * @param {Object} args - Arguments object.
 * @param {Object} args.data - API response data.
 * @param {boolean} args.ok - Whether the API call was successful.
 * @param {Function} args.setLoading - Function to update loading state.
 * @param {Function} args.navigate - Function to redirect after signup.
 */
const handleSignupResult = ({ data, ok, setLoading, navigate }) => {
    if (!ok) {
        handleSignupFailure(data, setLoading);
        return;
    }
    handleSignupSuccess(setLoading, navigate);
};

/**
 * Handles API request errors.
 * @param {Error} error - The caught error.
 * @param {Function} setLoading - Function to update loading state.
 */
const handleSignupRequestError = (error, setLoading) => {
    const errorMsg = error?.message || AUTH_MESSAGES.ERROR.NETWORK_ERROR;
    toast.error(errorMsg);
    setLoading(false);
};

/**
 * Processes the signup logic after validation.
 * @param {Object} args - Arguments object.
 * @param {Object} args.formData - Form data object to send to API.
 * @param {Function} args.setLoading - Function to update loading state.
 * @param {Function} args.navigate - Function to redirect after signup.
 */
const processSignup = async ({ formData, setLoading, navigate }) => {
    setLoading(true);
    try {
        const { ok, data } = await signupUserRequest(formData);
        handleSignupResult({ data, ok, setLoading, navigate });
    } catch (error) {
        handleSignupRequestError(error, setLoading);
    }
};

/**
 * Handles form submission for signup.
 * @param {Object} params - Parameters object.
 * @param {Object} params.formData - Form data object.
 * @param {Function} params.setLoading - Function to update loading state.
 * @param {Function} params.navigate - Function to redirect after signup.
 * @returns {Function} Event handler for form submit.
 */
export const handleSignupSubmit = ({ formData, setLoading, navigate }) => async (e) => {
    e.preventDefault();
    if (!validateSignupForm(formData)) return;
    await processSignup({ formData, setLoading, navigate });
};

/**
 * Initializes signup form state.
 * @returns {Object} Initial form state object.
 */
const getInitialFormState = () => ({
    username: "",
    password: "",
    confirmPassword: ""
});

/**
 * Custom hook for signup form state and handlers.
 * @returns {Object} Object containing formData, loading, handleChange, handleSubmit.
 */
const useSignupHandler = () => {
    const [formData, setFormData] = useState(getInitialFormState());
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    return {
        formData,
        loading,
        handleChange: handleSignupChange({ formData, setFormData }),
        handleSubmit: handleSignupSubmit({ formData, setLoading, navigate })
    };
};

export default useSignupHandler;
export { validatePasswordLength, validateSignupForm }; 