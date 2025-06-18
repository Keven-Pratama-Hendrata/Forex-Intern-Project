import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from '@jest/globals';
import LoadingSpinner from './LoadingSpinner';

const renderSpinner = (jsx) => {
  const { container } = render(jsx);
  return { container, node: container.firstChild };
};

describe('LoadingSpinner', () => {
  it('matches snapshot for the default variant / size', () => {
    const { container } = renderSpinner(<LoadingSpinner />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it.each([
    ['default',  'DIV',  'bg-gradient-to-b'],
    ['inline',   'SPAN', 'loading-spinner'],
    ['centered', 'DIV',  'justify-center'],
    ['custom',   'SPAN', 'my-extra'],
  ])('renders %s variant correctly', (variant, tag, expectClass) => {
    const extra = variant === 'custom' ? { className: 'my-extra' } : {};
    const { node } = renderSpinner(<LoadingSpinner variant={variant} {...extra} />);
    expect(node.tagName).toBe(tag);
    expect(node).toHaveClass(expectClass);
  });

  it('falls back to default variant when an invalid value is supplied', () => {
    const { node } = renderSpinner(<LoadingSpinner variant="nope" />);
    expect(node).toHaveClass('bg-gradient-to-b');
  });

  it.each(['xs', 'sm', 'md', 'lg', 'xl'])(
    'applies size "%s" to spinner classes',
    (size) => {
      const { node } = renderSpinner(<LoadingSpinner variant="inline" size={size} />);
      expect(node).toHaveClass(`loading-${size}`);
    },
  );

  it('adds custom classes in "custom" variant', () => {
    const { node } = renderSpinner(
      <LoadingSpinner variant="custom" className="text-red-500" />,
    );
    expect(node).toHaveClass('text-red-500');
  });
});
