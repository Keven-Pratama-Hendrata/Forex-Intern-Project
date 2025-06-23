import React from 'react';
import { Routes, Route } from 'react-router';
import Login from '../Pages/Login/Login';
import SignupWithFooter from '../Pages/Signup/Signup';

/**
 * Main application component that handles routing
 * @returns {JSX.Element} The main app with routing configuration
 */
const App = () => {
  return (
    <div data-theme="light">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignupWithFooter />} />
      </Routes>
    </div>
  );
};

export default App;