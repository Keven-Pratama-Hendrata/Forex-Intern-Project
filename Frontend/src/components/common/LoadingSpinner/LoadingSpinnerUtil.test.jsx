import React from 'react';
import { render } from '@testing-library/react';
import {
    renderDefaultSpinner,
    renderInlineSpinner,
    renderCenteredSpinner,
    renderCustomSpinner,
    renderSpinnerVariant,
} from './LoadingSpinnerUtil.jsx';

describe('LoadingSpinnerUtil', () => {
    describe('renderDefaultSpinner', () => {
        it('renders a fullscreen spinner with correct size and style', () => {
            const { container } = render(renderDefaultSpinner('lg'));
            const div = container.querySelector('div');
            const span = div.querySelector('span');

            expect(div).toHaveClass('bg-gradient-to-b');
            expect(span).toHaveClass('loading-lg');
        });
    });

    describe('renderInlineSpinner', () => {
        it('renders an inline spinner with correct size and class', () => {
            const { container } = render(renderInlineSpinner('md'));
            const span = container.querySelector('span');

            expect(span).toHaveClass('loading-md');
            expect(span).toHaveClass('loading-spinner');
        });
    });

    describe('renderCenteredSpinner', () => {
        it('renders a centered spinner with correct size and layout', () => {
            const { container } = render(renderCenteredSpinner('sm'));
            const div = container.querySelector('div');
            const span = div.querySelector('span');

            expect(div).toHaveClass('items-center');
            expect(span).toHaveClass('loading-sm');
        });
    });

    describe('renderCustomSpinner', () => {
        it('renders a custom spinner with correct size and additional class', () => {
            const { container } = render(renderCustomSpinner('xl', 'my-custom'));
            const span = container.querySelector('span');

            expect(span).toHaveClass('loading-xl');
            expect(span).toHaveClass('my-custom');
        });
    });

    describe('renderSpinnerVariant', () => {
        it('renders correct spinner based on variant type', () => {
            const renderAndAssert = (variant, size, expectedClass, extraClass) => {
                const { container } = render(renderSpinnerVariant(variant, size, extraClass));
                const element = container.querySelector('div') || container.querySelector('span');
                expect(element).toHaveClass(expectedClass);
                if (extraClass) expect(element).toHaveClass(extraClass);
            };

            renderAndAssert('default', 'lg', 'bg-gradient-to-b');
            renderAndAssert('inline', 'md', 'loading-md');
            renderAndAssert('centered', 'sm', 'items-center');
            renderAndAssert('custom', 'xl', 'loading-xl', 'my-custom');
            renderAndAssert('unknown', 'lg', 'bg-gradient-to-b');
        });
    });
});