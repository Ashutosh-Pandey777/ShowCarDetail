import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import CarCard from '@/components/CarCard';

const BODY_TYPES = ['SUV','Sedan','Hatchback','Coupe','MUV','Convertible'];
const FUELS = ['Petrol','Diesel','Electric','Hybrid','CNG'];
const TRANSMISSIONS = ['Manual','Automatic'];
const BUDGETS = [['Under ₹10L',0,1000000],['₹10-20L',1000000,2000000],['₹20-40L',2000000,4000000],['₹40L+',4000000,99999999]];
const SEATS = [4,5,6,7,8];

export default function Browse() {
  const [params, setParams] = useSearchParams();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [sort, setSort] = useState('-created_date');

  const [filters, setFilters] = useState({
    body: params.get('body') || '',
    fuel: params.get('fuel') || '',
    transmission: '',
    seats: '',
    budget: '',
    q: params.get('q') || '',
  });

  useEffect(() => {
    base44.entities.Car.list(sort, 100)
      .then(setCars).catch(() => setCars([])).finally(() => setLoading(false));
  }, [sort]);

  const set = (key, val) => setFilters(f => ({ ...f, [key]: val }));

  const filtered = cars.filter(c => {
    if (filters.body && c.body_type !== filters.body) return false;
    if (filters.fuel && c.fuel_type !== filters.fuel) return false;
    if (filters.transmission && c.transmission !== filters.transmission) return false;
    if (filters.seats && c.seating !== parseInt(filters.seats)) return false;
    if (filters.budget) {
      const [, min, max] = BUDGETS.find(b => b[0] === filters.budget);
      if (c.price < min || c.price >= max) return false;
    }
    if (filters.q) {
      const q = filters.q.toLowerCase();
      if (!`${c.name} ${c.brand}`.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const activeCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="bg-obsidian min-h-screen">
      <div className="max-w-chassis mx-auto px-4 sm:px-6 py-8">
        <div className="section-label mb-2"><span className="w-8 h-px bg-primary" />Inventory</div>
        <h1 className="font-heading text-4xl font-bold mb-2">Browse Vehicles</h1>
        <p className="text-muted-foreground mb-8">{filtered.length} machines matching your parameters.</p>

        <div className="grid lg:grid-cols-[280px_1fr] gap-8">
          {/* Filters */}
          <aside className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
            <div className="bg-card border border-hairline p-5 sticky top-20">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-heading font-bold flex items-center gap-2"><SlidersHorizontal className="w-4 h-4 text-primary" /> Filters</h3>
                {activeCount > 0 && <button onClick={() => setFilters({body:'',fuel:'',transmission:'',seats:'',budget:'',q:''})} className="text-xs text-muted-foreground hover:text-primary">Clear ({activeCount})</button>}
              </div>

              <FilterGroup title="Body Type">
                <div className="flex flex-wrap gap-2">{BODY_TYPES.map(b => <Pill key={b} active={filters.body===b} onClick={() => set('body', filters.body===b?'':b)}>{b}</Pill>)}</div>
              </FilterGroup>
              <FilterGroup title="Fuel Type">
                <div className="flex flex-wrap gap-2">{FUELS.map(b => <Pill key={b} active={filters.fuel===b} onClick={() => set('fuel', filters.fuel===b?'':b)}>{b}</Pill>)}</div>
              </FilterGroup>
              <FilterGroup title="Budget">
                <div className="flex flex-wrap gap-2">{BUDGETS.map(([l]) => <Pill key={l} active={filters.budget===l} onClick={() => set('budget', filters.budget===l?'':l)}>{l}</Pill>)}</div>
              </FilterGroup>
              <FilterGroup title="Transmission">
                <div className="flex flex-wrap gap-2">{TRANSMISSIONS.map(b => <Pill key={b} active={filters.transmission===b} onClick={() => set('transmission', filters.transmission===b?'':b)}>{b}</Pill>)}</div>
              </FilterGroup>
              <FilterGroup title="Seating">
                <div className="flex flex-wrap gap-2">{SEATS.map(b => <Pill key={b} active={filters.seats===String(b)} onClick={() => set('seats', filters.seats===String(b)?'':String(b))}>{b}p</Pill>)}</div>
              </FilterGroup>
            </div>
          </aside>

          {/* Results */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <button onClick={() => setShowFilters(!showFilters)} className="lg:hidden btn-ghost py-2 px-4 text-xs"><SlidersHorizontal className="w-4 h-4" /> Filters {activeCount>0 && `(${activeCount})`}</button>
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-xs font-mono-data uppercase tracking-widest text-muted-foreground">Sort</span>
                <select value={sort} onChange={(e) => setSort(e.target.value)} className="bg-card border border-hairline px-3 py-2 text-sm outline-none">
                  <option value="-created_date" className="bg-gunmetal">Latest</option>
                  <option value="price" className="bg-gunmetal">Price: Low to High</option>
                  <option value="-price" className="bg-gunmetal">Price: High to Low</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">{[...Array(6)].map((_,i) => <div key={i} className="aspect-[16/10] bg-card animate-pulse" />)}</div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20 border border-hairline"><p className="text-muted-foreground">No vehicles match these parameters.</p><button onClick={() => setFilters({body:'',fuel:'',transmission:'',seats:'',budget:'',q:''})} className="btn-ghost mt-4">Clear filters</button></div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map(c => <CarCard key={c.id} car={c} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ title, children }) {
  return (
    <div className="mb-5 pb-5 border-b border-hairline last:border-0 last:pb-0">
      <p className="text-xs font-mono-data uppercase tracking-widest text-muted-foreground mb-3">{title}</p>
      {children}
    </div>
  );
}

function Pill({ active, onClick, children }) {
  return (
    <button onClick={onClick} className={`px-3 py-1.5 text-xs border transition-colors ${active ? 'bg-primary text-primary-foreground border-primary' : 'border-hairline text-muted-foreground hover:border-primary/50 hover:text-foreground'}`}>{children}</button>
  );
}