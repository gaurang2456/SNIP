import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/urls', label: 'URLs' },
    { path: '/analytics', label: 'Analytics' },
  ];

  return (
    <header className="fixed top-0 w-full z-50 bg-white border-b border-outline-variant/30">
      <div className="h-16 max-w-[1200px] mx-auto px-lg flex items-center justify-between">
        <Link to="/" className="flex items-center gap-sm">
          <img src="/logo.png" alt="SNIP Logo" className="h-9 w-auto object-contain rounded" />
          <span className="font-headline-md text-headline-md tracking-tight text-primary font-bold">SNIP</span>
        </Link>
        <nav className="flex items-center gap-xl h-full">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path === '/urls' && location.pathname === '/dashboard');
            return (
              <Link
                key={item.path}
                to={item.path}
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
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-sm cursor-pointer" title="Account">
            <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
