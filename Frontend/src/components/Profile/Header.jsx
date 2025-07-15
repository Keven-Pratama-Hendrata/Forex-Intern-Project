import React, { useState, useRef } from "react";
import PropTypes from "prop-types";

const currencyOptions = [
    { code: "USD", label: "USD" },
    { code: "EUR", label: "EUR" },
    { code: "JPY", label: "JPY" },
    { code: "AUD", label: "AUD" },
    { code: "IDR", label: "IDR" },
];

const currencySymbols = {
    USD: "$",
    EUR: "€",
    JPY: "¥",
    AUD: "A$",
    IDR: "Rp"
};

/**
 * Dashboard header component
 * @param {Object} props - Component props
 * @param {string} props.username - The username to display
 * @param {string} props.currency - The selected currency (e.g., 'USD')
 * @param {number} props.balance - The user's balance
 * @param {Function} props.onCurrencyChange - Callback for currency dropdown
 * @param {Function} props.onLogout - Callback for logout button
 * @returns {JSX.Element} Header component
 */
const Header = ({
    username = "test",
    currency = "USD",
    balance = 0,
    onCurrencyChange = () => { },
    onLogout = () => { },
}) => {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    React.useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        }
        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [open]);

    return (
        <header className="flex items-center justify-between px-6 py-3 bg-white/60 rounded-t-2xl">
            <div className="flex items-center gap-2">
                <span className="bg-gray-200 rounded-full p-2">
                    <img src="/assets/profilepicture.png" alt="User avatar" className="w-8 h-8 rounded-full object-cover" />
                </span>
                <span className="font-semibold text-blue-900">{username}</span>
            </div>
            <div className="flex items-center gap-2">
                <span className="font-bold text-blue-900 text-lg">Balance:</span>
                <div className="relative" ref={dropdownRef}>
                    <button
                        type="button"
                        className="flex items-center text-blue-900 font-semibold bg-transparent focus:outline-none px-1 py-1 rounded hover:bg-blue-100 transition"
                        onClick={() => setOpen((prev) => !prev)}
                        style={{ minWidth: '110px' }}
                    >
                        <span className="flex items-center">
                            <span>{currency}:</span>
                            <span className="ml-1">{currencySymbols[currency]}{balance.toFixed(2)}</span>
                        </span>
                        <span className="ml-1 text-xs">▼</span>
                    </button>
                    {open && (
                        <ul className="absolute left-0 z-10 mt-1 w-full bg-white border border-blue-200 rounded shadow-lg">
                            {currencyOptions.map(opt => (
                                <li key={opt.code}>
                                    <button
                                        type="button"
                                        className={`w-full text-left px-3 py-1 hover:bg-blue-100 ${opt.code === currency ? 'font-bold text-blue-900' : 'text-blue-900'}`}
                                        onClick={() => {
                                            setOpen(false);
                                            if (opt.code !== currency) {
                                                onCurrencyChange(opt.code);
                                            }
                                        }}
                                    >
                                        {opt.code}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
            <button
                className="flex items-center gap-1 text-blue-900 font-semibold hover:underline"
                onClick={onLogout}
                type="button"
            >
                Logout
                <img src="/assets/logout_icon.png" alt="Logout" className="w-5 h-5 ml-1" />
            </button>
        </header>
    );
};

Header.propTypes = {
    username: PropTypes.string,
    currency: PropTypes.string,
    balance: PropTypes.number,
    onCurrencyChange: PropTypes.func,
    onLogout: PropTypes.func,
};

export default Header; 