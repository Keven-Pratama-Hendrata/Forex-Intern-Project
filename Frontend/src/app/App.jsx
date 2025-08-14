import React from 'react';
import AppRoutes from '../Routes/routes';
import { useGlobalFetchInterceptor } from "../hooks/useGlobalFetchInterceptor";

/**
 * Main application component that handles the overall app structure
 * @returns {JSX.Element} The main app with routing configuration
 */
const App = () => {
  useGlobalFetchInterceptor();
  return (
    <div data-theme="light">
      <AppRoutes />
    </div>
  );
};

export default App;