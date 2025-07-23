import PropTypes from 'prop-types';

export const AuthBackgroundProps = {
    children: PropTypes.node.isRequired,
    circlePosition: PropTypes.oneOf(['login', 'signup']).isRequired,
    className: PropTypes.string,
    customStyle: PropTypes.string,
}; 