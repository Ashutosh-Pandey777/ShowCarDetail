import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { ChevronRight, Zap } from 'lucide-react';
import CarCard from '@/components/CarCard';

export default function Brand() {
  const { slug } = useParams();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  const brandName = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  useEffect(() => {
    setLoading(true);
    base44.entities.Car.filter({}, '-created_date', 100)
      .then(all => setCars(all.filter(c => c.brand_slug === slug || c.brand?.toLowerCase().replace(/\s+/g,'-') === slug)))
      .catch(() => setCars([]))
      .finally(() => setLoading(false));
  }, [slug]);

  const byTag = (t) => cars.filter(c => c.tags?.includes(t));

  return (
    <div className="bg-obsidian">
      {/* Brand banner */}
      <section className="relative h-[40vh] min-h-[300px] overflow-hidden border-b border-hairline">
        <img src={cars[0]?.image_url || 'https://media.base44.com/images/public/6a7339c4158e000097245929/f14449a2c_generated_46ce4132.png'} alt={brandName} className="absolute inset-0 w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian to-transparent" />
        <div className="relative h-full max-w-chassis mx-auto px-4 sm:px-6 flex flex-col justify-end pb-10">
          <div className="flex items-center gap-2 text-xs font-mono-data uppercase tracking-widest text-muted-foreground mb-3">
            <Link to="/" className="hover:text-primary">Home</Link><ChevronRight className="w-3 h-3" /> Brands <ChevronRight className="w-3 h-3" /> {brandName}
          </div>
          <h1 className="font-heading text-5xl sm:text-7xl font-extrabold tracking-tight">{brandName}</h1>
          <p className="text-muted-foreground mt-2 max-w-xl">{cars.length} models in our precision-indexed inventory — from everyday commuters to flagship machines.</p>
        </div>
      </section>

      <div className="max-w-chassis mx-auto px-4 sm:px-6 py-10 space-y-12">
        <BrandSection title="All Models" label="Inventory" cars={cars} loading={loading} />
        {byTag('Electric').length > 0 && <BrandSection title="Electric" label="Zero Emission" cars={byTag('Electric')} />}
        {byTag('Upcoming').length > 0 && <BrandSection title="Upcoming" label="Forthcoming" cars={byTag('Upcoming')} />}
        {byTag('Luxury').length > 0 && <BrandSection title="Luxury" label="Prestige Tier" cars={byTag('Luxury')} />}
      </div>
    </div>
  );
}

function BrandSection({ title, label, cars, loading }) {
  if (!loading && cars.length === 0) return null;
  return (
    <section>
      <div className="flex items-end justify-between mb-5">
        <div>
          <div className="section-label mb-1"><span className="w-8 h-px bg-primary" />{label}</div>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold">{title}</h2>
        </div>
        <span className="text-xs font-mono-data text-muted-foreground">{cars.length} models</span>
      </div>
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">{[...Array(4)].map((_,i) => <div key={i} className="aspect-[16/10] bg-card animate-pulse" />)}</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">{cars.map(c => <CarCard key={c.id} car={c} />)}</div>
      )}
    </section>
  );
}