import React from 'react';
import { renderSpinnerVariant } from './LoadingSpinnerUtil.jsx';

/**
 * Loading spinner component for indicating loading states.
 * Supports multiple variants: default (fullscreen), inline, centered, and custom.
 *
 * @param {Object} props Spinner properties.
 * @param {string} [props.variant='default'] Spinner variant ('default', 'inline', 'centered', 'custom' from tailwind).
 * @param {string} [props.size='lg'] Spinner size (e.g., 'sm', 'md', 'lg', 'xl' from tailwind).
 * @param {string} [props.className] Additional class names for custom styling.
 * @returns {JSX.Element} The loading spinner element.
 */
function LoadingSpinner({
  variant = 'default',
  size = 'lg',
  className = ''
}) {
  return renderSpinnerVariant(variant, size, className);
}

export default LoadingSpinner; 