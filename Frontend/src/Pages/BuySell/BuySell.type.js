import PropTypes from 'prop-types';

export const BuySellFormState = {
    currency: PropTypes.string.isRequired,
    transactionType: PropTypes.oneOf(['buy', 'sell']).isRequired,
    amount: PropTypes.number
};

export const BuySellProps = {
    form: PropTypes.shape(BuySellFormState).isRequired,
    setForm: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    setLoading: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
    token: PropTypes.string,
    currency: PropTypes.string.isRequired,
    marketRows: PropTypes.arrayOf(
        PropTypes.shape({
            code: PropTypes.string.isRequired,
            flag: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            change: PropTypes.number.isRequired,
            idrValue: PropTypes.number.isRequired,
        })
    ).isRequired
};

export const BuySellContentProps = {
    form: PropTypes.shape(BuySellFormState).isRequired,
    setForm: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    setLoading: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
    token: PropTypes.string,
    currency: PropTypes.string.isRequired,
    marketRows: PropTypes.arrayOf(
        PropTypes.shape({
            code: PropTypes.string.isRequired,
            flag: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            change: PropTypes.number.isRequired,
            idrValue: PropTypes.number.isRequired,
        })
    ).isRequired
};

export const BuySellFormProps = {
    form: PropTypes.shape(BuySellFormState).isRequired,
    setForm: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    setLoading: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
    token: PropTypes.string,
    currency: PropTypes.string.isRequired,
    marketRows: PropTypes.arrayOf(
        PropTypes.shape({
            code: PropTypes.string.isRequired,
            flag: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            change: PropTypes.number.isRequired,
            idrValue: PropTypes.number.isRequired,
        })
    ).isRequired
};



export const TransactionTypeSelectorProps = {
    value: PropTypes.oneOf(['buy', 'sell']).isRequired,
    onChange: PropTypes.func.isRequired
};

export const AmountInputProps = {
    value: PropTypes.number,
    onChange: PropTypes.func.isRequired,
    transactionType: PropTypes.oneOf(['buy', 'sell']).isRequired,
    currency: PropTypes.string.isRequired
};

export const TransactionSummaryProps = {
    form: PropTypes.shape(BuySellFormState).isRequired,
    marketRows: PropTypes.arrayOf(
        PropTypes.shape({
            code: PropTypes.string.isRequired,
            flag: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            change: PropTypes.number.isRequired,
            idrValue: PropTypes.number.isRequired,
        })
    ).isRequired
};

export const SubmitButtonProps = {
    loading: PropTypes.bool.isRequired
};

export const InvalidCurrencyErrorProps = {
    navigate: PropTypes.func.isRequired
};

export const MarketRowPropTypes = {
    code: PropTypes.string.isRequired,
    flag: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    change: PropTypes.number.isRequired,
    idrValue: PropTypes.number.isRequired,
};

export const BuySellHookReturn = {
    form: PropTypes.shape(BuySellFormState).isRequired,
    setForm: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    setLoading: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
    token: PropTypes.string,
    marketRows: PropTypes.arrayOf(PropTypes.shape(MarketRowPropTypes)).isRequired
}; 