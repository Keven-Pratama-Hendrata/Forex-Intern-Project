import PropTypes from 'prop-types';

export const MarketFlagCellPropTypes = {
    cur: PropTypes.shape({
        code: PropTypes.string.isRequired,
        flag: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
    }).isRequired,
};

export const MarketChangeCellPropTypes = {
    cur: PropTypes.shape({
        change: PropTypes.number.isRequired,
        idrValue: PropTypes.number.isRequired,
    }).isRequired,
};

export const MarketTransactionCellPropTypes = {};

export const MarketTableRowPropTypes = {
    cur: PropTypes.shape({
        code: PropTypes.string.isRequired,
        flag: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        change: PropTypes.number.isRequired,
        idrValue: PropTypes.number.isRequired,
    }).isRequired,
};

export const MarketTablePropTypes = {
    rows: PropTypes.arrayOf(
        PropTypes.shape({
            code: PropTypes.string.isRequired,
            flag: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            change: PropTypes.number.isRequired,
            idrValue: PropTypes.number.isRequired,
        })
    ).isRequired,
}; 