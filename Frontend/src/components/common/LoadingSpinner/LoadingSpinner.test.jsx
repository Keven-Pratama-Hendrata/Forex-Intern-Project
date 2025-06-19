import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from '@jest/globals';
import LoadingSpinner from './LoadingSpinner';

describe('LoadingSpinner', () => {
  it('matches snapshot for the default variant / size', () => {
    const { container } = render(<LoadingSpinner />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it.each([
    ['default', 'SPAN', 'loading-spinner'],
    ['inline', 'SPAN', 'loading-spinner'],
    ['centered', 'SPAN', 'loading-spinner'],
    ['custom', 'SPAN', 'my-extra'],
  ])('renders %s variant correctly', (variant, tag, expectClass) => {
    const extra = variant === 'custom' ? { className: 'my-extra' } : {};
    render(<LoadingSpinner variant={variant} {...extra} />);
    const node = screen.getByRole('status', { hidden: true });
    expect(node.tagName).toBe(tag);
    expect(node).toHaveClass(expectClass);
  });

  it('falls back to default variant when an invalid value is supplied', () => {
    render(<LoadingSpinner variant="nope" />);
    const node = document.querySelector('.bg-gradient-to-b');
    expect(node).toBeInTheDocument();
  });

  it.each(['xs', 'sm', 'md', 'lg', 'xl'])(
    'applies size "%s" to spinner classes',
    (size) => {
      render(<LoadingSpinner variant="inline" size={size} />);
      const node = document.querySelector(`.loading-${size}`);
      expect(node).toBeInTheDocument();
    },
  );

  it('adds custom classes in "custom" variant', () => {
    render(<LoadingSpinner variant="custom" className="text-red-500" />);
    const node = document.querySelector('.text-red-500');
    expect(node).toBeInTheDocument();
  });
});
