import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Youtube, Twitter, ArrowUpRight, CarFront } from 'lucide-react';

const groups = [
 { title: 'New Cars', links: [['Find New Cars','/browse?condition=New'],['Upcoming Cars','/browse?condition=New'],['Electric Cars','/browse?condition=New&fuel=Electric'],['Compare Cars','/compare'],['Car Brands','/browse?condition=New']] },
 { title: 'Used Cars', links: [['Find Used Cars','/browse?condition=Used'],['Used SUVs','/browse?condition=Used&body=SUV'],['Used Sedans','/browse?condition=Used&body=Sedan'],['Sell Your Car','/contact']] },
 { title: 'News & Reviews', links: [['Latest News','/news-reviews?tab=news'],['Car Reviews','/news-reviews?tab=reviews'],['Expert Reviews','/news-reviews?tab=expert'],['Videos','/news-reviews?tab=videos']] },
 { title: 'ShowCarDetail', links: [['About Us','/'],['Contact Us','/contact'],['Login','/login']] }
];
const brands = ['Maruti Suzuki','Hyundai','Tata','Mahindra','Kia','Toyota','Honda','BMW','Mercedes-Benz','Audi','MG','Skoda'];
function FooterColumn({title,links}) { return <div><h3 className="mb-4 text-sm font-bold text-white">{title}</h3><ul className="space-y-3">{links.map(([label,to])=><li key={label}><Link to={to} className="text-sm text-slate-300 transition hover:text-white">{label}</Link></li>)}</ul></div>; }
export default function Footer() {
 return <footer className="mt-16 bg-[#17212f] text-white">
  <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-14">
   <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.35fr_1fr_1fr_1fr_1fr]">
    <div>
     <Link to="/" className="inline-flex items-center gap-2 text-xl font-extrabold tracking-tight"><span className="grid h-9 w-9 place-items-center rounded-lg bg-red-600"><CarFront size={22}/></span><span>SHOW<span className="text-red-400">CAR</span>DETAIL</span></Link>
     <p className="mt-4 max-w-xs text-sm leading-6 text-slate-300">Your destination to explore new cars, find used cars and make informed car-buying decisions.</p>
     <div className="mt-6 flex gap-3">{[[Facebook,'https://www.facebook.com/','Facebook'],[Instagram,'https://www.instagram.com/','Instagram'],[Youtube,'https://www.youtube.com/','YouTube'],[Twitter,'https://twitter.com/','Twitter']].map(([Icon,url,label])=><a key={label} href={url} target="_blank" rel="noreferrer" aria-label={label} className="grid h-9 w-9 place-items-center rounded-full border border-slate-600 text-slate-200 transition hover:border-red-500 hover:bg-red-600"><Icon size={17}/></a>)}</div>
    </div>
    {groups.map(group=><FooterColumn key={group.title} {...group}/>)}
   </div>
   <div className="mt-12 border-t border-slate-700 pt-8">
    <h3 className="mb-4 text-sm font-bold text-white">Popular car brands</h3>
    <div className="flex flex-wrap gap-x-5 gap-y-3">{brands.map(brand=><Link key={brand} to={'/brand/'+brand.toLowerCase().replace(/\s+/g,'-')} className="text-xs text-slate-300 hover:text-white">{brand}</Link>)}</div>
   </div>
   <div className="mt-8 flex flex-col justify-between gap-3 border-t border-slate-700 pt-6 text-xs text-slate-400 sm:flex-row sm:items-center">
    <p>© {new Date().getFullYear()} ShowCarDetail. All rights reserved.</p>
    <div className="flex flex-wrap gap-5"><Link to="/contact" className="hover:text-white">Contact</Link><Link to="/login" className="hover:text-white">Sign in</Link><a href="#top" className="inline-flex items-center gap-1 hover:text-white">Back to top <ArrowUpRight size={13}/></a></div>
   </div>
  </div>
 </footer>;
}