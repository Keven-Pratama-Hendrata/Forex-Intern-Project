import React from "react";
import { Link } from "react-router";

import AuthBackground from "../../components/Background";
import { Button, LoadingSpinner, FormField } from "../../components/common";
import { handleChange, handleSubmit, useSignupState } from "./signupHandler.jsx";
import { AUTH_FORMS } from "../../data";
import {
    SignupContentProps,
    SignupFormProps,
    SignupFieldsProps,
    FieldProps,
    SubmitButtonProps,
} from "./Signup.type.js";

/**
 * Main signup page component
 * Manages signup form state and renders the complete signup interface
 * @returns {JSX.Element} The wired signup page component
 */
const Signup = () => {
    const { navigate, loading, setLoading, form, setForm } = useSignupState();

    return (
        <SignupContent
            form={form}
            setForm={setForm}
            loading={loading}
            setLoading={setLoading}
            navigate={navigate}
        />
    );
};

/**
 * Signup page layout with authentication background
 * Wraps the signup form and the Sign in link
 * @param {Object} props Component props
 * @param {Object} props.form Form state object
 * @param {Function} props.setForm Setter for form state
 * @param {boolean} props.loading Loading state
 * @param {Function} props.setLoading Setter for loading state
 * @param {Function} props.navigate React Router navigate function
 * @returns {JSX.Element} The signup content layout
 */
const SignupContent = ({ form, setForm, loading, setLoading, navigate }) => (
    <AuthBackground circlePosition="signup">
        <SignupForm
            form={form}
            setForm={setForm}
            loading={loading}
            setLoading={setLoading}
            navigate={navigate}
        />
        <SigninLink />
    </AuthBackground>
);

SignupContent.propTypes = SignupContentProps;

/**
 * Signup form container
 * @param {Object} props Component props
 * @param {Object} props.form Form state object
 * @param {Function} props.setForm Setter for form state
 * @param {boolean} props.loading Loading state
 * @param {Function} props.setLoading Setter for loading state
 * @param {Function} props.navigate React Router navigate
 * @returns {JSX.Element} The signup form element
 */
const SignupForm = ({ form, setForm, loading, setLoading, navigate }) => (
    <form
        onSubmit={handleSubmit(form, setLoading, navigate)}
        className="rounded-2xl bg-white/60 p-8 shadow-xl backdrop-blur-md ring-1 ring-white/40"
    >
        <SignupHeader />
        <SignupFields form={form} setForm={setForm} />
        <SubmitButton loading={loading} />
    </form>
);

SignupForm.propTypes = SignupFormProps;

/**
 * Grouped signup fields: username, password, confirm password
 * @param {Object} props Component props
 * @param {Object} props.form Form state object
 * @param {Function} props.setForm Setter for form state
 * @returns {JSX.Element} Fragment containing input fields
 */
const SignupFields = ({ form, setForm }) => (
    <>
        <UsernameField form={form} setForm={setForm} />
        <PasswordField form={form} setForm={setForm} />
        <ConfirmPasswordField form={form} setForm={setForm} />
    </>
);

SignupFields.propTypes = SignupFieldsProps;

/**
 * Username input
 * @param {Object} props Component props
 * @param {Object} props.form Form state object
 * @param {Function} props.setForm Setter for form state
 * @returns {JSX.Element} Username input field
 */
const UsernameField = ({ form, setForm }) => (
    <FormField
        label="Username"
        type="text"
        name="username"
        placeholder={AUTH_FORMS?.SIGNUP?.PLACEHOLDERS?.USERNAME ?? "John Doe"}
        value={form.username}
        onChange={handleChange(form, setForm)}
        autoComplete={AUTH_FORMS?.SIGNUP?.AUTOCOMPLETE?.USERNAME ?? "username"}
        required
    />
);
UsernameField.propTypes = FieldProps;

/**
 * Password input
 * @param {Object} props Component props
 * @param {Object} props.form Form state object
 * @param {Function} props.setForm Setter for form state
 * @returns {JSX.Element} Password input field
 */
const PasswordField = ({ form, setForm }) => (
    <FormField
        label="Password"
        type="password"
        name="password"
        placeholder={AUTH_FORMS?.SIGNUP?.PLACEHOLDERS?.PASSWORD ?? "••••••"}
        value={form.password}
        onChange={handleChange(form, setForm)}
        autoComplete={AUTH_FORMS?.SIGNUP?.AUTOCOMPLETE?.PASSWORD ?? "new-password"}
        required
    />
);
PasswordField.propTypes = FieldProps;

/**
 * Confirm password input
 * @param {Object} props Component props
 * @param {Object} props.form Form state object
 * @param {Function} props.setForm Setter for form state
 * @returns {JSX.Element} Confirm password input field
 */
const ConfirmPasswordField = ({ form, setForm }) => (
    <FormField
        label="Confirm Password"
        type="password"
        name="confirmPassword"
        placeholder={
            AUTH_FORMS?.SIGNUP?.PLACEHOLDERS?.CONFIRM_PASSWORD ?? "••••••"
        }
        value={form.confirmPassword}
        onChange={handleChange(form, setForm)}
        autoComplete={
            AUTH_FORMS?.SIGNUP?.AUTOCOMPLETE?.CONFIRM_PASSWORD ?? "new-password"
        }
        required
    />
);
ConfirmPasswordField.propTypes = FieldProps;

/**
 * Submit button
 * @param {Object} props Component props
 * @param {boolean} props.loading Loading state
 * @returns {JSX.Element} Submit button element
 */
const SubmitButton = ({ loading }) => (
    <Button type="submit" disabled={loading}>
        {loading ? <LoadingSpinner variant="inline" /> : "Create Account"}
    </Button>
);
SubmitButton.propTypes = SubmitButtonProps;

/**
 * Header text
 * @returns {JSX.Element} Header content for the signup form
 */
const SignupHeader = () => (
    <>
        <h2 className="mb-1 text-center text-2xl font-extrabold text-gray-800">
            Create an Account
        </h2>
        <p className="mb-3 text-center text-sm text-gray-600">
            Join us to start trading!
        </p>
    </>
);

/**
 * Link to Login, mirrors the Login page’s footer link pattern
 * @returns {JSX.Element} Signup footer link to sign in
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
