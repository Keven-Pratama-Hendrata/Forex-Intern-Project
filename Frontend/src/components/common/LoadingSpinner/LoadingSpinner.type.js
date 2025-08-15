import PropTypes from 'prop-types';

export const LoadingSpinnerProps = {
    variant: PropTypes.oneOf(['default', 'inline']),
    size: PropTypes.oneOf(['sm', 'md', 'lg']),
    className: PropTypes.string,
    customStyle: PropTypes.string,
}; 