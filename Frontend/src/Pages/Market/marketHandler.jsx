import { currencyMeta, currencyList } from "../../data/uiData";
import { useState, useEffect } from "react";

/**
 * Maps USD market data to a table row.
 * @param {object} current The latest market data.
 * @param {object} previous The previous market data.
 * @param {string} code The currency code (should be 'USD').
 * @returns {object} Row data for USD.
 */
function getUsdMarketRow(current, previous, code) {
    const curIdr = current.rates.IDR;
    const prevIdr = previous.rates.IDR;
    return {
        code,
        name: currencyMeta[code].name,
        flag: currencyMeta[code].flag,
        value: 1,
        idrValue: curIdr,
        change: curIdr - prevIdr,
        changeAbs: Math.abs(curIdr - prevIdr),
    };
}

/**
 * Maps non-USD market data to a table row.
 * @param {object} current The latest market data.
 * @param {object} previous The previous market data.
 * @param {string} code The currency code.
 * @returns {object|null} Row data for non-USD or null if data is missing.
 */
// eslint-disable-next-line max-lines-per-function
function getNonUsdMarketRow(current, previous, code) {
    const curRate = current.rates[code];
    const prevRate = previous.rates[code];
    const curIdr = current.rates.IDR;
    const prevIdr = previous.rates.IDR;
    if (!curRate || !prevRate || !curIdr || !prevIdr) return null;
    const curInIdr = curIdr / curRate;
    const prevInIdr = prevIdr / prevRate;
    return {
        code,
        name: currencyMeta[code].name,
        flag: currencyMeta[code].flag,
        value: curInIdr,
        idrValue: curInIdr,
        change: curInIdr - prevInIdr,
        changeAbs: Math.abs(curInIdr - prevInIdr),
    };
}

/**
 * Maps a single currency's market data to a table row.
 * @param {object} current The latest market data.
 * @param {object} previous The previous market data.
 * @param {string} code The currency code.
 * @returns {object|null} Row data for the table or null if data is missing.
 */
function getMarketRow(current, previous, code) {
    if (code === "USD") {
        return getUsdMarketRow(current, previous, code);
    }
    return getNonUsdMarketRow(current, previous, code);
}

/**
 * Maps market history data to table rows.
 * @param {object} current The latest market data.
 * @param {object} previous The previous market data.
 * @returns {Array<object>} Array of row data for the table.
 */
function mapMarketRows(current, previous) {
    return currencyList
        .map((code) => getMarketRow(current, previous, code))
        .filter(Boolean);
}

/**
 * Fetches and processes market history data.
 * @returns {Promise<Array<object>>} Array of row data for the table.
 */
async function fetchMarketRows() {
    const res = await fetch("/api/market/history");
    const data = await res.json();
    if (!Array.isArray(data) || data.length < 2) return [];
    const sorted = [...data].sort((a, b) => new Date(b.date) - new Date(a.date));
    const [current, previous] = sorted;
    return mapMarketRows(current, previous);
}

/**
 * React hook to fetch and process market rates for the Market page.
 * @returns {{ rows: Array<object>, loading: boolean }} Market table rows and loading state.
 */
function useMarketRates() {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(true);
        fetchMarketRows()
            .then(setRows)
            .catch(() => setRows([]))
            .finally(() => setLoading(false));
    }, []);
    return { rows, loading };
}

export {
    getUsdMarketRow,
    getNonUsdMarketRow,
    getMarketRow,
    mapMarketRows,
    fetchMarketRows,
    useMarketRates
};