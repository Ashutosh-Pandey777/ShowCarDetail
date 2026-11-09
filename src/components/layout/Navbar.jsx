import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, ChevronDown, LogOut, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';

const BRANDS = ['Maruti Suzuki', 'Hyundai', 'Tata', 'Mahindra', 'Kia', 'Toyota', 'Honda', 'BMW', 'Mercedes-Benz', 'Audi', 'MG', 'Skoda', 'Volkswagen', 'Nissan', 'Renault', 'BYD', 'Volvo', 'Jeep'];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [brandOpen, setBrandOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const submit = (e) => {
    e.preventDefault();
    navigate(`/browse?q=${encodeURIComponent(query)}`);
    setOpen(false);
  };

  const closeMenu = () => setOpen(false);

  return (
    <header className="sticky top-0 z-50 bg-[#0b0f15]/95 text-white border-b border-white/10 backdrop-blur-xl">
      <div className="max-w-chassis mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5 group" onClick={closeMenu}>
            <svg width="32" height="32" viewBox="0 0 36 36" fill="none" aria-hidden="true">
              <path d="M4 24.5 9.5 12h17L32 24.5" stroke="#eeb52e" strokeWidth="2.4" strokeLinejoin="round"/>
              <path d="M7 24.5h22" stroke="#eeb52e" strokeWidth="2.4" strokeLinecap="round"/>
              <circle cx="11" cy="25" r="3" fill="#0b0f15" stroke="#eeb52e" strokeWidth="2"/>
              <circle cx="25" cy="25" r="3" fill="#0b0f15" stroke="#eeb52e" strokeWidth="2"/>
            </svg>
            <span className="font-heading font-extrabold text-lg tracking-tight text-white">SHOW<span className="text-amber-400">CAR</span>DETAIL</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            <Link to="/browse" className="px-3 py-2 text-sm font-medium text-white/75 hover:text-amber-400 transition-colors">New Cars</Link>
            <Link to="/browse" className="px-3 py-2 text-sm font-medium text-white/75 hover:text-amber-400 transition-colors">Used Cars</Link>
            <div className="relative" onMouseEnter={() => setBrandOpen(true)} onMouseLeave={() => setBrandOpen(false)}>
              <button type="button" onClick={() => setBrandOpen(v => !v)} className="px-3 py-2 text-sm font-medium text-white/75 hover:text-amber-400 transition-colors flex items-center gap-1">
                Brands <ChevronDown className="w-3.5 h-3.5" />
              </button>
              {brandOpen && (
                <div className="absolute top-full left-0 w-[480px] bg-[#111722] border border-white/10 p-4 grid grid-cols-3 gap-1 shadow-2xl">
                  {BRANDS.map(b => (
                    <Link key={b} to={`/brand/${b.toLowerCase().replace(/\\s+/g, '-')}`} className="px-3 py-2 text-sm text-white/70 hover:text-amber-400 hover:bg-white/5 transition-colors">{b}</Link>
                  ))}
                </div>
              )}
            </div>
            <Link to="/compare" className="px-3 py-2 text-sm font-medium text-white/75 hover:text-amber-400 transition-colors">Compare</Link>
            <Link to="/browse?fuel=Electric" className="px-3 py-2 text-sm font-medium text-white/75 hover:text-amber-400 transition-colors">Electric</Link>
            <Link to="/emi" className="px-3 py-2 text-sm font-medium text-white/75 hover:text-amber-400 transition-colors">EMI & Loans</Link>
            <Link to="/contact" className="px-3 py-2 text-sm font-medium text-white/75 hover:text-amber-400 transition-colors">Contact</Link>
          </nav>

          <div className="flex items-center gap-3">
            <form onSubmit={submit} className="hidden md:flex items-center bg-white/5 border border-white/15 px-3 h-9 w-52 focus-within:border-amber-400/70 transition-colors">
              <Search className="w-4 h-4 text-white/60" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search cars…" aria-label="Search cars" className="bg-transparent text-sm ml-2 outline-none flex-1 text-white placeholder:text-white/40" />
            </form>
            {isAuthenticated && user ? (
              <>
                <Link to="/admin" className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-white/70 hover:text-amber-400 transition-colors"><ShieldCheck className="w-4 h-4" /> Admin</Link>
                <div className="hidden sm:flex items-center gap-2 text-sm"><span className="text-white/50">Hi,</span><span className="font-medium text-white max-w-[140px] truncate">{user.full_name || user.email}</span></div>
                <button type="button" onClick={() => logout(false)} className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-white/70 hover:text-amber-400 transition-colors"><LogOut className="w-4 h-4" /> Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="hidden sm:block text-sm font-medium text-white/70 hover:text-amber-400 transition-colors">Sign In</Link>
                <Link to="/register" className="hidden sm:block btn-kinetic py-2 px-4 text-xs">Register</Link>
              </>
            )}
          </div>

          <button type="button" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen(!open)} className="lg:hidden p-2 text-white">
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-white/10 bg-[#0b0f15] px-4 py-4 space-y-2 text-white">
          <form onSubmit={submit} className="flex items-center bg-white/5 border border-white/15 px-3 h-10 mb-2">
            <Search className="w-4 h-4 text-white/60" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search cars…" aria-label="Search cars" className="bg-transparent text-sm ml-2 outline-none flex-1 text-white placeholder:text-white/40" />
          </form>
          {[['New Cars','/browse'],['Used Cars','/browse'],['Compare','/compare'],['Electric','/browse?fuel=Electric'],['EMI & Loans','/emi'],['Contact','/contact']].map(([label, to]) => (
            <Link key={label} to={to} className="block py-2 text-sm text-white/80 hover:text-amber-400" onClick={closeMenu}>{label}</Link>
          ))}
          <div className="flex gap-2 pt-3 border-t border-white/10">
            {isAuthenticated && user ? (
              <>
                <div className="flex-1 text-sm text-white/80 py-2">Hi, <span className="font-medium text-white">{user.full_name || user.email}</span></div>
                <Link to="/admin" className="btn-ghost flex-1 justify-center py-2 text-xs border-white/30 text-white hover:border-amber-400 hover:text-amber-400" onClick={closeMenu}>Admin</Link>
                <button type="button" onClick={() => { closeMenu(); logout(false); }} className="btn-kinetic flex-1 py-2 text-xs flex items-center justify-center gap-1.5"><LogOut className="w-4 h-4" /> Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-ghost flex-1 justify-center py-2 text-xs border-white/30 text-white hover:border-amber-400 hover:text-amber-400" onClick={closeMenu}>Sign In</Link>
                <Link to="/register" className="btn-kinetic flex-1 py-2 text-xs" onClick={closeMenu}>Register</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
