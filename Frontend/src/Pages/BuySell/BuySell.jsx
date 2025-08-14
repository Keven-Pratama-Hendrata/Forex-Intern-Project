import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import Background from "../../components/Background";
import { Button, LoadingSpinner, FormField } from "../../components/common";
import { useBuySellForm, handleSubmit, handleAmountKeyDown, handleAmountChange } from "./buySellHandler.jsx";
import { useMarketRates } from "../Market/marketHandler.jsx";
import { currencyMeta, BUYSELL_STYLES, BUYSELL_LABELS } from "../../data";
import {
    BuySellContentProps,
    BuySellFormProps,
    TransactionTypeSelectorProps,
    AmountInputProps,
    TransactionSummaryProps,
    SubmitButtonProps,
    InvalidCurrencyErrorProps
} from "./BuySell.type.js";

/**
 * Main Buy/Sell page component for currency transactions
 * @returns {JSX.Element} Complete Buy/Sell page with form and background
 */
const BuySell = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const currency = searchParams.get('currency');
    const { rows: marketRows, loading: marketLoading } = useMarketRates();
    const { form, setForm, loading, setLoading, token } = useBuySellForm(currency, marketRows);

    if (loading || marketLoading) {
        return <BuySellLoading />;
    }

    if (!currency || !currencyMeta[currency]) {
        return <InvalidCurrencyError navigate={navigate} />;
    }

    return (
        <BuySellContent
            form={form}
            setForm={setForm}
            loading={loading}
            setLoading={setLoading}
            navigate={navigate}
            token={token}
            currency={currency}
            marketRows={marketRows}
        />
    );
};

/**
 * Loading component for Buy/Sell page
 * @returns {JSX.Element} Loading spinner with background
 */
const BuySellLoading = () => (
    <Background>
        <div className="flex items-center justify-center min-h-screen">
            <LoadingSpinner />
        </div>
    </Background>
);

/**
 * Invalid currency error component
 * @param {Object} props Component props
 * @param {Function} props.navigate Navigation function
 * @returns {JSX.Element} Invalid currency error page
 */
const InvalidCurrencyError = ({ navigate }) => (
    <Background>
        <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{BUYSELL_LABELS.INVALID_CURRENCY_TITLE}</h2>
            <p className="text-gray-600 mb-4">{BUYSELL_LABELS.INVALID_CURRENCY_MESSAGE}</p>
            <Button onClick={() => navigate('/market')}>
                {BUYSELL_LABELS.BACK_TO_MARKET}
            </Button>
        </div>
    </Background>
);

InvalidCurrencyError.propTypes = InvalidCurrencyErrorProps;

/**
 * Buy/Sell page layout component with background
 * @param {Object} props Component props
 * @param {Object} props.form Form state object
 * @param {Function} props.setForm Function to update form state
 * @param {boolean} props.loading Loading state during form submission
 * @param {Function} props.setLoading Function to update loading state
 * @param {Function} props.navigate Navigation function
 * @param {string} props.token JWT token
 * @param {string} props.currency Selected currency code
 * @param {Array} props.marketRows Market rate data
 * @returns {JSX.Element} Buy/Sell page with background and form layout
 */
const BuySellContent = ({ form, setForm, loading, setLoading, navigate, token, currency, marketRows }) => (
    <Background>
        <div className="flex flex-col items-center justify-center min-h-screen w-full">
            <div className="w-full max-w-sm">
                <BuySellForm
                    form={form}
                    setForm={setForm}
                    loading={loading}
                    setLoading={setLoading}
                    navigate={navigate}
                    token={token}
                    currency={currency}
                    marketRows={marketRows}
                />
            </div>
            <div className="text-center mt-6">
                <button
                    onClick={() => window.history.back()}
                    className={BUYSELL_STYLES.BACK_BUTTON_CLASS}
                >
                    {BUYSELL_LABELS.BACK_TO_MARKET}
                </button>
            </div>
        </div>
    </Background>
);

BuySellContent.propTypes = BuySellContentProps;

/**
 * Buy/Sell form container with glassmorphism styling
 * @param {Object} props Component props
 * @param {Object} props.form Form state object
 * @param {Function} props.setForm Function to update form state
 * @param {boolean} props.loading Loading state during form submission
 * @param {Function} props.setLoading Function to update loading state
 * @param {Function} props.navigate Navigation function
 * @param {string} props.token JWT token
 * @param {string} props.currency Selected currency code
 * @param {Array} props.marketRows Market rate data
 * @returns {JSX.Element} Styled Buy/Sell form with glassmorphism effect
 */
const BuySellForm = ({ form, setForm, loading, setLoading, navigate, token, currency, marketRows }) => (
    <form
        onSubmit={handleSubmit(form, setLoading, navigate, token, marketRows)}
        className="rounded-2xl bg-white/60 p-8 shadow-xl backdrop-blur-md ring-1 ring-white/40"
    >
        <h2 className="mb-1 text-center text-2xl font-extrabold text-gray-800">
            {BUYSELL_LABELS.HEADER_TITLE}
        </h2>
        <p className="mb-6 text-center text-sm text-gray-600">
            {BUYSELL_LABELS.HEADER_SUBTITLE}
        </p>

        <TransactionTypeSelector
            value={form.transactionType}
            onChange={(value) => setForm({ ...form, transactionType: value })}
        />
        <AmountInput
            value={form.amount}
            onChange={(value) => setForm({ ...form, amount: value })}
            transactionType={form.transactionType}
            currency={currency}
        />

        <TransactionSummary form={{ ...form, currency }} marketRows={marketRows} />
        <SubmitButton loading={loading} />
    </form>
);

BuySellForm.propTypes = BuySellFormProps;

/**
 * Transaction type selector component
 * @param {Object} props Component props
 * @param {string} props.value Current transaction type
 * @param {Function} props.onChange Function to update transaction type
 * @returns {JSX.Element} Transaction type selector
 */
const TransactionTypeSelector = ({ value, onChange }) => {
    const buyButtonClass = value === 'buy'
        ? BUYSELL_STYLES.BUY_BUTTON_ACTIVE
        : BUYSELL_STYLES.BUY_BUTTON_INACTIVE;

    const sellButtonClass = value === 'sell'
        ? BUYSELL_STYLES.SELL_BUTTON_ACTIVE
        : BUYSELL_STYLES.SELL_BUTTON_INACTIVE;

    return (
        <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {BUYSELL_LABELS.TRANSACTION_TYPE_LABEL}
            </label>
            <div className="flex gap-2">
                <button
                    type="button"
                    onClick={() => onChange('buy')}
                    className={`${BUYSELL_STYLES.BASE_BUTTON_CLASS} ${buyButtonClass}`}
                >
                    <div className="flex items-center justify-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${value === 'buy' ? 'bg-white' : 'bg-green-500'}`}></div>
                        {BUYSELL_LABELS.BUY_LABEL}
                    </div>
                </button>
                <button
                    type="button"
                    onClick={() => onChange('sell')}
                    className={`${BUYSELL_STYLES.BASE_BUTTON_CLASS} ${sellButtonClass}`}
                >
                    <div className="flex items-center justify-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${value === 'sell' ? 'bg-white' : 'bg-red-500'}`}></div>
                        {BUYSELL_LABELS.SELL_LABEL}
                    </div>
                </button>
            </div>
        </div>
    );
};

TransactionTypeSelector.propTypes = TransactionTypeSelectorProps;

/**
 * Amount input component with validation
 * @param {Object} props Component props
 * @param {number} props.value Amount value
 * @param {Function} props.onChange Amount change handler
 * @param {string} props.transactionType Current transaction type
 * @param {string} props.currency Selected currency code
 * @returns {JSX.Element} Amount input field
 */
const AmountInput = ({ value, onChange, transactionType, currency }) => {
    const currencyLabel = transactionType === 'buy' ? 'IDR' : currency;

    return (
        <FormField
            label={`Amount (${currencyLabel})`}
            type="text"
            name="amount"
            placeholder={`Enter amount in ${currencyLabel}`}
            value={value || ''}
            onKeyDown={handleAmountKeyDown}
            onChange={(e) => handleAmountChange(e, onChange)}
            required
            className={BUYSELL_STYLES.INPUT_CLASS}
        />
    );
};

AmountInput.propTypes = AmountInputProps;

/**
 * Transaction summary component
 * @param {Object} props Component props
 * @param {Object} props.form Form state object
 * @param {Array} props.marketRows Market rate data
 * @returns {JSX.Element} Transaction summary display
 */
const TransactionSummary = ({ form, marketRows }) => {
    if (!form.currency || !form.amount || !marketRows.length) {
        return null;
    }

    const currencyRate = marketRows.find(row => row.code === form.currency);
    if (!currencyRate) return null;

    let totalAmount, totalCurrency, totalSymbol;
    if (form.transactionType === 'buy') {
        totalAmount = form.amount / currencyRate.idrValue;
        totalCurrency = form.currency;
        totalSymbol = totalCurrency === 'USD' ? '$' : '';
    } else {
        totalAmount = form.amount * currencyRate.idrValue;
        totalCurrency = 'IDR';
        totalSymbol = 'Rp ';
    }

    return (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span className="text-gray-600">{BUYSELL_LABELS.TOTAL_LABEL} ({totalCurrency}):</span>
                    <span className="font-medium">{totalSymbol}{totalAmount.toLocaleString()}</span>
                </div>
            </div>
        </div>
    );
};

TransactionSummary.propTypes = TransactionSummaryProps;

/**
 * Submit button component with loading state
 * @param {Object} props Component props
 * @param {boolean} props.loading Loading state during form submission
 * @returns {JSX.Element} Submit button with loading state handling
 */
export const SubmitButton = ({ loading }) => (
    <Button
        type="submit"
        disabled={loading}
        className="w-full"
    >
        {loading ? <LoadingSpinner variant="inline" /> : BUYSELL_LABELS.CONFIRM_TRANSACTION}
    </Button>
);

SubmitButton.propTypes = SubmitButtonProps;

export default BuySell; 