import React from 'react';
import { render, fireEvent, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import FormField from './FormField';

describe('FormField', () => {
  afterEach(() => cleanup());

  it('renders with label and input', () => {
    const formFieldProps = {
      label: "Username",
      type: "text",
      name: "username",
      placeholder: "Enter username",
      onChange: () => { }
    };

    render(<FormField {...formFieldProps} />);

    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter username')).toBeInTheDocument();
  });

  it('calls onChange when input changes', () => {
    const handleChange = jest.fn();
    const formFieldProps = {
      label: "Email",
      type: "email",
      name: "email",
      placeholder: "Enter email",
      onChange: handleChange
    };

    render(<FormField {...formFieldProps} />);
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'abc' } });

    expect(handleChange).toHaveBeenCalled();
  });

  it('applies custom className to wrapper', () => {
    const customClassName = 'custom-form-field';
    const formFieldProps = {
      label: "Custom",
      type: "text",
      name: "custom",
      placeholder: "Custom placeholder",
      className: customClassName,
      onChange: () => { }
    };

    const { container } = render(<FormField {...formFieldProps} />);

    expect(container.firstChild).toHaveClass('custom-form-field');
  });

  it('uses type="text" by default when type prop is not provided', () => {
    // Arrange
    const formFieldProps = {
      label: "Username",
      name: "username",
      placeholder: "Enter username",
      onChange: () => { },
    };

    // Act
    render(<FormField {...formFieldProps} />);
    const input = screen.getByLabelText('Username');

    // Assert
    expect(input).toHaveAttribute('type', 'text');
  });

  it('matches snapshot', () => {
    const formFieldProps = {
      label: "Password",
      type: "password",
      name: "password",
      placeholder: "Enter password",
      value: "",
      onChange: () => { },
      autoComplete: "current-password",
      required: true,
      className: "test-snapshot"
    };

    const { asFragment } = render(<FormField {...formFieldProps} />);

    expect(asFragment()).toMatchSnapshot();
  });
});
