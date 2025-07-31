import React from "react";
import PropTypes from "prop-types";
import { Sidebar } from "../../components/Profile/Sidebar";
import HeaderAntd from "../../components/Profile/Header/HeaderAntd.jsx";
import LoadingSpinner from "../../components/common/LoadingSpinner/LoadingSpinner";
import Background from "../../components/Background/Background";
import { Line } from "react-chartjs-2";
import {
    useDashboardData,
    useIdrMarketChartData,
    getIdrChartData,
    getIdrChartOptions,
    renderChartSpinner
} from './dashboardHandler.jsx';
import { useHeaderProfile } from '../../components/Profile/Header/headerAntdHandler.jsx';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

/**
 * Chart section for displaying the IDR rate chart or error message.
 * @param {Object} props Props object
 * @param {Object} props.chartData Chart.js data object
 * @param {boolean} props.chartLoading Loading state for chart data
 * @returns {JSX.Element} Chart section
 */
function IdrChartSection({ chartData, chartLoading }) {
    if (chartLoading) return renderChartSpinner();
    const chartOptions = getIdrChartOptions();
    return (
        <div className="flex min-h-[320px] items-center justify-center w-full p-3">
            <Line
                key={chartData.labels.join('-')}
                data={chartData}
                options={chartOptions}
                style={{ display: 'block', margin: '0 auto', width: '100%' }}
            />
        </div>
    );
}
IdrChartSection.propTypes = {
    chartData: PropTypes.object.isRequired,
    chartLoading: PropTypes.bool.isRequired,
};

/**
 * Loading spinner for the dashboard.
 * @returns {JSX.Element} Spinner section
 */
function DashboardLoading() {
    return (
        <Background>
            <div
                style={{
                    width: '100vw',
                    height: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <LoadingSpinner />
            </div>
        </Background>
    );
}

/**
 * Dashboard card layout (card, sidebar, header, chart, background)
 * @param {Object} props Props for the dashboard card
 * @returns {JSX.Element} Card layout
 */
function DashboardCardLayout(props) {
    return (
        <Background>
            <div
                className="w-[700px] m-[40px_auto] flex flex-col items-stretch min-h-[320px] rounded-2xl shadow-xl bg-white/60 \
                backdrop-blur-md ring-1 ring-white/40"
                data-testid="dashboard-content-layout"
            >
                <HeaderAntd {...props.headerProfile} />
                <div className="flex flex-1 min-h-[320px]">
                    <div className="w-[150px] min-h-[320px] bg-slate-200/85 rounded-bl-xl">
                        <Sidebar active={props.activeNav} onSelect={props.setActiveNav} />
                    </div>
                    <main className="flex-1 flex justify-center items-center pl-1">
                        <IdrChartSection chartData={props.chartData} chartLoading={props.chartLoading} />
                    </main>
                </div>
            </div>
        </Background>
    );
}
DashboardCardLayout.propTypes = {
    activeNav: PropTypes.string.isRequired,
    setActiveNav: PropTypes.func.isRequired,
    chartData: PropTypes.object.isRequired,
    chartLoading: PropTypes.bool.isRequired,
    headerProfile: PropTypes.object.isRequired,
};

/**
 * Dashboard content component. Handles loading and renders layout.
 * @param {Object} props Props for dashboard content
 * @returns {JSX.Element} Dashboard content or loading
 */
function DashboardContent(props) {
    if (props.loading) {
        return <DashboardLoading />;
    }
    return <DashboardCardLayout {...props} />;
}
DashboardContent.propTypes = {
    loading: PropTypes.bool.isRequired,
    activeNav: PropTypes.string.isRequired,
    setActiveNav: PropTypes.func.isRequired,
    chartData: PropTypes.object.isRequired,
    chartLoading: PropTypes.bool.isRequired,
    headerProfile: PropTypes.object.isRequired,
};

/**
 * Main Dashboard component. Uses hooks and renders DashboardContent.
 * @returns {JSX.Element} Dashboard root
 */
function Dashboard() {
    const dashboardProps = useDashboardData();
    const headerProfile = useHeaderProfile();
    const { labels, data, loading: chartLoading } = useIdrMarketChartData();
    const chartData = getIdrChartData(labels, data);
    if (dashboardProps.loading || headerProfile.loading || chartLoading) {
        return <DashboardLoading />;
    }
    return (
        <DashboardContent
            {...dashboardProps}
            headerProfile={headerProfile}
            chartData={chartData}
            chartLoading={chartLoading}
        />
    );
}

export { IdrChartSection, DashboardContent };
export default Dashboard;
