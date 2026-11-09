import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, ChevronDown, LogOut, ShieldCheck, MapPin, UserRound } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';

const BRANDS = ['Maruti Suzuki','Hyundai','Tata','Mahindra','Kia','Toyota','Honda','BMW','Mercedes-Benz','Audi','MG','Skoda','Volkswagen','Nissan','Renault','BYD'];
const CITIES = ['Select City','Delhi NCR','Mumbai','Bengaluru','Hyderabad','Chennai','Pune','Kolkata','Ahmedabad','Jaipur','Lucknow','Patna'];

export default function Navbar() {
  const [open,setOpen]=useState(false), [activeMenu,setActiveMenu]=useState(''), [query,setQuery]=useState(''), [accountOpen,setAccountOpen]=useState(false);
  const [city,setCity]=useState(()=>localStorage.getItem('showcardetail_city') || 'Select City');
  const navigate=useNavigate();
  const {user,isAuthenticated,logout}=useAuth();
  const close=()=>{setOpen(false);setActiveMenu('');setAccountOpen(false);};
  const submit=e=>{e.preventDefault();navigate('/browse?q='+encodeURIComponent(query));close();};
  const menus={
    'New Cars':[
      ['Find New Cars','/browse?condition=New'],['By Budget','/browse?condition=New'],['By Body Type','/browse?condition=New'],['By Fuel Type','/browse?condition=New'],['By Brand','/browse?condition=New'],['Electric Cars','/browse?condition=New&fuel=Electric'],['Compare Cars','/compare']
    ],
    'Used Cars':[
      ['Find Used Cars','/browse?condition=Used'],['Under ₹5 Lakh','/browse?condition=Used'],['Under ₹10 Lakh','/browse?condition=Used'],['SUVs','/browse?condition=Used&body=SUV'],['Sedans','/browse?condition=Used&body=Sedan'],['Browse by Brand','/browse?condition=Used']
    ],
    'News & Reviews':[
      ['Latest News','/news-reviews?tab=news'],['Car Reviews','/news-reviews?tab=reviews'],['Expert Reviews','/news-reviews?tab=expert'],['Videos','/news-reviews?tab=videos']
    ]
  };
  const MenuGroup=({name})=><div className="relative" onMouseEnter={()=>setActiveMenu(name)} onMouseLeave={()=>setActiveMenu('')}>
    <button type="button" onClick={()=>setActiveMenu(activeMenu===name?'':name)} className="flex items-center gap-1 px-3 py-3 text-sm font-semibold text-slate-700 hover:text-red-600">{name}<ChevronDown className="w-4 h-4"/></button>
    {activeMenu===name&&<div className="absolute left-0 top-full z-50 w-60 rounded-b-lg border border-slate-200 bg-white p-2 shadow-xl">
      {menus[name].map(([label,to])=><Link key={label} to={to} onClick={close} className="block rounded px-3 py-2.5 text-sm text-slate-700 hover:bg-red-50 hover:text-red-600">{label}</Link>)}
    </div>}
  </div>;
  return <header className="sticky top-0 z-50 border-b border-slate-200 bg-white text-slate-900 shadow-sm">
    <div className="mx-auto max-w-chassis px-4 sm:px-6">
      <div className="flex h-[72px] items-center justify-between gap-4">
        <Link to="/" onClick={close} className="flex shrink-0 items-center gap-2">
          <svg width="34" height="34" viewBox="0 0 36 36" fill="none" aria-hidden="true"><path d="M4 24.5 9.5 12h17L32 24.5M7 24.5h22" stroke="#e31e24" strokeWidth="2.4" strokeLinejoin="round"/><circle cx="11" cy="25" r="3" fill="white" stroke="#e31e24" strokeWidth="2"/><circle cx="25" cy="25" r="3" fill="white" stroke="#e31e24" strokeWidth="2"/></svg>
          <span className="font-heading text-lg font-extrabold tracking-tight">SHOW<span className="text-red-600">CAR</span>DETAIL</span>
        </Link>
        <nav className="hidden lg:flex items-center"><MenuGroup name="New Cars"/><MenuGroup name="Used Cars"/><MenuGroup name="News & Reviews"/></nav>
        <div className="hidden md:flex items-center gap-3">
          <label className="flex h-10 items-center gap-2 rounded border border-slate-200 bg-slate-50 px-3">
            <MapPin className="h-4 w-4 text-red-600"/><select aria-label="Select city" value={city} onChange={e=>{setCity(e.target.value);localStorage.setItem('showcardetail_city',e.target.value);}} className="max-w-[125px] bg-transparent text-sm text-slate-700 outline-none">{CITIES.map(c=><option key={c}>{c}</option>)}</select>
          </label>
          <form onSubmit={submit} className="flex h-10 w-44 items-center gap-2 rounded border border-slate-200 px-3"><Search className="h-4 w-4 text-slate-500"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search cars" aria-label="Search cars" className="w-full bg-transparent text-sm outline-none"/></form>
          <div className="relative">
            <button type="button" aria-label="Account menu" aria-expanded={accountOpen} onClick={()=>setAccountOpen(v=>!v)} className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-red-300 hover:bg-red-50 hover:text-red-600">
              <UserRound className="h-5 w-5"/>
            </button>
            {accountOpen&&<div className="absolute right-0 top-full z-[60] mt-2 w-56 overflow-hidden rounded-lg border border-slate-200 bg-white py-2 shadow-xl">
              <div className="border-b border-slate-100 px-4 py-3"><p className="text-sm font-semibold text-slate-900">{isAuthenticated&&user?'My Account':'Welcome to ShowCarDetail'}</p><p className="mt-1 text-xs text-slate-500">{isAuthenticated&&user?'Manage your account':'Login to access your account'}</p></div>
              {isAuthenticated&&user?<><Link to="/admin" onClick={close} className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50"><ShieldCheck className="h-4 w-4"/>Admin Dashboard</Link><button type="button" onClick={()=>{close();logout(false);}} className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-50"><LogOut className="h-4 w-4"/>Logout</button></>:<Link to="/login" onClick={close} className="mx-3 mt-2 flex items-center justify-center rounded bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700">Login / Sign Up</Link>}
            </div>}
          </div>
        </div>
        <button type="button" aria-label="Toggle menu" onClick={()=>setOpen(!open)} className="p-2 text-slate-800 lg:hidden">{open?<X/>:<Menu/>}</button>
      </div>
    </div>
    {open&&<div className="border-t border-slate-200 bg-white px-4 py-4 lg:hidden">
      <label className="mb-3 flex h-10 items-center gap-2 rounded border border-slate-200 px-3"><MapPin className="h-4 w-4 text-red-600"/><select value={city} onChange={e=>{setCity(e.target.value);localStorage.setItem('showcardetail_city',e.target.value);}} className="w-full bg-transparent text-sm">{CITIES.map(c=><option key={c}>{c}</option>)}</select></label>
      <form onSubmit={submit} className="mb-3 flex h-10 items-center gap-2 rounded border border-slate-200 px-3"><Search className="h-4 w-4"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search cars" className="w-full bg-transparent text-sm outline-none"/></form>
      {Object.entries(menus).map(([name,items])=><section key={name} className="border-b border-slate-100 py-2"><button onClick={()=>setActiveMenu(activeMenu===name?'':name)} className="flex w-full items-center justify-between py-2 font-semibold text-slate-800">{name}<ChevronDown className="h-4 w-4"/></button>{activeMenu===name&&<div className="grid grid-cols-2 gap-1">{items.map(([label,to])=><Link key={label} to={to} onClick={close} className="rounded px-2 py-2 text-sm text-slate-600 hover:bg-red-50">{label}</Link>)}</div>}</section>)}
      <div className="flex items-center justify-between border-t border-slate-100 pt-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-800"><UserRound className="h-5 w-5 text-red-600"/>{isAuthenticated&&user?'My Account':'Your Account'}</div>
        {isAuthenticated&&user?<div className="flex gap-4"><Link to="/admin" onClick={close} className="text-sm font-medium text-red-600">Admin</Link><button type="button" onClick={()=>{close();logout(false)}} className="text-sm text-slate-700">Logout</button></div>:<Link to="/login" onClick={close} className="rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white">Login / Sign Up</Link>}
      </div>
    </div>}
  </header>;
}
