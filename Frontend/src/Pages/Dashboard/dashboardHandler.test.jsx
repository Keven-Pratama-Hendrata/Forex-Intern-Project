import { fetchIdrHistory, handleLogout } from './dashboardHandler.jsx';
import { logout } from '../../store/slices/authSlice.js';
import { renderHook } from '@testing-library/react';
import { useDashboardData, useIdrMarketChartData } from './dashboardHandler.jsx';

const DASHBOARD_ERROR_MESSAGES = {
    FETCH_HISTORY_FAILED: 'Failed to fetch history',
    GENERIC: 'Something went wrong',
};

global.fetch = jest.fn();

jest.mock('../../store/slices/authSlice', () => ({
    logout: jest.fn(() => ({ type: 'LOGOUT' })),
}));

jest.mock('react-redux', () => ({
    useDispatch: () => jest.fn(),
}));
jest.mock('react-router-dom', () => ({
    useNavigate: () => jest.fn(),
}));

const flushPromises = () => new Promise(resolve => setTimeout(resolve, 0));

describe('fetchIdrHistory', () => {
    it('calls setError and setLoading in catch block (covers error case)', async () => {
        const setIdrHistory = jest.fn();
        const setError = jest.fn();
        const setLoading = jest.fn();
        fetch.mockImplementationOnce(() => Promise.reject(new Error('Network error')));

        await fetchIdrHistory(setIdrHistory, setError, setLoading);

        expect(setLoading).toHaveBeenCalledWith(true);
        expect(setError).toHaveBeenCalledWith('Network error');
        expect(setLoading).toHaveBeenLastCalledWith(false);
    });

    it('calls setError with generic message if error has no message', async () => {
        const setIdrHistory = jest.fn();
        const setError = jest.fn();
        const setLoading = jest.fn();
        fetch.mockImplementationOnce(() => Promise.reject({}));

        await fetchIdrHistory(setIdrHistory, setError, setLoading);

        expect(setError).toHaveBeenCalledWith('Error fetching IDR history');
        expect(setLoading).toHaveBeenLastCalledWith(false);
    });
});

describe('handleLogout', () => {
    it('dispatches logout and navigates to /login', () => {
        const dispatch = jest.fn();
        const navigate = jest.fn();

        handleLogout(dispatch, navigate);

        expect(dispatch).toHaveBeenCalledWith(logout());
        expect(navigate).toHaveBeenCalledWith('/login');
    });
});

describe('fetchChartHistory', () => {
    it('sets null in data array if entry.rates or entry.rates.IDR is missing', async () => {
        const { fetchChartHistory } = await import('./dashboardHandler.jsx');
        const setChartData = jest.fn();
        const setLoading = jest.fn();
        const mockHistory = [
            { date: '2023-01-01', rates: { IDR: 15000 } },
            { date: '2023-01-02', rates: {} },
            { date: '2023-01-03' },
        ];
        global.fetch.mockImplementationOnce(() => Promise.resolve({ json: () => Promise.resolve(mockHistory) }));

        fetchChartHistory(setChartData, setLoading);
        await flushPromises();

        expect(setChartData).toHaveBeenCalledWith({
            labels: [
                new Date('2023-01-01').toLocaleDateString(),
                new Date('2023-01-02').toLocaleDateString(),
                new Date('2023-01-03').toLocaleDateString(),
            ],
            data: [15000, null, null],
        });
        expect(setLoading).toHaveBeenLastCalledWith(false);
    });
});

describe('useDashboardData', () => {
    it('calls handleLogout when onLogout is invoked', () => {
        const dispatch = jest.fn();
        const navigate = jest.fn();
        jest.spyOn(require('react-redux'), 'useDispatch').mockReturnValue(dispatch);
        jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(navigate);

        const { result } = renderHook(() => useDashboardData());
        result.current.onLogout();

        expect(dispatch).toHaveBeenCalled();
        expect(navigate).toHaveBeenCalledWith('/login');
    });
});

describe('useIdrMarketChartData', () => {
    beforeEach(() => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve([]),
            })
        );
    });
    it('returns initial chart data and loading state', () => {
        const { result } = renderHook(() => useIdrMarketChartData());

        expect(result.current).toHaveProperty('labels');
        expect(result.current).toHaveProperty('data');
        expect(result.current).toHaveProperty('loading', true);
    });
}); 