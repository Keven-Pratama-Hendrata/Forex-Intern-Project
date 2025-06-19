import React from 'react';
import { render } from '@testing-library/react';

import {
    getButtonClassName,
    getButtonStyle,
    getButtonEventHandlers,
    getButtonCoreProps,
    renderButton,
    handleMouseEnter,
    handleMouseLeave,
    handleMouseDown,
    handleMouseUp,
} from './buttonUtils.jsx';

import {
    BLUE_BUTTON,
    BLUE_BUTTON_HOVER,
} from '../../../utils/constants.js';

function hexToRgb(hex) {
    const match = hex.replace('#', '').match(/.{1,2}/g);
    const [r, g, b] = match.map(x => parseInt(x, 16));
    return `rgb(${r}, ${g}, ${b})`;
}

describe('Button Utils', () => {
    describe('getButtonClassName', () => {
        it('returns base and extra classes correctly', () => {
            expect(getButtonClassName('extra')).toContain('extra');
            expect(getButtonClassName('')).toContain('btn w-full');
        });
    });

    describe('getButtonStyle', () => {
        it('returns correct background color style', () => {
            expect(getButtonStyle()).toEqual({ backgroundColor: BLUE_BUTTON });
        });
    });

    describe('getButtonEventHandlers', () => {
        it('returns all expected event handlers', () => {
            const onClick = jest.fn();
            const handlers = getButtonEventHandlers(onClick);

            expect(typeof handlers.onMouseEnter).toBe('function');
            expect(typeof handlers.onMouseLeave).toBe('function');
            expect(typeof handlers.onMouseDown).toBe('function');
            expect(typeof handlers.onMouseUp).toBe('function');
            expect(handlers.onClick).toBe(onClick);
        });
    });

    describe('getButtonCoreProps', () => {
        it('returns merged props correctly', () => {
            const props = getButtonCoreProps({
                children: 'X',
                type: 'submit',
                disabled: true,
                className: 'my-btn',
                'data-testid': 'btn',
            });

            expect(props.type).toBe('submit');
            expect(props.disabled).toBe(true);
            expect(props.className).toContain('my-btn');
            expect(props['data-testid']).toBe('btn');
            expect(props.children).toBe('X');
        });
    });

    describe('renderButton', () => {
        it('renders a button with children', () => {
            const { getByText } = render(renderButton({ children: 'Test' }));
            expect(getByText('Test')).toBeInTheDocument();
        });
    });

    describe('Mouse Event Handlers', () => {
        let button, event;

        beforeEach(() => {
            button = document.createElement('button');
            event = { currentTarget: button };
        });

        it('handleMouseEnter sets hover color', () => {
            handleMouseEnter(event);
            expect(button.style.backgroundColor).toBe(hexToRgb(BLUE_BUTTON_HOVER));
        });

        it('handleMouseLeave resets color', () => {
            handleMouseLeave(event);
            expect(button.style.backgroundColor).toBe(hexToRgb(BLUE_BUTTON));
        });

        it('handleMouseDown scales down', () => {
            handleMouseDown(event);
            expect(button.style.transform).toBe('scale(0.97)');
        });

        it('handleMouseUp resets scale', () => {
            handleMouseUp(event);
            expect(button.style.transform).toBe('scale(1)');
        });
    });
});
