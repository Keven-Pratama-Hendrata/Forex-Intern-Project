import PropTypes from 'prop-types';

export const DashboardHistoryEntry = {
    date: PropTypes.string,
    totalUsd: PropTypes.number
};

export const DashboardState = {
    username: PropTypes.string.isRequired,
    balance: PropTypes.number.isRequired,
    history: PropTypes.arrayOf(PropTypes.shape(DashboardHistoryEntry)).isRequired,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.string
};

export const DashboardProps = {
    username: PropTypes.string.isRequired,
    balance: PropTypes.number.isRequired,
    history: PropTypes.arrayOf(PropTypes.shape(DashboardHistoryEntry)).isRequired,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.string,
    currency: PropTypes.string.isRequired,
    onCurrencyChange: PropTypes.func.isRequired,
    onLogout: PropTypes.func.isRequired,
    activeNav: PropTypes.string.isRequired,
    setActiveNav: PropTypes.func.isRequired
};

export const DashboardHeaderProps = {
    username: PropTypes.string.isRequired,
    currency: PropTypes.string.isRequired,
    balance: PropTypes.number.isRequired,
    onCurrencyChange: PropTypes.func.isRequired,
    onLogout: PropTypes.func.isRequired
};

export const DashboardSidebarProps = {
    active: PropTypes.string.isRequired,
    onSelect: PropTypes.func.isRequired
}; 