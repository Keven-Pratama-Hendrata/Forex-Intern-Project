/**
 * Creates an event handler function for form input changes that updates the form state
 * @param {Object} form Current state of the form fields as key-value pairs
 * @param {function} setForm React state setter function for updating form state
 * @returns {function} Event handler function for input change events
 */
export const handleFormChange = (form, setForm) => (e) =>
  setForm({ ...form, [e.target.name]: e.target.value });

/**
 * Validates that specified fields in a form object have non-empty values
 * @param {Object} form The form data object containing field names as keys
 * @param {Array} requiredFields Array of field names to validate
 * @param {Object} errorMessages Object mapping field names to custom error messages
 * @returns {Object} Validation result object
 * @property {boolean} isValid True if all required fields have values
 * @property {string} [message] Error message if validation fails (absent when valid)
 */
export const validateRequiredFields = (form, requiredFields, errorMessages) => {
  for (const field of requiredFields) {
    if (!form[field]) {
      return { isValid: false, message: errorMessages[field] || `${field} is required` };
    }
  }
  return { isValid: true };
};

/**
 * Extracts a user-friendly error message from API error objects
 * @param {Error} error The caught error object from API call
 * @param {string} [defaultMessage='Operation failed'] Default message when no error message exists
 * @returns {string} The error message to display to the user
 */
export const handleApiError = (error, defaultMessage = 'Operation failed') => {
  const message = error?.message || defaultMessage;
  return message;
};

/**
 * Dispatches Redux action to store authenticated user data in state
 * @param {Function} dispatch Redux store's dispatch function
 * @param {Function} loginSuccess Redux action creator that returns LOGIN_SUCCESS action
 * @param {string} token JWT authentication token received from API
 */
export const setUserData = (dispatch, loginSuccess, token) => {
  dispatch(loginSuccess({ token }));
};

/**
 * Dispatches Redux action to clear authenticated user data from state
 * @param {Function} dispatch Redux store's dispatch function
 * @param {Function} logout Redux action creator that returns LOGOUT action
 */
export const clearUserData = (dispatch, logout) => {
  dispatch(logout());
};

/**
 * Renders an input element for a form field.
 * @param {Object} props Input props.
 * @param {string} props.type Input type.
 * @param {string} props.name Input name.
 * @param {string} [props.placeholder] Placeholder text.
 * @param {string|number} [props.value] Input value.
 * @param {function} props.onChange Change handler.
 * @param {string} [props.autoComplete] Autocomplete attribute.
 * @param {boolean} [props.required] Required flag.
 * @returns {JSX.Element} Input element.
 */
export function renderInput({ type, name, placeholder, value, onChange, autoComplete, required }) {
  return (
    <input
      id={name}
      type={type}
      name={name}
      placeholder={placeholder}
      className="input input-bordered w-full rounded-full"
      value={value}
      onChange={onChange}
      autoComplete={autoComplete}
      required={required}
    />
  );
}

/**
 * Renders the wrapper for a form field with label and input.
 * @param {Object} props Wrapper props.
 * @param {string} props.label Label text.
 * @param {JSX.Element} props.input Input element.
 * @param {string} [props.className] Additional class names.
 * @param {string} props.name Input name (for htmlFor).
 * @returns {JSX.Element} Wrapper element.
 */
export function renderFormFieldWrapper({ label, input, className, name }) {
  return (
    <div className={`form-control w-full mb-6 space-y-1 ${className}`}>
      <label className="label" htmlFor={name}>
        <span className="label-text font-medium">{label}</span>
      </label>
      {input}
    </div>
  );
}