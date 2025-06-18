import React from "react";
import { Link } from "react-router";

import AuthBackground from "../../components/Background/AuthBackground.jsx";
import { Button, LoadingSpinner, FormField } from "../../components/common";
import {
  handleChange,
  handleSubmit,
  useLoginState
} from "./loginUtils.jsx";

/**
 * Main login page component for user authentication
 * Manages login form state and renders the complete login interface
 * @returns {JSX.Element} Complete login page with form and background
 */
const Login = () => {
  const { navigate, dispatch, loading, setLoading, form, setForm } = useLoginState();
  return (
    <LoginContent
      form={form}
      setForm={setForm}
      loading={loading}
      setLoading={setLoading}
      navigate={navigate}
      dispatch={dispatch}
    />
  );
};

/**
 * Login page layout component with authentication background
 * Wraps the login form with animated background and signup link
 * @param {Object} props - Component props
 * @param {Object} props.form - Form state object with username and password fields
 * @param {Function} props.setForm - Function to update form state
 * @param {boolean} props.loading - Loading state during form submission
 * @param {Function} props.setLoading - Function to update loading state
 * @param {Function} props.navigate - React Router navigation function
 * @param {Function} props.dispatch - Redux dispatch function for auth actions
 * @returns {JSX.Element} Login page with background and form layout
 */
const LoginContent = ({ form, setForm, loading, setLoading, navigate, dispatch }) => (
  <AuthBackground circlePosition="login">
    <LoginForm
      form={form}
      setForm={setForm}
      loading={loading}
      setLoading={setLoading}
      navigate={navigate}
      dispatch={dispatch}
    />
    <SignupLink />
  </AuthBackground>
);

/**
 * Login form container with glassmorphism styling
 * Handles form submission and renders form fields with header and submit button
 * @param {Object} props - Component props
 * @param {Object} props.form - Form state object with username and password fields
 * @param {Function} props.setForm - Function to update form state
 * @param {boolean} props.loading - Loading state during form submission
 * @param {Function} props.setLoading - Function to update loading state
 * @param {Function} props.navigate - React Router navigation function
 * @param {Function} props.dispatch - Redux dispatch function for auth actions
 * @returns {JSX.Element} Styled login form with glassmorphism effect
 */
const LoginForm = ({ form, setForm, loading, setLoading, navigate, dispatch }) => (
  <form
    onSubmit={handleSubmit(form, setLoading, navigate, dispatch)}
    className="rounded-2xl bg-white/60 p-8 shadow-xl backdrop-blur-md ring-1 ring-white/40"
  >
    <LoginHeader />
    <LoginFields form={form} setForm={setForm} />
    <SubmitButton loading={loading} />
  </form>
);

/**
 * Container for login form input fields
 * Groups username and password fields together
 * @param {Object} props - Component props
 * @param {Object} props.form - Form state object with username and password fields
 * @param {Function} props.setForm - Function to update form state
 * @returns {JSX.Element} Fragment containing username and password fields
 */
const LoginFields = ({ form, setForm }) => (
  <>
    <UsernameField form={form} setForm={setForm} />
    <PasswordField form={form} setForm={setForm} />
  </>
);

/**
 * Username input field component
 * Renders a text input for username with proper accessibility attributes
 * @param {Object} props - Component props
 * @param {Object} props.form - Form state object with username field
 * @param {Function} props.setForm - Function to update form state
 * @returns {JSX.Element} Username input field with label and validation
 */
const UsernameField = ({ form, setForm }) => (
  <FormField
    label="Username"
    type="text"
    name="username"
    placeholder="John Doe"
    value={form.username}
    onChange={handleChange(form, setForm)}
    autoComplete="username"
    required
  />
);

/**
 * Password input field component
 * Renders a password input with proper security attributes
 * @param {Object} props - Component props
 * @param {Object} props.form - Form state object with password field
 * @param {Function} props.setForm - Function to update form state
 * @returns {JSX.Element} Password input field with label and validation
 */
const PasswordField = ({ form, setForm }) => (
  <FormField
    label="Password"
    type="password"
    name="password"
    placeholder="••••••••"
    value={form.password}
    onChange={handleChange(form, setForm)}
    autoComplete="current-password"
    required
  />
);

/**
 * Login form submit button component
 * Shows loading spinner when submitting, disabled during form submission
 * @param {Object} props - Component props
 * @param {boolean} props.loading - Loading state during form submission
 * @returns {JSX.Element} Submit button with loading state handling
 */
const SubmitButton = ({ loading }) => (
  <Button type="submit" disabled={loading}>
    {loading ? <LoadingSpinner variant="inline" /> : "Log in"}
  </Button>
);

/**
 * Login form header with branding and welcome message
 * Displays the application title and motivational text
 * @returns {JSX.Element} Form header with title and subtitle
 */
const LoginHeader = () => (
  <>
    <h2 className="mb-1 text-center text-2xl font-extrabold text-gray-800">
      Sign in to Trade FX
    </h2>
    <p className="mb-6 text-center text-sm text-gray-600">
      Ready to conquer the markets?
    </p>
  </>
);

/**
 * Signup link component for new user registration
 * Provides navigation to signup page for users without accounts
 * @returns {JSX.Element} Signup link with styled text and navigation
 */
const SignupLink = () => (
  <p className="mt-5 text-center text-sm text-gray-700">
    New here?{" "}
    <Link to="/signup" className="font-medium text-sky-950 hover:underline">
      Create an account
    </Link>
  </p>
);

export default Login;