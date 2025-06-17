import React from 'react';
import { BLUE_BUTTON, BLUE_BUTTON_HOVER } from '../../../utils/constants';

const Button = ({ 
  children, 
  type = 'button',
  disabled = false,
  className = '',
  onClick,
  ...props 
}) => {
  const buttonStyle = {
    backgroundColor: BLUE_BUTTON,
    onMouseEnter: (e) => (e.currentTarget.style.backgroundColor = BLUE_BUTTON_HOVER),
    onMouseLeave: (e) => (e.currentTarget.style.backgroundColor = BLUE_BUTTON),
    onMouseDown: (e) => (e.currentTarget.style.transform = 'scale(0.97)'),
    onMouseUp: (e) => (e.currentTarget.style.transform = 'scale(1)')
  };

  return (
    <button
      type={type}
      disabled={disabled}
      className={`btn w-full rounded-full border-none text-white font-semibold tracking-wide transition-transform duration-200 ${className}`}
      style={{ backgroundColor: buttonStyle.backgroundColor }}
      onMouseEnter={buttonStyle.onMouseEnter}
      onMouseLeave={buttonStyle.onMouseLeave}
      onMouseDown={buttonStyle.onMouseDown}
      onMouseUp={buttonStyle.onMouseUp}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button; 