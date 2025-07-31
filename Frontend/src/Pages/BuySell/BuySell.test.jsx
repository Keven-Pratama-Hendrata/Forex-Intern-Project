import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../store/slices/authSlice';
import BuySell, { SubmitButton } from './BuySell.jsx';

jest.mock('../../components/Background/Background', () => ({ children }) => (
    <div data-testid="background">{children}</div>
));

jest.mock('../../components/common', () => ({
    Button: ({ children, type, disabled, onClick, ...props }) => (
        <button
            type={type}
            disabled={disabled}
            onClick={onClick}
            data-testid="button"
            {...props}
        >
            {children}
        </button>
    ),
    LoadingSpinner: ({ variant }) => (
        <div data-testid="loading-spinner" data-variant={variant}>
            Loading...
        </div>
    ),
    FormField: ({
        label,
        type,
        name,
        placeholder,
        value,
        onChange,
        onKeyDown,
        required,
        className,
        ...props
    }) => (
        <div data-testid={`form-field-${name}`}>
            <label>{label}</label>
            <input
                type={type}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange || (() => { })}
                onKeyDown={onKeyDown}
                required={required}
                className={className}
                data-testid={`input-${name}`}
                {...props}
            />
        </div>
    ),
}));

jest.mock('./buySellHandler.jsx', () => ({
    useBuySellForm: jest.fn(),
    handleSubmit: jest.fn(() => jest.fn()),
    handleAmountKeyDown: jest.fn(),
    handleAmountChange: jest.fn((e, onChange) => {
        if (onChange) {
            onChange(parseFloat(e.target.value) || null);
        }
    }),
}));

jest.mock('../Market/marketHandler.jsx', () => ({
    useMarketRates: jest.fn(),
}));

jest.mock('../../data', () => ({
    currencyMeta: {
        USD: { name: 'US Dollar', flag: 'usd-flag.png' },
        EUR: { name: 'Euro', flag: 'eur-flag.png' },
        JPY: { name: 'Japanese Yen', flag: 'jpy-flag.png' },
        AUD: { name: 'Australian Dollar', flag: 'aud-flag.png' },
    },
    BUYSELL_CONFIG: {
        MAX_VALUE: 999999999999999,
        ALLOWED_KEYS: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'],
        CTRL_KEYS: ['a', 'c', 'v', 'x'],
    },
    BUYSELL_STYLES: {
        INPUT_CLASS: 'test-input-class',
        BUY_BUTTON_ACTIVE: 'bg-green-500',
        BUY_BUTTON_INACTIVE: 'bg-white',
        SELL_BUTTON_ACTIVE: 'bg-red-500',
        SELL_BUTTON_INACTIVE: 'bg-white',
        BASE_BUTTON_CLASS: 'test-button-class',
        BACK_BUTTON_CLASS: 'test-back-button-class',
    },
    BUYSELL_LABELS: {
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
    },
}));

const mockUseSearchParams = jest.fn();
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useSearchParams: () => mockUseSearchParams(),
    useNavigate: () => mockNavigate,
}));

const createMockStore = () =>
    configureStore({
        reducer: { auth: authReducer },
    });

const renderWithProvider = (ui) =>
    render(
        <Provider store={createMockStore()}>
            <MemoryRouter>{ui}</MemoryRouter>
        </Provider>
    );

const { useBuySellForm } = require('./buySellHandler.jsx');
const { useMarketRates } = require('../Market/marketHandler.jsx');

const mockMarketRows = [
    { code: 'USD', flag: 'usd-flag.png', name: 'US Dollar', change: 1.2345, idrValue: 15000 }
];

const mockEurMarketRows = [
    { code: 'EUR', flag: 'eur-flag.png', name: 'Euro', change: 1.2345, idrValue: 15000 }
];

const createMockBuySellForm = (overrides = {}) => ({
    form: { currency: 'USD', transactionType: 'buy', amount: null },
    setForm: jest.fn(),
    loading: false,
    setLoading: jest.fn(),
    navigate: jest.fn(),
    token: 'test-token',
    ...overrides,
});

describe('BuySell (unit and snapshot)', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockUseSearchParams.mockReturnValue([new URLSearchParams('currency=USD')]);
        mockNavigate.mockClear();
    });

    describe('Loading States', () => {
        it('renders loading spinner when loading (unit)', () => {
            useMarketRates.mockReturnValue({ rows: [], loading: true });
            useBuySellForm.mockReturnValue(createMockBuySellForm());

            renderWithProvider(<BuySell />);

            expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
        });

        it('renders loading spinner when form is submitting (unit)', () => {
            useMarketRates.mockReturnValue({ rows: [], loading: false });
            useBuySellForm.mockReturnValue(createMockBuySellForm({ loading: true }));

            renderWithProvider(<BuySell />);

            expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
        });

        it('matches snapshot when loading', () => {
            useMarketRates.mockReturnValue({ rows: [], loading: true });
            useBuySellForm.mockReturnValue(createMockBuySellForm());

            const { asFragment } = renderWithProvider(<BuySell />);

            expect(asFragment()).toMatchSnapshot();
        });

        it('matches snapshot when form is submitting', () => {
            useMarketRates.mockReturnValue({ rows: [], loading: false });
            useBuySellForm.mockReturnValue(createMockBuySellForm({ loading: true }));

            const { asFragment } = renderWithProvider(<BuySell />);

            expect(asFragment()).toMatchSnapshot();
        });
    });

    describe('Invalid Currency States', () => {
        it('renders invalid currency error when currency is invalid (unit)', () => {
            mockUseSearchParams.mockReturnValue([new URLSearchParams('currency=INVALID')]);
            useMarketRates.mockReturnValue({ rows: [], loading: false });
            useBuySellForm.mockReturnValue(createMockBuySellForm({
                form: { currency: 'INVALID', transactionType: 'buy', amount: null }
            }));

            renderWithProvider(<BuySell />);

            expect(screen.getByText('Invalid Currency')).toBeInTheDocument();
            expect(screen.getByText('The selected currency is not available.')).toBeInTheDocument();
            expect(screen.getByText('Back to Market')).toBeInTheDocument();
        });

        it('matches snapshot when invalid currency', () => {
            mockUseSearchParams.mockReturnValue([new URLSearchParams('currency=INVALID')]);
            useMarketRates.mockReturnValue({ rows: [], loading: false });
            useBuySellForm.mockReturnValue(createMockBuySellForm({
                form: { currency: 'INVALID', transactionType: 'buy', amount: null }
            }));

            const { asFragment } = renderWithProvider(<BuySell />);

            expect(asFragment()).toMatchSnapshot();
        });

        it('invalid currency error button navigates to market page when clicked', () => {
            mockUseSearchParams.mockReturnValue([new URLSearchParams('currency=XYZ')]);
            useMarketRates.mockReturnValue({ rows: [], loading: false });
            useBuySellForm.mockReturnValue(createMockBuySellForm({
                form: { currency: 'XYZ', transactionType: 'buy', amount: null },
                navigate: mockNavigate,
                marketRows: [],
            }));

            renderWithProvider(<BuySell />);

            expect(screen.getByText('Invalid Currency')).toBeInTheDocument();
            expect(screen.getByText('The selected currency is not available.')).toBeInTheDocument();

            const backButton = screen.getByTestId('button');
            expect(backButton).toBeInTheDocument();

            fireEvent.click(backButton);

            expect(mockNavigate).toHaveBeenCalledWith('/market');
        });
    });

    describe('Valid Form States', () => {
        it('renders main form when currency is valid and not loading (unit)', () => {
            const mockSetForm = jest.fn();
            const mockNavigate = jest.fn();

            useMarketRates.mockReturnValue({ rows: mockMarketRows, loading: false });
            useBuySellForm.mockReturnValue(createMockBuySellForm({
                setForm: mockSetForm,
                navigate: mockNavigate,
            }));

            renderWithProvider(<BuySell />);

            expect(screen.getByText('Buy/Sell Currency')).toBeInTheDocument();
            expect(screen.getByText('Complete your transaction')).toBeInTheDocument();
            expect(screen.getByText('Transaction Type')).toBeInTheDocument();
            expect(screen.getByText('Buy')).toBeInTheDocument();
            expect(screen.getByText('Sell')).toBeInTheDocument();
            expect(screen.getByText('Amount (IDR)')).toBeInTheDocument();
            expect(screen.getByText('Confirm Transaction')).toBeInTheDocument();
        });

        it('matches snapshot when valid currency and not loading', () => {
            useMarketRates.mockReturnValue({ rows: mockMarketRows, loading: false });
            useBuySellForm.mockReturnValue(createMockBuySellForm());

            const { asFragment } = renderWithProvider(<BuySell />);

            expect(asFragment()).toMatchSnapshot();
        });
    });

    describe('Transaction Summary', () => {
        it('displays transaction summary when amount is entered (unit)', () => {
            useMarketRates.mockReturnValue({ rows: mockMarketRows, loading: false });
            useBuySellForm.mockReturnValue(createMockBuySellForm({
                form: { currency: 'USD', transactionType: 'buy', amount: 15000 }
            }));

            renderWithProvider(<BuySell />);

            expect(screen.getByText('Total (USD):')).toBeInTheDocument();
            expect(screen.getByText('$1')).toBeInTheDocument();
        });

        it('sell transaction shows correct total calculation', () => {
            useMarketRates.mockReturnValue({ rows: mockMarketRows, loading: false });
            useBuySellForm.mockReturnValue(createMockBuySellForm({
                form: { currency: 'USD', transactionType: 'sell', amount: 10 }
            }));

            renderWithProvider(<BuySell />);

            expect(screen.getByText('Total (IDR):')).toBeInTheDocument();
            expect(screen.getByText('Rp 150.000')).toBeInTheDocument();
        });

        it('non-USD currency shows correct total calculation', () => {
            mockUseSearchParams.mockReturnValue([new URLSearchParams('currency=EUR')]);
            useMarketRates.mockReturnValue({ rows: mockEurMarketRows, loading: false });
            useBuySellForm.mockReturnValue(createMockBuySellForm({
                form: { currency: 'EUR', transactionType: 'buy', amount: 15000 }
            }));

            renderWithProvider(<BuySell />);

            expect(screen.getByText('Total (EUR):')).toBeInTheDocument();
            expect(screen.getByText('1')).toBeInTheDocument();
        });

        it('transaction summary returns null when currency rate is not found', () => {
            useMarketRates.mockReturnValue({ rows: mockEurMarketRows, loading: false });
            useBuySellForm.mockReturnValue(createMockBuySellForm({
                form: { currency: 'USD', transactionType: 'buy', amount: 15000 }
            }));

            renderWithProvider(<BuySell />);

            expect(screen.queryByText('Total (USD):')).not.toBeInTheDocument();
        });
    });

    describe('User Interactions', () => {
        it('displays correct currency label based on transaction type (unit)', () => {
            useMarketRates.mockReturnValue({ rows: mockMarketRows, loading: false });
            useBuySellForm.mockReturnValue(createMockBuySellForm());

            renderWithProvider(<BuySell />);

            expect(screen.getByText('Amount (IDR)')).toBeInTheDocument();

            useBuySellForm.mockReturnValue(createMockBuySellForm({
                form: { currency: 'USD', transactionType: 'sell', amount: null }
            }));

            renderWithProvider(<BuySell />);

            expect(screen.getByText('Amount (USD)')).toBeInTheDocument();
        });

        it('Buy/Sell buttons change transaction type when clicked', () => {
            useMarketRates.mockReturnValue({ rows: mockMarketRows, loading: false });
            const mockSetForm = jest.fn();
            useBuySellForm.mockReturnValue(createMockBuySellForm({
                setForm: mockSetForm,
            }));

            renderWithProvider(<BuySell />);

            const buyButton = screen.getByText('Buy');
            const sellButton = screen.getByText('Sell');

            fireEvent.click(buyButton);

            fireEvent.click(sellButton);

            expect(mockSetForm).toHaveBeenCalledWith({ currency: 'USD', transactionType: 'buy', amount: null });
            expect(mockSetForm).toHaveBeenCalledWith({ currency: 'USD', transactionType: 'sell', amount: null });
        });

        it('back button calls window.history.back when clicked', () => {
            useMarketRates.mockReturnValue({ rows: mockMarketRows, loading: false });
            useBuySellForm.mockReturnValue(createMockBuySellForm());

            const mockHistoryBack = jest.fn();
            Object.defineProperty(window, 'history', {
                value: { back: mockHistoryBack },
                writable: true
            });

            renderWithProvider(<BuySell />);

            const backButton = screen.getByText('Back to Market');

            fireEvent.click(backButton);

            expect(mockHistoryBack).toHaveBeenCalled();
        });

        it('amount input updates form state when user types', () => {
            useMarketRates.mockReturnValue({ rows: mockMarketRows, loading: false });
            const mockSetForm = jest.fn();
            useBuySellForm.mockReturnValue(createMockBuySellForm({
                setForm: mockSetForm,
            }));

            renderWithProvider(<BuySell />);

            const amountInput = screen.getByTestId('input-amount');

            fireEvent.change(amountInput, { target: { value: '5000' } });

            expect(mockSetForm).toHaveBeenCalledWith({ currency: 'USD', transactionType: 'buy', amount: 5000 });
        });
    });

    describe('SubmitButton', () => {
        it('renders correctly based on loading state', () => {
            const { rerender } = render(<SubmitButton loading={true} />);

            const loadingSpinner = screen.getByTestId('loading-spinner');
            expect(loadingSpinner).toBeInTheDocument();
            expect(loadingSpinner).toHaveAttribute('data-variant', 'inline');
            expect(screen.queryByText('Confirm Transaction')).not.toBeInTheDocument();

            rerender(<SubmitButton loading={false} />);

            expect(screen.getByText('Confirm Transaction')).toBeInTheDocument();
            expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
        });
    });
}); 