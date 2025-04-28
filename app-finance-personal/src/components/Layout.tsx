import { Outlet, Link, useLocation } from "react-router-dom";
import { HomeIcon, ClockIcon, ChartBarIcon } from "@heroicons/react/24/outline";

const Layout = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 p-4">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="flex justify-around items-center h-16">
          <Link
            to="/home"
            className={`flex flex-col items-center justify-center w-full h-full ${
              isActive("/home") ? "text-primary-500" : "text-gray-500"
            }`}
          >
            <HomeIcon className="w-6 h-6" />
            <span className="text-xs mt-1">Home</span>
          </Link>

          <Link
            to="/transactions"
            className={`flex flex-col items-center justify-center w-full h-full ${
              isActive("/transactions") ? "text-primary-500" : "text-gray-500"
            }`}
          >
            <ClockIcon className="w-6 h-6" />
            <span className="text-xs mt-1">History</span>
          </Link>

          <Link
            to="/dashboard"
            className={`flex flex-col items-center justify-center w-full h-full ${
              isActive("/dashboard") ? "text-primary-500" : "text-gray-500"
            }`}
          >
            <ChartBarIcon className="w-6 h-6" />
            <span className="text-xs mt-1">Dashboard</span>
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default Layout;
