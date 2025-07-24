import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Market from './Market.jsx';

jest.mock('./marketHandler', () => ({
    useMarketRates: jest.fn(),
}));
jest.mock('../../components/Profile/Header/headerAntdHandler.jsx', () => ({
    useHeaderProfile: jest.fn(),
}));
jest.mock('../../components/Profile/Sidebar/Sidebar', () => (props) => (
    <div data-testid="sidebar" onClick={() => props.onSelect('Dashboard')}>Sidebar</div>
));
jest.mock('../../components/Profile/Header/HeaderAntd.jsx', () => (props) => (
    <div data-testid="header">{props.username} - {props.balance}</div>
));

const { useMarketRates } = require('./marketHandler');
const { useHeaderProfile } = require('../../components/Profile/Header/headerAntdHandler.jsx');

describe('Market (unit and snapshot)', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders loading spinner when loading (unit)', () => {
        useMarketRates.mockReturnValue({ rows: [], loading: true });
        useHeaderProfile.mockReturnValue({ username: 'user', balance: 100 });

        render(<Market />);

        expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('renders main layout when not loading (unit)', () => {
        useMarketRates.mockReturnValue({ rows: [{ code: 'USD', flag: 'test-flag.png', name: 'US Dollar', change: 1, idrValue: 1 }], loading: false });
        useHeaderProfile.mockReturnValue({ username: 'user', balance: 100 });

        render(<Market />);

        expect(screen.getByTestId('header')).toHaveTextContent('user - 100');
        expect(screen.getByTestId('sidebar')).toBeInTheDocument();
        expect(screen.getByText('CCY')).toBeInTheDocument();
        expect(screen.getByText('Transaction')).toBeInTheDocument();
    });

    it('matches snapshot when loading', () => {
        useMarketRates.mockReturnValue({ rows: [], loading: true });
        useHeaderProfile.mockReturnValue({ username: 'user', balance: 100 });

        const { asFragment } = render(<Market />);

        expect(asFragment()).toMatchSnapshot();
    });

    it('matches snapshot when loaded', () => {
        useMarketRates.mockReturnValue({ rows: [{ code: 'USD', flag: 'test-flag.png', name: 'US Dollar', change: 1, idrValue: 1 }], loading: false });
        useHeaderProfile.mockReturnValue({ username: 'user', balance: 100 });

        const { asFragment } = render(<Market />);

        expect(asFragment()).toMatchSnapshot();
    });

    it('renders "No data" message when rows is empty and not loading', () => {
        useMarketRates.mockReturnValue({ rows: [], loading: false });
        useHeaderProfile.mockReturnValue({ username: 'user', balance: 100 });

        render(<Market />);

        expect(screen.getByText('No data')).toBeInTheDocument();
    });

    it('Buy/Sell button changes style on hover', () => {
        useMarketRates.mockReturnValue({ rows: [{ code: 'USD', flag: 'test-flag.png', name: 'US Dollar', change: 1, idrValue: 1 }], loading: false });
        useHeaderProfile.mockReturnValue({ username: 'user', balance: 100 });

        render(<Market />);
        const button = screen.getByRole('button', { name: /buy\/sell/i });
        const initialStyle = button.style.backgroundColor;
        fireEvent.mouseEnter(button);
        const hoverStyle = button.style.backgroundColor;
        fireEvent.mouseLeave(button);
        const afterLeaveStyle = button.style.backgroundColor;

        expect(initialStyle).not.toBe(hoverStyle);
        expect(afterLeaveStyle).toBe(initialStyle);
    });

    it('renders positive change with green color and plus sign', () => {
        useMarketRates.mockReturnValue({
            rows: [{ code: 'USD', flag: 'test-flag.png', name: 'US Dollar', change: 1.2345, idrValue: 10000 }],
            loading: false
        });
        useHeaderProfile.mockReturnValue({ username: 'user', balance: 100 });

        render(<Market />);
        const tds = screen.getAllByRole('cell');
        const match = tds.find(td => {
            const text = td.textContent.replace(/\s+/g, '');
            return text.includes('+1.2345') && text.includes('(10.000)');
        });

        expect(match).toBeDefined();
        expect(match.style.color).toBe('rgb(5, 150, 105)');
    });

    it('renders negative change with red color and no plus sign', () => {
        useMarketRates.mockReturnValue({
            rows: [{ code: 'USD', flag: 'test-flag.png', name: 'US Dollar', change: -2.3456, idrValue: 9000 }],
            loading: false
        });
        useHeaderProfile.mockReturnValue({ username: 'user', balance: 100 });

        render(<Market />);
        const tds = screen.getAllByRole('cell');
        const match = tds.find(td => {
            const text = td.textContent.replace(/\s+/g, '');
            return text.includes('-2.3456') && text.includes('(9.000)');
        });

        expect(match).toBeDefined();
        expect(match.style.color).toBe('rgb(220, 38, 38)');
    });
}); 