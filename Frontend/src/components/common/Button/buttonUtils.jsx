import { UI_CONSTANTS, UI_CLASSES } from '../../../data';

/**
 * Sets the button background color to the hover color on mouse enter.
 * @param {React.MouseEvent} e Mouse event.
 * @returns {void}
 */
export const handleMouseEnter = (e) => (e.currentTarget.style.backgroundColor = UI_CONSTANTS.BUTTON_COLORS.BLUE_HOVER);

/**
 * Resets the button background color on mouse leave.
 * @param {React.MouseEvent} e Mouse event.
 * @returns {void}
 */
export const handleMouseLeave = (e) => (e.currentTarget.style.backgroundColor = UI_CONSTANTS.BUTTON_COLORS.BLUE);

/**
 * Scales the button down on mouse down.
 * @param {React.MouseEvent} e Mouse event.
 * @returns {void}
 */
export const handleMouseDown = (e) => (e.currentTarget.style.transform = 'scale(0.97)');

/**
 * Resets the button scale on mouse up.
 * @param {React.MouseEvent} e Mouse event.
 * @returns {void}
 */
export const handleMouseUp = (e) => (e.currentTarget.style.transform = 'scale(1)');

/**
 * Returns the full className string for the button.
 * @param {string} additionalClass Additional class names.
 * @returns {string} The full className string.
 */
export function getButtonClassName(additionalClass) {
    return [UI_CLASSES.BUTTON.BASE, additionalClass].filter(Boolean).join(' ');
}

/**
 * Returns the style object for the button.
 * @returns {Object} The style object.
 */
export function getButtonStyle() {
    return { backgroundColor: UI_CONSTANTS.BUTTON_COLORS.BLUE };
}

/**
 * Returns event handlers for button interactions.
 * @param {function} onClick Click handler.
 * @returns {Object} Event handlers for the button.
 */
export function getButtonEventHandlers(onClick) {
    return {
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
        onMouseDown: handleMouseDown,
        onMouseUp: handleMouseUp,
        onClick,
    };
}

/**
 * Returns the core props for the button element.
 * @param {Object} props Button props.
 * @param {React.ReactNode} props.children Button content.
 * @param {string} [props.type] Button type.
 * @param {boolean} [props.disabled] Disabled state.
 * @param {string} [props.className] Additional class names.
 * @returns {Object} The core props for the button.
 */
export function getButtonCoreProps({ children, type, disabled, className, ...props }) {
    return {
        type,
        disabled,
        className: getButtonClassName(className),
        style: getButtonStyle(),
        ...props,
        children,
    };
}

/**
 * Renders the button element with the given props.
 * @param {Object} props Button props.
 * @returns {JSX.Element} The button element.
 */
export function renderButton(props) {
    return (
        <button {...props}>{props.children}</button>
    );
} 