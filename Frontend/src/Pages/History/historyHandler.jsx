import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { API_ROUTES } from '../../data/uiData';

/**
 * Custom hook to fetch and manage history data.
 * @returns {Object} Object containing transactions array and loading state.
 */
export function useHistoryData() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = useSelector(state => state.auth.token);

    useEffect(() => {
        /**
         * Fetches transaction history from the backend API.
         */
        const fetchHistory = async () => {
            if (!token) {
                setError('No authentication token');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                const response = await fetch(API_ROUTES.USER_HISTORY, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setTransactions(data.balanceHistory || []);
            } catch (err) {
                console.error('Failed to fetch history:', err);
                setError(err.message);
                setTransactions([]);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [token]);

    return { transactions, loading, error };
} 