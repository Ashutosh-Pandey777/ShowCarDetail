import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Youtube, Twitter } from 'lucide-react';
const BRANDS=['Maruti Suzuki','Hyundai','Tata','Mahindra','Kia','Toyota','Honda','BMW','Mercedes-Benz','Audi','MG','Skoda'];
function Col({title,links}){return <div><h3 className="mb-4 text-sm font-bold text-slate-900">{title}</h3><ul className="space-y-2.5">{links.map(([label,to])=><li key={label}><Link to={to} className="text-sm text-slate-600 hover:text-red-600">{label}</Link></li>)}</ul></div>}
export default function Footer(){return <footer className="mt-16 border-t border-slate-200 bg-slate-50 text-slate-800">
  <div className="mx-auto max-w-chassis px-4 py-12 sm:px-6">
    <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
      <div className="col-span-2 lg:col-span-1"><Link to="/" className="mb-4 inline-flex items-center gap-2 text-lg font-extrabold"> <span className="text-red-600">◉</span> SHOWCARDETAIL</Link><p className="max-w-xs text-sm leading-6 text-slate-600">Find the right car with trusted specifications, comparisons, news and reviews.</p><div className="mt-5 flex gap-4 text-slate-500"><a href="https://www.facebook.com/" aria-label="Facebook"><Facebook size={18}/></a><a href="https://www.instagram.com/" aria-label="Instagram"><Instagram size={18}/></a><a href="https://www.youtube.com/" aria-label="YouTube"><Youtube size={18}/></a><a href="https://twitter.com/" aria-label="Twitter"><Twitter size={18}/></a></div></div>
      <Col title="New Cars" links={ [['Find New Cars','/browse?condition=New'],['Upcoming Cars','/browse?condition=New'],['Electric Cars','/browse?condition=New&fuel=Electric'],['Compare Cars','/compare'],['Car Brands','/browse?condition=New']]}/>
      <Col title="Used Cars" links={ [['Find Used Cars','/browse?condition=Used'],['Used SUVs','/browse?condition=Used&body=SUV'],['Used Sedans','/browse?condition=Used&body=Sedan'],['Sell / List Your Car','/contact']]}/>
      <Col title="News & Reviews" links={ [['Latest News','/news-reviews?tab=news'],['Car Reviews','/news-reviews?tab=reviews'],['Expert Reviews','/news-reviews?tab=expert'],['Videos','/news-reviews?tab=videos']]}/>
      <Col title="Popular Brands" links={BRANDS.map(b=>[b,'/brand/'+b.toLowerCase().replace(/\s+/g,'-')])}/>
    </div>
    <div className="mt-10 flex flex-col justify-between gap-3 border-t border-slate-200 pt-6 text-xs text-slate-500 sm:flex-row"><p>© {new Date().getFullYear()} ShowCarDetail. All rights reserved.</p><div className="flex gap-5"><Link to="/contact" className="hover:text-red-600">Contact Us</Link><Link to="/login" className="hover:text-red-600">Login</Link></div></div>
  </div></footer>}
