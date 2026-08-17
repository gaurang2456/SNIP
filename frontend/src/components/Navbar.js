import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();

  const navItems = [
    { path: '/', label: 'Home', requiresAuth: false },
    { path: '/urls', label: 'URLs', requiresAuth: true, context: 'urls' },
    { path: '/analytics', label: 'Analytics', requiresAuth: true, context: 'analytics' },
  ];

  const handleNavClick = (e, item) => {
    if (item.requiresAuth && !isAuthenticated) {
      e.preventDefault();
      openAuthModal('prompt', item.context);
      navigate(item.path);
    }
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-white border-b border-outline-variant/30">
      <div className="h-16 max-w-[1200px] mx-auto px-lg flex items-center justify-between">
        <Link to="/" className="flex items-center gap-sm">
          <img src="/logo.png" alt="SNIP Logo" className="h-9 w-auto object-contain rounded" />
          <span className="font-headline-md text-headline-md tracking-tight text-primary font-bold">SNIP</span>
        </Link>
        <nav className="flex items-center gap-xl h-full">
          {navItems.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (item.path === '/urls' && location.pathname === '/dashboard');
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={(e) => handleNavClick(e, item)}
                className={`h-full flex items-center transition-all ${
                  isActive
                    ? 'text-primary font-bold border-b-2 border-primary'
                    : 'text-body-md text-on-surface-variant hover:text-on-surface border-b-2 border-transparent'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-md">
          {isAuthenticated ? (
            <div className="flex items-center gap-md">
              <span className="font-body-md text-xs font-medium text-on-surface-variant max-w-[180px] truncate hidden sm:inline-block bg-surface-container px-md py-xs rounded-full border border-outline-variant/20">
                {user?.email}
              </span>
              <button
                onClick={logout}
                className="text-xs font-label-sm uppercase tracking-wider text-on-surface-variant hover:text-error transition-colors px-sm py-xs rounded hover:bg-error-container/20 flex items-center gap-xs font-semibold"
                title="Sign out"
              >
                <span className="material-symbols-outlined text-[16px]">logout</span>
                Sign out
              </button>
            </div>
          ) : (
            <button
              onClick={() => openAuthModal('login')}
              className="px-lg py-xs h-9 rounded-lg bg-primary text-on-primary font-headline-md text-xs font-semibold hover:bg-primary/90 transition-all shadow-xs flex items-center gap-xs active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-[16px]">login</span>
              Sign in
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
