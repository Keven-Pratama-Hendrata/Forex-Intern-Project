import PropTypes from "prop-types";

export const HeaderAntdProps = {
    username: PropTypes.string.isRequired,
    balance: PropTypes.number.isRequired,
    onLogout: PropTypes.func.isRequired,
}; 