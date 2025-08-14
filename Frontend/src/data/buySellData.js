import { AUTH_MESSAGES } from "./index";

export const BUYSELL_MESSAGES = {
    SUCCESS: {
        BUY: 'Buy transaction completed successfully!',
        SELL: 'Sell transaction completed successfully!',
    },
    ERROR: {
        INVALID_AMOUNT: 'Please enter a valid amount',
        AUTHENTICATION_REQUIRED: AUTH_MESSAGES.ERROR.LOGIN_REQUIRED,
        EXCHANGE_RATE_NOT_AVAILABLE: 'Exchange rate not available',
        TRANSACTION_FAILED: 'Transaction failed. Please try again.',
        NETWORK_ERROR: AUTH_MESSAGES.ERROR.NETWORK_ERROR,
    },
    VALIDATION: {
        AMOUNT_REQUIRED: 'Please fill in all required fields',
        AMOUNT_GREATER_THAN_ZERO: 'Amount must be greater than 0',
        AMOUNT_NOT_NEGATIVE: 'Amount cannot be negative',
    },
};

export const BUYSELL_CONFIG = {
    MAX_VALUE: 999999999999999,
    ALLOWED_KEYS: [
        'Backspace', 'Tab', 'Escape', 'Enter', 'Delete',
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
        'Numpad0', 'Numpad1', 'Numpad2', 'Numpad3', 'Numpad4',
        'Numpad5', 'Numpad6', 'Numpad7', 'Numpad8', 'Numpad9',
        '.', 'NumpadDecimal'
    ],
    CTRL_KEYS: ['a', 'c', 'v', 'x'],
};

export const BUYSELL_STYLES = {
    INPUT_CLASS: "[&_input::-webkit-outer-spin-button]:appearance-none " +
        "[&_input::-webkit-inner-spin-button]:appearance-none " +
        "[&_input::-moz-appearance]:textfield",
    BUY_BUTTON_ACTIVE: 'bg-green-500 border-green-500 text-white shadow-lg',
    BUY_BUTTON_INACTIVE: 'bg-white border-gray-300 text-gray-700 hover:border-green-400 hover:bg-green-50',
    SELL_BUTTON_ACTIVE: 'bg-red-500 border-red-500 text-white shadow-lg',
    SELL_BUTTON_INACTIVE: 'bg-white border-gray-300 text-gray-700 hover:border-red-400 hover:bg-red-50',
    BASE_BUTTON_CLASS: "flex-1 py-3 px-4 rounded-full border-2 font-semibold text-sm transition-all duration-200",
    BACK_BUTTON_CLASS: "px-6 py-2 rounded-full bg-gray-800 hover:bg-black text-white " +
        "font-semibold transition-all duration-200 cursor-pointer shadow-md " +
        "hover:shadow-lg transform hover:scale-105",
};

export const BUYSELL_LABELS = {
    HEADER_TITLE: 'Buy/Sell Currency',
    HEADER_SUBTITLE: 'Complete your transaction',
    TRANSACTION_TYPE_LABEL: 'Transaction Type',
    BUY_LABEL: 'Buy',
    SELL_LABEL: 'Sell',
    CONFIRM_TRANSACTION: 'Confirm Transaction',
    BACK_TO_MARKET: 'Back to Market',
    INVALID_CURRENCY_TITLE: 'Invalid Currency',
    INVALID_CURRENCY_MESSAGE: 'The selected currency is not available.',
    TOTAL_LABEL: 'Total',
}; 