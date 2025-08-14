import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import PropTypes from "prop-types";
import { API_ROUTES, BUYSELL_MESSAGES, BUYSELL_CONFIG } from "../../data";

/**
 * Custom hook for managing Buy/Sell form state and navigation
 * @param {string} currency Selected currency from URL parameter
 * @param {Array} marketRows Market rate data
 * @returns {Object} Object containing: form (Object), setForm (Function), loading (boolean), onSubmit (Function)
 */
export const useBuySellForm = (currency, marketRows) => {
    const [form, setForm] = useState({
        currency: currency || "",
        transactionType: "buy",
        amount: null
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const token = useSelector(state => state.auth.token);

    return {
        form,
        setForm,
        loading,
        setLoading: setLoading,
        navigate,
        token,
        marketRows
    };
};

useBuySellForm.propTypes = {
    currency: PropTypes.string,
    marketRows: PropTypes.array.isRequired
};

/**
 * Validates the transaction form data
 * @param {Object} form The form data
 * @returns {boolean} True if valid, false otherwise
 */
const validateTransactionForm = (form) => {
    if (!form.amount || form.amount <= 0) {
        toast.error(BUYSELL_MESSAGES.ERROR.INVALID_AMOUNT);
        return false;
    }
    return true;
};

/**
 * Validates authentication token
 * @param {string} token JWT token
 * @param {Function} navigate Navigation function
 * @returns {boolean} True if authenticated, false otherwise
 */
const validateAuthentication = (token, navigate) => {
    if (!token) {
        toast.error(BUYSELL_MESSAGES.ERROR.AUTHENTICATION_REQUIRED);
        navigate('/login');
        return false;
    }
    return true;
};

/**
 * Finds currency rate from market data
 * @param {Array} marketRows Market rate data
 * @param {string} currency Currency code
 * @returns {Object} Currency rate object
 */
const findCurrencyRate = (marketRows, currency) => {
    const currencyRate = marketRows.find(row => row.code === currency);
    if (!currencyRate) {
        throw new Error(BUYSELL_MESSAGES.ERROR.EXCHANGE_RATE_NOT_AVAILABLE);
    }
    return currencyRate;
};

/**
 * Performs the transaction API call
 * @param {Object} form Form data
 * @param {string} token JWT token
 * @param {Array} marketRows Market rate data
 * @returns {Promise<Object>} Transaction response
 */
const performTransaction = async (form, token, marketRows) => {
    const currencyRate = findCurrencyRate(marketRows, form.currency);

    const response = await fetch(API_ROUTES.TRANSACTION, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            currency: form.currency,
            amount: form.amount,
            transactionType: form.transactionType,
            exchangeRate: currencyRate.idrValue
        })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || BUYSELL_MESSAGES.ERROR.TRANSACTION_FAILED);
    }

    return response.json();
};

/**
 * Handles the complete transaction process
 * @param {Object} form Form data
 * @param {Function} setLoading Function to update loading state
 * @param {Function} navigate Navigation function
 * @param {string} token JWT token
 * @param {Array} marketRows Market rate data
 * @returns {Promise<void>}
 */
const handleTransaction = async (form, setLoading, navigate, token, marketRows) => {
    try {
        setLoading(true);
        await performTransaction(form, token, marketRows);
        const action = form.transactionType === 'buy' ? BUYSELL_MESSAGES.SUCCESS.BUY : BUYSELL_MESSAGES.SUCCESS.SELL;
        toast.success(action);
        navigate('/market');
    } catch (error) {
        toast.error(error.message || BUYSELL_MESSAGES.ERROR.TRANSACTION_FAILED);
    } finally {
        setLoading(false);
    }
};

/**
 * Creates form submission event handler for Buy/Sell form
 * @param {Object} form Form data
 * @param {Function} setLoading Function to update loading state
 * @param {Function} navigate Navigation function
 * @param {string} token JWT token
 * @param {Array} marketRows Market rate data
 * @returns {Function} Event handler function
 */
export const handleSubmit = (form, setLoading, navigate, token, marketRows) => async (e) => {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    if (!validateTransactionForm(form)) return;
    if (!validateAuthentication(token, navigate)) return;
    await handleTransaction(form, setLoading, navigate, token, marketRows);
};

/**
 * Handles key down events for input validation
 * @param {KeyboardEvent} e The keyboard event
 */
export const handleAmountKeyDown = (e) => {
    if (e.ctrlKey && BUYSELL_CONFIG.CTRL_KEYS.includes(e.key.toLowerCase())) {
        return;
    }

    if (!BUYSELL_CONFIG.ALLOWED_KEYS.includes(e.key)) {
        e.preventDefault();
    }
};

/**
 * Handles input change events with validation and capping
 * @param {Event} e The change event
 * @param {Function} onChange Function to update the value
 */
export const handleAmountChange = (e, onChange) => {
    const inputValue = e.target.value;

    if (inputValue === '') {
        onChange(null);
    } else {
        const numValue = parseFloat(inputValue);
        if (!isNaN(numValue) && numValue >= 0) {
            const cappedValue = Math.min(numValue, BUYSELL_CONFIG.MAX_VALUE);
            onChange(cappedValue);
        }
    }
}; 