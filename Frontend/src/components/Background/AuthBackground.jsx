import React from 'react';
import {
  getCircleConfigs,
  getConfig,
  renderWaveBackground,
  renderCircles
} from './authBackgroundUtils.jsx';

/**
 * Authentication background component with circles and wave
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render
 * @param {string} [props.circlePosition="login"] - Position of circles ("login" or "signup")
 * @returns {JSX.Element} The authentication background with wave
 */
const AuthBackground = ({ children, circlePosition = "login" }) => {
  const circleConfigs = getCircleConfigs();
  const config = getConfig(circlePosition, circleConfigs);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {renderWaveBackground()}
      {renderCircles(config)}
      <div className="relative z-10 w-full max-w-sm">
        {children}
      </div>
    </div>
  );
};

export default AuthBackground; 