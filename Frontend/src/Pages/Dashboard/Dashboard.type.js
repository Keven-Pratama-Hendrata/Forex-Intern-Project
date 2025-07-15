import PropTypes from "prop-types";

export const DashboardProps = {
};

export const SidebarProps = {
    active: PropTypes.string,
    onSelect: PropTypes.func,
};

export const HeaderProps = {
    username: PropTypes.string,
    currency: PropTypes.string,
    balance: PropTypes.number,
    onCurrencyChange: PropTypes.func,
    onLogout: PropTypes.func,
}; 