import React from 'react';
import Background from '../Background';
import { AuthBackgroundProps } from './AuthBackground.type';

/**
 * Authentication background component with circles and wave
 * @param {Object} props Component props
 * @param {React.ReactNode} props.children Child components to render
 * @param {string} [props.circlePosition="login"] Position of circles ("login" or "signup")
 * @returns {JSX.Element} The authentication background with wave
 */
const AuthBackground = ({ children, circlePosition = "login" }) => (
  <Background showCircles circlePosition={circlePosition}>
    <div className="relative z-10 w-full max-w-sm">
      {children}
    </div>
  </Background>
);

AuthBackground.propTypes = AuthBackgroundProps;

export default AuthBackground; 