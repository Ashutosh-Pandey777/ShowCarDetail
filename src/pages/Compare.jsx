import React,{useEffect,useMemo,useState} from 'react';
import {Link} from 'react-router-dom';
import {base44} from '@/api/base44Client';
import {ArrowLeft,Plus,X,GitCompare,Search,ChevronDown} from 'lucide-react';

export default function Compare(){
 const [cars,setCars]=useState([]),[selected,setSelected]=useState([]),[picker,setPicker]=useState(false),[slot,setSlot]=useState(0),[query,setQuery]=useState(''),[loading,setLoading]=useState(true);
 useEffect(()=>{base44.entities.Car.list('-created_date',500).then(setCars).catch(()=>setCars([])).finally(()=>setLoading(false));},[]);
 const pool=useMemo(()=>cars.filter(c=>!selected.some(s=>s.id===c.id)&&((c.name||'')+' '+(c.brand||'')).toLowerCase().includes(query.toLowerCase())),[cars,selected,query]);
 const openPicker=i=>{setSlot(i);setQuery('');setPicker(true);};
 const add=c=>{setSelected(prev=>{const next=[...prev];next[slot]=c;return next.filter(Boolean).slice(0,2);});setPicker(false);};
 const remove=id=>setSelected(prev=>prev.filter(c=>c.id!==id));
 const fmtPrice=v=>Number(v)>0?'₹'+(Number(v)/100000).toFixed(2)+' Lakh':'Not available';
 const rows=[
  ['Price',c=>fmtPrice(c.price)],['On-road price',c=>fmtPrice(c.on_road_price)],['Body type',c=>c.body_type],['Fuel type',c=>c.fuel_type],['Transmission',c=>c.transmission],['Mileage / Range',c=>c.fuel_type==='Electric'?(c.range_km?c.range_km+' km':'—'):(c.mileage||'—')],['Engine',c=>c.engine],['Power',c=>c.power],['Torque',c=>c.torque],['Seating',c=>c.seating?c.seating+' persons':'—'],['Boot space',c=>c.boot_space],['Safety rating',c=>c.safety_rating?c.safety_rating+'/5':'—']
 ];
 return <main className="min-h-screen bg-[#f5f6f8] text-slate-900">
  <div className="mx-auto max-w-6xl px-4 py-7 sm:px-6">
   <Link to="/" className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-red-600"><ArrowLeft className="h-4 w-4"/> Back to home</Link>
   <div className="mb-7"><p className="text-xs font-bold uppercase tracking-[.18em] text-red-600">ShowCarDetail comparison</p><h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">Compare Cars</h1><p className="mt-2 max-w-2xl text-sm text-slate-500">Compare two cars side by side — price, performance, comfort, features and safety.</p></div>
   <section className="grid gap-4 md:grid-cols-2">
    {[0,1].map(i=>{const car=selected[i];return <div key={i} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
     {car?<><div className="relative aspect-[16/9] bg-slate-100"><img src={car.image_url} alt={car.brand+' '+car.name} className="h-full w-full object-cover"/><button onClick={()=>remove(car.id)} aria-label="Remove car" className="absolute right-3 top-3 rounded-full bg-white/95 p-2 text-slate-600 shadow hover:text-red-600"><X className="h-4 w-4"/></button></div><div className="p-5"><p className="text-xs font-bold uppercase tracking-wider text-red-600">{car.brand}</p><h2 className="mt-1 text-xl font-extrabold">{car.name}</h2><p className="mt-2 text-lg font-bold">{fmtPrice(car.price)}</p><Link to={'/car/'+car.id} className="mt-3 inline-flex text-sm font-semibold text-red-600 hover:underline">View full details →</Link></div></>:<button onClick={()=>openPicker(i)} className="flex min-h-[290px] w-full flex-col items-center justify-center gap-3 p-8 text-center transition hover:bg-red-50/40"><span className="grid h-14 w-14 place-items-center rounded-full border-2 border-dashed border-red-300 text-red-600"><Plus className="h-7 w-7"/></span><span className="text-base font-bold">Add {i===0?'First':'Second'} Car</span><span className="text-sm text-slate-500">Select a car from ShowCarDetail inventory</span></button>}
    </div>})}
   </section>
   {selected.length===2&&<section className="mt-7 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
    <div className="border-b border-slate-200 px-5 py-4"><h2 className="text-lg font-extrabold">Detailed Comparison</h2><p className="mt-1 text-xs text-slate-500">Side-by-side specifications of selected cars</p></div>
    <div className="grid grid-cols-[minmax(112px,.8fr)_minmax(0,1fr)_minmax(0,1fr)]">
     <div className="bg-slate-50 p-3 text-xs font-bold uppercase tracking-wide text-slate-500">Specification</div><div className="border-l border-slate-100 p-3 text-sm font-bold">{selected[0].name}</div><div className="border-l border-slate-100 p-3 text-sm font-bold">{selected[1].name}</div>
     {rows.map(([label,get],i)=><React.Fragment key={label}><div className={'border-t border-slate-100 p-3 text-xs font-semibold text-slate-500 '+(i%2?'bg-slate-50':'')}>{label}</div><div className={'border-l border-t border-slate-100 p-3 text-sm font-semibold '+(i%2?'bg-slate-50':'')}>{get(selected[0])||'—'}</div><div className={'border-l border-t border-slate-100 p-3 text-sm font-semibold '+(i%2?'bg-slate-50':'')}>{get(selected[1])||'—'}</div></React.Fragment>)}
    </div>
   </section>}
   {!loading&&cars.length===0&&<p className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">Abhi inventory mein cars nahi hain. Admin Dashboard → Cars se cars add karein.</p>}
   <div className="mt-7 flex flex-wrap items-center justify-between gap-3"><p className="text-xs text-slate-500">Up to 2 cars can be compared at a time.</p><Link to="/browse" className="text-sm font-bold text-red-600 hover:underline">Browse all cars →</Link></div>
  </div>
  {picker&&<div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/60 px-4 pt-16" onClick={()=>setPicker(false)}><div className="flex max-h-[78vh] w-full max-w-xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl" onClick={e=>e.stopPropagation()}>
   <div className="flex items-center gap-3 border-b border-slate-200 p-4"><Search className="h-5 w-5 text-slate-400"/><input autoFocus value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search car name or brand..." className="min-w-0 flex-1 text-sm outline-none"/><button onClick={()=>setPicker(false)} className="rounded-full p-2 hover:bg-slate-100"><X className="h-4 w-4"/></button></div>
   <div className="overflow-y-auto p-2">{loading?<p className="p-5 text-center text-sm text-slate-500">Loading cars...</p>:pool.map(car=><button key={car.id} onClick={()=>add(car)} className="flex w-full items-center gap-3 rounded-lg p-3 text-left hover:bg-slate-50"><img src={car.image_url} alt="" className="h-16 w-24 rounded-md bg-slate-100 object-cover"/><span className="min-w-0 flex-1"><span className="block text-xs font-semibold text-slate-500">{car.brand}</span><span className="block truncate text-sm font-bold">{car.name}</span><span className="block text-xs text-slate-600">{fmtPrice(car.price)}</span></span><Plus className="h-4 w-4 text-red-600"/></button>)}{!loading&&pool.length===0&&<p className="p-6 text-center text-sm text-slate-500">No matching cars found.</p>}</div>
  </div></div>}
 </main>;
}
