import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User as UserIcon, LogOut, PlusCircle } from 'lucide-react';
import { User } from '../types';
import { useAuth } from '../auth/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path ? "text-indigo-600 font-semibold" : "text-gray-600 hover:text-indigo-600";

  const scrollToAbout = () => {
    const el = document.getElementById('about');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleAboutClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // If we are not on home, navigate first, then scroll.
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(scrollToAbout, 80);
    } else {
      scrollToAbout();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">R</span>
                </div>
                <span className="text-xl font-bold text-gray-900 tracking-tight">Rentify</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/" className={isActive('/')}>Home</Link>
              <Link to="/apartments" className={isActive('/apartments')}>Apartments</Link>
              <Link to="/contact" className={isActive('/contact')}>Contact</Link>
              
              {user ? (
                <div className="flex items-center space-x-4">
                  <Link 
                    to="/apartments/new" 
                    className="flex items-center px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-full hover:bg-indigo-100 transition-colors"
                  >
                    <PlusCircle className="w-4 h-4 mr-2" />
                    List Property
                  </Link>
                  <div className="relative group">
                    <button className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 focus:outline-none">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <UserIcon className="w-5 h-5 text-gray-500" />
                        </div>
                        <span className="text-sm font-medium">{user.name}</span>
                    </button>
                    {/* Dropdown */}
                    <div className="absolute right-0 w-48 mt-2 py-2 bg-white rounded-lg shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right">
                        {user.role === 'admin' && (
                          <Link to="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Admin Panel</Link>
                        )}
                        <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">My Profile</Link>
                        <button 
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Sign out
                        </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                    <Link to="/login" className="text-gray-600 hover:text-indigo-600 font-medium">Log in</Link>
                    <Link to="/register" className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors shadow-sm">
                        Register
                    </Link>
                </div>
              )}
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600 hover:text-gray-900 p-2">
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100">
            <div className="px-4 pt-2 pb-4 space-y-2">
              <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Home</Link>
              <Link to="/apartments" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Apartments</Link>
              <Link to="/contact" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Contact</Link>
              {user ? (
                  <>
                    <Link to="/apartments/new" className="block px-3 py-2 rounded-md text-base font-medium text-indigo-600 hover:bg-indigo-50">List Property</Link>
                    {user.role === 'admin' && (
                      <Link to="/admin" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">Admin Panel</Link>
                    )}
                    <Link to="/profile" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">My Profile</Link>
                    <button onClick={handleLogout} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50">Sign out</button>
                  </>
              ) : (
                  <div className="pt-4 border-t border-gray-100 flex flex-col space-y-2">
                      <Link to="/login" className="block w-full text-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Log in</Link>
                      <Link to="/register" className="block w-full text-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">Register</Link>
                  </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                <div className="col-span-1 md:col-span-2">
                    <Link to="/" className="flex items-center space-x-2 mb-4">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">R</span>
                        </div>
                        <span className="text-xl font-bold text-gray-900">Rentify</span>
                    </Link>
                    <p className="text-gray-500 text-sm">
                        Find your perfect place to call home. Renting and selling made simple.
                    </p>
                </div>
                <div className="md:justify-self-end">
                    <h4 className="font-semibold text-gray-900 mb-4">Navigation</h4>
                    <ul className="space-y-2 text-sm text-gray-500">
                        <li>
                          <a href="#about" onClick={handleAboutClick} className="hover:text-indigo-600">About Us</a>
                        </li>
                        <li>
                          <Link to="/contact" className="hover:text-indigo-600">Help Center</Link>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="border-t border-gray-100 mt-12 pt-8 text-center text-sm text-gray-400">
                &copy; {new Date().getFullYear()} Rentify Inc. All rights reserved.
            </div>
        </div>
      </footer>
    </div>
  );
};