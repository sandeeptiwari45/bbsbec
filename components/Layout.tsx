import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, Heart, User, LogOut, PlusCircle, ShieldCheck, Menu, X, Moon, Sun, Users, GraduationCap } from 'lucide-react';
import NotificationPanel from './NotificationPanel';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  if (!user) return <>{children}</>;

  const getNavLinks = () => {
    if (user.role === 'student') {
      return [
        { path: '/student/home', label: 'Home', icon: Home },
        { path: '/student/calendar', label: 'Calendar', icon: Calendar },
        { path: '/student/favourites', label: 'Favourites', icon: Heart },
        { path: '/student/profile', label: 'Profile', icon: User },
      ];
    } else if (user.role === 'faculty') {
      return [
        { path: '/faculty', label: 'My Notices', icon: Home },
        { path: '/faculty/create', label: 'Create Notice', icon: PlusCircle },
        { path: '/faculty/calendar', label: 'Calendar', icon: Calendar },
        { path: '/faculty/profile', label: 'Profile', icon: User },
      ];
    } else {
      return [
        { path: '/admin', label: 'Home', icon: Home },
        { path: '/admin/notices', label: 'All Notices', icon: Menu },
        { path: '/admin/calendar', label: 'Calendar', icon: Calendar },
        { path: '/admin/students', label: 'Students', icon: Users },
        { path: '/admin/faculty', label: 'Faculty', icon: GraduationCap },
      ];
    }
  };

  const links = getNavLinks();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-4 flex justify-between items-center sticky top-0 z-20">
        <span className="font-bold text-lg text-blue-700 dark:text-blue-400">BBSBEC Digital Notice Board</span>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="w-6 h-6 text-slate-600 dark:text-slate-300" /> : <Menu className="w-6 h-6 text-slate-600 dark:text-slate-300" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:h-screen ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center overflow-hidden">
            <img src="/assets/logo.png" alt="BBSBEC Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">BBSBEC</h1>
            <p className="text-xs text-slate-500 font-medium">Digital Notice Board</p>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
                  }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-slate-100 dark:border-slate-700">
          <div className="flex items-center space-x-3 mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center text-slate-600 dark:text-slate-300 text-sm font-bold">
              {user.profileImage ? (
                <img src={user.profileImage} alt={user.fullName} className="w-full h-full rounded-full object-cover" />
              ) : (
                user.fullName.charAt(0)
              )}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-sm font-medium text-slate-800 dark:text-white truncate">{user.fullName}</p>
              {user.designation ? (
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium truncate">{user.designation}</p>
              ) : (
                <p className="text-xs text-slate-500 dark:text-slate-400 capitalize truncate">{user.role}</p>
              )}</div>
          </div>
          <div className="space-y-2">
            <button
              onClick={toggleTheme}
              className="flex items-center space-x-3 px-4 py-2 w-full text-left text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
            <button
              onClick={logout}
              className="flex items-center space-x-3 px-4 py-2 w-full text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>


      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-[calc(100vh-64px)] md:h-screen p-4 md:p-8 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>

      {/* Overlay for mobile menu */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default Layout;
