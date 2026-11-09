import React from 'react';
import { Link } from 'react-router-dom';
const BRANDS = ['Maruti Suzuki', 'Hyundai', 'Tata', 'Mahindra', 'Kia', 'Toyota', 'BMW', 'Mercedes-Benz', 'Audi', 'MG'];
export default function Footer() {
  return <footer className="bg-obsidian border-t border-hairline mt-24"><div className="max-w-chassis mx-auto px-4 sm:px-6 py-14">
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
      <div className="col-span-2"><Link to="/" className="flex items-center gap-2.5 mb-4"><svg width="32" height="32" viewBox="0 0 36 36" fill="none" aria-hidden="true"><path d="M4 24.5 9.5 12h17L32 24.5M7 24.5h22" stroke="#eeb52e" strokeWidth="2.4" strokeLinejoin="round"/><circle cx="11" cy="25" r="3" fill="#0d1118" stroke="#eeb52e" strokeWidth="2"/><circle cx="25" cy="25" r="3" fill="#0d1118" stroke="#eeb52e" strokeWidth="2"/></svg><span className="font-heading font-extrabold text-lg">SHOW<span className="text-amber-400">CAR</span>DETAIL</span></Link>
        <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">Research, compare and discover new and used cars. Find specifications, prices and finance tools to make a confident decision.</p></div>
      <FooterCol title="Explore" links={[['New Cars','/browse?condition=New'],['Used Cars','/browse?condition=Used'],['Compare Cars','/compare'],['Electric Cars','/browse?fuel=Electric'],['EMI Calculator','/emi']]} />
      <FooterCol title="Popular Brands" links={BRANDS.map(b => [b, '/brand/' + b.toLowerCase().replace(/\s+/g, '-')])} />
      <FooterCol title="Company" links={ [['Contact Us','/contact'],['Admin Login','/login']] } />
    </div>
    <div className="mt-12 pt-6 border-t border-hairline flex flex-col sm:flex-row justify-between items-center gap-3"><p className="text-xs font-mono-data text-muted-foreground">© {new Date().getFullYear()} SHOWCARDETAIL — ALL RIGHTS RESERVED</p><p className="text-xs font-mono-data text-muted-foreground">RESEARCH · COMPARE · DRIVE</p></div>
  </div></footer>;
}
function FooterCol({ title, links }) { return <div><h4 className="text-xs font-mono-data uppercase tracking-widest text-primary mb-4">{title}</h4><ul className="space-y-2">{links.map(([label,to]) => <li key={label}><Link to={to} className="text-sm text-muted-foreground hover:text-foreground transition-colors">{label}</Link></li>)}</ul></div>; }
