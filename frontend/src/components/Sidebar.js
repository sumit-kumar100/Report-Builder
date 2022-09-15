import Icon from '@material-tailwind/react/Icon';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { navlist } from '../utilities/list';

export default function Sidebar({ showSidebar, setShowSidebar }) {

    const navigate = useNavigate()

    const { pathname } = useLocation()

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate("/login", { replace: true });
    }

    return (
        <div className={`h-screen fixed top-0 md:left-0 ${showSidebar} overflow-y-auto flex-row flex-nowrap overflow-hidden shadow-xl bg-white w-64 z-10 py-4 px-6 transition-all duration-300`}>
            <div className="flex-col items-stretch min-h-full flex-nowrap px-0 relative">
                <span className="mt-2 text-right w-full inline-block md:hidden cursor-pointer" onClick={() => setShowSidebar()}>
                    <Icon name="close" size="2xl" />
                </span>
                <div className="flex flex-col">
                    <hr className="my-4 min-w-full" />
                    <ul className="flex-col min-w-full flex list-none">
                        {navlist?.map((item, index) => (
                            <li className="rounded-lg mb-4" key={index}>
                                <NavLink
                                    to={item.path}
                                    className={`flex items-center gap-4 text-sm text-gray-700 font-light px-4 py-3 rounded-lg ${pathname === item.path ? "bg-pink-500 text-white shadow-md" : null} `}
                                >
                                    <Icon name={item.icon} size="2xl" />
                                    {item.title}
                                </NavLink>
                            </li>
                        ))}
                        <li className="rounded-lg mb-2">
                            <span
                                onClick={handleLogout}
                                className="flex items-center gap-4 text-sm text-gray-700 font-light px-4 py-3 rounded-lg cursor-pointer"
                            >
                                <Icon name="logout" size="2xl" />
                                Sign Out
                            </span>
                        </li>
                    </ul>
                </div>
            </div>
        </div >
    );
}
