import React from 'react';
import { renderInput, renderFormFieldWrapper } from './formfieldUtils.jsx';

/**
 * Styled input field with label for use in forms.
 * Renders a label and a rounded input with full width and optional autocomplete and required attributes.
 *
 * @param {Object} props Props for FormField.
 * @param {string} props.label The label text displayed above the input.
 * @param {string} props.type The input type (e.g., 'text', 'password').
 * @param {string} props.name The input name attribute (used for form data and accessibility).
 * @param {string} [props.placeholder] Placeholder text for the input.
 * @param {string|number} [props.value] The current value of the input.
 * @param {function} props.onChange Callback fired when the input value changes (receives event).
 * @param {string} [props.autoComplete] Autocomplete attribute for browser autofill (e.g., 'username', 'off').
 * @param {boolean} [props.required=false] Whether the input is required for form submission.
 * @param {string} [props.className] Additional class names for the outer div.
 * @returns {JSX.Element} A labeled, styled input field for use in forms.
 */
function FormField({
  label,
  type,
  name,
  placeholder,
  value,
  onChange,
  autoComplete,
  required = false,
  className = '',
}) {
  const input = renderInput({ type, name, placeholder, value, onChange, autoComplete, required });
  return renderFormFieldWrapper({ label, input, className, name });
}

export default FormField; 