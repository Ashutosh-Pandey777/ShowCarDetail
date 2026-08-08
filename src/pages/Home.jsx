import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Image } from '@/components/ui/image';
import { ChevronRight, ArrowRight, Zap, Shield, Gauge, Wallet, Car as CarIcon, Star, Plus } from 'lucide-react';
import CarCard from '@/components/CarCard';
import EMICalculator from '@/components/EMICalculator';
import GalleryStrip from '@/components/GalleryStrip';

export default function Home() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.Car.list('-created_date', 60)
      .then(setCars)
      .catch(() => setCars([]))
      .finally(() => setLoading(false));
  }, []);

  const byTag = (t) => cars.filter(c => c.tags?.includes(t));
  const featured = byTag('Featured');
  const latest = byTag('Latest');
  const upcoming = byTag('Upcoming');
  const electric = byTag('Electric');
  const luxury = byTag('Luxury');
  const popular = byTag('Popular');

  return (
    <div className="bg-obsidian">
      <Hero />
      <QuickSearch />
      <BrandStrip />
      <CarRow title="Featured" label="Curated Selection" cars={featured} loading={loading} viewAll="/browse" />
      <Categories />
      <CarRow title="Latest Arrivals" label="New Inventory" cars={latest} loading={loading} viewAll="/browse" />
      <CompareCTA />
      <div className="grid lg:grid-cols-2 gap-1">
        <CarRow title="Electric" label="Zero Emission" cars={electric} loading={loading} compact viewAll="/browse?fuel=Electric" />
        <CarRow title="Luxury" label="Prestige Tier" cars={luxury} loading={loading} compact viewAll="/browse" />
      </div>
      <CarRow title="Upcoming" label="Forthcoming Models" cars={upcoming} loading={loading} viewAll="/browse" />
      <GalleryStrip />
      <FinanceCTA />
      <Testimonials />
      <FAQ />
    </div>
  );
}

/* ── HERO ─────────────────────────────────────────── */
function Hero() {
  const [body, setBody] = useState('');
  const [budget, setBudget] = useState('');
  const [fuel, setFuel] = useState('');

  const go = () => {
    const p = new URLSearchParams();
    if (body) p.set('body', body);
    if (budget) p.set('budget', budget);
    if (fuel) p.set('fuel', fuel);
    window.location.href = `/browse?${p.toString()}`;
  };

  return (
    <section className="relative h-[92vh] min-h-[640px] overflow-hidden">
      <img src="https://media.base44.com/images/public/6a7339c4158e000097245929/18bb6f86c_generated_50c4b9a7.png" alt="Cinematic luxury SUV" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />
      <div className="relative h-full max-w-chassis mx-auto px-4 sm:px-6 flex flex-col justify-end pb-16">
        <div className="max-w-2xl animate-fade-up">
          <p className="section-label mb-4 text-white"><span className="w-8 h-px bg-white" />Precision Automotive Marketplace</p>
          <h1 className="font-heading text-5xl sm:text-7xl font-extrabold leading-[0.95] tracking-tight text-balance text-white">
            Drive the<br/><span className="text-amber-400">extraordinary.</span>
          </h1>
          <p className="mt-5 text-lg text-white/80 max-w-lg leading-relaxed">A high-velocity digital showroom where engineering meets desire. Discover, compare, and finance your next machine.</p>
        </div>

        {/* Command Line Search */}
        <div className="mt-10 bg-black/80 backdrop-blur-xl border border-white/15 p-1.5 flex flex-col sm:flex-row gap-1.5 max-w-3xl">
          <Select value={body} onChange={setBody} options={['SUV','Sedan','Hatchback','Coupe','MUV']} placeholder="Body Type" />
          <div className="hidden sm:block w-px bg-white/15 self-stretch" />
          <Select value={budget} onChange={setBudget} options={['Under ₹10L','₹10-20L','₹20-40L','₹40L+']} placeholder="Budget" />
          <div className="hidden sm:block w-px bg-white/15 self-stretch" />
          <Select value={fuel} onChange={setFuel} options={['Petrol','Diesel','Electric','Hybrid']} placeholder="Fuel" />
          <button onClick={go} className="btn-kinetic shrink-0">
            Search <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {['Trending: SUVs','Electric under ₹20L','Family Sedans','Performance Coupes'].map(t => (
            <button key={t} onClick={() => window.location.href='/browse'} className="chip bg-white/5 border-white/20 text-white/80 hover:border-white hover:text-white transition-colors">{t}</button>
          ))}
        </div>
      </div>
    </section>
  );
}

function Select({ value, onChange, options, placeholder }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className="flex-1 bg-transparent text-white px-4 py-3 text-sm outline-none cursor-pointer appearance-none">
      <option value="" className="bg-black text-white">{placeholder}</option>
      {options.map(o => <option key={o} value={o} className="bg-black text-white">{o}</option>)}
    </select>
  );
}

/* ── QUICK SEARCH ─────────────────────────────────── */
function QuickSearch() {
  const items = [
    { icon: CarIcon, label: 'By Brand', to: '/browse' },
    { icon: Wallet, label: 'By Budget', to: '/browse' },
    { icon: Zap, label: 'By Fuel', to: '/browse?fuel=Electric' },
    { icon: CarIcon, label: 'By Body Type', to: '/browse' },
    { icon: Gauge, label: 'By Transmission', to: '/browse' },
  ];
  return (
    <section className="border-b border-hairline bg-gunmetal">
      <div className="max-w-chassis mx-auto px-4 sm:px-6 py-6 grid grid-cols-2 md:grid-cols-5 gap-3">
        {items.map(({ icon: Icon, label, to }) => (
          <Link key={label} to={to} className="flex items-center gap-3 px-4 py-4 border border-hairline bg-card hover:border-primary/40 transition-colors group">
            <Icon className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium">{label}</span>
            <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto group-hover:text-primary transition-colors" />
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ── BRAND STRIP ─────────────────────────────────── */
function BrandStrip() {
  const brands = ['Toyota','Hyundai','Tata','Mahindra','Kia','Maruti Suzuki','Honda','BMW','Mercedes-Benz','Audi','MG','Skoda','Volkswagen','Nissan','Renault','BYD','Volvo','Jeep'];
  return (
    <section className="py-12 overflow-hidden">
      <div className="max-w-chassis mx-auto px-4 sm:px-6 mb-6">
        <div className="section-label"><span className="w-8 h-px bg-primary" />Browse by Manufacturer</div>
      </div>
      <div className="relative flex overflow-hidden">
        <div className="flex gap-8 animate-marquee shrink-0 pr-8">
          {[...brands, ...brands].map((b, i) => (
            <Link key={i} to={`/brand/${b.toLowerCase().replace(/\s+/g,'-')}`} className="flex items-center justify-center px-8 py-4 border border-hairline bg-card whitespace-nowrap hover:border-primary/40 transition-colors">
              <span className="font-heading text-lg font-bold tracking-tight text-muted-foreground hover:text-foreground transition-colors">{b}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── CAR ROW ─────────────────────────────────────── */
function CarRow({ title, label, cars, loading, viewAll, compact }) {
  return (
    <section className="py-10">
      <div className="max-w-chassis mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="section-label mb-2"><span className="w-8 h-px bg-primary" />{label}</div>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight">{title}</h2>
          </div>
          {viewAll && <Link to={viewAll} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">View All <ChevronRight className="w-4 h-4" /></Link>}
        </div>
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(compact?2:4)].map((_,i) => <div key={i} className="aspect-[16/10] bg-card animate-pulse" />)}
          </div>
        ) : (
          <div className={`grid ${compact ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-4'} gap-4`}>
            {cars.slice(0, compact ? 2 : 4).map(c => <CarCard key={c.id} car={c} />)}
          </div>
        )}
      </div>
    </section>
  );
}

/* ── CATEGORIES ──────────────────────────────────── */
function Categories() {
  const cats = [
    { name: 'SUVs', desc: 'Command the road', to: '/browse?body=SUV', img: 'https://media.base44.com/images/public/6a7339c4158e000097245929/f14449a2c_generated_46ce4132.png' },
    { name: 'Sedans', desc: 'Refined elegance', to: '/browse?body=Sedan', img: 'https://media.base44.com/images/public/6a7339c4158e000097245929/cc031488e_generated_740934e7.png' },
    { name: 'Electric', desc: 'Silent power', to: '/browse?fuel=Electric', img: 'https://media.base44.com/images/public/6a7339c4158e000097245929/cc031488e_generated_740934e7.png' },
    { name: 'Coupes', desc: 'Performance dna', to: '/browse?body=Coupe', img: 'https://media.base44.com/images/public/6a7339c4158e000097245929/dfa8c5378_generated_ef182013.png' },
  ];
  return (
    <section className="py-16 bg-gunmetal border-y border-hairline">
      <div className="max-w-chassis mx-auto px-4 sm:px-6">
        <div className="section-label mb-2"><span className="w-8 h-px bg-primary" />Explore Categories</div>
        <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-8">Find your form</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {cats.map(c => (
            <Link key={c.name} to={c.to} className="group relative aspect-[4/5] overflow-hidden bg-card border border-hairline">
              <img src={c.img} alt={c.name} className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-transparent" />
              <div className="absolute bottom-0 left-0 p-5">
                <h3 className="font-heading text-xl font-bold">{c.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">{c.desc}</p>
                <span className="inline-flex items-center gap-1 mt-3 text-xs font-mono-data uppercase tracking-widest text-primary">Explore <ArrowRight className="w-3 h-3" /></span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── COMPARE CTA ─────────────────────────────────── */
function CompareCTA() {
  return (
    <section className="py-16">
      <div className="max-w-chassis mx-auto px-4 sm:px-6">
        <div className="relative bg-card border border-hairline p-8 sm:p-12 overflow-hidden">
          <div className="absolute right-0 top-0 w-1/2 h-full opacity-20">
            <img src="https://media.base44.com/images/public/6a7339c4158e000097245929/dfa8c5378_generated_ef182013.png" alt="" className="w-full h-full object-cover" />
          </div>
          <div className="relative max-w-md">
            <div className="section-label mb-3"><span className="w-8 h-px bg-primary" />Comparison Engine</div>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-3">Spec vs. spec.<br/>No compromises.</h2>
            <p className="text-muted-foreground mb-6">Stack up to four vehicles side by side. Reveal the delta in horsepower, efficiency, and dimension — in high contrast.</p>
            <Link to="/compare" className="btn-kinetic">Open Compare <Plus className="w-4 h-4" /></Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── FINANCE CTA ─────────────────────────────────── */
function FinanceCTA() {
  return (
    <section className="py-16 bg-gunmetal border-y border-hairline">
      <div className="max-w-chassis mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-8 items-center">
        <div>
          <div className="section-label mb-3"><span className="w-8 h-px bg-primary" />Finance Module</div>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-3">Calculate. Plan. Drive.</h2>
          <p className="text-muted-foreground mb-6">Estimate your monthly outflow in seconds. Adjust down payment, tenure, and rate to find the configuration that fits your trajectory.</p>
          <div className="grid grid-cols-3 gap-4">
            {[['EMI','Instant'],['Loans','Flexible'],['Insurance','Built-in']].map(([a,b]) => (
              <div key={a} className="border border-hairline p-4">
                <Shield className="w-5 h-5 text-primary mb-2" />
                <p className="text-sm font-semibold">{a}</p>
                <p className="text-xs text-muted-foreground">{b}</p>
              </div>
            ))}
          </div>
        </div>
        <EMICalculator price={2500000} compact />
      </div>
    </section>
  );
}

/* ── TESTIMONIALS ────────────────────────────────── */
function Testimonials() {
  const reviews = [
    { name: 'Arjun Mehta', role: 'Verified Buyer', text: 'The comparison engine saved me weeks of research. I could see exactly why one SUV outclassed another — down to boot space.', rating: 5 },
    { name: 'Priya Nair', role: 'EV Enthusiast', text: 'Found my electric sedan through the precision filters. The whole experience felt engineered, not cluttered like other sites.', rating: 5 },
    { name: 'Rohan Kapoor', role: 'Performance Driver', text: 'The blueprint aesthetic and technical spec layout made choosing a performance coupe genuinely enjoyable.', rating: 4 },
  ];
  return (
    <section className="py-16">
      <div className="max-w-chassis mx-auto px-4 sm:px-6">
        <div className="section-label mb-2"><span className="w-8 h-px bg-primary" />Testimonials</div>
        <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-8">Precision, validated.</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {reviews.map(r => (
            <div key={r.name} className="bg-card border border-hairline p-6">
              <div className="flex gap-1 mb-4">{[...Array(5)].map((_,i) => <Star key={i} className={`w-4 h-4 ${i < r.rating ? 'text-primary fill-primary' : 'text-muted-foreground/30'}`} />)}</div>
              <p className="text-sm leading-relaxed text-foreground/90 mb-5">"{r.text}"</p>
              <div className="pt-4 border-t border-hairline">
                <p className="font-semibold text-sm">{r.name}</p>
                <p className="text-xs font-mono-data uppercase tracking-widest text-muted-foreground">{r.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── FAQ ─────────────────────────────────────────── */
function FAQ() {
  const faqs = [
    { q: 'How does the comparison engine work?', a: 'Select up to four vehicles and we stack their specifications — price, mileage, engine, dimensions, and safety — side by side, highlighting the delta between each.' },
    { q: 'Is the EMI calculator accurate?', a: 'It provides a close estimate based on your down payment, interest rate, and tenure. Final figures depend on your lender and credit profile.' },
    { q: 'Can I filter by city and availability?', a: 'Yes. The browse page supports filtering by body type, fuel, transmission, price range, seating, and city availability.' },
    { q: 'Do you support electric vehicles?', a: 'Absolutely. Our Electric category includes range, charging, and battery specifications alongside the standard metrics.' },
  ];
  const [open, setOpen] = useState(0);
  return (
    <section className="py-16 bg-gunmetal border-y border-hairline">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="section-label mb-2 justify-center"><span className="w-8 h-px bg-primary" />FAQ</div>
        <h2 className="font-heading text-3xl sm:text-4xl font-bold text-center mb-10">Questions, answered.</h2>
        <div className="space-y-2">
          {faqs.map((f, i) => (
            <div key={i} className="border border-hairline bg-card">
              <button onClick={() => setOpen(open === i ? -1 : i)} className="w-full flex items-center justify-between p-5 text-left">
                <span className="font-medium text-sm">{f.q}</span>
                <Plus className={`w-4 h-4 text-primary transition-transform ${open === i ? 'rotate-45' : ''}`} />
              </button>
              {open === i && <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">{f.a}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}