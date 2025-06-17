import { render } from '@testing-library/react';
import { describe, it, expect } from '@jest/globals';
import FormField from './FormField';

describe('FormField Component', () => {
  it('renders correctly with default props', () => {
    const { container } = render(
      <FormField 
        label="Username" 
        type="text" 
        name="username" 
        placeholder="Enter username"
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders correctly with value and onChange', () => {
    const { container } = render(
      <FormField 
        label="Email" 
        type="email" 
        name="email" 
        placeholder="Enter email"
        value="test@example.com"
        onChange={() => {}}
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders correctly when required', () => {
    const { container } = render(
      <FormField 
        label="Password" 
        type="password" 
        name="password" 
        placeholder="Enter password"
        required={true}
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders correctly with custom className', () => {
    const { container } = render(
      <FormField 
        label="Custom Field" 
        type="text" 
        name="custom" 
        placeholder="Custom placeholder"
        className="custom-form-field"
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders correctly with autoComplete', () => {
    const { container } = render(
      <FormField 
        label="Full Name" 
        type="text" 
        name="fullName" 
        placeholder="Enter full name"
        autoComplete="name"
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders correctly with all props', () => {
    const { container } = render(
      <FormField 
        label="Complete Field" 
        type="tel" 
        name="phone" 
        placeholder="Enter phone number"
        value="123-456-7890"
        onChange={() => {}}
        autoComplete="tel"
        required={true}
        className="complete-field"
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders correctly with different input types', () => {
    const { container } = render(
      <FormField 
        label="Number Field" 
        type="number" 
        name="age" 
        placeholder="Enter age"
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders correctly with empty values', () => {
    const { container } = render(
      <FormField 
        label="Empty Field" 
        type="text" 
        name="empty" 
        placeholder=""
        value=""
        onChange={() => {}}
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
}); 