import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import * as handler from './portfolioHandler';

const {
    generateChartData,
    generateChartOptions,
    convertBalancesToIDR,
    fetchMarketRates,
    fetchProfileData,
    usePortfolioData
} = handler;

jest.mock('../../data/uiData.js', () => ({
    API_ROUTES: {
        HISTORY: '/history',
        PROFILE: '/profile'
    },
    currencyMeta: {
        USD: { name: 'US Dollar' },
        EUR: { name: 'Euro' }
    },
    portfolioCurrencyList: ['USD', 'EUR']
}));

global.fetch = jest.fn();

const originalToLocaleString = Number.prototype.toLocaleString;
beforeAll(() => {
    Number.prototype.toLocaleString = function (_, opts) {
        return originalToLocaleString.call(this, 'en-US', opts);
    };
});
afterAll(() => {
    Number.prototype.toLocaleString = originalToLocaleString;
});

function HookTestComponent() {
    const { loading, idrBalances } = usePortfolioData();
    return (
        <div>
            <span data-testid="loading">{String(loading)}</span>
            <span data-testid="count">{idrBalances.length}</span>
            <span data-testid="idr">{idrBalances[0]?.idrValue ?? ''}</span>
            <span data-testid="name">{idrBalances[0]?.name ?? ''}</span>
        </div>
    );
}

const makeStore = (token = 'mock-token') =>
    configureStore({
        reducer: {
            auth: (state = { token }) => state
        }
    });

const renderWithProvider = (ui, token = 'mock-token') =>
    render(<Provider store={makeStore(token)}>{ui}</Provider>);

describe('Utility Functions', () => {
    it('generateChartData creates labels/data and cycles colors', () => {
        const balances = Array.from({ length: 10 }).map((_, i) => ({
            currency: `C${i}`,
            idrValue: i + 1
        }));

        const data = generateChartData(balances);
        const bg = data.datasets[0].backgroundColor;
        const firstRepeatIndex = bg.findIndex((c, i) => i > 0 && c === bg[0]);

        expect(data.labels).toEqual(balances.map(b => b.currency));
        expect(data.datasets[0].data).toEqual(balances.map(b => b.idrValue));
        expect(data.datasets[0].borderColor).toEqual(bg);
        expect(firstRepeatIndex).toBeGreaterThan(0);
        expect(new Set(bg).size).toBeLessThan(bg.length);
    });

    it('generateChartOptions tooltip formats IDR and fallbacks', () => {
        const options = generateChartOptions();

        const normal = options.plugins.tooltip.callbacks.label({
            label: 'USD',
            parsed: 1234.56
        });
        const fallback = options.plugins.tooltip.callbacks.label({
            label: null,
            parsed: undefined
        });

        expect(normal).toBe('USD: Rp 1,234.56');
        expect(fallback).toBe(': Rp 0.00');
        expect(options.responsive).toBe(true);
        expect(options.maintainAspectRatio).toBe(false);
        expect(options.plugins.legend.position).toBe('bottom');
    });

    it('convertBalancesToIDR covers success, missing rates, and USD missing IDR', () => {
        const usdInput = [{ currency: 'USD', amount: 2 }];
        const eurInput = [{ currency: 'EUR', amount: 2 }];
        const customInput = [{ currency: 'EUR', amount: 1, name: 'Euro Custom' }];
        const bad1 = null;
        const bad2 = [{ currency: 'USD', amount: 1 }];

        const usd = convertBalancesToIDR(usdInput, { IDR: 14000 });
        const eur = convertBalancesToIDR(eurInput, { IDR: 14000, EUR: 2 });
        const custom = convertBalancesToIDR(customInput, { IDR: 15000, EUR: 2 });
        const res1 = convertBalancesToIDR(bad1, { IDR: 1 });
        const res2 = convertBalancesToIDR(bad2, null);
        const res3 = convertBalancesToIDR([{ currency: 'EUR', amount: 2 }], { IDR: 15000 });
        const res4 = convertBalancesToIDR([{ currency: 'USD', amount: 1 }], {});
        const res5 = convertBalancesToIDR([{ currency: 'USD', amount: 1 }], { IDR: 0 });

        expect(usd[0].idrValue).toBe(28000);
        expect(eur[0].idrValue).toBe(14000);
        expect(eur[0].name).toBe('Euro');
        expect(custom[0].name).toBe('Euro Custom');
        expect(res1).toEqual([]);
        expect(res2).toEqual([]);
        expect(res3).toEqual([]);
        expect(res4).toEqual([]);
        expect(res5).toEqual([]);
    });
});

describe('fetchMarketRates', () => {
    const originalError = console.error;

    beforeEach(() => {
        fetch.mockReset();
        console.error = jest.fn();
    });

    afterEach(() => {
        console.error = originalError;
    });

    it('returns {} on empty token and logs', async () => {
        const res = await fetchMarketRates('');

        expect(res).toEqual({});
        expect(console.error).toHaveBeenCalledWith(
            'Error fetching market rates:',
            expect.any(Error)
        );
    });

    it('returns {} when response is ok but array is empty', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => []
        });

        const res = await fetchMarketRates('t');

        expect(res).toEqual({});
    });

    it('returns {} and logs when response.ok === false', async () => {
        fetch.mockResolvedValueOnce({ ok: false });

        const res = await fetchMarketRates('t');

        expect(res).toEqual({});
        expect(console.error).toHaveBeenCalledWith(
            'Error fetching market rates:',
            expect.any(Error)
        );
    });

    it('returns latest rates when present', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => [
                { rates: { USD: 1, IDR: 10000 } },
                { rates: { USD: 1, IDR: 10500 } }
            ]
        });

        const res = await fetchMarketRates('t');

        expect(res).toEqual({ USD: 1, IDR: 10500 });
    });

    it('returns undefined when last item has no "rates"', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => [{ foo: 1 }]
        });

        const res = await fetchMarketRates('t');

        expect(res).toBeUndefined();
    });
});

describe('fetchProfileData', () => {
    const originalError = console.error;

    beforeEach(() => {
        fetch.mockClear();
        console.error = jest.fn();
    });

    afterEach(() => {
        console.error = originalError;
    });

    it('returns mock data on empty token and logs', async () => {
        const res = await fetchProfileData('');

        expect(res).toEqual({ balances: [] });
        expect(console.error).toHaveBeenCalledWith(
            'Error fetching profile data:',
            expect.any(Error)
        );
    });

    it('returns mock on response.ok === false', async () => {
        fetch.mockResolvedValueOnce({ ok: false });

        const res = await fetchProfileData('t');

        expect(res).toEqual({ balances: [] });
    });

    it('returns mock on fetch rejection', async () => {
        fetch.mockRejectedValueOnce(new Error('boom'));

        const res = await fetchProfileData('t');

        expect(res).toEqual({ balances: [] });
        expect(console.error).toHaveBeenCalledWith(
            'Error fetching profile data:',
            expect.any(Error)
        );
    });

    it('returns real data on success', async () => {
        const profile = { balances: [{ currency: 'USD', amount: 10 }] };
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => profile
        });

        const res = await fetchProfileData('t');

        expect(res).toEqual(profile);
    });
});

describe('usePortfolioData Hook (with Provider store)', () => {
    beforeEach(() => {
        fetch.mockReset();
        jest.spyOn(console, 'error').mockImplementation(() => { });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('treats non-array balances as empty (Array.isArray false branch)', async () => {
        fetch.mockImplementation((url) => {
            if (String(url).includes('/profile')) {
                return Promise.resolve({
                    ok: true,
                    json: async () => ({ balances: 'oops' })
                });
            }
            if (String(url).includes('/history')) {
                return Promise.resolve({
                    ok: true,
                    json: async () => [{ rates: { IDR: 16000, USD: 1 } }]
                });
            }
            return Promise.reject(new Error('Unexpected URL'));
        });

        renderWithProvider(<HookTestComponent />);

        await waitFor(() =>
            expect(screen.getByTestId('loading').textContent).toBe('false')
        );
        expect(screen.getByTestId('count').textContent).toBe('0');
        expect(screen.getByTestId('idr').textContent).toBe('');
    });

    it('enrichment falls back to currency code when currencyMeta entry is missing', async () => {
        const uiData = require('../../data/uiData.js');
        const originalUsdMeta = uiData.currencyMeta.USD;
        delete uiData.currencyMeta.USD;

        fetch.mockImplementation((url) => {
            if (String(url).includes('/profile')) {
                return Promise.resolve({
                    ok: true,
                    json: async () => ({ balances: [{ currency: 'USD', amount: 2 }] })
                });
            }
            if (String(url).includes('/history')) {
                return Promise.resolve({
                    ok: true,
                    json: async () => [{ rates: { IDR: 15000, USD: 1 } }]
                });
            }
            return Promise.reject(new Error('Unexpected URL'));
        });

        renderWithProvider(<HookTestComponent />);

        await waitFor(() =>
            expect(screen.getByTestId('loading').textContent).toBe('false')
        );
        expect(screen.getByTestId('count').textContent).toBe('1');
        expect(screen.getByTestId('name').textContent).toBe('USD');

        uiData.currencyMeta.USD = originalUsdMeta;
    });

    it('happy path: loads and converts data', async () => {
        fetch.mockImplementation((url) => {
            if (String(url).includes('/profile')) {
                return Promise.resolve({
                    ok: true,
                    json: async () => ({ balances: [{ currency: 'USD', amount: 4 }] })
                });
            }
            if (String(url).includes('/history')) {
                return Promise.resolve({
                    ok: true,
                    json: async () => [{ rates: { USD: 1, IDR: 20000 } }]
                });
            }
            return Promise.reject(new Error('Unexpected URL'));
        });

        renderWithProvider(<HookTestComponent />);

        expect(await screen.findByTestId('loading')).toHaveTextContent('true');

        await waitFor(() =>
            expect(screen.getByTestId('loading').textContent).toBe('false')
        );
        expect(screen.getByTestId('count').textContent).toBe('1');
        expect(screen.getByTestId('idr').textContent).toBe('80000');
    });

    it('loadData catch path: triggers catch and resets state', async () => {
        fetch.mockImplementation((url) => {
            if (String(url).includes('/profile')) {
                return Promise.resolve({
                    ok: true,
                    json: async () => ({ balances: [{ currency: 'USD', amount: 5 }] })
                });
            }
            if (String(url).includes('/history')) {
                return Promise.resolve({
                    ok: true,
                    json: async () => [{ rates: { USD: 1, IDR: 16000 } }]
                });
            }
            return Promise.reject(new Error('Unexpected URL'));
        });

        const originalFilter = Array.prototype.filter;
        Array.prototype.filter = function (cb, thisArg) {
            if (
                Array.isArray(this) &&
                this.length === 1 &&
                this[0]?.currency === 'USD' &&
                this[0]?.amount === 5
            ) {
                throw new Error('boom in filter during processProfileData');
            }
            return originalFilter.call(this, cb, thisArg);
        };

        renderWithProvider(<HookTestComponent />);

        await waitFor(() =>
            expect(screen.getByTestId('loading').textContent).toBe('false')
        );

        expect(screen.getByTestId('count').textContent).toBe('0');
        expect(screen.getByTestId('idr').textContent).toBe('');
        expect(console.error).toHaveBeenCalledWith(
            'Error loading portfolio data:',
            expect.any(Error)
        );

        Array.prototype.filter = originalFilter;
    });

    it('filters to supported currencies and enriches with currencyMeta name', async () => {
        fetch.mockImplementation((url) => {
            if (String(url).includes('/profile')) {
                return Promise.resolve({
                    ok: true,
                    json: async () => ({
                        balances: [
                            { currency: 'USD', amount: 1 },
                            { currency: 'JPY', amount: 1000 }
                        ]
                    })
                });
            }
            if (String(url).includes('/history')) {
                return Promise.resolve({
                    ok: true,
                    json: async () => [{ rates: { IDR: 16000, USD: 1, JPY: 160 } }]
                });
            }
            return Promise.reject(new Error('Unexpected URL'));
        });

        renderWithProvider(<HookTestComponent />);

        await waitFor(() =>
            expect(screen.getByTestId('loading').textContent).toBe('false')
        );
        expect(screen.getByTestId('count').textContent).toBe('1');
        expect(screen.getByTestId('name').textContent).toBe('US Dollar');
    });

    it('enrichment uses currencyMeta name even if API provides a custom name', async () => {
        fetch.mockImplementation((url) => {
            if (String(url).includes('/profile')) {
                return Promise.resolve({
                    ok: true,
                    json: async () => ({
                        balances: [{ currency: 'USD', amount: 2, name: 'Custom Dollar' }]
                    })
                });
            }
            if (String(url).includes('/history')) {
                return Promise.resolve({
                    ok: true,
                    json: async () => [{ rates: { IDR: 15000, USD: 1 } }]
                });
            }
            return Promise.reject(new Error('Unexpected URL'));
        });

        renderWithProvider(<HookTestComponent />);

        await waitFor(() =>
            expect(screen.getByTestId('loading').textContent).toBe('false')
        );
        expect(screen.getByTestId('count').textContent).toBe('1');
        expect(screen.getByTestId('name').textContent).toBe('US Dollar');
    });

    it('handles missing token gracefully', async () => {
        renderWithProvider(<HookTestComponent />, null);

        await waitFor(() =>
            expect(screen.getByTestId('loading').textContent).toBe('false')
        );

        expect(screen.getByTestId('count').textContent).toBe('0');
        expect(screen.getByTestId('idr').textContent).toBe('');
        expect(console.error).toHaveBeenCalledWith(
            'Error fetching profile data:',
            expect.any(Error)
        );
        expect(console.error).toHaveBeenCalledWith(
            'Error fetching market rates:',
            expect.any(Error)
        );
    });

    it('filters unsupported currencies in hook flow', async () => {
        fetch.mockImplementation((url) => {
            if (String(url).includes('/profile')) {
                return Promise.resolve({
                    ok: true,
                    json: async () => ({
                        balances: [
                            { currency: 'USD', amount: 1 },
                            { currency: 'JPY', amount: 1000 }
                        ]
                    })
                });
            }
            if (String(url).includes('/history')) {
                return Promise.resolve({
                    ok: true,
                    json: async () => [{ rates: { IDR: 16000, USD: 1, JPY: 160 } }]
                });
            }
            return Promise.reject(new Error('Unexpected URL'));
        });

        renderWithProvider(<HookTestComponent />);

        await waitFor(() =>
            expect(screen.getByTestId('loading').textContent).toBe('false')
        );

        expect(screen.getByTestId('count').textContent).toBe('1');
        expect(screen.getByTestId('idr').textContent).toBe('16000');
    });
});
