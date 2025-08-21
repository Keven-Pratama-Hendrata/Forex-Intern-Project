import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { logout } from "../../../store/slices/authSlice";
import React from 'react';
import { SUPPORTED_CURRENCIES, HEADER_LABELS, HEADER_STYLES, HEADER_ROUTES } from '../../../data';

/**
 * Extracts the username and IDR balance from the user profile data.
 * @param {Object} data The user profile data from the backend.
 * @returns {{ username: string, balance: number }} The extracted profile object.
 */
function extractProfile(data) {
    const idr = data.balances?.find(b => b.currency === SUPPORTED_CURRENCIES[0]);
    return {
        username: data.username || "",
        balance: idr ? idr.amount : 0
    };
}

/**
 * Helper to fetch user profile and update state.
 * @param {string} token Auth token.
 * @param {function} setProfile State setter for profile.
 */
export async function fetchUserProfile(token, setProfile) {
    if (!token) return;
    try {
        const res = await fetch(HEADER_ROUTES.profile, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setProfile(extractProfile(data));
    } catch {
        setProfile({ username: "", balance: 0 });
    }
}

/**
 * Custom hook to get the user profile (username and IDR balance) for the header by fetching from the backend.
 * @returns {{ username: string, balance: number }} Object with username and balance.
 */
export function useHeaderProfile() {
    const token = useSelector(state => state.auth.token);
    const [profile, setProfile] = React.useState({ username: "", balance: 0 });
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        let mounted = true;
        /**
         * Loads the user profile and updates loading state.
         * @returns {Promise<void>}
         */
        const load = async () => {
            setLoading(true);
            await fetchUserProfile(token, (p) => {
                if (!mounted) return;
                setProfile(p);
            });
            if (mounted) setLoading(false);
        };
        load();
        return () => { mounted = false; };
    }, [token]);

    return { ...profile, loading };
}

/**
 * Custom hook to handle user logout from the header.
 * @returns {function} Logout handler function.
 */
export function useHeaderLogout() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    return () => {
        dispatch(logout());
        toast.success("Logged out successfully");
        navigate("/", { state: { fromLogout: true } });
    };
}

/**
 * Custom hook to manage hover state for the logout button.
 * @returns {[boolean, function, function]} Hover state, onMouseEnter, onMouseLeave.
 */
export function useLogoutHover() {
    const [hover, setHover] = React.useState(false);
    /**
     * Sets hover to true.
     * @returns {void}
     */
    const onMouseEnter = () => setHover(true);
    /**
     * Sets hover to false.
     * @returns {void}
     */
    const onMouseLeave = () => setHover(false);
    return [hover, onMouseEnter, onMouseLeave];
}

/**
 * Returns the style object for the logout button, including hover state.
 * @param {boolean} hover Whether the button is hovered.
 * @returns {Object} The style object.
 */
export function getLogoutButtonStyle(hover) {
    return {
        ...HEADER_STYLES.logoutLinkStyle,
        transition: 'background 0.2s',
        background: hover ? '#c7d6ee' : HEADER_STYLES.logoutLinkStyle.background,
        borderRadius: 8,
        padding: '2px 4px',
    };
}

export { HEADER_LABELS, HEADER_STYLES, extractProfile }; 