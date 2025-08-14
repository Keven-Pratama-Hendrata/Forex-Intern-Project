import unitedStatesFlag from "../../assets/flags/united-states.png";
import europeanUnionFlag from "../../assets/flags/european-union.png";
import japanFlag from "../../assets/flags/japan.png";
import australiaFlag from "../../assets/flags/australia.png";
import indonesiaFlag from "../../assets/flags/indonesia-flag.png";

export const currencyMeta = {
    USD: { name: "US Dollar", flag: unitedStatesFlag },
    EUR: { name: "Euro", flag: europeanUnionFlag },
    JPY: { name: "Japanese Yen", flag: japanFlag },
    AUD: { name: "Australian Dollar", flag: australiaFlag },
    IDR: { name: "Indonesian Rupiah", flag: indonesiaFlag },
};

export const currencyList = ["USD", "EUR", "JPY", "AUD"];
export const portfolioCurrencyList = ["USD", "EUR", "JPY", "AUD", "IDR"];

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

export const API_ROUTES = {
    HISTORY: 'http://localhost:5001/api/market/history',
    TRANSACTION: 'http://localhost:5001/api/users/transaction',
    USER_HISTORY: 'http://localhost:5001/api/users/history',
    PROFILE: 'http://localhost:5001/api/users/profile',
};

export const MARKET_BUYSELL_BUTTON_STYLE = {
    backgroundColor: '#507fa1',
    borderColor: '#507fa1',
    color: 'white',
    transition: 'background 0.2s, border 0.2s',
};

export const MARKET_BUYSELL_BUTTON_HOVER_STYLE = {
    backgroundColor: '#426989',
    borderColor: '#426989',
    color: 'white',
}; 