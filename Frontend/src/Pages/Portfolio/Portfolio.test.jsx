import React from 'react';
import { render, screen } from '@testing-library/react';
import Portfolio, {
    PortfolioContent,
    PortfolioContentWrapper,
    PortfolioCardLayout,
} from './Portfolio.jsx';

const originalToLocaleString = Number.prototype.toLocaleString;
beforeAll(() => {
    Number.prototype.toLocaleString = function (locale, opts) {
        return originalToLocaleString.call(this, 'id-ID', opts);
    };
});
afterAll(() => {
    Number.prototype.toLocaleString = originalToLocaleString;
});

jest.mock('../../components/Profile/Sidebar', () => ({
    Sidebar: () => <div data-testid="sidebar">Sidebar</div>,
}));

jest.mock('../../components/Profile/Header/HeaderAntd.jsx', () => ({
    __esModule: true,
    default: (props) => (
        <div data-testid="header">
            HeaderAntd {JSON.stringify(!!props && typeof props === 'object')}
        </div>
    ),
}));

jest.mock('../../components/common/LoadingSpinner/LoadingSpinner', () => ({
    __esModule: true,
    default: () => <div data-testid="spinner">LoadingSpinner</div>,
}));

jest.mock('../../components/Background/Background', () => ({
    __esModule: true,
    default: ({ children }) => <div data-testid="bg">{children}</div>,
}));

jest.mock('react-chartjs-2', () => ({
    Pie: () => <div data-testid="pie">PieChart</div>,
}));

jest.mock('./Portfolio.type.js', () => ({
    PortfolioContentProps: {},
    PortfolioCardLayoutProps: {},
    PortfolioContentWrapperProps: {},
}));

const mockUsePortfolioData = jest.fn();
const mockGenerateChartData = jest.fn(() => ({
    labels: ['USD', 'EUR'],
    datasets: [{ data: [10000, 5000] }],
}));
const mockGenerateChartOptions = jest.fn(() => ({}));

jest.mock('./portfolioHandler.jsx', () => ({
    usePortfolioData: (...args) => mockUsePortfolioData(...args),
    generateChartData: (...args) => mockGenerateChartData(...args),
    generateChartOptions: (...args) => mockGenerateChartOptions(...args),
}));

const mockUseHeaderProfile = jest.fn();
jest.mock('../../components/Profile/Header/headerAntdHandler.jsx', () => ({
    useHeaderProfile: (...args) => mockUseHeaderProfile(...args),
}));

describe('PortfolioContent branches', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('uses 0 total and calls generateChartData([]) when idrBalances is undefined', () => {
        const props = { idrBalances: undefined, marketLoading: false };

        render(<PortfolioContent {...props} />);

        expect(screen.getByTestId('no-data')).toBeInTheDocument();
        expect(mockGenerateChartData).toHaveBeenCalledTimes(1);
        expect(mockGenerateChartData).toHaveBeenCalledWith([]);
    });

    test('sums using 0 for items without idrValue', () => {
        const idrBalances = [{ name: 'NoVal' }, { idrValue: 2000, name: 'WithVal' }];
        const props = { idrBalances, marketLoading: false };

        render(<PortfolioContent {...props} />);

        expect(screen.getByTestId('total-idr')).toHaveTextContent('Rp 2.000,00');
        expect(mockGenerateChartData).toHaveBeenCalledWith(idrBalances);
    });
});

describe('PortfolioContent snapshots', () => {
    test('renders ChartLoading when marketLoading is true', () => {
        const props = { idrBalances: [{ idrValue: 1000, name: 'USD' }], marketLoading: true };

        const { container } = render(<PortfolioContent {...props} />);

        expect(container).toMatchSnapshot();
    });

    test('renders EmptyPortfolioState when idrBalances is empty', () => {
        const props = { idrBalances: [], marketLoading: false };

        const { container } = render(<PortfolioContent {...props} />);

        expect(container).toMatchSnapshot();
    });

    test('renders portfolio summary and pie chart when data present', () => {
        const props = {
            idrBalances: [
                { idrValue: 10000, name: 'US Dollar', currency: 'USD' },
                { idrValue: 5000, name: 'Euro', currency: 'EUR' },
            ],
            marketLoading: false,
        };

        const { container } = render(<PortfolioContent {...props} />);

        expect(container).toMatchSnapshot();
    });
});

describe('PortfolioContentWrapper snapshots', () => {
    test('renders PortfolioLoading when loading is true', () => {
        const props = {
            loading: true,
            idrBalances: [],
            marketLoading: true,
            headerProfile: { username: 'alice', balance: 0 },
            activeNav: 'Portfolio',
            setActiveNav: () => { },
        };

        const { container } = render(<PortfolioContentWrapper {...props} />);

        expect(container).toMatchSnapshot();
    });

    test('renders PortfolioCardLayout when loading is false', () => {
        const props = {
            loading: false,
            idrBalances: [{ idrValue: 12345, name: 'US Dollar', currency: 'USD' }],
            marketLoading: false,
            headerProfile: { username: 'alice', balance: 100000 },
            activeNav: 'Portfolio',
            setActiveNav: () => { },
        };

        const { container } = render(<PortfolioContentWrapper {...props} />);

        expect(container).toMatchSnapshot();
    });
});

describe('PortfolioCardLayout snapshots', () => {
    test('renders full card layout with sidebar, header, content, and background', () => {
        const props = {
            headerProfile: { username: 'bob', balance: 50000 },
            idrBalances: [{ idrValue: 20000, name: 'US Dollar', currency: 'USD' }],
            marketLoading: false,
            activeNav: 'Portfolio',
            setActiveNav: () => { },
        };

        const { container } = render(<PortfolioCardLayout {...props} />);

        expect(container).toMatchSnapshot();
    });
});

describe('Portfolio page snapshots', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders page-level loading state (PortfolioLoading) from usePortfolioData', () => {
        mockUsePortfolioData.mockReturnValue({
            portfolioData: { balances: [] },
            idrBalances: [],
            loading: true,
        });
        mockUseHeaderProfile.mockReturnValue({ username: 'carol', balance: 0 });

        const { container } = render(<Portfolio />);

        expect(container).toMatchSnapshot();
    });

    test('renders full content when usePortfolioData returns data', () => {
        mockUsePortfolioData.mockReturnValue({
            portfolioData: { balances: [{ currency: 'USD', amount: 1 }] },
            idrBalances: [
                { idrValue: 7000, name: 'US Dollar', currency: 'USD' },
                { idrValue: 3000, name: 'Euro', currency: 'EUR' },
            ],
            loading: false,
        });
        mockUseHeaderProfile.mockReturnValue({ username: 'dana', balance: 123456 });

        const { container } = render(<Portfolio />);

        expect(container).toMatchSnapshot();
    });
});
