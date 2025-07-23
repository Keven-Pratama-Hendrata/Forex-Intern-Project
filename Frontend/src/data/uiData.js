export const DASHBOARD_CHART_CONFIG = {
    LABEL: 'IDR Rate',
    BORDER_COLOR: '#1e3a8a',
    BACKGROUND_COLOR: '#c7d6ee',
    TITLE: 'IDR Rate History',
    TITLE_PADDING: { top: 0, bottom: 16 }
};

export const DASHBOARD_ERROR_MESSAGES = {
    FETCH_HISTORY_FAILED: 'Failed to fetch IDR history',
    GENERIC: 'Error fetching IDR history',
};

export const DASHBOARD_ROUTES = {
    HISTORY: 'http://localhost:5001/api/market/history',
}; 