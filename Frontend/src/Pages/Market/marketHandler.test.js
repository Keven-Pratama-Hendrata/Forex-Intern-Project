import { renderHook } from '@testing-library/react';
import { waitFor } from '@testing-library/react';
import {
    getUsdMarketRow,
    getNonUsdMarketRow,
    getMarketRow,
    mapMarketRows,
    fetchMarketRows,
    useMarketRates
} from './marketHandler.jsx';

jest.mock('../../data/uiData', () => ({
    currencyMeta: {
        USD: { name: 'US Dollar', flag: 'usd-flag' },
        EUR: { name: 'Euro', flag: 'eur-flag' },
        JPY: { name: 'Japanese Yen', flag: 'jpy-flag' },
        AUD: { name: 'Australian Dollar', flag: 'aud-flag' },
    },
    currencyList: ['USD', 'EUR', 'JPY', 'AUD'],
}));

describe('marketHandler pure functions', () => {
    const current = {
        rates: { USD: 1, EUR: 0.9, JPY: 110, AUD: 1.5, IDR: 15000 },
    };
    const previous = {
        rates: { USD: 1, EUR: 0.8, JPY: 100, AUD: 1.4, IDR: 16000 },
    };

    it('getUsdMarketRow returns correct row', () => {
        const row = getUsdMarketRow(current, previous, 'USD');

        expect(row).toEqual({
            code: 'USD',
            name: 'US Dollar',
            flag: 'usd-flag',
            value: 1,
            idrValue: 15000,
            change: -1000,
            changeAbs: 1000,
        });
    });

    it('getNonUsdMarketRow returns correct row', () => {
        const row = getNonUsdMarketRow(current, previous, 'EUR');

        expect(row.code).toBe('EUR');
        expect(row.name).toBe('Euro');
        expect(row.flag).toBe('eur-flag');
        expect(row.value).toBeCloseTo(16666.6667, 3);
        expect(row.idrValue).toBeCloseTo(16666.6667, 3);
        expect(row.change).toBeCloseTo(16666.6667 - 20000, 3);
        expect(row.changeAbs).toBeCloseTo(Math.abs(16666.6667 - 20000), 3);
    });

    it('getNonUsdMarketRow returns null if missing data', () => {
        const badCurrent = { rates: { USD: 1, IDR: 15000 } };
        const badPrevious = { rates: { USD: 1, IDR: 16000 } };

        const result = getNonUsdMarketRow(badCurrent, badPrevious, 'EUR');

        expect(result).toBeNull();
    });

    it('getMarketRow delegates to USD and non-USD', () => {
        const usdRow = getMarketRow(current, previous, 'USD');
        const eurRow = getMarketRow(current, previous, 'EUR');

        expect(usdRow.code).toBe('USD');
        expect(eurRow.code).toBe('EUR');
    });

    it('mapMarketRows returns all valid rows', () => {
        const rows = mapMarketRows(current, previous);

        expect(rows.length).toBe(4);
        expect(rows[0].code).toBe('USD');
        expect(rows[1].code).toBe('EUR');
    });
});

describe('fetchMarketRows', () => {
    afterEach(() => jest.restoreAllMocks());

    it('returns [] if data is not array', async () => {
        global.fetch = jest.fn().mockResolvedValue({ json: async () => null });

        const rows = await fetchMarketRows();

        expect(rows).toEqual([]);
    });

    it('returns [] if data.length < 2', async () => {
        global.fetch = jest.fn().mockResolvedValue({ json: async () => [{}] });

        const rows = await fetchMarketRows();

        expect(rows).toEqual([]);
    });

    it('returns mapped rows for valid data', async () => {
        const data = [
            { date: '2024-06-01', rates: { USD: 1, EUR: 0.9, JPY: 110, AUD: 1.5, IDR: 15000 } },
            { date: '2024-05-31', rates: { USD: 1, EUR: 0.8, JPY: 100, AUD: 1.4, IDR: 16000 } },
        ];
        global.fetch = jest.fn().mockResolvedValue({ json: async () => data });

        const rows = await fetchMarketRows();

        expect(rows.length).toBe(4);
        expect(rows[0].code).toBe('USD');
        expect(rows[1].code).toBe('EUR');
    });
});

describe('useMarketRates', () => {
    afterEach(() => jest.restoreAllMocks());

    it('returns loading true initially and then rows', async () => {
        const data = [
            { date: '2024-06-01', rates: { USD: 1, EUR: 0.9, JPY: 110, AUD: 1.5, IDR: 15000 } },
            { date: '2024-05-31', rates: { USD: 1, EUR: 0.8, JPY: 100, AUD: 1.4, IDR: 16000 } },
        ];
        global.fetch = jest.fn().mockResolvedValue({ json: async () => data });

        const { result } = renderHook(() => useMarketRates());
        expect(result.current.loading).toBe(true);
        await waitFor(() => expect(result.current.loading).toBe(false));

        expect(result.current.rows.length).toBe(4);
    });

    it('handles fetch error gracefully', async () => {
        global.fetch = jest.fn().mockRejectedValue(new Error('fail'));

        const { result } = renderHook(() => useMarketRates());
        expect(result.current.loading).toBe(true);
        await waitFor(() => expect(result.current.loading).toBe(false));

        expect(result.current.rows).toEqual([]);
    });
}); 