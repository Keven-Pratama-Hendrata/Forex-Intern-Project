import PropTypes from 'prop-types';

export const PortfolioDataPropTypes = PropTypes.shape({
    balances: PropTypes.arrayOf(PropTypes.shape({
        amount: PropTypes.number.isRequired,
        currency: PropTypes.string.isRequired,
        _id: PropTypes.string
    }))
});

export const PortfolioContentProps = PropTypes.shape({
    idrBalances: PropTypes.array,
    marketLoading: PropTypes.bool,
});

export const PortfolioCardLayoutProps = PropTypes.shape({
    activeNav: PropTypes.string.isRequired,
    setActiveNav: PropTypes.func.isRequired,
    headerProfile: PropTypes.object.isRequired,
    portfolioData: PortfolioDataPropTypes.isRequired,
    idrBalances: PropTypes.array,
    marketLoading: PropTypes.bool,
});

export const PortfolioContentWrapperProps = PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    activeNav: PropTypes.string.isRequired,
    setActiveNav: PropTypes.func.isRequired,
    headerProfile: PropTypes.object.isRequired,
    portfolioData: PortfolioDataPropTypes.isRequired,
    idrBalances: PropTypes.array,
    marketLoading: PropTypes.bool,
}); 