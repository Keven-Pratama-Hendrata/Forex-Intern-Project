import { useState } from "react";
import { AUTH_ENDPOINTS } from "../../data/authData";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

/**
 * Provides form state and navigation for signup page
 * @returns {Object} Signup state and helpers
 */
export function useSignupState() {
    const [form, setForm] = useState({ username: "", password: "", confirmPassword: "" });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    return { form, setForm, loading, setLoading, navigate };
}

/**
 * Generic onChange handler factory for controlled inputs
 * @param {Object} form current form state
 * @param {Function} setForm state setter
 * @returns {Function} onChange event handler
 */
export function handleChange(form, setForm) {
    return (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };
}

/**
 * Creates a submit handler bound to the form state and navigation
 * @param {Object} form current form state
 * @param {Function} setLoading function to toggle loading
 * @param {Function} navigate react-router navigate
 * @returns {Function} submit event handler
 */
export function handleSubmit(form, setLoading, navigate) {
    return async (e) => {
        e.preventDefault();

        if (form.password !== form.confirmPassword) {
            toast.error("Passwords don't match!");
            return;
        }

        if (!form.password || form.password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(AUTH_ENDPOINTS.SIGNUP, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: form.username, password: form.password })
            });

            if (!response.ok) {
                const data = await response.json();
                const message = data?.message || data?.error?.message || "Signup failed";
                toast.error(message);
                setLoading(false);
                return;
            }

            toast.success("Account created successfully");
            navigate("/");
        } catch (err) {
            toast.error(err.message || "Signup failed");
            setLoading(false);
        }
    };
}
