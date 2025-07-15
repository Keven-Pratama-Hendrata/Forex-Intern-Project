import { useState } from "react";

/**
 * Custom hook for managing Dashboard state
 * @returns {Object} Dashboard state and handlers
 */
export function useDashboardState() {
    const [activeNav, setActiveNav] = useState("Home");
    const [currency, setCurrency] = useState("USD");
    const [balance] = useState(0);
    const username = "test";

    return {
        activeNav,
        setActiveNav,
        currency,
        setCurrency,
        balance,
        username,
    };
} 