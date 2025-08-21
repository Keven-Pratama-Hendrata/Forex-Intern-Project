import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import History from './History';
import { useHistoryData } from './historyHandler';
import { useHeaderProfile, useHeaderLogout, useLogoutHover } from '../../components/Profile/Header/headerAntdHandler';

jest.mock('./historyHandler');
jest.mock('../../components/Profile/Header/headerAntdHandler');

const mockStore = configureStore({
    reducer: {
        auth: (state = { token: 'mock-token' }) => state
    }
});

const mockTransactions = [
    {
        _id: '1',
        date: '2025-07-31T03:27:24.277+00:00',
        currency: 'JPY',
        amount: 908.4886264888182,
        balance: 4440.368852153083
    },
    {
        _id: '2',
        date: '2025-07-31T06:30:11.484+00:00',
        currency: 'IDR',
        amount: 100000,
        balance: 1010329.4824890726
    },
    {
        _id: '3',
        date: '2025-07-31T06:30:11.487+00:00',
        currency: 'JPY',
        amount: -908.4886264888182,
        balance: 3531.880225664265
    }
];

const renderWithProviders = (component) => {
    return render(
        <Provider store={mockStore}>
            <BrowserRouter>
                {component}
            </BrowserRouter>
        </Provider>
    );
};

describe('History Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        useHistoryData.mockReturnValue({
            transactions: mockTransactions,
            loading: false,
            error: null
        });

        useHeaderProfile.mockReturnValue({
            username: 'testuser',
            balance: 1000,
            loading: false
        });

        useHeaderLogout.mockReturnValue(() => { });
        useLogoutHover.mockReturnValue([false, () => { }, () => { }]);
    });

    it('renders history page with transaction data', async () => {
        const { container } = renderWithProviders(<History />);

        await waitFor(() => {
            expect(screen.getByText('Date')).toBeInTheDocument();
            expect(screen.getByText('Currency')).toBeInTheDocument();
            expect(screen.getByText('Amount')).toBeInTheDocument();
            expect(screen.getByText('Balance')).toBeInTheDocument();
        });

        expect(screen.getAllByText('JPY')).toHaveLength(2);
        expect(screen.getByText('IDR')).toBeInTheDocument();
        expect(screen.getByText('+908,4886 JPY')).toBeInTheDocument();
        expect(screen.getByText('+100.000,00 IDR')).toBeInTheDocument();
        expect(screen.getByText('-908,4886 JPY')).toBeInTheDocument();

        expect(container).toMatchSnapshot();
    });

    it('renders loading spinner when data is loading', () => {
        useHistoryData.mockReturnValue({
            transactions: [],
            loading: true,
            error: null
        });

        const { container } = renderWithProviders(<History />);

        expect(screen.getByRole('status')).toBeInTheDocument();
        expect(container).toMatchSnapshot();
    });

    it('renders empty state when no transactions', async () => {
        useHistoryData.mockReturnValue({
            transactions: [],
            loading: false,
            error: null
        });

        const { container } = renderWithProviders(<History />);

        await waitFor(() => {
            expect(screen.getByText('No transaction history found')).toBeInTheDocument();
        });

        expect(container).toMatchSnapshot();
    });

    it('formats dates correctly', async () => {
        const { container } = renderWithProviders(<History />);

        await waitFor(() => {
            expect(screen.getAllByText('Jul 31, 2025')).toHaveLength(3);
        });

        expect(container).toMatchSnapshot();
    });

    it('formats amounts with correct colors', async () => {
        const { container } = renderWithProviders(<History />);

        await waitFor(() => {
            const positiveAmount = screen.getByText('+908,4886 JPY');
            const negativeAmount = screen.getByText('-908,4886 JPY');

            expect(positiveAmount).toHaveStyle({ color: '#059669' });
            expect(negativeAmount).toHaveStyle({ color: '#dc2626' });
        });

        expect(container).toMatchSnapshot();
    });

    it('displays balance with proper formatting', async () => {
        const { container } = renderWithProviders(<History />);

        await waitFor(() => {
            const table = screen.getByRole('table');
            expect(table.textContent).toContain('4.440,3689');
            expect(table.textContent).toContain('1.010.329,4825');
            expect(table.textContent).toContain('3.531,8802');
        });

        expect(container).toMatchSnapshot();
    });

    it('handles mouse hover events on table rows', async () => {
        const { container } = renderWithProviders(<History />);

        await waitFor(() => {
            const tableRows = screen.getAllByRole('row');
            const dataRows = tableRows.slice(1);

            expect(dataRows.length).toBeGreaterThan(0);

            const firstDataRow = dataRows[0];

            fireEvent.mouseEnter(firstDataRow);

            expect(() => {
                fireEvent.mouseEnter(firstDataRow);
            }).not.toThrow();

            fireEvent.mouseLeave(firstDataRow);

            expect(() => {
                fireEvent.mouseLeave(firstDataRow);
            }).not.toThrow();
        });

        expect(container).toMatchSnapshot();
    });

    it('handles hover events on all table rows', async () => {
        const { container } = renderWithProviders(<History />);

        await waitFor(() => {
            const tableRows = screen.getAllByRole('row');
            const dataRows = tableRows.slice(1);

            expect(dataRows.length).toBe(3);

            dataRows.forEach((row) => {
                fireEvent.mouseEnter(row);
                fireEvent.mouseLeave(row);

                expect(() => {
                    fireEvent.mouseEnter(row);
                    fireEvent.mouseLeave(row);
                }).not.toThrow();
            });
        });

        expect(container).toMatchSnapshot();
    });

    it('should match snapshot with error state', () => {
        useHistoryData.mockReturnValue({
            transactions: [],
            loading: false,
            error: 'Failed to load transactions'
        });

        const { container } = renderWithProviders(<History />);
        expect(container).toMatchSnapshot();
    });

    it('should match snapshot with loading state', () => {
        useHistoryData.mockReturnValue({
            transactions: [],
            loading: true,
            error: null
        });

        const { container } = renderWithProviders(<History />);
        expect(container).toMatchSnapshot();
    });

    it('should match snapshot with empty transactions', () => {
        useHistoryData.mockReturnValue({
            transactions: [],
            loading: false,
            error: null
        });

        const { container } = renderWithProviders(<History />);
        expect(container).toMatchSnapshot();
    });
}); 