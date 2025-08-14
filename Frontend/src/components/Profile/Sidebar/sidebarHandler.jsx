import React from "react";

export const navItems = [
    {
        key: "Home",
        icon: <img src="/assets/Home.png" alt="Home" style={{ width: 24, height: 24 }} />,
        label: <span style={{ marginLeft: 4, fontWeight: 600, fontSize: 16, color: "#1e3a8a" }}>Home</span>
    },
    {
        key: "Market",
        icon: <img src="/assets/market.png" alt="Market" style={{ width: 24, height: 24 }} />,
        label: <span style={{ marginLeft: 4, fontWeight: 600, fontSize: 16, color: "#1e3a8a" }}>Market</span>
    },
    {
        key: "Portfolio",
        icon: <img src="/assets/portfolio.png" alt="Portfolio" style={{ width: 24, height: 24 }} />,
        label: <span style={{ marginLeft: 4, fontWeight: 600, fontSize: 16, color: "#1e3a8a" }}>Portfolio</span>
    },
    {
        key: "History",
        icon: <img src="/assets/history.png" alt="History" style={{ width: 24, height: 24 }} />,
        label: <span style={{ marginLeft: 4, fontWeight: 600, fontSize: 16, color: "#1e3a8a" }}>History</span>
    },
];

export const navItemStyle = {
    fontSize: 16,
    fontWeight: 500,
    height: 48,
    display: 'flex',
    alignItems: 'center',
};

export const navRoutes = {
    Home: "/dashboard",
    Market: "/market",
    Portfolio: "/portfolio",
    History: "/history"
};

/**
 * Handles menu item click for the sidebar.
 * Navigates to the corresponding route and calls onSelect.
 * @param {Object} event The click event object.
 * @param {string} event.key The key of the clicked menu item.
 * @param {Function} navigate The navigation function from react-router-dom.
 * @param {Function} onSelect Callback for selection.
 */
export function handleMenuClick({ key }, navigate, onSelect) {
    if (navRoutes[key]) {
        navigate(navRoutes[key]);
    }
    onSelect(key);
} 