import React from "react";
import {
    useHeaderLogout,
    useLogoutHover,
    getLogoutButtonStyle,
    HEADER_LABELS,
    HEADER_STYLES
} from "./headerAntdHandler.jsx";
import logoutIcon from '../../../../assets/logout_icon.png';
import profileIcon from '../../../../assets/profilepicture.png';
import { HeaderAntdProps } from "./Header.type.js";

/**
 * User info section for the header (blue pill with icon and username).
 * @param {Object} props The props object.
 * @param {string} props.username The username to display.
 * @returns {JSX.Element} User info section.
 */
function UserInfo({ username }) {
    return (
        <div style={HEADER_STYLES.avatarPillStyle}>
            <span style={HEADER_STYLES.avatarIconStyle}>
                <img src={profileIcon} alt="Profile" style={{ width: 28, height: 28, borderRadius: '50%' }} />
            </span>
            <span style={HEADER_STYLES.usernameStyle}>{username || 'User'}</span>
        </div>
    );
}

/**
 * Balance display section for the header (centered, with dropdown arrow).
 * @param {Object} props The props object.
 * @param {number} props.balance The balance to display.
 * @returns {JSX.Element} Balance display section.
 */
function BalanceDisplay({ balance }) {
    const formattedBalance = balance.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    return (
        <span style={{ display: 'flex', alignItems: 'center', fontWeight: 700, fontSize: 20, color: '#1e3a8a' }}>
            {HEADER_LABELS.balance}:&nbsp;
            <span style={{ fontWeight: 500, fontSize: 18, color: '#1e3a8a' }}>
                Rp{formattedBalance}
            </span>
        </span>
    );
}

/**
 * Logout button content (icon and text).
 * @returns {JSX.Element} Logout button content.
 */
function LogoutButtonContent() {
    return (
        <>
            {HEADER_LABELS.logout}
            <img
                src={logoutIcon}
                alt="Logout"
                style={HEADER_STYLES.logoutIconStyle}
            />
        </>
    );
}

/**
 * Logout link section for the header (right-aligned, small text with icon).
 * @returns {JSX.Element} Logout link section.
 */
function LogoutLink() {
    const onLogout = useHeaderLogout();
    const [hover, onMouseEnter, onMouseLeave] = useLogoutHover();
    return (
        <button
            onClick={onLogout}
            style={getLogoutButtonStyle(hover)}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <LogoutButtonContent />
        </button>
    );
}

/**
 * Renders the header layout with user info, balance, and logout link.
 * @param {string} username The username to display.
 * @param {number} balance The balance to display.
 * @returns {JSX.Element} The header layout.
 */
function renderHeader(username, balance) {
    return (
        <div style={HEADER_STYLES.headerContainerStyle}>
            <div style={HEADER_STYLES.sectionLeftStyle}>
                <UserInfo username={username} />
            </div>
            <div style={HEADER_STYLES.sectionCenterStyle}>
                <BalanceDisplay balance={balance} />
            </div>
            <div style={HEADER_STYLES.sectionRightStyle}>
                <LogoutLink />
            </div>
        </div>
    );
}

/**
 * Header component for user profile section, showing user info, IDR balance, and logout.
 * @param {Object} props The props object.
 * @param {string} props.username The username to display.
 * @param {number} props.balance The balance to display.
 * @returns {JSX.Element} The header bar.
 */
function HeaderAntd({ username, balance }) {
    return renderHeader(username, balance);
}

HeaderAntd.propTypes = HeaderAntdProps;

export default HeaderAntd; 