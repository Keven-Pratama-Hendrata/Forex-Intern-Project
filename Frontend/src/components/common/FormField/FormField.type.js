import PropTypes from 'prop-types';

export const FormFieldProps = {
    label: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    autoComplete: PropTypes.string,
    required: PropTypes.bool,
    className: PropTypes.string,
    customStyle: PropTypes.string,
};

export const ValidationResult = {
    isValid: PropTypes.bool.isRequired,
    message: PropTypes.string,
}; 