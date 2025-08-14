import PropTypes from 'prop-types';

export const HistoryTableRowPropTypes = {
    transaction: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
        currency: PropTypes.string.isRequired,
        amount: PropTypes.number.isRequired,
        balance: PropTypes.number.isRequired
    }).isRequired,
    isLast: PropTypes.bool.isRequired
};

export const HistoryTablePropTypes = {
    transactions: PropTypes.arrayOf(
        PropTypes.shape({
            _id: PropTypes.string.isRequired,
            date: PropTypes.string.isRequired,
            currency: PropTypes.string.isRequired,
            amount: PropTypes.number.isRequired,
            balance: PropTypes.number.isRequired
        })
    ).isRequired
};

export const HistoryTableWithHeaderPropTypes = {
    transactions: PropTypes.arrayOf(
        PropTypes.shape({
            _id: PropTypes.string.isRequired,
            date: PropTypes.string.isRequired,
            currency: PropTypes.string.isRequired,
            amount: PropTypes.number.isRequired,
            balance: PropTypes.number.isRequired
        })
    ).isRequired
}; 