import {
    handleMouseEnter,
    handleMouseLeave,
    handleMouseDown,
    handleMouseUp,
    getButtonClassName,
    getButtonStyle,
    getButtonEventHandlers,
    getButtonCoreProps,
    renderButton
} from './buttonHandler';

const createMockElement = () => {
    const element = {
        style: {},
        currentTarget: {
            style: {}
        }
    };
    return element;
};

describe('Button Utils', () => {
    describe('handleMouseEnter', () => {
        it('sets background color to hover color', () => {
            const element = createMockElement();

            handleMouseEnter(element);

            expect(element.currentTarget.style.backgroundColor).toBe('#426989');
        });
    });

    describe('handleMouseLeave', () => {
        it('resets background color to default', () => {
            const element = createMockElement();

            handleMouseLeave(element);

            expect(element.currentTarget.style.backgroundColor).toBe('#507fa1');
        });
    });

    describe('handleMouseDown', () => {
        it('scales down the element', () => {
            const element = createMockElement();

            handleMouseDown(element);

            expect(element.currentTarget.style.transform).toBe('scale(0.97)');
        });
    });

    describe('handleMouseUp', () => {
        it('resets the scale', () => {
            const element = createMockElement();

            handleMouseUp(element);

            expect(element.currentTarget.style.transform).toBe('scale(1)');
        });
    });

    describe('getButtonClassName', () => {
        const base = 'btn w-full rounded-full border-none text-white font-semibold tracking-wide transition-transform duration-200';
        it('returns base class when no additional class provided', () => {
            const additionalClass = '';

            const result = getButtonClassName(additionalClass);

            expect(result).toBe(base);
        });

        it('combines base class with additional class', () => {
            const additionalClass = 'custom-class';

            const result = getButtonClassName(additionalClass);

            expect(result).toBe(`${base} ${additionalClass}`);
        });
    });

    describe('getButtonStyle', () => {
        it('returns style object with correct background color', () => {
            const result = getButtonStyle();

            expect(result).toEqual({ backgroundColor: '#507fa1' });
        });
    });

    describe('getButtonEventHandlers', () => {
        it('returns object with all event handlers', () => {
            const onClick = jest.fn();

            const result = getButtonEventHandlers(onClick);

            expect(result).toHaveProperty('onMouseEnter');
            expect(result).toHaveProperty('onMouseLeave');
            expect(result).toHaveProperty('onMouseDown');
            expect(result).toHaveProperty('onMouseUp');
            expect(result.onClick).toBe(onClick);
        });

        it('calls onClick when provided', () => {
            const onClick = jest.fn();

            const result = getButtonEventHandlers(onClick);
            result.onClick();

            expect(onClick).toHaveBeenCalledTimes(1);
        });
    });

    describe('getButtonCoreProps', () => {
        it('returns core props with default values', () => {
            const props = {
                children: 'Test Button',
                type: 'button',
                disabled: false,
                className: 'custom-class'
            };

            const result = getButtonCoreProps(props);

            expect(result.type).toBe('button');
            expect(result.disabled).toBe(false);
            expect(result.children).toBe('Test Button');
            expect(result.style).toEqual({ backgroundColor: '#507fa1' });
        });

        it('includes additional props', () => {
            const props = {
                children: 'Test',
                'data-testid': 'test-button',
                customProp: 'value'
            };

            const result = getButtonCoreProps(props);

            expect(result['data-testid']).toBe('test-button');
            expect(result.customProp).toBe('value');
        });
    });

    describe('renderButton', () => {
        it('renders button with provided props', () => {
            const props = {
                children: 'Test Button',
                className: 'test-class',
                onClick: jest.fn()
            };

            const result = renderButton(props);

            expect(result.type).toBe('button');
            expect(result.props.children).toBe('Test Button');
            expect(result.props.className).toBe('test-class');
            expect(result.props.onClick).toBe(props.onClick);
        });
    });
});