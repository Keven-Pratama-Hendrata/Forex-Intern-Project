import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { Login } from './Pages';

/**
 * Main application routing component
 * Centralizes all route definitions and navigation logic
 * @returns {JSX.Element} The main app with routing configuration
 */
const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
        </Routes>
    );
};

export default AppRoutes; 