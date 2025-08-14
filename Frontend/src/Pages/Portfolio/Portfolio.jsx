import React from "react";
import { Sidebar } from "../../components/Profile/Sidebar";
import HeaderAntd from "../../components/Profile/Header/HeaderAntd.jsx";
import LoadingSpinner from "../../components/common/LoadingSpinner/LoadingSpinner";
import Background from "../../components/Background/Background";
import { useHeaderProfile } from "../../components/Profile/Header/headerAntdHandler.jsx";
import { usePortfolioData, generateChartData, generateChartOptions } from "./portfolioHandler.jsx";
import { Pie } from "react-chartjs-2";
import {
    PortfolioContentProps,
    PortfolioCardLayoutProps,
    PortfolioContentWrapperProps
} from "./Portfolio.type.js";

/**
 * Full-page loading spinner for the Portfolio page.
 * @returns {JSX.Element} Spinner section
 */
function PortfolioLoading() {
    return (
        <Background>
            <div
                style={{
                    width: "100vw",
                    height: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}
                data-testid="portfolio-loading"
            >
                <LoadingSpinner />
            </div>
        </Background>
    );
}

/** 
 * @returns {JSX.Element} Compact "loading chart" placeholder. 
*/
function ChartLoading() {
    return (
        <div className="w-full p-6" data-testid="chart-loading">
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-500">Loading chart...</div>
            </div>
        </div>
    );
}

/** 
 * @returns {JSX.Element} Empty-state when there is no portfolio data. 
*/
function EmptyPortfolioState() {
    return (
        <div className="w-full p-6">
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-500" data-testid="no-data">
                    No portfolio data available
                </div>
            </div>
        </div>
    );
}

/**
 * @param {Object} props Component props
 * @param {Array<{idrValue:number}>} props.idrBalances IDR-converted balances
 * @param {boolean} props.marketLoading Whether market data is still loading
 * @returns {JSX.Element} Content section
 */
function PortfolioContent({ idrBalances, marketLoading }) {
    const totalIDR = React.useMemo(
        () => (Array.isArray(idrBalances) ? idrBalances.reduce((s, b) => s + (b.idrValue || 0), 0) : 0),
        [idrBalances]
    );

    const chartData = React.useMemo(() => generateChartData(idrBalances || []), [idrBalances]);
    const chartOptions = React.useMemo(() => generateChartOptions(), []);

    if (marketLoading) return <ChartLoading />;
    if (!idrBalances || idrBalances.length === 0) return <EmptyPortfolioState />;

    return (
        <div className="w-full p-6">
            <div className="w-full">
                <div className="mb-3">
                    <h3 className="text-base font-bold text-gray-800 mb-2">Portfolio Distribution (IDR)</h3>
                    <p className="text-sm font-semibold text-gray-600 mb-2" data-testid="total-idr">
                        Total Balance: Rp{" "}
                        {totalIDR.toLocaleString("id-ID", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        })}
                    </p>
                </div>
                <div className="h-64">
                    <Pie data={chartData} options={chartOptions} />
                </div>
            </div>
        </div>
    );
}
PortfolioContent.propTypes = PortfolioContentProps;

/**
 * Portfolio card layout (card, sidebar, header, content, background).
 * @param {Object} props Component props
 * @returns {JSX.Element} Card layout
 */
function PortfolioCardLayout(props) {
    return (
        <Background>
            <div
                className={[
                    "w-[700px] m-[40px_auto] flex flex-col items-stretch min-h-[320px]",
                    "rounded-2xl shadow-xl bg-white/60 backdrop-blur-md ring-1 ring-white/40"
                ].join(" ")}
                data-testid="portfolio-content-layout"
            >
                <HeaderAntd {...props.headerProfile} />
                <div className="flex flex-1 min-h-[320px]">
                    <div className="w-[150px] min-h-[320px] bg-slate-200/85 rounded-bl-xl">
                        <Sidebar active={props.activeNav} onSelect={props.setActiveNav} />
                    </div>
                    <main className="flex-1 flex justify-center items-center pl-1">
                        <PortfolioContent idrBalances={props.idrBalances} marketLoading={props.marketLoading} />
                    </main>
                </div>
            </div>
        </Background>
    );
}
PortfolioCardLayout.propTypes = PortfolioCardLayoutProps;

/**
 * Wrapper that decides between loading UI and the main layout.
 * @param {Object} props Component props
 * @returns {JSX.Element} Loading or content layout
 */
function PortfolioContentWrapper(props) {
    if (props.loading) return <PortfolioLoading />;
    return <PortfolioCardLayout {...props} />;
}
PortfolioContentWrapper.propTypes = PortfolioContentWrapperProps;

/**
 * Portfolio page root component. Pulls data via hooks and renders the wrapper/layout.
 * @returns {JSX.Element} Portfolio page
 */
function Portfolio() {
    const { portfolioData, idrBalances, loading } = usePortfolioData();
    const headerProfile = useHeaderProfile();
    const [activeNav, setActiveNav] = React.useState("Portfolio");

    return (
        <PortfolioContentWrapper
            loading={loading}
            portfolioData={portfolioData}
            idrBalances={idrBalances}
            marketLoading={loading}
            headerProfile={headerProfile}
            activeNav={activeNav}
            setActiveNav={setActiveNav}
        />
    );
}

export { PortfolioContent, PortfolioContentWrapper, PortfolioCardLayout };
export default Portfolio;
