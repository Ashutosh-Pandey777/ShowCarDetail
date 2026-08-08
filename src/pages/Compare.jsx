import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { X, Plus, ArrowLeft } from 'lucide-react';

export default function Compare() {
  const [cars, setCars] = useState([]);
  const [selected, setSelected] = useState([]);
  const [picker, setPicker] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    base44.entities.Car.list('-created_date', 100).then(setCars).catch(() => {});
  }, []);

  const add = (c) => { if (selected.length < 4) setSelected([...selected, c]); setPicker(false); setQuery(''); };
  const remove = (id) => setSelected(selected.filter(c => c.id !== id));
  const pool = cars.filter(c => !selected.find(s => s.id === c.id) && `${c.name} ${c.brand}`.toLowerCase().includes(query.toLowerCase()));

  const rows = [
    ['Price', c => `₹${(c.price/100000).toFixed(2)}L`],
    ['On-road', c => `₹${(c.on_road_price/100000).toFixed(2)}L`],
    ['Body Type', c => c.body_type],
    ['Fuel', c => c.fuel_type],
    ['Transmission', c => c.transmission],
    ['Mileage', c => c.mileage],
    ['Engine', c => c.engine],
    ['Power', c => c.power],
    ['Torque', c => c.torque],
    ['Seating', c => `${c.seating}p`],
    ['Boot Space', c => c.boot_space],
    ['Safety', c => `${c.safety_rating}/5`],
    ['Range', c => c.range_km ? `${c.range_km} km` : '—'],
  ];

  const best = (rowIdx) => {
    if (selected.length < 2) return -1;
    // numeric extraction for price, power etc — just highlight lowest price, highest mileage
    return -1;
  };

  return (
    <div className="bg-obsidian min-h-screen">
      <div className="max-w-chassis mx-auto px-4 sm:px-6 py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-xs font-mono-data uppercase tracking-widest text-muted-foreground hover:text-primary mb-4"><ArrowLeft className="w-3 h-3" /> Back</Link>
        <div className="section-label mb-2"><span className="w-8 h-px bg-primary" />Comparison Engine</div>
        <h1 className="font-heading text-4xl font-bold mb-2">Spec vs. spec.</h1>
        <p className="text-muted-foreground mb-8">Stack up to four vehicles. Reveal the delta.</p>

        {selected.length === 0 ? (
          <div className="border-2 border-dashed border-hairline py-20 text-center">
            <p className="text-muted-foreground mb-4">No vehicles selected yet.</p>
            <button onClick={() => setPicker(true)} className="btn-kinetic"><Plus className="w-4 h-4" /> Add first vehicle</button>
          </div>
        ) : (
          <div className="overflow-x-auto scrollbar-thin">
            <div className="min-w-[720px]">
              {/* Car headers */}
              <div className="grid gap-px mb-px" style={{ gridTemplateColumns: `200px repeat(${selected.length}, 1fr)` }}>
                <div></div>
                {selected.map(c => (
                  <div key={c.id} className="bg-card border border-hairline p-4 relative">
                    <button onClick={() => remove(c.id)} className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"><X className="w-4 h-4" /></button>
                    <Link to={`/car/${c.id}`}><img src={c.image_url} alt={c.name} className="w-full aspect-[4/3] object-cover mb-3 bg-gunmetal" /></Link>
                    <p className="text-[10px] font-mono-data uppercase tracking-widest text-primary">{c.brand}</p>
                    <p className="font-heading font-bold text-sm leading-tight">{c.name}</p>
                  </div>
                ))}
                {selected.length < 4 && (
                  <div className="bg-card border-2 border-dashed border-hairline flex items-center justify-center p-4">
                    <button onClick={() => setPicker(true)} className="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary">
                      <Plus className="w-6 h-6" />
                      <span className="text-xs">Add vehicle</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Spec rows */}
              {rows.map(([label, fn], i) => {
                const values = selected.map(fn);
                let bestIdx = -1;
                if (label === 'Price' && selected.length > 1) bestIdx = values.reduce((minI, v, idx, arr) => parseFloat(v.replace(/[^0-9.]/g,'')) < parseFloat(arr[minI].replace(/[^0-9.]/g,'')) ? idx : minI, 0);
                if (label === 'Mileage' && selected.length > 1) {
                  const nums = values.map(v => parseFloat(v) || 0);
                  bestIdx = nums.indexOf(Math.max(...nums));
                }
                if (label === 'Safety' && selected.length > 1) {
                  const nums = selected.map(c => c.safety_rating || 0);
                  bestIdx = nums.indexOf(Math.max(...nums));
                }
                return (
                  <div key={label} className={`grid gap-px ${i%2 ? 'bg-gunmetal' : ''}`} style={{ gridTemplateColumns: `200px repeat(${selected.length}, 1fr)` }}>
                    <div className="bg-secondary px-4 py-3 text-xs font-mono-data uppercase tracking-widest text-muted-foreground">{label}</div>
                    {values.map((v, idx) => (
                      <div key={idx} className={`px-4 py-3 font-mono-data text-sm font-semibold ${bestIdx === idx ? 'bg-primary/15 text-primary' : 'bg-card'}`}>{v || '—'}</div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Picker modal */}
      {picker && (
        <div className="fixed inset-0 bg-obsidian/90 backdrop-blur-sm z-50 flex items-start justify-center pt-20 px-4" onClick={() => setPicker(false)}>
          <div className="bg-card border border-hairline w-full max-w-lg max-h-[60vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b border-hairline flex items-center gap-2">
              <Plus className="w-4 h-4 text-primary" />
              <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search vehicles…" className="flex-1 bg-transparent outline-none text-sm" />
              <button onClick={() => setPicker(false)}><X className="w-4 h-4 text-muted-foreground" /></button>
            </div>
            <div className="overflow-y-auto scrollbar-thin p-2">
              {pool.map(c => (
                <button key={c.id} onClick={() => add(c)} className="w-full flex items-center gap-3 p-2 hover:bg-secondary text-left">
                  <img src={c.image_url} alt="" className="w-16 h-12 object-cover bg-gunmetal" />
                  <div>
                    <p className="text-[10px] font-mono-data uppercase tracking-widest text-muted-foreground">{c.brand}</p>
                    <p className="text-sm font-medium">{c.name}</p>
                    <p className="text-xs font-mono-data text-primary">₹{(c.price/100000).toFixed(2)}L</p>
                  </div>
                </button>
              ))}
              {pool.length === 0 && <p className="p-4 text-sm text-muted-foreground text-center">No vehicles found.</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}