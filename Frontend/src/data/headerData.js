export const SUPPORTED_CURRENCIES = ["IDR", "USD", "EUR", "JPY", "AUD"];

export const HEADER_LABELS = {
    balance: "Balance",
    logout: "Logout",
};

export const HEADER_STYLES = {
    avatarPillStyle: {
        display: 'flex',
        alignItems: 'center',
        background: '#e0edfa',
        borderRadius: 20,
        padding: '2px 12px 2px 4px',
        gap: 8,
        boxShadow: '0 1px 4px rgba(30,58,138,0.08)'
    },
    avatarIconStyle: {
        width: 28,
        height: 28,
        borderRadius: '50%',
        background: '#b6d0f7',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 18,
        color: '#1e3a8a',
    },
    usernameStyle: {
        color: '#1e3a8a',
        fontWeight: 500,
        fontSize: 18,
        marginLeft: 4,
    },
    headerContainerStyle: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#e6ecf2',
        borderRadius: '12px 12px 0 0',
        padding: '10px 28px',
        minHeight: 54
    },
    sectionLeftStyle: {
        display: 'flex',
        alignItems: 'center',
        gap: 12
    },
    sectionCenterStyle: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontWeight: 700,
        fontSize: 20,
        color: '#1e3a8a',
    },
    sectionRightStyle: {
        display: 'flex',
        alignItems: 'center',
        gap: 8
    },
    logoutLinkStyle: {
        color: '#1e3a8a',
        fontWeight: 600,
        fontSize: 18,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        background: 'none',
        border: 'none',
        padding: 0,
        textDecoration: 'none',
    },
    logoutIconStyle: {
        width: 18,
        height: 18,
        marginLeft: 2,
        display: 'inline-block',
        verticalAlign: 'middle',
    }
};

export const HEADER_ROUTES = {
    profile: '/api/users/profile',
}; 