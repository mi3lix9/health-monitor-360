
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Activity, Users, Settings } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-16 md:w-64 bg-white shadow-md z-10">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center md:justify-start h-16 px-4 border-b">
            <span className="hidden md:block text-xl font-bold text-info">Health Monitor 360</span>
            <span className="block md:hidden text-xl font-bold text-info">HM</span>
          </div>
          <nav className="flex-1 px-2 py-4 space-y-2">
            <NavItem to="/" icon={<Home className="h-5 w-5" />} label="Dashboard" />
            <NavItem to="/players" icon={<Users className="h-5 w-5" />} label="Players" />
            <NavItem to="/monitoring" icon={<Activity className="h-5 w-5" />} label="Monitoring" />
            <NavItem to="/settings" icon={<Settings className="h-5 w-5" />} label="Settings" />
          </nav>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 ml-16 md:ml-64 p-4 md:p-8">
        {children}
      </div>
    </div>
  );
};

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label }) => (
  <Link
    to={to}
    className="flex items-center p-2 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
  >
    <div className="flex items-center justify-center">{icon}</div>
    <span className="hidden md:ml-3 md:block">{label}</span>
  </Link>
);

export default Layout;
