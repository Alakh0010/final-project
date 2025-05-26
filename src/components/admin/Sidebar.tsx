import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ChartBarIcon,
  ClockIcon,
  UserIcon,
  DocumentTextIcon,
  UsersIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/outline';

interface SidebarProps {
  collapsed: boolean;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, activeTab, onTabChange, onLogout }) => {
  const location = useLocation();

  const menuItems = [
    { id: 'dashboard', icon: ChartBarIcon, label: 'Dashboard' },
    { id: 'queries', icon: DocumentTextIcon, label: 'Queries' },
    { id: 'users', icon: UsersIcon, label: 'Users' },
    { id: 'settings', icon: Cog6ToothIcon, label: 'Settings' },
  ];

  return (
    <div
      className={`bg-gray-900 text-white h-screen flex flex-col transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}
    >
      <div className="p-4 flex items-center justify-between border-b border-gray-700">
        {!collapsed && <h1 className="text-xl font-bold">Quick Query</h1>}
        <button
          onClick={() => onTabChange(collapsed ? 'expand' : 'collapse')}
          className="p-2 rounded-lg hover:bg-gray-700"
        >
          {collapsed ? '→' : '←'}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto p-2">
        <ul className="space-y-1">
          {menuItems.map(item => (
            <li key={item.id}>
              <Link
                to={`/admin#${item.id}`}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center p-3 rounded-lg transition-colors ${
                  activeTab === item.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <item.icon className="h-6 w-6" />
                {!collapsed && <span className="ml-3">{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-700">
        <button
          onClick={onLogout}
          className="w-full flex items-center p-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white"
        >
          <ArrowLeftOnRectangleIcon className="h-6 w-6" />
          {!collapsed && <span className="ml-3">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default React.memo(Sidebar);
