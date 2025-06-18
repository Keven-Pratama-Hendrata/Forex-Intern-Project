import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect, jest } from '@jest/globals';
import FormField from './FormField';

const renderInput = (node) => {
  const { container } = render(node);
  return container.querySelector('input');
};

describe('FormField', () => {
  it('matches snapshot for default props', () => {
    const { container } = render(
      <FormField
        label="Username"
        type="text"
        name="username"
        placeholder="Enter username"
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('binds value and calls onChange', () => {
    const handleChange = jest.fn();
    const input = renderInput(
      <FormField
        label="Email"
        type="email"
        name="email"
        placeholder="Enter email"
        value="test@example.com"
        onChange={handleChange}
      />,
    );

    expect(input).toHaveValue('test@example.com');
    fireEvent.change(input, { target: { value: 'new@example.com' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('sets required, autocomplete and correct type', () => {
    const input = renderInput(
      <FormField
        label="Phone"
        type="tel"
        name="phone"
        placeholder="Enter phone"
        autoComplete="tel"
        required
      />,
    );

    expect(input).toBeRequired();
    expect(input).toHaveAttribute('type', 'tel');
    expect(input).toHaveAttribute('autocomplete', 'tel');
  });

  it('supports arbitrary input types and empty values', () => {
    const numberInput = renderInput(
      <FormField
        label="Age"
        type="number"
        name="age"
        placeholder="Enter age"
      />,
    );
    expect(numberInput).toHaveAttribute('type', 'number');

    const emptyInput = renderInput(
      <FormField
        label="Empty"
        type="text"
        name="empty"
        placeholder=""
        value=""
        onChange={() => {}}
      />,
    );
    expect(emptyInput).toHaveValue('');
    expect(emptyInput).toHaveAttribute('placeholder', '');
  });

  it('adds custom wrapper class', () => {
    const { container } = render(
      <FormField
        label="Custom"
        type="text"
        name="custom"
        placeholder="Custom placeholder"
        className="custom-form-field"
      />,
    );
    expect(container.firstChild).toHaveClass('custom-form-field');
  });
});
