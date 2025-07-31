import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

/**
 * Protects routes from unauthenticated access.
 * Redirects to the login page if the user is not authenticated.
 * @param {Object} props The component props.
 * @param {React.ReactNode} props.children The child components to render if authenticated.
 * @returns {JSX.Element} The protected route or redirect.
 */
const ProtectedRoute = ({ children }) => {
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute; 