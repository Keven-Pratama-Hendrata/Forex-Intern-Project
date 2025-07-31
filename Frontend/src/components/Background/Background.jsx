import React from 'react';
import { renderWaveBackground, renderCircles, getCircleConfigs, getConfig } from './Auth/authBackgroundHandler';
import PropTypes from 'prop-types';

/**
 * Generalized background component with wave and optional circles
 * @param {Object} props Props object containing children and optional configuration for the background.
 * @param {React.ReactNode} props.children Child components to render
 * @param {boolean} [props.showCircles=false] Whether to show circles
 * @param {string} [props.circlePosition='login'] Circle config position
 * @returns {JSX.Element} The background with wave and optional circles
 */
const Background = ({ children, showCircles = false, circlePosition = "login" }) => {
    const circleConfigs = getCircleConfigs();
    const config = getConfig(circlePosition, circleConfigs);

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
            {renderWaveBackground()}
            {showCircles && renderCircles(config)}
            <div className="absolute inset-0 flex items-center justify-center z-10">
                {children}
            </div>
        </div>
    );
};

Background.propTypes = {
    children: PropTypes.node,
    showCircles: PropTypes.bool,
    circlePosition: PropTypes.string,
};

export default Background; 