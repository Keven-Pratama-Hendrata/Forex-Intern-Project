import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import Button from './Button';
import { UI_CONSTANTS } from '../../../data';

describe('Button Component', () => {
  const defaultProps = {
    children: 'Test Button',
    onClick: jest.fn(),
  };

  afterEach(() => cleanup());

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders button with correct text', () => {
    render(<Button {...defaultProps} />);
    expect(screen.getByText('Test Button')).toBeInTheDocument();
  });

  it('renders button with default type', () => {
    render(<Button {...defaultProps} />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'button');
  });

  it('renders button with custom type', () => {
    render(<Button {...defaultProps} type="submit" />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('calls onClick when clicked', () => {
    render(<Button {...defaultProps} />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button {...defaultProps} disabled />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('applies custom className', () => {
    const customClass = 'custom-class';
    render(<Button {...defaultProps} className={customClass} />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass(customClass);
  });

  it('renders with default styling', () => {
    render(<Button {...defaultProps} />);
    const btn = screen.getByRole('button');
    expect(btn).toHaveStyle(`background-color: ${UI_CONSTANTS.BUTTON_COLORS.BLUE}`);
  });

  it('applies hover effects on mouse events', () => {
    render(<Button {...defaultProps} />);
    const btn = screen.getByRole('button');

    fireEvent.mouseEnter(btn);
    expect(btn).toHaveStyle(`background-color: ${UI_CONSTANTS.BUTTON_COLORS.BLUE_HOVER}`);

    fireEvent.mouseLeave(btn);
    expect(btn).toHaveStyle(`background-color: ${UI_CONSTANTS.BUTTON_COLORS.BLUE}`);
  });

  it('applies press effects on mouse down/up', () => {
    render(<Button {...defaultProps} />);
    const btn = screen.getByRole('button');

    fireEvent.mouseDown(btn);
    expect(btn).toHaveStyle('transform: scale(0.97)');

    fireEvent.mouseUp(btn);
    expect(btn).toHaveStyle('transform: scale(1)');
  });

  it('renders children correctly', () => {
    const customContent = <span data-testid="custom-content">Custom Content</span>;
    render(<Button {...defaultProps}>{customContent}</Button>);
    expect(screen.getByTestId('custom-content')).toBeInTheDocument();
  });
});