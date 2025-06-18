import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, jest } from '@jest/globals';

import Button from './Button';
import { BLUE_BUTTON, BLUE_BUTTON_HOVER } from '../../../utils/constants';

describe('Button snapshots', () => {
  it('renders with default props', () => {
    const { container } = render(<Button>Click me</Button>);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders disabled variant', () => {
    const { container } = render(<Button disabled>Disabled</Button>);
    expect(container.firstChild).toMatchSnapshot();
  });
});

describe('Button interactive behaviour', () => {
  const renderBtn = (ui = <Button>Test</Button>) =>
    render(ui).getByRole('button');

  it('applies custom className, type, and extra props', () => {
    render(
      <Button
        type="submit"
        className="my-class"
        data-testid="custom-btn"
        aria-label="label"
      >
        X
      </Button>,
    );

    const btn = screen.getByTestId('custom-btn');
    expect(btn).toHaveAttribute('type', 'submit');
    expect(btn).toHaveClass('my-class');
    expect(btn).toHaveAttribute('aria-label', 'label');
  });

  it('hover, press, release, leave – colour & scale transitions', () => {
    const btn = renderBtn();

    expect(btn).toHaveStyle(`background-color: ${BLUE_BUTTON}`);

    fireEvent.mouseEnter(btn);
    expect(btn).toHaveStyle(`background-color: ${BLUE_BUTTON_HOVER}`);

    fireEvent.mouseDown(btn);
    expect(btn).toHaveStyle(`transform: scale(0.97)`);

    fireEvent.mouseUp(btn);
    expect(btn).toHaveStyle(`transform: scale(1)`);

    fireEvent.mouseLeave(btn);
    expect(btn).toHaveStyle(`background-color: ${BLUE_BUTTON}`);
  });

  it('fires onClick when enabled and not when disabled', () => {
    const handler = jest.fn();
  
    const { getByRole, unmount } = render(
      <Button onClick={handler}>OK</Button>,
    );
  
    fireEvent.click(getByRole('button'));
    expect(handler).toHaveBeenCalledTimes(1);
  
    unmount();
    handler.mockClear();

    const {
      getByRole: getByRoleDisabled,
    } = render(
      <Button onClick={handler} disabled>
        NO
      </Button>,
    );
  
    fireEvent.click(getByRoleDisabled('button'));
    expect(handler).not.toHaveBeenCalled();
  });

  it('scales only while pressed', () => {
    const btn = renderBtn(<Button>Press</Button>);
    fireEvent.mouseDown(btn);
    expect(btn).toHaveStyle('transform: scale(0.97)');
    fireEvent.mouseUp(btn);
    expect(btn).toHaveStyle('transform: scale(1)');
  });
});