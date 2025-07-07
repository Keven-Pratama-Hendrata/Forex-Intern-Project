/**
 * Renders the default fullscreen spinner.
 * @param {string} size Spinner size.
 * @returns {JSX.Element} Spinner element.
 */
export function renderDefaultSpinner(size) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#6ca0c1] to-[#507fa1]">
            <span role="status" className={`loading loading-spinner loading-${size}`}></span>
        </div>
    );
}

/**
 * Renders an inline spinner.
 * @param {string} size Spinner size.
 * @returns {JSX.Element} Spinner element.
 */
export function renderInlineSpinner(size) {
    return <span role="status" className={`loading loading-spinner loading-${size}`} />;
}

/**
 * Renders a centered spinner.
 * @param {string} size Spinner size.
 * @returns {JSX.Element} Spinner element.
 */
export function renderCenteredSpinner(size) {
    return (
        <div className="flex items-center justify-center h-full">
            <span role="status" className={`loading loading-spinner loading-${size}`}></span>
        </div>
    );
}

/**
 * Renders a custom spinner with extra className.
 * @param {string} size Spinner size.
 * @param {string} className Additional class names.
 * @returns {JSX.Element} Spinner element.
 */
export function renderCustomSpinner(size, className) {
    return <span role="status" className={`loading loading-spinner loading-${size} ${className}`} />;
}

/**
 * Renders the spinner variant based on props.
 * @param {string} variant Spinner variant.
 * @param {string} size Spinner size.
 * @param {string} className Additional class names.
 * @returns {JSX.Element} Spinner element.
 */
export function renderSpinnerVariant(variant, size, className) {
    switch (variant) {
        case 'inline':
            return renderInlineSpinner(size);
        case 'centered':
            return renderCenteredSpinner(size);
        case 'custom':
            return renderCustomSpinner(size, className);
        case 'default':
        default:
            return renderDefaultSpinner(size);
    }
} 