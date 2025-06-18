import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, jest } from '@jest/globals';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../store/slices/authSlice';
import Login from './Login';
import React from 'react';

jest.mock('../../components/Background/AuthBackground.jsx', () => {
  return function MockAuthBackground({ children, circlePosition }) {
    return (
      <div data-testid="auth-background" data-circle-position={circlePosition}>
        {children}
      </div>
    );
  };
});

jest.mock('../../components/common', () => ({
  Button: ({ children, type, disabled, ...props }) => (
    <button
      type={type}
      disabled={disabled}
      data-testid="login-button"
      {...props}
    >
      {children}
    </button>
  ),
  LoadingSpinner: ({ variant }) => (
    <div data-testid="loading-spinner" data-variant={variant}>
      Loading...
    </div>
  ),
  FormField: ({
    label,
    type,
    name,
    placeholder,
    value,
    onChange,
    autoComplete,
    required,
    ...props
  }) => (
    <div data-testid={`form-field-${name}`}>
      <label>{label}</label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange || (() => {})}
        autoComplete={autoComplete}
        required={required}
        data-testid={`input-${name}`}
        {...props}
      />
    </div>
  ),
  handleFormChange: jest.fn(),
  validateRequiredFields: jest.fn(),
  setUserData: jest.fn(),
}));

jest.mock('./loginUtils.jsx', () => {
  const handleChange = jest.fn(() => () => {});
  const handleSubmit = jest.fn(
    (_form, setLoading) =>
      (e) => {
        e?.preventDefault?.();
        setLoading(true);
      },
  );

  const FormField = ({
    label,
    type,
    name,
    placeholder,
    value,
    onChange,
    autoComplete,
    required,
    ...props
  }) => (
    <div data-testid={`form-field-${name}`}>
      <label>{label}</label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange || (() => {})}
        autoComplete={autoComplete}
        required={required}
        data-testid={`input-${name}`}
        {...props}
      />
    </div>
  );

  return { handleChange, handleSubmit, FormField };
});

jest.mock('react-router', () => ({
  useNavigate: () => jest.fn(),
  Link: ({ children, to, ...props }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}));

jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

const createMockStore = () =>
  configureStore({
    reducer: { auth: authReducer },
  });

const renderWithProvider = (ui) =>
  render(<Provider store={createMockStore()}>{ui}</Provider>);

describe('Login Component', () => {
  it('renders correctly with default state', () => {
    const { container } = renderWithProvider(<Login />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('toggles to loading state after form submit (covers line 55)', async () => {
    const { container } = renderWithProvider(<Login />);

    const button = screen.getByTestId('login-button');
    expect(button).toHaveTextContent('Log in');
    expect(button).not.toBeDisabled();

    fireEvent.submit(button.closest('form'));

    await waitFor(() =>
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument(),
    );

    expect(button).toBeDisabled();
    expect(button).toHaveTextContent('Loading...');

    expect(container.firstChild).toMatchSnapshot();
  });
});
