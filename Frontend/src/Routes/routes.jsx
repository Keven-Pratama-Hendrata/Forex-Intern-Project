import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { Login, Dashboard } from '../Pages/index.js';
import ProtectedRoute from './protectedRoute.jsx';

/**
 * Main application routing component
 * Centralizes all route definitions and navigation logic
 * @returns {JSX.Element} The main app with routing configuration
 */
const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/Dashboard" element={
                <ProtectedRoute>
                    <Dashboard />
                </ProtectedRoute>
            } />
        </Routes>
    );
};

export default AppRoutes; 