import PropTypes from 'prop-types';

export const FormFieldProps = {
    label: PropTypes.string.isRequired,
    type: PropTypes.string,
    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func.isRequired,
    autoComplete: PropTypes.string,
    required: PropTypes.bool,
    className: PropTypes.string,
};

export const ValidationResult = {
    isValid: PropTypes.bool.isRequired,
    message: PropTypes.string,
}; 