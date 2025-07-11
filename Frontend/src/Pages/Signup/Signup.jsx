import React from "react";
import { Link } from "react-router-dom";
import AuthBackground from "../../components/Background";
import { Button, FormField, LoadingSpinner } from "../../components/common";
import useSignupHandler from "./signupHandler";
import {
    SignupContentProps,
    SignupFormProps,
    SignupFieldsProps,
    FieldProps,
    SubmitButtonProps
} from "./Signup.type";
import { AUTH_FORMS, AUTH_HEADERS } from "../../data";

/**
 * Main signup page component for user registration
 * Manages signup form state and renders the complete signup interface
 * @returns {JSX.Element} Complete signup page with form and background
 */
const Signup = () => {
    const handler = useSignupHandler();
    return <SignupContent {...handler} />;
};

/**
 * Signup page layout component with authentication background
 * @param {Object} props Component props
 * @param {Object} props.formData Form state object with username, password, confirmPassword fields
 * @param {boolean} props.loading Loading state during form submission
 * @param {Function} props.handleChange Function to update form state
 * @param {Function} props.handleSubmit Function to handle form submission
 * @returns {JSX.Element} Signup page with background and form layout
 */
const SignupContent = ({ formData, loading, handleChange, handleSubmit }) => (
    <AuthBackground circlePosition="signup">
        <SignupForm
            formData={formData}
            loading={loading}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
        />
        <SigninLink />
    </AuthBackground>
);

SignupContent.propTypes = SignupContentProps;

/**
 * Signup form container with glassmorphism styling
 * Handles form submission and renders form fields with header and submit button
 * @param {Object} props Component props
 * @param {Object} props.formData Form state object with username, password, confirmPassword fields
 * @param {boolean} props.loading Loading state during form submission
 * @param {Function} props.handleChange Function to update form state
 * @param {Function} props.handleSubmit Function to handle form submission
 * @returns {JSX.Element} Styled signup form with glassmorphism effect
 */
const SignupForm = ({ formData, loading, handleChange, handleSubmit }) => (
    <form
        onSubmit={handleSubmit}
        className="rounded-2xl bg-white/60 p-8 shadow-xl backdrop-blur-md ring-1 ring-white/40"
        data-testid="signup-form"
    >
        <SignupHeader />
        <SignupFields
            formData={formData}
            handleChange={handleChange}
        />
        <SubmitButton loading={loading} />
    </form>
);

SignupForm.propTypes = SignupFormProps;

/**
 * Container for signup form input fields
 * Groups username, password, and confirm password fields together
 * @param {Object} props Component props
 * @param {Object} props.formData Form state object with username, password, confirmPassword fields
 * @param {Function} props.handleChange Function to update form state
 * @returns {JSX.Element} Fragment containing signup fields
 */
const SignupFields = ({ formData, handleChange }) => (
    <>
        <UsernameField formData={formData} handleChange={handleChange} />
        <PasswordField formData={formData} handleChange={handleChange} />
        <ConfirmPasswordField formData={formData} handleChange={handleChange} />
    </>
);

SignupFields.propTypes = SignupFieldsProps;

/**
 * Username input field component
 * @param {Object} props Component props
 * @param {Object} props.formData Form state object
 * @param {Function} props.handleChange Function to update form state
 * @returns {JSX.Element} Username input field
 */
const UsernameField = ({ formData, handleChange }) => (
    <FormField
        label="Username"
        name="username"
        placeholder={AUTH_FORMS.SIGNUP.PLACEHOLDERS.USERNAME}
        value={formData.username}
        onChange={handleChange}
        autoComplete={AUTH_FORMS.SIGNUP.AUTOCOMPLETE.USERNAME}
        required
    />
);

UsernameField.propTypes = FieldProps;

/**
 * Password input field component
 * @param {Object} props Component props
 * @param {Object} props.formData Form state object
 * @param {Function} props.handleChange Function to update form state
 * @returns {JSX.Element} Password input field
 */
const PasswordField = ({ formData, handleChange }) => (
    <FormField
        label="Password"
        name="password"
        type="password"
        placeholder={AUTH_FORMS.SIGNUP.PLACEHOLDERS.PASSWORD}
        value={formData.password}
        onChange={handleChange}
        autoComplete={AUTH_FORMS.SIGNUP.AUTOCOMPLETE.PASSWORD}
        required
    />
);

PasswordField.propTypes = FieldProps;

/**
 * Confirm password input field component
 * @param {Object} props Component props
 * @param {Object} props.formData Form state object
 * @param {Function} props.handleChange Function to update form state
 * @returns {JSX.Element} Confirm password input field
 */
const ConfirmPasswordField = ({ formData, handleChange }) => (
    <FormField
        label="Confirm Password"
        name="confirmPassword"
        type="password"
        placeholder={AUTH_FORMS.SIGNUP.PLACEHOLDERS.CONFIRM_PASSWORD}
        value={formData.confirmPassword}
        onChange={handleChange}
        autoComplete={AUTH_FORMS.SIGNUP.AUTOCOMPLETE.CONFIRM_PASSWORD}
        required
    />
);

ConfirmPasswordField.propTypes = FieldProps;

/**
 * Signup form header with branding and welcome message
 * @returns {JSX.Element} Form header with title and subtitle
 */
const SignupHeader = () => (
    <>
        <h2 className="mb-1 text-center text-2xl font-extrabold text-gray-800">
            {AUTH_HEADERS.SIGNUP.TITLE}
        </h2>
        <p className="mb-6 text-center text-sm text-gray-600">
            {AUTH_HEADERS.SIGNUP.SUBTITLE}
        </p>
    </>
);

/**
 * Signup form submit button component
 * @param {Object} props Component props
 * @param {boolean} props.loading Loading state during form submission
 * @returns {JSX.Element} Submit button with loading state handling
 */
const SubmitButton = ({ loading }) => (
    <Button type="submit" disabled={loading}>
        {loading ? <LoadingSpinner variant="inline" /> : "Create Account"}
    </Button>
);

SubmitButton.propTypes = SubmitButtonProps;

/**
 * Sign-in link component for users who already have an account
 * @returns {JSX.Element} Sign-in link with styled text and navigation
 */
const SigninLink = () => (
    <p className="mt-5 text-center text-sm text-gray-700">
        Already have an account?{" "}
        <Link to="/" className="font-medium text-sky-950 hover:underline">
            Sign in
        </Link>
    </p>
);

export default Signup; 