import PropTypes from 'prop-types';

export const LoginFormState = {
    user_name: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
};

export const LoginProps = {
    form: PropTypes.shape(LoginFormState).isRequired,
    setForm: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    setLoading: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
};

export const LoginContentProps = {
    form: PropTypes.shape(LoginFormState).isRequired,
    setForm: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    setLoading: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
};

export const LoginFormProps = {
    form: PropTypes.shape(LoginFormState).isRequired,
    setForm: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    setLoading: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
};

export const LoginFieldsProps = {
    form: PropTypes.shape(LoginFormState).isRequired,
    setForm: PropTypes.func.isRequired,
};

export const FieldProps = {
    form: PropTypes.shape(LoginFormState).isRequired,
    setForm: PropTypes.func.isRequired,
};

export const SubmitButtonProps = {
    loading: PropTypes.bool.isRequired,
}; 