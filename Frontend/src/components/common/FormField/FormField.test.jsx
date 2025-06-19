import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { describe, it, expect, jest } from '@jest/globals';
import FormField from './FormField';

describe('FormField', () => {
  it('renders with label and input', () => {
    render(<FormField label="Username" type="text" name="username" placeholder="Enter username" />);
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter username')).toBeInTheDocument();
  });

  it('calls onChange when input changes', () => {
    const handleChange = jest.fn();
    render(<FormField label="Email" type="email" name="email" placeholder="Enter email" onChange={handleChange} />);
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'abc' } });
    expect(handleChange).toHaveBeenCalled();
  });

  it('applies custom className to wrapper', () => {
    const { container } = render(
      <FormField label="Custom" type="text" name="custom" placeholder="Custom placeholder" className="custom-form-field" />
    );
    expect(container.firstChild).toHaveClass('custom-form-field');
  });

  it('matches snapshot', () => {
    const { asFragment } = render(
      <FormField
        label="Password"
        type="password"
        name="password"
        placeholder="Enter password"
        value=""
        onChange={() => { }}
        autoComplete="current-password"
        required
        className="test-snapshot"
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
