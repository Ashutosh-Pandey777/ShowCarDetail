import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Youtube, Twitter, CarFront } from 'lucide-react';

const legalLinks = [
 ['About Us','https://www.carwale.com/about-us/'],
 ['Careers','https://www.carwale.com/career/'],
 ['Terms & Conditions','https://www.carwale.com/used/sell/terms/'],
 ['Advertise','https://www.carwale.com/contactus/']
];
export default function Footer() {
 return <footer className="mt-16 bg-[#17212f] text-white">
  <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
   <div className="flex flex-col justify-between gap-8 md:flex-row md:items-start">
    <div>
     <Link to="/" className="inline-flex items-center gap-2 text-xl font-extrabold tracking-tight"><span className="grid h-9 w-9 place-items-center rounded-lg bg-red-600"><CarFront size={22}/></span><span>SHOW<span className="text-red-400">CAR</span>DETAIL</span></Link>
     <p className="mt-3 max-w-sm text-sm leading-6 text-slate-300">Explore cars and make informed car-buying decisions with ShowCarDetail.</p>
     <div className="mt-5 flex gap-3">{[[Facebook,'https://www.facebook.com/','Facebook'],[Instagram,'https://www.instagram.com/','Instagram'],[Youtube,'https://www.youtube.com/','YouTube'],[Twitter,'https://twitter.com/','Twitter']].map(([Icon,url,label])=><a key={label} href={url} target="_blank" rel="noreferrer" aria-label={label} className="grid h-9 w-9 place-items-center rounded-full border border-slate-600 text-slate-200 transition hover:border-red-500 hover:bg-red-600"><Icon size={17}/></a>)}</div>
    </div>
    <div className="grid grid-cols-2 gap-x-10 gap-y-4 sm:grid-cols-4 md:gap-x-8">
     {legalLinks.map(([label,url])=><a key={label} href={url} target="_blank" rel="noreferrer" className="text-sm text-slate-300 transition hover:text-white">{label}</a>)}
    </div>
   </div>
   <div className="mt-9 flex flex-col justify-between gap-4 border-t border-slate-700 pt-6 text-xs text-slate-400 sm:flex-row sm:items-center">
    <p>© {new Date().getFullYear()} ShowCarDetail. All rights reserved.</p>
    <div className="flex items-center gap-3"><span className="text-slate-300">Language:</span><a href="/" className="font-semibold text-white hover:text-red-300">English</a><span className="text-slate-600">|</span><a href="https://www.carwale.com/hi/" target="_blank" rel="noreferrer" className="text-slate-300 hover:text-white">हिंदी</a></div>
   </div>
  </div>
 </footer>;
}