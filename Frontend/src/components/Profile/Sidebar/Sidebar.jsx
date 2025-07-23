import React from "react";
import PropTypes from "prop-types";
import { Menu } from "antd";
import { useNavigate } from "react-router-dom";
import { navItems, handleMenuClick } from "./sidebarHandler.jsx";
import { SidebarProps } from "./Sidebar.type.js";

/**
 * Sidebar navigation for the Dashboard page using Ant Design Menu
 * @param {Object} props Component props
 * @param {string} props.active The currently active nav item
 * @param {Function} props.onSelect Callback when a nav item is selected
 * @returns {JSX.Element} Sidebar navigation component
 */
const Sidebar = ({ active = "Home", onSelect = () => { } }) => {
    const navigate = useNavigate();
    return (
        <Menu
            mode="inline"
            selectedKeys={[active]}
            onClick={(e) => handleMenuClick(e, navigate, onSelect)}
            style={{ minWidth: 110, padding: '24px 0', borderRight: 0, background: 'transparent' }}
            items={navItems}
        />
    );
};

Sidebar.propTypes = SidebarProps;

export default Sidebar; 