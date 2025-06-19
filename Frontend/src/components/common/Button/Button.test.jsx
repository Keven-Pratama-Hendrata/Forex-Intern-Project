import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, jest } from '@jest/globals';

import Button from './Button';
import { BLUE_BUTTON, BLUE_BUTTON_HOVER } from '../../../utils/constants';

describe('Button', () => {
  it('renders with children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('applies custom className and type', () => {
    render(
      <Button type="submit" className="my-class" data-testid="custom-btn">X</Button>
    );
    const btn = screen.getByTestId('custom-btn');
    expect(btn).toHaveAttribute('type', 'submit');
    expect(btn).toHaveClass('my-class');
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('fires onClick when enabled', () => {
    const handler = jest.fn();
    render(<Button onClick={handler}>OK</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('does not fire onClick when disabled', () => {
    const handler = jest.fn();
    render(<Button onClick={handler} disabled>NO</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handler).not.toHaveBeenCalled();
  });

  it('applies interactive styles on hover and press', () => {
    render(<Button>Test</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toHaveStyle(`background-color: ${BLUE_BUTTON}`);
    fireEvent.mouseEnter(btn);
    expect(btn).toHaveStyle(`background-color: ${BLUE_BUTTON_HOVER}`);
    fireEvent.mouseDown(btn);
    expect(btn).toHaveStyle('transform: scale(0.97)');
    fireEvent.mouseUp(btn);
    expect(btn).toHaveStyle('transform: scale(1)');
    fireEvent.mouseLeave(btn);
    expect(btn).toHaveStyle(`background-color: ${BLUE_BUTTON}`);
  });

  it('matches snapshot', () => {
    const { asFragment } = render(
      <Button type="button" className="snapshot-btn" disabled={false} onClick={() => { }}>
        Snapshot
      </Button>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});