import { render } from '@testing-library/react';
import { describe, it, expect } from '@jest/globals';
import LoadingSpinner from './LoadingSpinner';

describe('LoadingSpinner Component', () => {
  it('renders correctly with default props', () => {
    const { container } = render(<LoadingSpinner />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders correctly with default variant', () => {
    const { container } = render(<LoadingSpinner variant="default" />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders correctly with inline variant', () => {
    const { container } = render(<LoadingSpinner variant="inline" />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders correctly with centered variant', () => {
    const { container } = render(<LoadingSpinner variant="centered" />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders correctly with custom variant', () => {
    const { container } = render(
      <LoadingSpinner variant="custom" className="custom-spinner" />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders correctly with different sizes', () => {
    const { container } = render(<LoadingSpinner size="xs" />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders correctly with medium size', () => {
    const { container } = render(<LoadingSpinner size="md" />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders correctly with large size', () => {
    const { container } = render(<LoadingSpinner size="lg" />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders correctly with custom variant and size', () => {
    const { container } = render(
      <LoadingSpinner variant="custom" size="sm" className="my-custom-class" />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders correctly with inline variant and custom size', () => {
    const { container } = render(
      <LoadingSpinner variant="inline" size="xl" />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders correctly with centered variant and medium size', () => {
    const { container } = render(
      <LoadingSpinner variant="centered" size="md" />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders correctly with invalid variant (should fallback to default)', () => {
    const { container } = render(<LoadingSpinner variant="invalid" />);
    expect(container.firstChild).toMatchSnapshot();
  });
}); 