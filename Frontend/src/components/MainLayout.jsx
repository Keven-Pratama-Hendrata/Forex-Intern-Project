import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import toast from 'react-hot-toast';

import homeIcon from '../../assets/Home.png';
import marketIcon from '../../assets/market.png';
import portfolioIcon from '../../assets/portfolio.png';
import historyIcon from '../../assets/history.png';
import userIcon from '../../assets/profilepicture.png';
import logoutIcon from '../../assets/logout_icon.png';

import { formatUSD } from '../utils/currencyFormats/currencyFormat';
import DashboardBackground from '../Components/Background/DashboardBackground';

const sidebarLinks = [
  { name: 'Home', icon: homeIcon, route: '/dashboard' },
  { name: 'Market', icon: marketIcon, route: '/market' },
  { name: 'Portfolio', icon: portfolioIcon, route: '/portfolio' },
  { name: 'History', icon: historyIcon, route: '/history' },
];

const MainLayout = ({ userData, children, selectedSidebar, setSelectedSidebar }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    toast.success("Logged out successfully!");
  };

  const handleTopup = () => {
    navigate('/topup');
  };

  return (
    <DashboardBackground>
      <div className="rounded-2xl bg-white/80 p-0 shadow-xl backdrop-blur-md ring-1 ring-white/40">
        <div className="flex items-center justify-between px-8 py-4 bg-[#e6ebef] rounded-t-2xl">
          <div className="flex items-center space-x-2">
            <div className="rounded-full bg-blue-200 px-4 py-2 flex items-center">
              <img src={userIcon} alt="User" className="w-6 h-6 mr-2" />
              <span className="font-bold text-blue-900">{userData?.userName || "Username"}</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-blue-900">
            Balance: {formatUSD(userData?.balances.USD || 0)}
          </div>
          <div className="flex items-center space-x-2">
            <button
              className="text-blue-900 font-bold flex items-center space-x-1 hover:bg-blue-100 px-2 py-1 rounded-lg"
              onClick={handleTopup}
            >
              Topup
            </button>
            <button
              className="text-blue-900 font-bold flex items-center space-x-1 hover:bg-blue-100 px-2 py-1 rounded-lg"
              onClick={handleLogout}
            >
              Logout <img src={logoutIcon} alt="Logout" className="w-5 h-5 ml-1" />
            </button>
          </div>
        </div>

        <div className="flex">
          <div className="w-1/4 pr-6 border-r border-gray-200 py-8 bg-white/0">
            <nav className="space-y-6">
              {sidebarLinks.map(link => (
                <button
                  key={link.name}
                  className={`w-full flex items-center space-x-2 text-blue-900 font-bold text-lg px-2 py-2 transition-colors duration-150 rounded-lg ${selectedSidebar === link.name
                    ? 'bg-blue-200'
                    : 'hover:bg-blue-100'
                    }`}
                  onClick={() => {
                    setSelectedSidebar(link.name);
                    navigate(link.route);
                  }}
                >
                  <img src={link.icon} alt={link.name} className="w-6 h-6" /> <span>{link.name}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="flex-1 pl-6 py-8 bg-white/0 flex items-center justify-center">
            {children}
          </div>
        </div>
      </div>
    </DashboardBackground>
  );
};

export default MainLayout; 