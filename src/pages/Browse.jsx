import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { SlidersHorizontal } from 'lucide-react';
import CarCard from '@/components/CarCard';

const BODY_TYPES = ['SUV','Compact SUV','Hatchback','Sedan','Compact Sedan','MUV','Luxury','Coupe','Convertible','Pickup','Minivan'];
const FUELS = ['Petrol','Diesel','Electric','Hybrid','CNG'];
const TRANSMISSIONS = ['Manual','Automatic'];
const BUDGETS = [['Under ₹5 Lakh',0,500000],['₹5 - 10 Lakh',500000,1000000],['₹10 - 20 Lakh',1000000,2000000],['₹20 - 30 Lakh',2000000,3000000],['₹30 - 50 Lakh',3000000,5000000],['Above ₹50 Lakh',5000000,999999999]];
const SEATS = [4,5,6,7,8];

export default function Browse() {
  const [params] = useSearchParams();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(() => params.get('filters') === '1');
  const [sort, setSort] = useState('-created_date');
  const [filters, setFilters] = useState({
    condition: params.get('condition') || '', body: params.get('body') || '',
    fuel: params.get('fuel') || '', transmission: params.get('transmission') || '', seats: params.get('seats') || '', budget: params.get('budget') || '', q: params.get('q') || '',
  });
  useEffect(() => {
    let mounted = true;
    base44.entities.Car.list(sort, 500).then(data => { if (mounted) setCars(Array.isArray(data) ? data : []); })
      .catch(() => { if (mounted) setCars([]); }).finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [sort]);
  const set = (key, val) => setFilters(f => ({ ...f, [key]: val }));
  const clearFilters = () => setFilters({condition:'',body:'',fuel:'',transmission:'',seats:'',budget:'',q:''});
  const filtered = cars.filter(c => {
    const condition = String(c.condition || c.listing_type || 'New').toLowerCase();
    if (filters.condition && condition !== filters.condition.toLowerCase()) return false;
    if (filters.body) { const actual=String(c.body_type||'').toLowerCase().replace(/[^a-z0-9]/g,''); const wanted=filters.body.toLowerCase().replace(/[^a-z0-9]/g,''); const match=actual===wanted||(wanted==='suv'&&actual.includes('suv'))||(wanted==='muv'&&['muv','mpv','minivan'].includes(actual))||(wanted==='sedanothers'&&!actual.includes('suv')&&!actual.includes('hatch'))||(wanted==='compactsuv'&&actual.includes('compact')&&actual.includes('suv')); if(!match)return false; }
    if (filters.fuel && String(c.fuel_type||'').toLowerCase() !== filters.fuel.toLowerCase()) return false;
    if (filters.transmission && c.transmission !== filters.transmission) return false;
    if (filters.seats && Number(c.seating) !== Number(filters.seats)) return false;
    if (filters.budget) { const price = Number(c.price) || 0; const range=filters.budget.match(/^(\d+)-(\d+)$/); const budget = BUDGETS.find(x => x[0] === filters.budget); if(range){if(price<Number(range[1])||price>=Number(range[2]))return false;}else if(budget&&(price<budget[1]||price>=budget[2]))return false; }
    if (filters.q && !(String(c.name || '') + ' ' + String(c.brand || '')).toLowerCase().includes(filters.q.toLowerCase())) return false;
    return true;
  });
  const activeCount = Object.values(filters).filter(Boolean).length;
  return (
    <div className="bg-obsidian min-h-screen"><div className="max-w-chassis mx-auto px-4 sm:px-6 py-8">
      <div className="section-label mb-2"><span className="w-8 h-px bg-primary" />Car Finder</div>
      <h1 className="font-heading text-4xl font-bold mb-2">Find the right car for you</h1>
      <p className="text-muted-foreground mb-8">{filtered.length} cars matching your search.</p>
      <div className="grid lg:grid-cols-[280px_1fr] gap-8">
        <aside className={(showFilters ? 'block' : 'hidden') + ' lg:block'}><div className="bg-card border border-hairline p-5 sticky top-20">
          <div className="flex items-center justify-between mb-5"><h3 className="font-heading font-bold flex items-center gap-2"><SlidersHorizontal className="w-4 h-4 text-primary" /> Filters</h3>
            {activeCount > 0 && <button onClick={clearFilters} className="text-xs text-muted-foreground hover:text-primary">Clear ({activeCount})</button>}</div>
          <FilterGroup title="Car Condition"><div className="flex flex-wrap gap-2">{['New','Used'].map(x => <Pill key={x} active={filters.condition===x} onClick={() => set('condition', filters.condition===x?'':x)}>{x} Cars</Pill>)}</div></FilterGroup>
          <FilterGroup title="Body Type"><div className="flex flex-wrap gap-2">{BODY_TYPES.map(x => <Pill key={x} active={filters.body===x} onClick={() => set('body', filters.body===x?'':x)}>{x}</Pill>)}</div></FilterGroup>
          <FilterGroup title="Fuel Type"><div className="flex flex-wrap gap-2">{FUELS.map(x => <Pill key={x} active={filters.fuel===x} onClick={() => set('fuel', filters.fuel===x?'':x)}>{x}</Pill>)}</div></FilterGroup>
          <FilterGroup title="Budget"><div className="flex flex-wrap gap-2">{BUDGETS.map(([x]) => <Pill key={x} active={filters.budget===x} onClick={() => set('budget', filters.budget===x?'':x)}>{x}</Pill>)}</div></FilterGroup>
          <FilterGroup title="Transmission"><div className="flex flex-wrap gap-2">{TRANSMISSIONS.map(x => <Pill key={x} active={filters.transmission===x} onClick={() => set('transmission', filters.transmission===x?'':x)}>{x}</Pill>)}</div></FilterGroup>
          <FilterGroup title="Seating"><div className="flex flex-wrap gap-2">{SEATS.map(x => <Pill key={x} active={filters.seats===String(x)} onClick={() => set('seats', filters.seats===String(x)?'':String(x))}>{x} seats</Pill>)}</div></FilterGroup>
        </div></aside>
        <div><div className="flex items-center justify-between mb-4">
          <button onClick={() => setShowFilters(!showFilters)} className="lg:hidden btn-ghost py-2 px-4 text-xs"><SlidersHorizontal className="w-4 h-4" /> Filters {activeCount > 0 && '(' + activeCount + ')'}</button>
          <div className="flex items-center gap-2 ml-auto"><span className="text-xs font-mono-data uppercase tracking-widest text-muted-foreground">Sort</span>
            <select value={sort} onChange={e => setSort(e.target.value)} className="bg-card border border-hairline px-3 py-2 text-sm outline-none">
              <option value="-created_date">Latest</option><option value="price">Price: Low to High</option><option value="-price">Price: High to Low</option>
            </select></div></div>
          {loading ? <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">{[...Array(6)].map((_,i) => <div key={i} className="aspect-[16/10] bg-card animate-pulse" />)}</div>
            : filtered.length === 0 ? <div className="text-center py-20 border border-hairline"><p className="text-muted-foreground">No cars found. Try changing your filters.</p><button onClick={clearFilters} className="btn-ghost mt-4">Clear filters</button></div>
            : <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">{filtered.map(c => <CarCard key={c.id} car={c} />)}</div>}
        </div>
      </div>
    </div></div>
  );
}
function FilterGroup({ title, children }) { return <div className="mb-5 pb-5 border-b border-hairline last:border-0 last:pb-0"><p className="text-xs font-mono-data uppercase tracking-widest text-muted-foreground mb-3">{title}</p>{children}</div>; }
function Pill({ active, onClick, children }) { return <button type="button" onClick={onClick} className={'px-3 py-1.5 text-xs border transition-colors ' + (active ? 'bg-primary text-primary-foreground border-primary' : 'border-hairline text-muted-foreground hover:border-primary/50 hover:text-foreground')}>{children}</button>; }
