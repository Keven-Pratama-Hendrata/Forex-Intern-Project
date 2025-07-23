import React from 'react';
import AppRoutes from '../Routes/routes';

/**
 * Main application component that handles the overall app structure
 * @returns {JSX.Element} The main app with routing configuration
 */
const App = () => {
  return (
    <div data-theme="light">
      <AppRoutes />
    </div>
  );
};

export default App;