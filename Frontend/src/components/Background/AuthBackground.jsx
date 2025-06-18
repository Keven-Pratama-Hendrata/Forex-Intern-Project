import React from 'react';
import {
  getCircleConfigs,
  getConfig,
  renderBackgroundGradient,
  renderCircles
} from './authBackgroundUtils.jsx';

const AuthBackground = ({ children, circlePosition = "login" }) => {
  const circleConfigs = getCircleConfigs();
  const config = getConfig(circlePosition, circleConfigs);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {renderBackgroundGradient()}
      {renderCircles(config)}
      <div className="relative z-10 w-full max-w-sm">
        {children}
      </div>
    </div>
  );
};

export default AuthBackground; 