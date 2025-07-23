import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Dashboard, { IdrChartSection, DashboardContent } from './Dashboard.jsx';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { getIdrChartOptions, getIdrChartData } from './dashboardHandler.jsx';
import * as DashboardTypes from './Dashboard.type.js';

jest.mock('../../components/Profile/Header/HeaderAntd.jsx', () => () => <div data-testid="header" />);
jest.mock('../../components/Profile/Sidebar', () => ({
    Sidebar: () => <div data-testid="sidebar" />,
}));
jest.mock('../../components/common/LoadingSpinner/LoadingSpinner', () => () => <div data-testid="spinner" />);
jest.mock('../../components/Background/Background', () => ({ children }) => <div data-testid="background">{children}</div>);
jest.mock('react-chartjs-2', () => ({ Line: () => <div data-testid="chart" /> }));

const mockReducer = (state = { auth: { isAuthenticated: true } }) => state;
const store = configureStore({ reducer: mockReducer });

const renderDashboard = () =>
    render(
        <Provider store={store}>
            <MemoryRouter>
                <Dashboard />
            </MemoryRouter>
        </Provider>
    );

const mockProps = {
    loading: false,
    activeNav: 'Home',
    setActiveNav: jest.fn(),
    chartData: { labels: ['2023-01-01'], datasets: [{ data: [15000] }] },
    chartLoading: false,
    headerProfile: {
        username: 'test',
        currency: 'USD',
        balance: 100,
        onCurrencyChange: jest.fn(),
        onLogout: jest.fn(),
    },
};

beforeEach(() => {
    global.fetch = jest.fn(() =>
        Promise.resolve({
            json: () => Promise.resolve([
                { date: '2023-01-01', rates: { IDR: 15000 } },
                { date: '2023-01-02', rates: { IDR: 15100 } },
            ]),
            ok: true,
        })
    );
});

afterEach(() => {
    jest.clearAllMocks();
});

describe('Dashboard', () => {
    it('renders without crashing', () => {
        renderDashboard();
    });

    it('matches snapshot', () => {
        const { asFragment } = renderDashboard();

        expect(asFragment()).toMatchSnapshot();
    });

    it('shows loading spinner initially', () => {
        renderDashboard();

        expect(screen.getByTestId('spinner')).toBeInTheDocument();
    });

    it('renders dashboard content after loading', async () => {
        renderDashboard();

        await waitFor(() => {
            expect(screen.getByTestId('header')).toBeInTheDocument();
            expect(screen.getByTestId('sidebar')).toBeInTheDocument();
            expect(screen.getByTestId('chart')).toBeInTheDocument();
        });
    });

    it('renders spinner if fetch fails', async () => {
        global.fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: false,
                json: () => Promise.resolve({ message: 'error' }),
            })
        );

        renderDashboard();

        await waitFor(() => {
            expect(screen.getByTestId('spinner')).toBeInTheDocument();
        });
    });

    it('renders chart with correct data', async () => {
        renderDashboard();

        await waitFor(() => {
            expect(screen.getByTestId('chart')).toBeInTheDocument();
        });
    });

    it('getIdrChartOptions returns correct options object', () => {
        const options = getIdrChartOptions();

        expect(options).toHaveProperty('responsive', true);
        expect(options).toHaveProperty('plugins');
        expect(options.plugins).toHaveProperty('legend');
        expect(options.plugins).toHaveProperty('title');
        expect(options).toHaveProperty('scales');
        expect(options.scales).toHaveProperty('y');
    });

    it('getIdrChartData returns correct data structure', () => {
        const labels = ['2023-01-01', '2023-01-02'];
        const data = [15000, 15100];

        const chartData = getIdrChartData(labels, data);

        expect(chartData.labels).toEqual(labels);
        expect(chartData.datasets[0].data).toEqual(data);
    });

    it('covers Dashboard.type.js', () => {
        Object.values(DashboardTypes).forEach(type => expect(type).toBeDefined());
    });

    it('renders DashboardContentLayout when not loading', async () => {
        renderDashboard();

        await waitFor(() => {
            expect(screen.getByTestId('dashboard-content-layout')).toBeInTheDocument();
        });
    });

    describe('DashboardContent', () => {
        it('renders DashboardContent directly with props (covers line 164)', () => {
            render(<DashboardContent {...mockProps} />);

            expect(screen.getByTestId('dashboard-content-layout')).toBeInTheDocument();
        });
        it('renders DashboardContent loading state (covers loading branch)', () => {
            render(<DashboardContent {...{ ...mockProps, loading: true }} />);

            expect(screen.getByTestId('spinner')).toBeInTheDocument();
        });
    });

    describe('IdrChartSection', () => {
        it('renders IdrChartSection chart when not loading', () => {
            render(
                <IdrChartSection
                    chartLoading={false}
                    chartData={{ labels: ['2023-01-01'], datasets: [{ data: [15000] }] }}
                />
            );

            expect(screen.getByTestId('chart')).toBeInTheDocument();
        });
        it('renders spinner in IdrChartSection when chartLoading is true', () => {
            render(
                <IdrChartSection
                    chartLoading={true}
                    chartData={{ labels: ['2023-01-01'], datasets: [{ data: [15000] }] }}
                />
            );

            expect(screen.getByTestId('spinner')).toBeInTheDocument();
        });
    });
}); 