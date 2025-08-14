import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../store/slices/authSlice";
import { DASHBOARD_CHART_CONFIG, DASHBOARD_ERROR_MESSAGES, API_ROUTES } from '../../data';

/**
 * Fetches IDR history from backend and updates state.
 * @param {Function} setIdrHistory Setter for IDR history state.
 * @param {Function} setError Setter for error state.
 * @param {Function} setLoading Setter for loading state.
 */
export async function fetchIdrHistory(setIdrHistory, setError, setLoading) {
    setLoading(true);
    try {
        const res = await fetch(API_ROUTES.HISTORY);
        if (!res.ok) throw new Error(DASHBOARD_ERROR_MESSAGES.FETCH_HISTORY_FAILED);
        const data = await res.json();
        setIdrHistory(data);
        setError(null);
    } catch (err) {
        setError(err.message || DASHBOARD_ERROR_MESSAGES.GENERIC);
    } finally {
        setLoading(false);
    }
}

/**
 * Handles logout: clears auth and navigates to login.
 * @param {Function} dispatch Redux dispatch function.
 * @param {Function} navigate React Router navigate function.
 */
export function handleLogout(dispatch, navigate) {
    dispatch(logout());
    navigate("/login");
}

/**
 * Helper hook for dashboard state (activeNav, idrHistory, loading, error) and setters.
 * @returns {Object} Dashboard state and setters.
 */
function useDashboardState() {
    const [activeNav, setActiveNav] = useState("Home");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchIdrHistory(() => { }, setError, setLoading);
    }, []);

    return { activeNav, setActiveNav, loading, error, setError, setLoading };
}

/**
 * Custom hook for dashboard state and data fetching.
 * @returns {Object} Dashboard state and handlers.
 */
export function useDashboardData() {
    const { activeNav, setActiveNav, loading, error } = useDashboardState();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    /**
     * Handler to log out the user and navigate to login.
     * @returns {void}
     */
    const onLogout = () => handleLogout(dispatch, navigate);
    return { activeNav, setActiveNav, loading, error, onLogout };
}

/**
 * Fetches chart history and updates state.
 * @param {Function} setChartData Setter for chart data state.
 * @param {Function} setLoading Setter for loading state.
 */
function fetchChartHistory(setChartData, setLoading) {
    fetch(API_ROUTES.HISTORY)
        .then(res => res.json())
        .then(history => {
            const labels = history.map(entry => new Date(entry.date).toLocaleDateString());
            const data = history.map(entry => entry.rates?.IDR ? Number(entry.rates.IDR) : null);
            setChartData({ labels, data });
        })
        .finally(() => setLoading(false));
}

/**
 * Custom hook to fetch market price history and return chart data for IDR rates, with loading state.
 * @returns {{ labels: string[], data: number[], loading: boolean }} Chart data for IDR and loading state.
 */
export function useIdrMarketChartData() {
    const [chartData, setChartData] = useState({ labels: [], data: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchChartHistory(setChartData, setLoading);
    }, []);

    return { ...chartData, loading };
}

/**
 * Returns the chart data object for the IDR rate chart.
 * @param {string[]} labels The labels for the x-axis.
 * @param {number[]} data The data points for the chart.
 * @returns {Object} Chart.js data object.
 */
export function getIdrChartData(labels, data) {
    return {
        labels,
        datasets: [
            {
                label: DASHBOARD_CHART_CONFIG.LABEL,
                data,
                fill: false,
                borderColor: DASHBOARD_CHART_CONFIG.BORDER_COLOR,
                backgroundColor: DASHBOARD_CHART_CONFIG.BACKGROUND_COLOR,
                tension: 0.2,
            },
        ],
    };
}

/**
 * Returns the chart options object for the IDR rate chart.
 * @returns {Object} Chart.js options object.
 */
export function getIdrChartOptions() {
    return {
        responsive: true,
        plugins: {
            legend: { display: false },
            title: { display: true, text: DASHBOARD_CHART_CONFIG.TITLE, padding: DASHBOARD_CHART_CONFIG.TITLE_PADDING },
        },
        scales: {
            y: { beginAtZero: false, grace: 0 },
        },
    };
}

/**
 * Renders a spinner for the chart section.
 * @returns {JSX.Element} Spinner element.
 */
export function renderChartSpinner() {
    return <div data-testid="spinner" />;
}

export { fetchChartHistory }; 