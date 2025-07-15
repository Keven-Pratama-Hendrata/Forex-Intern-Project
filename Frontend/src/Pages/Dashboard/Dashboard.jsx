import React, { useState } from "react";
import Sidebar from "../../components/Profile/Sidebar";
import Header from "../../components/Profile/Header";
import Background from "../../components/Background/Background";

/**
 * Dashboard page UI
 * @returns {JSX.Element}
 */
const Dashboard = () => {
    const [activeNav, setActiveNav] = useState("Home");
    const [currency, setCurrency] = useState("USD");
    const [balance] = useState(0);
    const username = "test";

    return (
        <Background>
            <div className="w-[700px] rounded-2xl shadow-xl bg-white/60 backdrop-blur-md ring-1 ring-white/40">
                <Header
                    username={username}
                    currency={currency}
                    balance={balance}
                    onCurrencyChange={setCurrency}
                    onLogout={() => { }}
                />
                <div className="flex">
                    <Sidebar active={activeNav} onSelect={setActiveNav} />
                    <main className="flex-1 flex items-center justify-center text-gray-500 text-lg">
                        {activeNav === "Home" && (
                            <span>No historical data available for {currency}.</span>
                        )}
                        {/* Add more content for other navs as needed */}
                    </main>
                </div>
            </div>
        </Background>
    );
};

export default Dashboard; 