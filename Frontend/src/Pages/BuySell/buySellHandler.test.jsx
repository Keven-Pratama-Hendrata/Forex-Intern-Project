import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useBuySellForm, handleSubmit, handleAmountKeyDown, handleAmountChange } from './buySellHandler.jsx';
import { API_ROUTES, BUYSELL_MESSAGES, BUYSELL_CONFIG } from '../../data/index.js';

jest.mock('react-hot-toast', () => ({
    error: jest.fn(),
    success: jest.fn()
}));

jest.mock('../../data', () => ({
    API_ROUTES: {
        TRANSACTION: '/api/transaction'
    },
    BUYSELL_MESSAGES: {
        ERROR: {
            INVALID_AMOUNT: 'Invalid amount',
            AUTHENTICATION_REQUIRED: 'Authentication required',
            EXCHANGE_RATE_NOT_AVAILABLE: 'Exchange rate not available',
            TRANSACTION_FAILED: 'Transaction failed'
        },
        SUCCESS: {
            BUY: 'Buy transaction successful',
            SELL: 'Sell transaction successful'
        }
    },
    BUYSELL_CONFIG: {
        MAX_VALUE: 999999999999999,
        ALLOWED_KEYS: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'],
        CTRL_KEYS: ['a', 'c', 'v', 'x']
    }
}));

const createMockStore = (initialState = {}) =>
    configureStore({
        reducer: {
            auth: (state = { token: 'test-token', ...initialState }) => state
        }
    });

const renderHookWithProviders = (hook, options = {}) => {
    const store = createMockStore(options.initialState);
    const wrapper = ({ children }) => (
        <Provider store={store}>
            <MemoryRouter>{children}</MemoryRouter>
        </Provider>
    );
    return renderHook(hook, { wrapper });
};

describe('buySellHandler', () => {
    let originalFetch;

    beforeEach(() => {
        jest.clearAllMocks();
        originalFetch = window.fetch;
        window.fetch = jest.fn();
    });

    afterEach(() => {
        window.fetch = originalFetch;
    });

    describe('useBuySellForm', () => {
        it('initializes with default values', () => {
            const { result } = renderHookWithProviders(() => useBuySellForm('USD', []));

            expect(result.current.form).toEqual({
                currency: 'USD',
                transactionType: 'buy',
                amount: null
            });
            expect(result.current.loading).toBe(false);
            expect(result.current.token).toBe('test-token');
            expect(result.current.marketRows).toEqual([]);
        });

        it('initializes with empty currency when not provided', () => {
            const { result } = renderHookWithProviders(() => useBuySellForm(null, []));

            expect(result.current.form.currency).toBe('');
        });

        it('provides setForm function', () => {
            const { result } = renderHookWithProviders(() => useBuySellForm('USD', []));

            expect(typeof result.current.setForm).toBe('function');
        });

        it('provides setLoading function', () => {
            const { result } = renderHookWithProviders(() => useBuySellForm('USD', []));

            expect(typeof result.current.setLoading).toBe('function');
        });

        it('provides navigate function', () => {
            const { result } = renderHookWithProviders(() => useBuySellForm('USD', []));

            expect(typeof result.current.navigate).toBe('function');
        });
    });

    describe('handleAmountKeyDown', () => {
        it('allows numeric keys', () => {
            const event = {
                key: '5',
                ctrlKey: false,
                preventDefault: jest.fn()
            };

            handleAmountKeyDown(event);

            expect(event.preventDefault).not.toHaveBeenCalled();
        });

        it('allows decimal point', () => {
            const event = {
                key: '.',
                ctrlKey: false,
                preventDefault: jest.fn()
            };

            handleAmountKeyDown(event);

            expect(event.preventDefault).not.toHaveBeenCalled();
        });

        it('prevents non-numeric keys', () => {
            const event = {
                key: 'a',
                ctrlKey: false,
                preventDefault: jest.fn()
            };

            handleAmountKeyDown(event);

            expect(event.preventDefault).toHaveBeenCalled();
        });

        it('allows ctrl key combinations', () => {
            const event = {
                key: 'c',
                ctrlKey: true,
                preventDefault: jest.fn()
            };

            handleAmountKeyDown(event);

            expect(event.preventDefault).not.toHaveBeenCalled();
        });

        it('prevents non-allowed ctrl key combinations', () => {
            const event = {
                key: 'z',
                ctrlKey: true,
                preventDefault: jest.fn()
            };

            handleAmountKeyDown(event);

            expect(event.preventDefault).toHaveBeenCalled();
        });
    });

    describe('handleAmountChange', () => {
        it('sets null for empty input', () => {
            const onChange = jest.fn();
            const event = { target: { value: '' } };

            handleAmountChange(event, onChange);

            expect(onChange).toHaveBeenCalledWith(null);
        });

        it('sets parsed number for valid input', () => {
            const onChange = jest.fn();
            const event = { target: { value: '123.45' } };

            handleAmountChange(event, onChange);

            expect(onChange).toHaveBeenCalledWith(123.45);
        });

        it('caps value at maximum', () => {
            const onChange = jest.fn();
            const event = { target: { value: '9999999999999999' } };

            handleAmountChange(event, onChange);

            expect(onChange).toHaveBeenCalledWith(BUYSELL_CONFIG.MAX_VALUE);
        });

        it('ignores negative values', () => {
            const onChange = jest.fn();
            const event = { target: { value: '-123' } };

            handleAmountChange(event, onChange);

            expect(onChange).not.toHaveBeenCalled();
        });

        it('ignores invalid numeric input', () => {
            const onChange = jest.fn();
            const event = { target: { value: 'abc' } };

            handleAmountChange(event, onChange);

            expect(onChange).not.toHaveBeenCalled();
        });
    });

    describe('handleSubmit', () => {
        const mockForm = {
            currency: 'USD',
            transactionType: 'buy',
            amount: 1000
        };

        const mockMarketRows = [
            { code: 'USD', idrValue: 15000 }
        ];

        const mockSetLoading = jest.fn();
        const mockNavigate = jest.fn();
        const mockToken = 'test-token';

        beforeEach(() => {
            jest.clearAllMocks();
        });

        it('prevents default form submission', async () => {
            const event = { preventDefault: jest.fn() };
            const submitHandler = handleSubmit(mockForm, mockSetLoading, mockNavigate, mockToken, mockMarketRows);

            window.fetch.mockResolvedValue({
                ok: true,
                json: () => Promise.resolve({ success: true })
            });

            await act(async () => {
                await submitHandler(event);
            });

            expect(event.preventDefault).toHaveBeenCalled();
        });

        it('handles form submission without event', async () => {
            const submitHandler = handleSubmit(mockForm, mockSetLoading, mockNavigate, mockToken, mockMarketRows);

            window.fetch.mockResolvedValue({
                ok: true,
                json: () => Promise.resolve({ success: true })
            });

            await act(async () => {
                await submitHandler();
            });

            expect(window.fetch).toHaveBeenCalled();
        });

        it('validates form amount before submission', async () => {
            const invalidForm = { ...mockForm, amount: 0 };
            const submitHandler = handleSubmit(invalidForm, mockSetLoading, mockNavigate, mockToken, mockMarketRows);

            await act(async () => {
                await submitHandler();
            });

            expect(toast.error).toHaveBeenCalledWith(BUYSELL_MESSAGES.ERROR.INVALID_AMOUNT);
            expect(window.fetch).not.toHaveBeenCalled();
        });

        it('validates authentication before submission', async () => {
            const submitHandler = handleSubmit(mockForm, mockSetLoading, mockNavigate, null, mockMarketRows);

            await act(async () => {
                await submitHandler();
            });

            expect(toast.error).toHaveBeenCalledWith(BUYSELL_MESSAGES.ERROR.AUTHENTICATION_REQUIRED);
            expect(mockNavigate).toHaveBeenCalledWith('/login');
            expect(window.fetch).not.toHaveBeenCalled();
        });

        it('makes successful API call', async () => {
            const submitHandler = handleSubmit(mockForm, mockSetLoading, mockNavigate, mockToken, mockMarketRows);

            window.fetch.mockResolvedValue({
                ok: true,
                json: () => Promise.resolve({ success: true })
            });

            await act(async () => {
                await submitHandler();
            });

            expect(window.fetch).toHaveBeenCalledWith(API_ROUTES.TRANSACTION, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${mockToken}`
                },
                body: JSON.stringify({
                    currency: mockForm.currency,
                    amount: mockForm.amount,
                    transactionType: mockForm.transactionType,
                    exchangeRate: 15000
                })
            });
        });

        it('shows success toast for buy transaction', async () => {
            const submitHandler = handleSubmit(mockForm, mockSetLoading, mockNavigate, mockToken, mockMarketRows);

            window.fetch.mockResolvedValue({
                ok: true,
                json: () => Promise.resolve({ success: true })
            });

            await act(async () => {
                await submitHandler();
            });

            expect(toast.success).toHaveBeenCalledWith(BUYSELL_MESSAGES.SUCCESS.BUY);
            expect(mockNavigate).toHaveBeenCalledWith('/market');
        });

        it('shows success toast for sell transaction', async () => {
            const sellForm = { ...mockForm, transactionType: 'sell' };
            const submitHandler = handleSubmit(sellForm, mockSetLoading, mockNavigate, mockToken, mockMarketRows);

            window.fetch.mockResolvedValue({
                ok: true,
                json: () => Promise.resolve({ success: true })
            });

            await act(async () => {
                await submitHandler();
            });

            expect(toast.success).toHaveBeenCalledWith(BUYSELL_MESSAGES.SUCCESS.SELL);
        });

        it('handles API error response with custom message', async () => {
            const submitHandler = handleSubmit(mockForm, mockSetLoading, mockNavigate, mockToken, mockMarketRows);

            window.fetch.mockResolvedValue({
                ok: false,
                json: () => Promise.resolve({ message: 'API Error' })
            });

            await act(async () => {
                await submitHandler();
            });

            expect(toast.error).toHaveBeenCalledWith('API Error');
        });

        it('handles API error response with fallback message', async () => {
            const submitHandler = handleSubmit(mockForm, mockSetLoading, mockNavigate, mockToken, mockMarketRows);

            window.fetch.mockResolvedValue({
                ok: false,
                json: () => Promise.resolve({})
            });

            await act(async () => {
                await submitHandler();
            });

            expect(toast.error).toHaveBeenCalledWith(BUYSELL_MESSAGES.ERROR.TRANSACTION_FAILED);
        });

        it('handles network error with error message', async () => {
            const submitHandler = handleSubmit(mockForm, mockSetLoading, mockNavigate, mockToken, mockMarketRows);

            window.fetch.mockRejectedValue(new Error('Network error'));

            await act(async () => {
                await submitHandler();
            });

            expect(toast.error).toHaveBeenCalledWith('Network error');
        });

        it('handles network error with fallback message', async () => {
            const submitHandler = handleSubmit(mockForm, mockSetLoading, mockNavigate, mockToken, mockMarketRows);

            window.fetch.mockRejectedValue(new Error());

            await act(async () => {
                await submitHandler();
            });

            expect(toast.error).toHaveBeenCalledWith(BUYSELL_MESSAGES.ERROR.TRANSACTION_FAILED);
        });

        it('sets loading state during transaction', async () => {
            const submitHandler = handleSubmit(mockForm, mockSetLoading, mockNavigate, mockToken, mockMarketRows);

            window.fetch.mockResolvedValue({
                ok: true,
                json: () => Promise.resolve({ success: true })
            });

            await act(async () => {
                await submitHandler();
            });

            expect(mockSetLoading).toHaveBeenCalledWith(true);
            expect(mockSetLoading).toHaveBeenCalledWith(false);
        });

        it('sets loading to false even on error', async () => {
            const submitHandler = handleSubmit(mockForm, mockSetLoading, mockNavigate, mockToken, mockMarketRows);

            window.fetch.mockRejectedValue(new Error('Network error'));

            await act(async () => {
                await submitHandler();
            });

            expect(mockSetLoading).toHaveBeenCalledWith(false);
        });

        it('throws error when currency rate not found', async () => {
            const submitHandler = handleSubmit(mockForm, mockSetLoading, mockNavigate, mockToken, []);

            await act(async () => {
                await submitHandler();
            });

            expect(toast.error).toHaveBeenCalledWith(BUYSELL_MESSAGES.ERROR.EXCHANGE_RATE_NOT_AVAILABLE);
        });
    });
}); 