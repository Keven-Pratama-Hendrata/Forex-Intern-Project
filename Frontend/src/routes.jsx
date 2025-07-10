import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { Login } from './Pages';
import { Signup } from "./Pages";

/**
 * Main application routing component
 * Centralizes all route definitions and navigation logic
 * @returns {JSX.Element} The main app with routing configuration
 */
const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
        </Routes>
    );
};

export default AppRoutes; 