import React from "react";
import Background from "../../components/Background/Background";
import Sidebar from "../../components/Profile/Sidebar/Sidebar";
import HeaderAntd from "../../components/Profile/Header/HeaderAntd.jsx";
import { useHeaderProfile } from "../../components/Profile/Header/headerAntdHandler.jsx";
import { Button as AntdButton } from "antd";
import { MARKET_BUYSELL_BUTTON_STYLE, MARKET_BUYSELL_BUTTON_HOVER_STYLE } from "../../data/uiData";
import { useMarketRates } from "./marketHandler";
import LoadingSpinner from "../../components/common/LoadingSpinner/LoadingSpinner";
import {
    MarketFlagCellPropTypes,
    MarketChangeCellPropTypes,
    MarketTransactionCellPropTypes,
    MarketTableRowPropTypes,
    MarketTablePropTypes
} from "./Market.type";

/**
 * Displays the flag and code for a currency.
 * @param {{ cur: { code: string, flag: string, name: string } }} props The props object containing currency info.
 * @returns {JSX.Element} Table cell with flag and code.
 */
function MarketFlagCell({ cur }) {
    return (
        <td style={{ padding: 10, verticalAlign: "middle" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <img src={cur.flag} alt={cur.code} style={{ width: 28, height: 28, borderRadius: "50%" }} />
                <span style={{ fontWeight: 600 }}>{cur.code}</span>
            </div>
        </td>
    );
}

/**
 * Displays the change and today's rate for a currency.
 * @param {{ cur: { change: number, idrValue: number } }} props The props object containing change and rate.
 * @returns {JSX.Element} Table cell with change and rate.
 */
// eslint-disable-next-line max-lines-per-function
function MarketChangeCell({ cur }) {
    const color = cur.change >= 0 ? "#059669" : "#dc2626";
    const changeStr = `${cur.change >= 0 ? "+" : ""}${cur.change.toFixed(4)}`;
    const idrStr = `(${cur.idrValue.toLocaleString(undefined, { maximumFractionDigits: 0 })})`;
    return (
        <td
            style={{
                padding: 10,
                textAlign: "right",
                color,
                fontWeight: 600,
                verticalAlign: "middle"
            }}
        >
            {changeStr} {idrStr}
        </td>
    );
}

/**
 * Displays the Buy/Sell button for a currency row.
 * @returns {JSX.Element} Table cell with Buy/Sell button.
 */
// eslint-disable-next-line max-lines-per-function
function MarketTransactionCell() {
    const [hover, setHover] = React.useState(false);
    const style = hover
        ? { ...MARKET_BUYSELL_BUTTON_STYLE, ...MARKET_BUYSELL_BUTTON_HOVER_STYLE }
        : MARKET_BUYSELL_BUTTON_STYLE;
    return (
        <td style={{ padding: 10, textAlign: "center", verticalAlign: "middle" }}>
            <AntdButton
                size="large"
                type="primary"
                shape="round"
                style={style}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
            >
                Buy/Sell
            </AntdButton>
        </td>
    );
}

/**
 * Renders a table row for a currency.
 * @param {{ cur: object }} props The props object containing currency row data.
 * @returns {JSX.Element} Table row for a currency.
 */
function MarketTableRow({ cur }) {
    return (
        <tr key={cur.code}>
            <MarketFlagCell cur={cur} />
            <MarketChangeCell cur={cur} />
            <MarketTransactionCell />
        </tr>
    );
}

/**
 * Renders the table body for the market rates.
 * @param {{ rows: Array<object> }} props The props object containing all currency rows.
 * @returns {JSX.Element} Table body for market rates.
 */
// eslint-disable-next-line max-lines-per-function
function MarketTable({ rows }) {
    if (!rows.length) {
        return (
            <tbody>
                <tr>
                    <td colSpan={3} style={{ textAlign: 'center', padding: 20 }}>
                        No data
                    </td>
                </tr>
            </tbody>
        );
    }
    return (
        <tbody>
            {rows.map((cur) => (
                <MarketTableRow key={cur.code} cur={cur} />
            ))}
        </tbody>
    );
}

/**
 * Table with header for the market content area.
 * @param {{ rows: Array<object> }} props The props object containing all currency rows.
 * @returns {JSX.Element} The table with header and market rows.
 */
function MarketTableWithHeader({ rows }) {
    return (
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 18 }}>
            <thead>
                <tr>
                    <th style={{ padding: 10, paddingBottom: 0, textAlign: "left" }}>CCY</th>
                    <th style={{ padding: 10, paddingBottom: 0, textAlign: "right" }}>Change %</th>
                    <th style={{ padding: 10, paddingBottom: 0, textAlign: "center" }}>Transaction</th>
                </tr>
            </thead>
            <MarketTable rows={rows} />
        </table>
    );
}

/**
 * Renders the loading spinner for the Market page.
 * @returns {JSX.Element} The loading spinner centered on the page.
 */
function MarketLoading() {
    return (
        <Background>
            <div className="w-screen h-screen flex items-center justify-center">
                <LoadingSpinner />
            </div>
        </Background>
    );
}

/**
 * Renders the main layout for the Market page after loading.
 * @param {{ username, balance, activeNav, setActiveNav, rows}} props The props object containing layout data.
 * @returns {JSX.Element} The Market page layout.
 */
function MarketLayout({ username, balance, activeNav, setActiveNav, rows }) {
    return (
        <Background>
            <MarketContainer>
                <HeaderAntd username={username} balance={balance} />
                <div className="flex flex-1 min-h-[320px]">
                    <MarketSidebar activeNav={activeNav} setActiveNav={setActiveNav} />
                    <MarketContent rows={rows} />
                </div>
            </MarketContainer>
        </Background>
    );
}

/**
 * Main card container for the Market page.
 * @param {{ children: React.ReactNode }} props The props object containing children to render inside the container.
 * @returns {JSX.Element} The styled card container for the Market page.
 */
function MarketContainer({ children }) {
    return (
        <div
            className={[
                "w-[700px] m-[40px_auto] flex flex-col items-stretch min-h-[220px]",
                "rounded-2xl shadow-xl bg-white/60 backdrop-blur-md ring-1 ring-white/40"
            ].join(" ")}
            style={{ minHeight: 220, width: 700, margin: "40px auto" }}
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
function MarketSidebar({ activeNav, setActiveNav }) {
    return (
        <div
            className="w-[150px] min-h-[320px] bg-slate-200/85 rounded-bl-xl"
        >
            <Sidebar active={activeNav} onSelect={setActiveNav} />
        </div>
    );
}

/**
 * Main content area for the market table.
 * @param {{ rows: Array<object> }} props The props object containing all currency rows.
 * @returns {JSX.Element} The main content area with the market table.
 */
function MarketContent({ rows }) {
    return (
        <main className="flex-1 flex justify-center items-center pl-1">
            <MarketTableWithHeader rows={rows} />
        </main>
    );
}

/**
 * Main Market page component.
 * @returns {JSX.Element} The Market page.
 */
function Market() {
    const { username, balance } = useHeaderProfile();
    const [activeNav, setActiveNav] = React.useState("Market");
    const { rows, loading } = useMarketRates();
    if (loading) return <MarketLoading />;
    return (
        <MarketLayout
            username={username}
            balance={balance}
            activeNav={activeNav}
            setActiveNav={setActiveNav}
            rows={rows}
        />
    );
}

MarketFlagCell.propTypes = MarketFlagCellPropTypes;
MarketChangeCell.propTypes = MarketChangeCellPropTypes;
MarketTransactionCell.propTypes = MarketTransactionCellPropTypes;
MarketTableRow.propTypes = MarketTableRowPropTypes;
MarketTable.propTypes = MarketTablePropTypes;

export default Market; 