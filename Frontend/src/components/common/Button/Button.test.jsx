import { render } from '@testing-library/react';
import { describe, it, expect } from '@jest/globals';
import Button from './Button';

describe('Button Component', () => {
  it('renders correctly with default props', () => {
    const { container } = render(<Button>Click me</Button>);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders correctly when disabled', () => {
    const { container } = render(<Button disabled>Disabled Button</Button>);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders correctly with custom className', () => {
    const { container } = render(<Button className="custom-class">Custom Button</Button>);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders correctly with submit type', () => {
    const { container } = render(<Button type="submit">Submit Button</Button>);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders correctly with additional props', () => {
    const { container } = render(
      <Button data-testid="custom-button" aria-label="Custom label">
        Props Button
      </Button>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders correctly with empty children', () => {
    const { container } = render(<Button></Button>);
    expect(container.firstChild).toMatchSnapshot();
  });
}); 