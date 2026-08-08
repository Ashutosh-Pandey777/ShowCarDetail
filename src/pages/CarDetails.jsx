import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Image } from '@/components/ui/image';
import { Fuel, Gauge, Cog, Users, Zap, Shield, Ruler, Heart, Share2, Download, GitCompare, ChevronRight, Star, Check, MapPin } from 'lucide-react';
import CarCard from '@/components/CarCard';
import EMICalculator from '@/components/EMICalculator';

export default function CarDetails() {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [tab, setTab] = useState('specs');

  useEffect(() => {
    setLoading(true);
    base44.entities.Car.get(id)
      .then(c => {
        setCar(c);
        setActiveImg(0);
        if (c?.brand) {
          base44.entities.Car.filter({ brand: c.brand }, '-created_date', 8)
            .then(r => setSimilar(r.filter(x => x.id !== c.id).slice(0, 4)))
            .catch(() => {});
        }
        base44.entities.Review.filter({ car_name: c?.name }, '-created_date', 5)
          .then(setReviews).catch(() => {});
      })
      .catch(() => setCar(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><div className="w-8 h-8 border-2 border-muted border-t-primary rounded-full animate-spin" /></div>;
  if (!car) return <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4"><p className="text-muted-foreground">Vehicle not found.</p><Link to="/browse" className="btn-kinetic">Browse all</Link></div>;

  const gallery = car.gallery?.length ? car.gallery : [car.image_url];

  return (
    <div className="bg-obsidian">
      {/* Breadcrumb */}
      <div className="max-w-chassis mx-auto px-4 sm:px-6 py-4 flex items-center gap-2 text-xs font-mono-data uppercase tracking-widest text-muted-foreground">
        <Link to="/" className="hover:text-primary">Home</Link><ChevronRight className="w-3 h-3" />
        <Link to={`/brand/${car.brand_slug}`} className="hover:text-primary">{car.brand}</Link><ChevronRight className="w-3 h-3" />
        <span className="text-foreground">{car.name}</span>
      </div>

      {/* Gallery + Summary */}
      <section className="max-w-chassis mx-auto px-4 sm:px-6 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="relative aspect-[16/10] bg-gunmetal overflow-hidden border border-hairline">
            <Image src={gallery[activeImg]} alt={car.name} className="w-full h-full object-cover" />
            {car.tags?.map(t => <span key={t} className="absolute top-4 left-4 chip bg-obsidian/70 backdrop-blur">{t}</span>)}
          </div>
          {gallery.length > 1 && (
            <div className="flex gap-2 mt-2 overflow-x-auto scrollbar-thin">
              {gallery.map((g, i) => (
                <button key={i} onClick={() => setActiveImg(i)} className={`relative shrink-0 w-24 aspect-[4/3] border-2 overflow-hidden ${activeImg === i ? 'border-primary' : 'border-hairline'}`}>
                  <img src={g} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="bg-card border border-hairline p-6">
          <p className="text-xs font-mono-data uppercase tracking-widest text-primary">{car.brand}</p>
          <h1 className="font-heading text-3xl font-bold mt-1">{car.name}</h1>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex">{[...5].map((_,i) => <Star key={i} className={`w-4 h-4 ${i < (car.safety_rating||4) ? 'text-primary fill-primary' : 'text-muted-foreground/30'}`} />)}</div>
            <span className="text-xs text-muted-foreground">Safety {car.safety_rating}/5</span>
          </div>

          <div className="mt-5 pt-5 border-t border-hairline">
            <p className="text-xs font-mono-data uppercase tracking-widest text-muted-foreground">Ex-showroom</p>
            <p className="font-mono-data text-3xl font-bold text-primary">₹{(car.price/100000).toFixed(2)}<span className="text-lg">L</span></p>
            <p className="text-xs text-muted-foreground mt-1">On-road ≈ ₹{(car.on_road_price/100000).toFixed(2)}L</p>
          </div>

          <div className="mt-5 grid grid-cols-4 gap-2">
            <MiniSpec icon={Fuel} label={car.fuel_type} />
            <MiniSpec icon={Gauge} label={car.mileage} />
            <MiniSpec icon={Cog} label={car.transmission} />
            <MiniSpec icon={Users} label={`${car.seating}p`} />
          </div>

          <div className="mt-5 space-y-2">
            <button className="btn-kinetic w-full">Get Best Offer</button>
            <div className="grid grid-cols-2 gap-2">
              <Link to="/compare" className="btn-ghost"><GitCompare className="w-4 h-4" /> Compare</Link>
              <button className="btn-ghost"><Download className="w-4 h-4" /> Brochure</button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button className="btn-ghost"><Heart className="w-4 h-4" /> Wishlist</button>
              <button className="btn-ghost"><Share2 className="w-4 h-4" /> Share</button>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Sub-nav */}
      <nav className="sticky top-16 z-30 bg-obsidian/90 backdrop-blur-xl border-y border-hairline mt-10">
        <div className="max-w-chassis mx-auto px-4 sm:px-6 flex gap-1 overflow-x-auto scrollbar-thin">
          {[['specs','Specifications'],['features','Features'],['variants','Variants'],['emi','EMI'],['reviews','Reviews'],['similar','Similar']].map(([k,l]) => (
            <button key={k} onClick={() => { setTab(k); document.getElementById(k)?.scrollIntoView({behavior:'smooth', block:'start'}); }} className={`px-5 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${tab===k ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>{l}</button>
          ))}
        </div>
      </nav>

      {/* Specs */}
      <section id="specs" className="max-w-chassis mx-auto px-4 sm:px-6 py-12">
        <div className="section-label mb-6"><span className="w-8 h-px bg-primary" />Technical Blueprint</div>
        <h2 className="font-heading text-2xl font-bold mb-8">Specifications</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-hairline">
          <SpecBlock icon={Fuel} label="Fuel Type" value={car.fuel_type} />
          <SpecBlock icon={Gauge} label="Mileage" value={car.mileage} />
          <SpecBlock icon={Cog} label="Transmission" value={car.transmission} />
          <SpecBlock icon={Users} label="Seating" value={`${car.seating} persons`} />
          <SpecBlock icon={Zap} label="Engine" value={car.engine} />
          <SpecBlock icon={Zap} label="Power" value={car.power} />
          <SpecBlock icon={Zap} label="Torque" value={car.torque} />
          <SpecBlock icon={Ruler} label="Boot Space" value={car.boot_space} />
          {car.fuel_type === 'Electric' && <SpecBlock icon={Zap} label="Range" value={`${car.range_km} km`} />}
          <SpecBlock icon={Shield} label="Safety Rating" value={`${car.safety_rating}/5`} />
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-chassis mx-auto px-4 sm:px-6 py-12 border-t border-hairline">
        <div className="section-label mb-6"><span className="w-8 h-px bg-primary" />Equipment</div>
        <h2 className="font-heading text-2xl font-bold mb-8">Key Features</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {(car.features||[]).map(f => (
            <div key={f} className="flex items-center gap-3 bg-card border border-hairline p-4">
              <Check className="w-4 h-4 text-primary shrink-0" />
              <span className="text-sm">{f}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Colors */}
      {car.colors?.length > 0 && (
        <section className="max-w-chassis mx-auto px-4 sm:px-6 py-12 border-t border-hairline">
          <div className="section-label mb-6"><span className="w-8 h-px bg-primary" />Palette</div>
          <h2 className="font-heading text-2xl font-bold mb-6">Color Options</h2>
          <div className="flex flex-wrap gap-3">
            {car.colors.map(c => (
              <div key={c} className="flex items-center gap-3 bg-card border border-hairline px-4 py-3">
                <span className="w-5 h-5 rounded-full border border-hairline" style={{ backgroundColor: c.toLowerCase() }} />
                <span className="text-sm">{c}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* EMI */}
      <section id="emi" className="max-w-chassis mx-auto px-4 sm:px-6 py-12 border-t border-hairline">
        <div className="section-label mb-6"><span className="w-8 h-px bg-primary" />Finance</div>
        <h2 className="font-heading text-2xl font-bold mb-8">EMI Calculator</h2>
        <div className="max-w-2xl"><EMICalculator price={car.price} /></div>
      </section>

      {/* Dealer Inquiry */}
      <section className="max-w-chassis mx-auto px-4 sm:px-6 py-12 border-t border-hairline">
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <div className="section-label mb-3"><span className="w-8 h-px bg-primary" />Dealer Inquiry</div>
            <h2 className="font-heading text-2xl font-bold mb-3">Request a test drive</h2>
            <p className="text-muted-foreground mb-6">Connect with an authorized dealer near you. Receive a personalized offer within 24 hours.</p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground"><MapPin className="w-4 h-4 text-primary" /> Available in {car.city || 'all major cities'}</div>
          </div>
          <DealerForm carName={car.name} />
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" className="max-w-chassis mx-auto px-4 sm:px-6 py-12 border-t border-hairline">
        <div className="section-label mb-6"><span className="w-8 h-px bg-primary" />Verdicts</div>
        <h2 className="font-heading text-2xl font-bold mb-8">Reviews</h2>
        {reviews.length === 0 ? (
          <p className="text-muted-foreground text-sm">No reviews yet. Be the first to share your verdict.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {reviews.map(r => <ReviewCard key={r.id} r={r} />)}
          </div>
        )}
      </section>

      {/* Similar */}
      {similar.length > 0 && (
        <section id="similar" className="max-w-chassis mx-auto px-4 sm:px-6 py-12 border-t border-hairline">
          <div className="section-label mb-6"><span className="w-8 h-px bg-primary" />Adjacent</div>
          <h2 className="font-heading text-2xl font-bold mb-8">Similar Vehicles</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {similar.map(c => <CarCard key={c.id} car={c} />)}
          </div>
        </section>
      )}

      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context':'https://schema.org/','@type':'Car', name: `${car.brand} ${car.name}`, brand: car.brand,
        vehicleConfiguration: car.body_type, fuelType: car.fuel_type, vehicleTransmission: car.transmission,
        offers: { '@type':'Offer', priceCurrency:'INR', price: car.price }
      })}} />
    </div>
  );
}

function MiniSpec({ icon: Icon, label }) {
  return (
    <div className="flex flex-col items-center gap-1 py-3 border border-hairline">
      <Icon className="w-4 h-4 text-primary" />
      <span className="text-[10px] font-mono-data text-muted-foreground">{label}</span>
    </div>
  );
}

function SpecBlock({ icon: Icon, label, value }) {
  return (
    <div className="bg-card p-5">
      <Icon className="w-5 h-5 text-primary mb-3" />
      <p className="text-xs font-mono-data uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="font-mono-data text-lg font-semibold mt-1">{value || '—'}</p>
    </div>
  );
}

function ReviewCard({ r }) {
  return (
    <div className="bg-card border border-hairline p-5">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="font-semibold text-sm">{r.author}</p>
          <span className="chip mt-1">{r.type}</span>
        </div>
        <div className="flex">{[...5].map((_,i) => <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? 'text-primary fill-primary' : 'text-muted-foreground/30'}`} />)}</div>
      </div>
      <p className="font-medium text-sm mb-2">{r.title}</p>
      <p className="text-sm text-muted-foreground leading-relaxed mb-3">{r.body}</p>
      {r.pros?.length > 0 && <div className="text-xs"><span className="text-primary">Pros: </span>{r.pros.join(', ')}</div>}
      {r.cons?.length > 0 && <div className="text-xs mt-1"><span className="text-destructive">Cons: </span>{r.cons.join(', ')}</div>}
    </div>
  );
}

function DealerForm({ carName }) {
  const [sent, setSent] = useState(false);
  return sent ? (
    <div className="bg-card border border-primary/40 p-8 flex flex-col items-center justify-center text-center">
      <Check className="w-10 h-10 text-primary mb-3" />
      <p className="font-heading text-lg font-bold">Inquiry submitted.</p>
      <p className="text-sm text-muted-foreground mt-1">A dealer will contact you shortly regarding the {carName}.</p>
    </div>
  ) : (
    <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="bg-card border border-hairline p-6 space-y-3">
      <input required placeholder="Full name" className="w-full bg-secondary border border-hairline px-4 py-3 text-sm outline-none focus:border-primary/50" />
      <input required type="tel" placeholder="Phone number" className="w-full bg-secondary border border-hairline px-4 py-3 text-sm outline-none focus:border-primary/50" />
      <input required type="email" placeholder="Email" className="w-full bg-secondary border border-hairline px-4 py-3 text-sm outline-none focus:border-primary/50" />
      <select className="w-full bg-secondary border border-hairline px-4 py-3 text-sm outline-none">
        <option className="bg-gunmetal">Mumbai</option><option className="bg-gunmetal">Delhi</option><option className="bg-gunmetal">Bangalore</option>
      </select>
      <button type="submit" className="btn-kinetic w-full">Submit Inquiry</button>
    </form>
  );
}