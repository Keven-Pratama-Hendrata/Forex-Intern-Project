import PropTypes from 'prop-types';

export const SignupFormState = {
    username: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    confirmPassword: PropTypes.string.isRequired,
};

export const SignupProps = {
    form: PropTypes.shape(SignupFormState).isRequired,
    setForm: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    setLoading: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
};

export const SignupContentProps = SignupProps;

export const SignupFormProps = {
    form: PropTypes.shape(SignupFormState).isRequired,
    setForm: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
};

export const SignupFieldsProps = {
    form: PropTypes.shape(SignupFormState).isRequired,
    setForm: PropTypes.func.isRequired,
};

export const FieldProps = {
    form: PropTypes.shape(SignupFormState).isRequired,
    setForm: PropTypes.func.isRequired,
};

export const SubmitButtonProps = {
    loading: PropTypes.bool.isRequired,
};

export const FormInputProps = {
    label: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
};
