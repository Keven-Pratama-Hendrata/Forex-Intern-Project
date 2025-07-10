import toast from "react-hot-toast";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AUTH_ENDPOINTS, AUTH_MESSAGES, AUTH_FORMS } from "../../data";

/**
 * Validates password length meets minimum requirement
 * @param {string} password The password to validate
 * @param {number} minLength Minimum required password length
 * @returns {boolean} True if password meets length requirement
 */
const validatePasswordLength = (password, minLength = 6) => {
    return password.length >= minLength;
};

/**
 * Validates that password and confirm password match
 * @param {string} password The password
 * @param {string} confirmPassword The confirm password
 * @returns {boolean} True if passwords match
 */
const validatePasswordMatch = (password, confirmPassword) => {
    return password === confirmPassword;
};

/**
 * Validates username field for required value
 * @param {Object} formData Form data object
 * @param {Object} validationMessages Validation error messages
 * @returns {string|null} Error message if validation fails, null if valid
 */
const validateUsernameField = (formData, validationMessages) => {
    if (!formData.username) {
        return validationMessages.USERNAME_REQUIRED;
    }
    return null;
};

/**
 * Validates password field for required value and minimum length
 * @param {Object} formData Form data object
 * @param {Object} validationMessages Validation error messages
 * @param {number} minPasswordLength Minimum required password length
 * @returns {string|null} Error message if validation fails, null if valid
 */
const validatePasswordField = (formData, validationMessages, minPasswordLength) => {
    if (!formData.password) {
        return validationMessages.PASSWORD_REQUIRED;
    }
    if (!validatePasswordLength(formData.password, minPasswordLength)) {
        return validationMessages.PASSWORD_TOO_SHORT;
    }
    return null;
};

/**
 * Validates confirm password field for required value and password match
 * @param {Object} formData Form data object
 * @param {Object} validationMessages Validation error messages
 * @returns {string|null} Error message if validation fails, null if valid
 */
const validateConfirmPasswordField = (formData, validationMessages) => {
    if (!formData.confirmPassword) {
        return validationMessages.CONFIRM_PASSWORD_REQUIRED;
    }
    if (!validatePasswordMatch(formData.password, formData.confirmPassword)) {
        return validationMessages.PASSWORDS_DONT_MATCH;
    }
    return null;
};

/**
 * Validates signup form fields and returns the first error if any
 * @param {Object} formData Form data object
 * @param {Object} validationMessages Validation error messages
 * @param {number} minPasswordLength Minimum required password length
 * @returns {string|null} First error message if validation fails, null if valid
 */
const validateSignupFormFields = (formData, validationMessages, minPasswordLength = 6) => {
    const usernameError = validateUsernameField(formData, validationMessages);
    if (usernameError) return usernameError;

    const passwordError = validatePasswordField(formData, validationMessages, minPasswordLength);
    if (passwordError) return passwordError;

    const confirmPasswordError = validateConfirmPasswordField(formData, validationMessages);
    if (confirmPasswordError) return confirmPasswordError;

    return null;
};

/**
 * Validates signup form fields for required username, password, and confirm password
 * Checks if all fields are present, password is at least 6 characters, and passwords match
 * Shows toast for validation error if any
 * @param {Object} formData The form data object
 * @returns {boolean} True if validation passes, false otherwise
 */
export const validateSignupForm = (formData) => {
    const error = validateSignupFormFields(
        formData,
        AUTH_MESSAGES.VALIDATION,
        AUTH_FORMS.SIGNUP.VALIDATION.MIN_PASSWORD_LENGTH
    );

    if (error) {
        toast.error(error);
        return false;
    }
    return true;
};

/**
 * Creates HTTP request configuration for signup API endpoint
 * @param {string} method HTTP method
 * @param {Object} body Request body
 * @returns {Object} Fetch request configuration
 */
const createRequestConfig = (method, body) => ({
    method,
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
});

/**
 * Creates request body for signup API call
 * @param {Object} formData Form data object
 * @returns {Object} Request body object
 */
const createSignupRequestBody = (formData) => ({
    username: formData.username,
    password: formData.password
});

/**
 * Makes the signup API request
 * @param {Object} formData Form data object containing username and password
 * @returns {Promise<Object>} API response data
 */
const signupUserRequest = async (formData) => {
    const requestBody = createSignupRequestBody(formData);
    const config = createRequestConfig("POST", requestBody);

    const response = await fetch(AUTH_ENDPOINTS.SIGNUP, config);
    const data = await response.json();

    return { ok: response.ok, data };
};

/**
 * Handles input change for signup form fields
 * @param {Object} params Parameters object
 * @param {Function} params.setFormData Function to update form state
 * @returns {Function} Event handler for input change
 */
export const handleSignupChange = ({ setFormData }) => (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
        ...prev,
        [name]: value
    }));
};

/**
 * Determines error message for signup failure
 * @param {Object} data API response data
 * @returns {string} Error message
 */
const getSignupErrorMessage = (data) => {
    if (data.error === "USERNAME_EXISTS") {
        return AUTH_MESSAGES.ERROR.USERNAME_EXISTS;
    }
    return data.message || AUTH_MESSAGES.ERROR.SIGNUP_FAILED;
};

/**
 * Handles successful signup result
 * @param {Function} setLoading Function to update loading state
 * @param {Function} navigate Function to redirect after signup
 */
const handleSignupSuccess = (setLoading, navigate) => {
    toast.success(AUTH_MESSAGES.SUCCESS.SIGNUP);
    navigate("/");
    setLoading(false);
};

/**
 * Handles failed signup result
 * @param {Object} data API response data
 * @param {Function} setLoading Function to update loading state
 */
const handleSignupFailure = (data, setLoading) => {
    const errorMsg = getSignupErrorMessage(data);
    toast.error(errorMsg);
    setLoading(false);
};

/**
 * Handles the result of the signup API call and updates UI accordingly
 * @param {Object} args Arguments object
 * @param {Object} args.data Response data from API
 * @param {boolean} args.ok Whether the API call was successful
 * @param {Function} args.setLoading Function to update loading state
 * @param {Function} args.navigate Function to redirect after signup
 */
const handleSignupResult = ({ data, ok, setLoading, navigate }) => {
    if (!ok) {
        handleSignupFailure(data, setLoading);
        return;
    }

    handleSignupSuccess(setLoading, navigate);
};

/**
 * Handles API request errors
 * @param {Error} error The caught error
 * @param {Function} setLoading Function to update loading state
 */
const handleSignupRequestError = (error, setLoading) => {
    const errorMsg = error?.message || AUTH_MESSAGES.ERROR.NETWORK_ERROR;
    toast.error(errorMsg);
    setLoading(false);
};

/**
 * Processes the signup logic after validation
 * @param {Object} args Arguments object
 * @param {Object} args.formData Form data object to send to API
 * @param {Function} args.setLoading Function to update loading state
 * @param {Function} args.navigate Function to redirect after signup
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
 * Handles form submission for signup
 * Validates form and makes API call
 * @param {Object} params Parameters object
 * @param {Object} params.formData Form data object
 * @param {Function} params.setLoading Function to update loading state
 * @param {Function} params.navigate Function to redirect after signup
 * @returns {Function} Event handler for form submit
 */
export const handleSignupSubmit = ({ formData, setLoading, navigate }) => async (e) => {
    e.preventDefault();

    if (!validateSignupForm(formData)) return;

    await processSignup({ formData, setLoading, navigate });
};

/**
 * Initializes signup form state
 * @returns {Object} Initial form state object
 */
const getInitialFormState = () => ({
    username: "",
    password: "",
    confirmPassword: ""
});

/**
 * Custom hook for signup form state and handlers
 * @returns {Object} Object containing formData, loading, handleChange, handleSubmit
 */
const useSignupHandler = () => {
    const [formData, setFormData] = useState(getInitialFormState());
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    return {
        formData,
        loading,
        handleChange: handleSignupChange({ setFormData }),
        handleSubmit: handleSignupSubmit({ formData, setLoading, navigate })
    };
};

export default useSignupHandler;
export { validatePasswordLength, validateSignupFormFields }; 