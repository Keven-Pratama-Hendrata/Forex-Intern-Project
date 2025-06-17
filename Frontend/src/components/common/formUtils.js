export const handleFormChange = (form, setForm) => (e) =>
  setForm({ ...form, [e.target.name]: e.target.value });

export const validateRequiredFields = (form, requiredFields, errorMessages) => {
  for (const field of requiredFields) {
    if (!form[field]) {
      return { isValid: false, message: errorMessages[field] || `${field} is required` };
    }
  }
  return { isValid: true };
};

export const handleApiError = (error, defaultMessage = 'Operation failed') => {
  const message = error.message || defaultMessage;
  return message;
};

export const setUserData = (dispatch, loginSuccess, token, userData) => {
  dispatch(loginSuccess({ token }));
};

export const clearUserData = (dispatch, logout) => {
  dispatch(logout());
}; 