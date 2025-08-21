import { renderHook, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { useHistoryData } from './historyHandler';

// Mock fetch globally
global.fetch = jest.fn();

const mockStore = configureStore({
    reducer: {
        auth: (state = { token: 'mock-token' }) => state
    }
});

const mockStoreWithoutToken = configureStore({
    reducer: {
        auth: (state = { token: null }) => state
    }
});

const renderHookWithProvider = (store = mockStore) => {
    return renderHook(() => useHistoryData(), {
        wrapper: ({ children }) => (
            <Provider store={store}>
                {children}
            </Provider>
        )
    });
};

describe('useHistoryData Hook - Unit Tests', () => {
    beforeEach(() => {
        fetch.mockClear();
        // Suppress console.error for cleaner test output
        jest.spyOn(console, 'error').mockImplementation(() => { });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('should initialize with correct default state', () => {
        const { result } = renderHookWithProvider();

        expect(result.current).toMatchSnapshot();
        expect(result.current.transactions).toEqual([]);
        expect(result.current.loading).toBe(true);
        expect(result.current.error).toBe(null);
    });

    test('should handle missing authentication token', async () => {
        const { result } = renderHookWithProvider(mockStoreWithoutToken);

        await waitFor(() => {
            expect(result.current.error).toBe('No authentication token');
            expect(result.current.loading).toBe(false);
            expect(result.current.transactions).toEqual([]);
        });

        expect(result.current).toMatchSnapshot();
    });

    test('should handle successful data fetch', async () => {
        const mockTransactions = [
            {
                _id: '1',
                date: '2025-07-31T03:27:24.277+00:00',
                currency: 'JPY',
                amount: 908.4886264888182,
                balance: 4440.368852153083
            }
        ];

        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ balanceHistory: mockTransactions })
        });

        const { result } = renderHookWithProvider();

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.transactions).toEqual(mockTransactions);
        expect(result.current.error).toBe(null);
        expect(result.current).toMatchSnapshot();
    });

    test('should handle fetch error', async () => {
        fetch.mockRejectedValueOnce(new Error('Network error'));

        const { result } = renderHookWithProvider();

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.transactions).toEqual([]);
        expect(result.current.error).toBe('Network error');
        expect(result.current).toMatchSnapshot();
    });

    test('should handle HTTP error response', async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
            status: 401
        });

        const { result } = renderHookWithProvider();

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.transactions).toEqual([]);
        expect(result.current.error).toBe('HTTP error! status: 401');
        expect(result.current).toMatchSnapshot();
    });

    test('should handle empty balanceHistory response', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ balanceHistory: [] })
        });

        const { result } = renderHookWithProvider();

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.transactions).toEqual([]);
        expect(result.current.error).toBe(null);
        expect(result.current).toMatchSnapshot();
    });

    test('should handle missing balanceHistory in response', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({})
        });

        const { result } = renderHookWithProvider();

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.transactions).toEqual([]);
        expect(result.current.error).toBe(null);
        expect(result.current).toMatchSnapshot();
    });

    test('should make correct API call with authentication', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ balanceHistory: [] })
        });

        renderHookWithProvider();

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith('http://localhost:5001/api/users/history', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer mock-token'
                }
            });
        });
    });
}); 