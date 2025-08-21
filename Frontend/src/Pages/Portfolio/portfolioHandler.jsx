import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { API_ROUTES, currencyMeta, portfolioCurrencyList } from '../../data/uiData.js';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

/**
 * Build Chart.js pie data from IDR-converted balances.
 * @param {Array} idrBalances List of balances already converted to IDR.
 * @returns {object}} Chart.js compatible dataset for a pie chart.
 */
export const generateChartData = (idrBalances) => {
    const colors = [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#4BC0C0',
        '#9966FF'
    ];

    return {
        labels: idrBalances.map(b => b.currency),
        datasets: [{
            data: idrBalances.map(b => b.idrValue),
            backgroundColor: idrBalances.map((_, i) => colors[i % colors.length]),
            borderColor: idrBalances.map((_, i) => colors[i % colors.length]),
            borderWidth: 2
        }]
    };
};

/**
 * Chart.js options for the portfolio pie chart.
 * @returns {Object} Options object to configure legend, tooltip, and responsiveness.
 */
export const generateChartOptions = () => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'bottom',
            labels: {
                padding: 20,
                usePointStyle: true,
                font: { size: 12 }
            }
        },
        tooltip: {
            callbacks: {
                /**
                 * Custom tooltip label formatter for IDR values.
                 * @param {Object} context - Chart.js tooltip context containing label and parsed value.
                 * @returns {string} A human-readable line like "USD: Rp 1,234.00".
                 */
                label: (context) => {
                    const label = context.label || '';
                    const value = context.parsed || 0;
                    return `${label}: Rp ${value.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    })}`;
                }
            }
        }
    }
});

/**
 * Get latest market rates (assumes newest item is last in the HISTORY array).
 * @param {string} token - Authentication token to authorize the request.
 * @returns {Promise<Record<string, number>>} A mapping of currency code to its USD-based rate for the latest day.
 */
async function fetchMarketRates(token) {
    try {
        if (!token) throw new Error('No authentication token found');

        const response = await fetch(API_ROUTES.HISTORY, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Failed to fetch market rates');

        const data = await response.json();
        const todayRates = data[data.length - 1];
        return todayRates ? todayRates.rates : {};
    } catch (err) {
        console.error('Error fetching market rates:', err);
        return {};
    }
}

/**
 * Fetch user profile balances.
 * @param {string} token - Authentication token to authorize the request.
 * @returns {Promise} The profile payload containing a balances array (or an empty fallback).
 */
async function fetchProfileData(token) {
    try {
        if (!token) throw new Error('No authentication token found');

        const response = await fetch(API_ROUTES.PROFILE, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Failed to fetch profile data');

        return await response.json();
    } catch (err) {
        console.error('Error fetching profile data:', err);
        return { balances: [] };
    }
}

/**
 * Convert balances to IDR using USD-based market rates.
 * @param {Array<{currency:string, amount:number, name?:string}>} balances Raw balances from the profile (not yet converted).
 * @param {Record<string, number>} marketRates Latest USD-based market rates including the IDR rate.
 * @returns {Array<{currency:string, amount:number, idrValue:number, name?:string}>} New list of balances including their IDR value.
 */
function convertBalancesToIDR(balances, marketRates) {
    if (!Array.isArray(balances) || !marketRates) return [];

    return balances.map(balance => {
        const idrRate = marketRates.IDR;
        if (!idrRate) return null;

        if (balance.currency === 'USD') {
            return {
                currency: balance.currency,
                amount: balance.amount,
                idrValue: balance.amount * idrRate,
                name: balance.name || currencyMeta[balance.currency]?.name
            };
        }

        const currencyRate = marketRates[balance.currency];
        if (!currencyRate) return null;

        return {
            currency: balance.currency,
            amount: balance.amount,
            idrValue: balance.amount * (idrRate / currencyRate),
            name: balance.name || currencyMeta[balance.currency]?.name
        };
    }).filter(Boolean);
}

/**
 * @returns {object} Object with the converted balances and a loading flag.
 */
export const usePortfolioData = () => {
    const [idrBalances, setIdrBalances] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = useSelector(state => state.auth.token);

    useEffect(() => {
        /**
         * Load balances and rates, then compute IDR values.
         * @returns {Promise<void>} Resolves when state has been updated with fresh data.
         */
        const load = async () => {
            try {
                setLoading(true);
                const [raw, rates] = await Promise.all([
                    fetchProfileData(token),
                    fetchMarketRates(token)
                ]);

                const filtered = Array.isArray(raw?.balances)
                    ? raw.balances.filter(b => portfolioCurrencyList.includes(b.currency))
                    : [];

                const enriched = filtered.map(b => ({
                    ...b,
                    name: currencyMeta[b.currency]?.name || b.currency
                }));

                setIdrBalances(convertBalancesToIDR(enriched, rates));
            } catch (err) {
                console.error('Error loading portfolio data:', err);
                setIdrBalances([]);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [token]);

    return { idrBalances, loading };
};

export {
    fetchMarketRates,
    fetchProfileData,
    convertBalancesToIDR
};
