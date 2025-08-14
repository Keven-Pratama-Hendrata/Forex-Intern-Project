import PropTypes from 'prop-types';

export const LoadingSpinnerProps = {
    variant: PropTypes.oneOf(['default', 'inline']),
    size: PropTypes.oneOf(['small', 'medium', 'large']),
    className: PropTypes.string,
    customStyle: PropTypes.string,
}; 