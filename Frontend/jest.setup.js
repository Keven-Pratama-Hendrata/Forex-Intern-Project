import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

if (typeof globalThis.TextEncoder === 'undefined') {
    globalThis.TextEncoder = TextEncoder;
}
if (typeof globalThis.TextDecoder === 'undefined') {
    globalThis.TextDecoder = TextDecoder;
}

const originalError = console.error;

/**
 * Override console.error to suppress act(...) warnings and environment errors in test output.
 * @param {...any} args - Arguments passed to console.error
 */
console.error = (...args) => {
    if (
        typeof args[0] === 'string' &&
        (
            args[0].includes('not wrapped in act') ||
            args[0].includes('The current testing environment is not configured to support act')
        )
    ) {
        return;
    }
    originalError.call(console, ...args);
};
