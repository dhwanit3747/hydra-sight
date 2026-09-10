import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X, Waves, Circle } from 'lucide-react';
import { Button } from './ui/button';

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/dashboard', label: 'Command Center' },
  { to: '/rainfall', label: 'Rainfall' },
  { to: '/inundation', label: 'Inundation' },
  { to: '/risk', label: 'Risk' },
  { to: '/simulation', label: 'Simulation' },
  { to: '/alerts', label: 'Alerts' },
  { to: '/historical', label: 'Historical' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [location.pathname]);

  const isHome = location.pathname === '/';
  const transparent = isHome && !scrolled;

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        transparent
          ? 'bg-slate-950/20 backdrop-blur-[2px] border-b border-transparent'
          : 'bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm'
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3 group">
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
              transparent
                ? 'bg-slate-900/60 border border-white/20 text-sky-400'
                : 'bg-slate-900 text-white shadow-sm'
            }`}
          >
            <Waves className="w-5 h-5" strokeWidth={2.2} />
          </div>
          <div className="leading-tight">
            <div className={`text-[15px] font-bold tracking-tight transition-colors ${transparent ? 'text-white' : 'text-slate-900'}`}>
              HydroSense AI
            </div>
            <div
              className={`text-[9.5px] tracking-[0.2em] font-semibold transition-colors ${
                transparent ? 'text-sky-300' : 'text-slate-500'
              }`}
            >
              FLOOD INTELLIGENCE
            </div>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="nav-desktop-links hidden md:flex items-center gap-1">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                `px-3.5 py-1.5 text-[13px] font-medium rounded-full transition-all duration-200 ${
                  isActive
                    ? transparent
                      ? 'bg-slate-800/80 text-white border border-white/20 shadow-sm font-semibold'
                      : 'bg-slate-900 text-white font-semibold shadow-sm'
                    : transparent
                    ? 'text-white/80 hover:text-white hover:bg-white/10'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        {/* Right Action Items */}
        <div className="flex items-center gap-3">
          <div
            className={`nav-demo-badge hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider transition-all ${
              transparent
                ? 'bg-slate-900/80 text-slate-200 border border-slate-700/80 backdrop-blur-sm'
                : 'bg-amber-50 text-amber-800 border border-amber-300'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            DEMO MODE
          </div>

          <Link to="/dashboard" className="nav-cta-btn hidden md:block">
            <Button
              size="sm"
              className={`rounded-full font-semibold px-4 py-2 text-xs transition-all shadow-sm ${
                transparent
                  ? 'bg-white hover:bg-slate-100 text-slate-950 shadow-md'
                  : 'bg-slate-900 hover:bg-slate-800 text-white'
              }`}
            >
              Launch Command Center
            </Button>
          </Link>

          {/* Mobile hamburger */}
          <button
            className="nav-mobile-btn md:hidden p-2 rounded-md focus:outline-none"
            onClick={() => setOpen(!open)}
            aria-label="Toggle navigation menu"
          >
            {open ? (
              <X className={`w-6 h-6 ${transparent ? 'text-white' : 'text-slate-900'}`} />
            ) : (
              <Menu className={`w-6 h-6 ${transparent ? 'text-white' : 'text-slate-900'}`} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div className="md:hidden bg-slate-950/95 backdrop-blur-xl border-t border-slate-800 px-6 py-5 space-y-2 shadow-2xl text-white">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                `block px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  isActive ? 'bg-white/20 text-white font-semibold' : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <div className="pt-3 border-t border-slate-800 flex flex-col gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-900 text-amber-300 border border-amber-400/40 w-max">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              DEMO MODE
            </div>
            <Link to="/dashboard" className="block">
              <Button className="w-full bg-white text-slate-950 hover:bg-slate-100 font-semibold rounded-full">
                Launch Command Center
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
