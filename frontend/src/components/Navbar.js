import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, LayoutDashboard, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logoutUser, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const handleLogout = () => { 
    logoutUser(); 
    navigate('/'); 
    setDropdownOpen(false); 
    setMobileMenuOpen(false);
  };
  
  const isActive = (path) => location.pathname === path;

  // desktop link
  const NavLink = ({ to, children }) => (
    <Link to={to} className="relative px-4 py-2 text-sm font-medium rounded-lg transition-colors group">
      <span className={`relative z-10 ${isActive(to) ? 'text-indigo-800 font-semibold' : 'text-stone-600 group-hover:text-indigo-800'}`}>
        {children}
      </span>
      {isActive(to) && (
        <motion.div layoutId="navbar-indicator" className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-indigo-800 rounded-full" />
      )}
      <div className="absolute inset-0 bg-indigo-50 rounded-lg opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 z-0" />
    </Link>
  );

  return (
    <nav className="sticky top-0 z-50 glass border-b border-stone-200/50 text-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-xl sm:text-2xl font-display font-bold text-indigo-800 tracking-tight">
            Fest<span className="font-light italic text-indigo-400">Zone</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink to="/events">Events</NavLink>
            
            {user ? (
              <>
                <NavLink to={isAdmin ? '/admin' : '/dashboard'}>{isAdmin ? 'Admin' : 'Dashboard'}</NavLink>
                <div className="w-px h-6 bg-stone-200 mx-2" />
                
                {/* User Dropdown */}
                <div className="relative">
                  <motion.button 
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="ml-2 flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-100 text-indigo-800 font-display font-bold text-sm border-2 border-indigo-200 hover:border-indigo-800 transition-colors"
                  >
                    {user.name?.charAt(0).toUpperCase()}
                  </motion.button>

                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.1 } }}
                        className="absolute right-0 mt-3 w-56 rounded-2xl bg-white border border-stone-200 shadow-glass overflow-hidden"
                      >
                        <div className="px-5 py-4 border-b border-stone-100 bg-stone-50/50">
                          <p className="text-sm font-semibold text-stone-800 truncate">{user.name}</p>
                          <p className="text-xs text-stone-500 mt-1 truncate">{user.email}</p>
                        </div>
                        <div className="p-2">
                          <Link 
                            to={isAdmin ? '/admin' : '/dashboard'}
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 text-sm text-stone-700 rounded-xl hover:bg-stone-50 transition-colors"
                          >
                            <LayoutDashboard className="w-4 h-4 text-stone-400" />
                            Dashboard
                          </Link>
                          <button 
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-rose-600 rounded-xl hover:bg-rose-50 transition-colors"
                          >
                            <LogOut className="w-4 h-4 text-rose-500" />
                            Sign out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2 ml-2">
                <Link to="/login" className="px-5 py-2 text-sm font-semibold text-stone-700 hover:text-indigo-800 transition-colors">
                  Sign in
                </Link>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link to="/register" className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-br from-indigo-800 to-indigo-700 hover:from-indigo-900 hover:to-indigo-800 rounded-xl shadow-glow-indigo transition-all">
                    Get Started
                  </Link>
                </motion.div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 text-stone-600 hover:text-indigo-800"
            >
              <Menu className="w-6 h-6" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-stone-900/20 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-4/5 max-w-sm bg-white shadow-2xl z-50 md:hidden flex flex-col"
            >
              <div className="flex justify-between items-center p-4 border-b border-stone-100">
                <span className="font-display font-bold text-lg text-stone-800">Menu</span>
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => setMobileMenuOpen(false)} className="p-2 bg-stone-100 rounded-full text-stone-500">
                  <X className="w-5 h-5" />
                </motion.button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                <Link to="/events" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-xl text-stone-700 hover:bg-indigo-50 hover:text-indigo-800 transition-colors">
                  <Calendar className="w-5 h-5 text-indigo-400" />
                  <span className="font-medium">Events</span>
                </Link>
                
                {user ? (
                  <>
                    <Link to={isAdmin ? '/admin' : '/dashboard'} onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-xl text-stone-700 hover:bg-indigo-50 hover:text-indigo-800 transition-colors">
                      <LayoutDashboard className="w-5 h-5 text-indigo-400" />
                      <span className="font-medium">{isAdmin ? 'Admin Panel' : 'Dashboard'}</span>
                    </Link>
                    <div className="h-px bg-stone-100 my-4" />
                    <div className="px-3 pb-2">
                      <p className="text-sm font-semibold text-stone-800">{user.name}</p>
                      <p className="text-xs text-stone-500">{user.email}</p>
                    </div>
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 p-3 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors">
                      <LogOut className="w-5 h-5 text-rose-500" />
                      <span className="font-medium">Sign out</span>
                    </button>
                  </>
                ) : (
                  <>
                    <div className="h-px bg-stone-100 my-4" />
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-xl text-stone-700 hover:bg-indigo-50 hover:text-indigo-800 transition-colors">
                      <span className="font-medium">Sign in</span>
                    </Link>
                    <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-center p-3 mt-2 rounded-xl text-white bg-indigo-800 hover:bg-indigo-900 font-medium transition-colors">
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
