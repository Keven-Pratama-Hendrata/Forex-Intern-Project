import React from "react";
import PropTypes from "prop-types";

// Navigation items for the sidebar with asset icons
const navItems = [
    { label: "Home", icon: <img src="/assets/Home.png" alt="Home" className="w-6 h-6" /> },
    { label: "Market", icon: <img src="/assets/market.png" alt="Market" className="w-6 h-6" /> },
    { label: "Portfolio", icon: <img src="/assets/portfolio.png" alt="Portfolio" className="w-6 h-6" /> },
    { label: "History", icon: <img src="/assets/history.png" alt="History" className="w-6 h-6" /> },
];

/**
 * Renders a single navigation button for the sidebar
 * @param {Object} props - Component props
 * @param {Object} props.item - Navigation item
 * @param {boolean} props.isActive - Whether the item is active
 * @param {Function} props.onSelect - Callback for selection
 * @returns {JSX.Element} Navigation button element
 */
function SidebarNavItem({ item, isActive, onSelect }) {
    const buttonClass = [
        "flex items-center gap-2 px-4 py-2 rounded-lg text-lg font-semibold transition-colors",
        isActive ? "bg-blue-100 text-blue-900" : "text-blue-900 hover:bg-blue-50",
    ].join(" ");
    return (
        <button
            key={item.label}
            className={buttonClass}
            onClick={() => onSelect(item.label)}
            type="button"
        >
            {item.icon}
            <span>{item.label}</span>
        </button>
    );
}

/**
 * Sidebar navigation for the Dashboard page
 * @param {Object} props - Component props
 * @param {string} props.active - The currently active nav item
 * @param {Function} props.onSelect - Callback when a nav item is selected
 * @returns {JSX.Element} Sidebar navigation component
 */
const Sidebar = ({ active = "Home", onSelect = () => { } }) => (
    <nav className="flex flex-col gap-2 py-4 px-2 min-w-[160px]">
        {navItems.map((item) => (
            <SidebarNavItem
                key={item.label}
                item={item}
                isActive={active === item.label}
                onSelect={onSelect}
            />
        ))}
    </nav>
);

Sidebar.propTypes = {
    active: PropTypes.string,
    onSelect: PropTypes.func,
};

export default Sidebar; 