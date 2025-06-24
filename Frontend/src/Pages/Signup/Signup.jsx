import React from "react";
import { useNavigate, Link } from "react-router";
import { useDispatch } from "react-redux";
import { useSignupForm } from "./signupUtils.jsx";

import AuthBackground from "../../components/Background/AuthBackground.jsx";
import { Button, LoadingSpinner } from "../../components/common";
import { handleSubmit } from "./signupUtils.jsx";
import { FormField } from "../../components/common";

/**
 * Signup page component for user registration.
 * Renders the signup form and handles user registration logic.
 * @component
 * @returns {JSX.Element} The rendered Signup page.
 */
function Signup() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    return (
        <AuthBackground circlePosition="signup">
            <SignupFormContent
                navigate={navigate}
                dispatch={dispatch}
            />
        </AuthBackground>
    );
}

/**
 * SignupFormContent component renders the registration form.
 * @param {Object} props The component props.
 * @param {Function} props.navigate Navigation function from react-router.
 * @param {Function} props.dispatch Dispatch function from react-redux.
 * @returns {JSX.Element} The rendered signup form.
 */
const SignupFormContent = ({ navigate, dispatch }) => {
    const { form, setForm, loading, setLoading } = useSignupForm();
    return (
        <form
            onSubmit={handleSubmit(form, setLoading, navigate, dispatch)}
            className="rounded-2xl bg-white/60 p-8 shadow-xl backdrop-blur-md ring-1 ring-white/40"
        >
            <SignupHeader />
            <SignupFields form={form} setForm={setForm} />
            <SignupButton loading={loading} />
            <SignupFooter />
        </form>
    );
};

/**
 * SignupHeader component renders the form header.
 * @returns {JSX.Element} The rendered header.
 */
const SignupHeader = () => (
    <>
        <h2 className="mb-1 text-center text-2xl font-extrabold text-gray-800">
            Create an Account
        </h2>
        <p className="mb-6 text-center text-sm text-gray-600">
            Join us to start trading!
        </p>
    </>
);

/**
 * SignupFields component renders the form fields.
 * @param {Object} root0 The props object.
 * @param {Object} root0.form The form state object.
 * @param {Function} root0.setForm Function to update the form state.
 * @returns {JSX.Element} The rendered form fields.
 */
const SignupFields = ({ form, setForm }) => (
    <>
        <UsernameField form={form} setForm={setForm} />
        <PasswordField form={form} setForm={setForm} />
        <ConfirmPasswordField form={form} setForm={setForm} />
    </>
);

/**
 * UsernameField component renders the username input field.
 * @param {Object} root0 The props object.
 * @param {Object} root0.form The form state object.
 * @param {Function} root0.setForm Function to update the form state.
 * @returns {JSX.Element} The rendered username field.
 */
const UsernameField = ({ form, setForm }) => (
    <FormField
        label="Username"
        type="text"
        name="username"
        placeholder="Choose a username"
        value={form.username}
        onChange={(e) => setForm({ ...form, username: e.target.value })}
        autoComplete="username"
        required
    />
);

/**
 * PasswordField component renders the password input field.
 * @param {Object} root0 The props object.
 * @param {Object} root0.form The form state object.
 * @param {Function} root0.setForm Function to update the form state.
 * @returns {JSX.Element} The rendered password field.
 */
const PasswordField = ({ form, setForm }) => (
    <FormField
        label="Password"
        type="password"
        name="password"
        placeholder="••••••••"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        autoComplete="new-password"
        required
    />
);

/**
 * ConfirmPasswordField component renders the confirm password input field.
 * @param {Object} root0 The props object.
 * @param {Object} root0.form The form state object.
 * @param {Function} root0.setForm Function to update the form state.
 * @returns {JSX.Element} The rendered confirm password field.
 */
const ConfirmPasswordField = ({ form, setForm }) => (
    <FormField
        label="Confirm Password"
        type="password"
        name="confirmPassword"
        placeholder="••••••••"
        value={form.confirmPassword}
        onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
        autoComplete="new-password"
        required
    />
);

/**
 * SignupButton component renders the submit button.
 * @param {Object} root0 The props object.
 * @param {boolean} root0.loading Loading state for the form submission.
 * @returns {JSX.Element} The rendered button.
 */
const SignupButton = ({ loading }) => (
    <Button type="submit" disabled={loading}>
        {loading ? <LoadingSpinner variant="inline" /> : "Create Account"}
    </Button>
);

/**
 * SignupFooter component renders the footer with a sign-in link.
 * @returns {JSX.Element} The rendered footer.
 */
const SignupFooter = () => (
    <p className="mt-5 text-center text-sm text-gray-700">
        Already have an account?{" "}
        <Link to="/" className="font-medium text-sky-950 hover:underline">
            Sign in
        </Link>
    </p>
);

/**
 * Default export for the Signup page, rendering the Signup form and footer.
 * @returns {JSX.Element} The rendered Signup page with footer.
 */
export default function SignupWithFooter() {
    return <Signup />;
}