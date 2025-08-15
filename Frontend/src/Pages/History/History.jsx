import React from "react";
import Background from "../../components/Background/Background";
import Sidebar from "../../components/Profile/Sidebar/Sidebar";
import HeaderAntd from "../../components/Profile/Header/HeaderAntd.jsx";
import { useHeaderProfile } from "../../components/Profile/Header/headerAntdHandler.jsx";
import LoadingSpinner from "../../components/common/LoadingSpinner/LoadingSpinner";
import { useHistoryData } from "./historyHandler.jsx";
import {
    HistoryTableRowPropTypes,
    HistoryTablePropTypes
} from "./History.type";

/**
 * Formats a date string to a readable format.
 * @param {string} dateString The date string to format.
 * @returns {string} Formatted date string.
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

/**
 * Formats currency amount with proper sign and formatting.
 * @param {number} amount The amount to format.
 * @param {string} currency The currency code.
 * @returns {string} Formatted amount string.
 */
function formatAmount(amount, currency) {
    const isPositive = amount >= 0;
    const sign = isPositive ? '+' : '-';
    const formattedAmount = Math.abs(amount).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 4
    });
    return `${sign}${formattedAmount} ${currency}`;
}

/**
 * Renders a table row for a transaction history entry.
 * @param {{ transaction: object, isLast: boolean }} props The props object containing transaction data and last row indicator.
 * @returns {JSX.Element} Table row for a transaction.
 */
function HistoryTableRow({ transaction, isLast }) {
    const rowStyle = {
        borderBottom: isLast ? 'none' : '1px solid #e5e7eb',
        transition: 'background-color 0.2s ease'
    };
    const amountColor = transaction.amount >= 0 ? "#059669" : "#dc2626";

    return (
        <tr
            key={transaction._id}
            style={rowStyle}
            onMouseEnter={(e) => e.target.closest('tr').style.backgroundColor = '#f8fafc'}
            onMouseLeave={(e) => e.target.closest('tr').style.backgroundColor = 'transparent'}
        >
            <td style={{ padding: 10, verticalAlign: "middle" }}>
                {formatDate(transaction.date)}
            </td>
            <td style={{ padding: 10, verticalAlign: "middle" }}>
                {transaction.currency}
            </td>
            <td style={{
                padding: 10,
                textAlign: "right",
                color: amountColor,
                fontWeight: 600,
                verticalAlign: "middle"
            }}>
                {formatAmount(transaction.amount, transaction.currency)}
            </td>
            <td style={{
                padding: 10,
                textAlign: "right",
                fontWeight: 600,
                verticalAlign: "middle"
            }}>
                {transaction.balance.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 4
                })} {transaction.currency}
            </td>
        </tr>
    );
}

/**
 * Renders the table body for the transaction history.
 * @param {{ transactions: Array<object> }} props The props object containing all transaction data.
 * @returns {JSX.Element} Table body for transaction history.
 */
function HistoryTable({ transactions }) {
    if (!transactions.length) {
        return (
            <tbody>
                <tr>
                    <td colSpan={4} style={{ textAlign: 'center', padding: 20 }}>
                        No transaction history found
                    </td>
                </tr>
            </tbody>
        );
    }
    return (
        <tbody>
            {transactions.map((transaction, index) => (
                <HistoryTableRow
                    key={transaction._id}
                    transaction={transaction}
                    isLast={index === transactions.length - 1}
                />
            ))}
        </tbody>
    );
}

/**
 * Table with header for the history content area.
 * @param {{ transactions: Array<object> }} props The props object containing all transaction data.
 * @returns {JSX.Element} The table with header and history rows.
 */
function HistoryTableWithHeader({ transactions }) {
    return (
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 16 }}>
            <thead style={{
                position: "sticky",
                top: 0,
                backgroundColor: "rgba(219, 234, 254, 0.95)",
                backdropFilter: "blur(8px)",
                zIndex: 10,
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
            }}>
                <tr>
                    <th style={{ padding: 10, paddingBottom: 0, textAlign: "left", borderBottom: "2px solid #e5e7eb" }}>Date</th>
                    <th style={{ padding: 10, paddingBottom: 0, textAlign: "left", borderBottom: "2px solid #e5e7eb" }}>Currency</th>
                    <th style={{ padding: 10, paddingBottom: 0, textAlign: "right", borderBottom: "2px solid #e5e7eb" }}>Amount</th>
                    <th style={{ padding: 10, paddingBottom: 0, textAlign: "right", borderBottom: "2px solid #e5e7eb" }}>Balance</th>
                </tr>
            </thead>
            <HistoryTable transactions={transactions} />
        </table>
    );
}

/**
 * Renders the loading spinner for the History page.
 * @returns {JSX.Element} The loading spinner centered on the page.
 */
function HistoryLoading() {
    return (
        <Background>
            <div className="w-screen h-screen flex items-center justify-center">
                <LoadingSpinner />
            </div>
        </Background>
    );
}

/**
 * Renders the main layout for the History page after loading.
 * @param {{ username, balance, activeNav, setActiveNav, transactions}} props The props object containing layout data.
 * @returns {JSX.Element} The History page layout.
 */
function HistoryLayout({ username, balance, activeNav, setActiveNav, transactions }) {
    return (
        <Background>
            <HistoryContainer>
                <HeaderAntd username={username} balance={balance} />
                <div className="flex flex-1 min-h-[320px]">
                    <HistorySidebar activeNav={activeNav} setActiveNav={setActiveNav} />
                    <HistoryContent transactions={transactions} />
                </div>
            </HistoryContainer>
        </Background>
    );
}

/**
 * Main card container for the History page.
 * @param {{ children: React.ReactNode }} props The props object containing children to render inside the container.
 * @returns {JSX.Element} The styled card container for the History page.
 */
function HistoryContainer({ children }) {
    return (
        <div
            className={[
                "w-[700px] m-[40px_auto] flex flex-col items-stretch min-h-[320px]",
                "rounded-2xl shadow-xl bg-white/60 backdrop-blur-md ring-1 ring-white/40"
            ].join(" ")}
            data-testid="history-content-layout"
        >
            {children}
        </div>
    );
}

/**
 * Sidebar section for navigation.
 * @param {{ activeNav: string, setActiveNav: function }} props The props object containing sidebar state and setter.
 * @returns {JSX.Element} The sidebar navigation section.
 */
function HistorySidebar({ activeNav, setActiveNav }) {
    return (
        <div className="w-[150px] min-h-[320px] bg-slate-200/85 rounded-bl-xl">
            <Sidebar active={activeNav} onSelect={setActiveNav} />
        </div>
    );
}

/**
 * Main content area for the history table.
 * @param {{ transactions: Array<object> }} props The props object containing all transaction data.
 * @returns {JSX.Element} The main content area with the history table.
 */
function HistoryContent({ transactions }) {
    return (
        <main className="flex-1 flex justify-start items-start">
            <div
                className="w-full max-h-[320px] overflow-y-auto"
                style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    WebkitScrollbar: { display: 'none' }
                }}
            >
                <HistoryTableWithHeader transactions={transactions} />
            </div>
        </main>
    );
}

/**
 * Main History page component.
 * @returns {JSX.Element} The History page.
 */
function History() {
    const headerProfile = useHeaderProfile();
    const { username, balance } = headerProfile;
    const [activeNav, setActiveNav] = React.useState("History");
    const { transactions, loading } = useHistoryData();

    if (loading || headerProfile.loading) return <HistoryLoading />;

    return (
        <HistoryLayout
            username={username}
            balance={balance}
            activeNav={activeNav}
            setActiveNav={setActiveNav}
            transactions={transactions}
        />
    );
}

HistoryTableRow.propTypes = HistoryTableRowPropTypes;
HistoryTable.propTypes = HistoryTablePropTypes;

export default History; 