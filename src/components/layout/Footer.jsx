import React from 'react';
import { Link } from 'react-router-dom';

const BRANDS = ['Toyota', 'Hyundai', 'Tata', 'Mahindra', 'Kia', 'BMW', 'Audi', 'MG'];

export default function Footer() {
  return (
    <footer className="bg-obsidian border-t border-hairline mt-24">
      <div className="max-w-chassis mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                <path d="M4 22L9 9h14l5 13" stroke="#F5B324" strokeWidth="2.5" strokeLinejoin="round"/>
                <circle cx="11" cy="22" r="2.5" fill="#F5B324"/>
                <circle cx="21" cy="22" r="2.5" fill="#F5B324"/>
              </svg>
              <span className="font-heading font-extrabold text-lg">KINETIC</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">A high-velocity digital showroom engineered for precision automotive discovery. Technical luxury, by design.</p>
          </div>
          <FooterCol title="Explore" links={[['New Cars','/browse'],['Compare','/compare'],['Electric','/browse?fuel=Electric'],['Finance','/emi']]} />
          <FooterCol title="Brands" links={BRANDS.map(b => [b, `/brand/${b.toLowerCase()}`])} />
          <FooterCol title="Company" links={[['About','#'],['News','#'],['Dealers','#'],['Contact','#'],['Privacy','#'],['Terms','#']]} />
        </div>
        <div className="mt-12 pt-6 border-t border-hairline flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs font-mono-data text-muted-foreground">© 2026 KINETIC MOTORWORKS — ALL RIGHTS RESERVED</p>
          <p className="text-xs font-mono-data text-muted-foreground">DESIGNED WITH PRECISION · BUILT FOR SPEED</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }) {
  return (
    <div>
      <h4 className="text-xs font-mono-data uppercase tracking-widest text-primary mb-4">{title}</h4>
      <ul className="space-y-2">
        {links.map(([label, to]) => (
          <li key={label}><Link to={to} className="text-sm text-muted-foreground hover:text-foreground transition-colors">{label}</Link></li>
        ))}
      </ul>
    </div>
  );
}