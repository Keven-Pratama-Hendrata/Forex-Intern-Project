import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { Login, Dashboard, Market, BuySell, History } from '../Pages/index.js';
import ProtectedRoute from './protectedRoute.jsx';

const routeConfig = [
    { path: '/', element: <Login />, protected: false, key: 'login' },
    { path: '/Dashboard', element: <Dashboard />, protected: true, key: 'dashboard' },
    { path: '/market', element: <Market />, protected: true, key: 'market' },
    { path: '/buy-sell', element: <BuySell />, protected: true, key: 'buy-sell' },
    { path: '/history', element: <History />, protected: true, key: 'history' },
];

/**
 * Renders all route definitions for the app.
 * @returns {JSX.Element[]} Array of route elements.
 */
function renderRoutes() {
    return routeConfig.map(({ path, element, protected: isProtected, key }) => (
        <Route
            path={path}
            element={isProtected ? <ProtectedRoute>{element}</ProtectedRoute> : element}
            key={key}
        />
    ));
}

/**
 * Main application routing component
 * Centralizes all route definitions and navigation logic
 * @returns {JSX.Element} The main app with routing configuration
 */
const AppRoutes = () => (
    <Routes>
        {renderRoutes()}
    </Routes>
);

export default AppRoutes; 