import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export let rateLimitToastShown = false;
/**
 * Resets the rate limit toast flag.
 */
export function _resetRateLimitToastFlag() {
    rateLimitToastShown = false;
}

/**
 * Returns a fetch function that handles 429 errors.
 * @param {Function} originalFetch - The original fetch function.
 * @param {Function} navigate - The navigation function from react-router.
 * @returns {Function} The wrapped fetch function.
 */
function createFetchWith429Handler(originalFetch, navigate) {
    return async (...args) => {
        const response = await originalFetch(...args);
        if (response.status === 429 && !rateLimitToastShown) {
            rateLimitToastShown = true;
            toast.error("Too many requests. Please try again later.");
            navigate("/", { replace: true });
            setTimeout(() => { rateLimitToastShown = false; }, 2000);
        }
        return response;
    };
}

/**
 * Sets up a global fetch override to handle 429 errors with a toast and redirect.
 * @param {Function} navigate - The navigation function from react-router.
 * @returns {Function} Cleanup function to restore the original fetch.
 */
function setupFetchInterceptor(navigate) {
    const originalFetch = window.fetch;
    window.fetch = createFetchWith429Handler(originalFetch, navigate);
    return () => { window.fetch = originalFetch; };
}

/**
 * React hook to globally intercept fetch 429 errors and show a toast/redirect.
 */
export function useGlobalFetchInterceptor() {
    const navigate = useNavigate();
    useEffect(() => setupFetchInterceptor(navigate), [navigate]);
} 