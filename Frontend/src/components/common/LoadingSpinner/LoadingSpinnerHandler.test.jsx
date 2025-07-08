import { render } from '@testing-library/react';
import {
    renderDefaultSpinner,
    renderInlineSpinner,
    renderCenteredSpinner,
    renderCustomSpinner,
    renderSpinnerVariant,
} from './LoadingSpinnerHandler.jsx';

describe('LoadingSpinnerUtil', () => {
    describe('renderDefaultSpinner', () => {
        it('renders a fullscreen spinner with correct size and style', () => {
            const size = 'lg';

            const { container } = render(renderDefaultSpinner(size));
            const div = container.querySelector('div');
            const span = div.querySelector('span');

            expect(div).toHaveClass('bg-gradient-to-b');
            expect(span).toHaveClass('loading-lg');
        });
    });

    describe('renderInlineSpinner', () => {
        it('renders an inline spinner with correct size and class', () => {
            const size = 'md';

            const { container } = render(renderInlineSpinner(size));
            const span = container.querySelector('span');

            expect(span).toHaveClass('loading-md');
            expect(span).toHaveClass('loading-spinner');
        });
    });

    describe('renderCenteredSpinner', () => {
        it('renders a centered spinner with correct size and layout', () => {
            const size = 'sm';

            const { container } = render(renderCenteredSpinner(size));
            const div = container.querySelector('div');
            const span = div.querySelector('span');

            expect(div).toHaveClass('items-center');
            expect(span).toHaveClass('loading-sm');
        });
    });

    describe('renderCustomSpinner', () => {
        it('renders a custom spinner with correct size and additional class', () => {
            const size = 'xl';
            const customClass = 'my-custom';

            const { container } = render(renderCustomSpinner(size, customClass));
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