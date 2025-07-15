import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { Login, Dashboard } from './Pages';

/**
 * Main application routing component
 * Centralizes all route definitions and navigation logic
 * @returns {JSX.Element} The main app with routing configuration
 */
const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/Dashboard" element={<Dashboard />} />
        </Routes>
    );
};

export default AppRoutes; 