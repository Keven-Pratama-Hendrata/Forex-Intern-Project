import React from 'react';
import PropTypes from 'prop-types';
import {
  getButtonEventHandlers,
  getButtonCoreProps,
  renderButton
} from './buttonUtils.jsx';
import { ButtonProps } from './Button.type';
import { UI_CONSTANTS } from '../../../data';

/**
 * Styled button component with interactive hover and press effects.
 * Renders a full-width, rounded button with custom color and transition effects.
 *
 * @param {Object} props Button properties.
 * @param {React.ReactNode} props.children Content to display inside the button (text or elements).
 * @param {string} [props.type='button'] The button type attribute (e.g., 'button', 'submit', 'reset').
 * @param {boolean} [props.disabled=false] If true, disables the button and prevents interaction.
 * @param {string} [props.className] Additional class names for custom styling.
 * @param {function} [props.onClick] Function to call when the button is clicked.
 * @returns {JSX.Element} A styled, interactive button for use in forms and UI.
 */
function Button({
  children,
  type = 'button',
  disabled = false,
  className = '',
  onClick,
  ...props
}) {
  const coreProps = getButtonCoreProps({ children, type, disabled, className, ...props });
  const eventHandlers = getButtonEventHandlers(onClick);
  return renderButton({ ...coreProps, ...eventHandlers });
}

Button.propTypes = ButtonProps;

export default Button; 