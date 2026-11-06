import React, { useState } from 'react';
import { GraduationCap, Menu, X, LogOut, User, BookOpen, LayoutDashboard, MessageSquare, Home } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from './AuthModal';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

const roleBadgeColors: Record<string, string> = {
  student: 'bg-blue-100 text-blue-700',
  professor: 'bg-emerald-100 text-emerald-700',
  admin: 'bg-purple-100 text-purple-700',
};

const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [authModal, setAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [mobileMenu, setMobileMenu] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);

  const openAuth = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setAuthModal(true);
    setMobileMenu(false);
  };

  const handleLogout = async () => {
    await logout();
    setProfileDropdown(false);
    onNavigate('home');
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { id: 'courses', label: 'Courses', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'discussions', label: 'Discussions', icon: <MessageSquare className="w-4 h-4" /> },
  ];

  if (isAuthenticated && user?.role === 'professor') {
    navItems.push({ id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> });
  }
  if (isAuthenticated && user?.role === 'admin') {
    navItems.push({ id: 'dashboard', label: 'Admin Panel', icon: <LayoutDashboard className="w-4 h-4" /> });
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button onClick={() => onNavigate('home')} className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 group-hover:shadow-indigo-300 transition">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">SmartEdu</span>
            </button>
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <button key={item.id} onClick={() => onNavigate(item.id)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${currentView === item.id ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}>
                  {item.icon}{item.label}
                </button>
              ))}
            </div>
            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated && user ? (
                <div className="relative">
                  <button onClick={() => setProfileDropdown(!profileDropdown)} className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-full border border-gray-200 hover:border-gray-300 hover:shadow-sm transition">
                    <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-full object-cover" />
                    <span className="text-sm font-medium text-gray-700">{user.name.split(' ')[0]}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleBadgeColors[user.role]}`}>{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</span>
                  </button>
                  {profileDropdown && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setProfileDropdown(false)} />
                      <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-20">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                        <button onClick={() => { onNavigate('profile'); setProfileDropdown(false); }} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition">
                          <User className="w-4 h-4" /> Profile
                        </button>
                        <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition">
                          <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <>
                  <button onClick={() => openAuth('login')} className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition">Sign In</button>
                  <button onClick={() => openAuth('signup')} className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition shadow-md shadow-indigo-200">Sign Up</button>
                </>
              )}
            </div>
            <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition">
              {mobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        {mobileMenu && (
          <div className="md:hidden border-t border-gray-200 bg-white pb-4">
            <div className="px-4 pt-3 space-y-1">
              {navItems.map((item) => (
                <button key={item.id} onClick={() => { onNavigate(item.id); setMobileMenu(false); }} className={`w-full flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition ${currentView === item.id ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}>
                  {item.icon}{item.label}
                </button>
              ))}
            </div>
            <div className="px-4 pt-3 border-t border-gray-100 mt-3 space-y-2">
              {isAuthenticated && user ? (
                <>
                  <div className="flex items-center gap-3 px-4 py-2">
                    <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                    <div><p className="text-sm font-medium">{user.name}</p><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleBadgeColors[user.role]}`}>{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</span></div>
                  </div>
                  <button onClick={() => { handleLogout(); setMobileMenu(false); }} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"><LogOut className="w-4 h-4" /> Sign Out</button>
                </>
              ) : (
                <>
                  <button onClick={() => openAuth('login')} className="w-full px-4 py-2.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition">Sign In</button>
                  <button onClick={() => openAuth('signup')} className="w-full px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold rounded-lg transition">Sign Up</button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
      <AuthModal isOpen={authModal} onClose={() => setAuthModal(false)} initialMode={authMode} />
    </>
  );
};

export default Navbar;
