import React,{useEffect,useMemo,useState} from 'react';
import {Link} from 'react-router-dom';
import {base44} from '@/api/base44Client';
import CarCard from '@/components/CarCard';
import {Search,ChevronRight,MapPin,ArrowRight,CarFront,Wallet,SlidersHorizontal,Newspaper,Star,ShieldCheck} from 'lucide-react';

const BRANDS=['Maruti Suzuki','Hyundai','Tata','Mahindra','Kia','Toyota','Honda','Renault','Skoda','Volkswagen','BMW','Mercedes-Benz'];
const BUDGETS=[['Under ₹5 Lakh','0-500000'],['₹5 - 10 Lakh','500000-1000000'],['₹10 - 20 Lakh','1000000-2000000'],['₹20 - 30 Lakh','2000000-3000000'],['₹30 - 50 Lakh','3000000-5000000'],['Above ₹50 Lakh','5000000-999999999']];
const TYPES=[['SUV','SUV'],['Hatchback','Hatchback'],['Sedan','Sedan'],['MUV','MUV'],['Luxury','Luxury'],['Electric','Electric']];
export default function Home(){
 const [cars,setCars]=useState([]),[loading,setLoading]=useState(true),[kind,setKind]=useState('New'),[query,setQuery]=useState(''),[city,setCity]=useState('Patna');
 useEffect(()=>{base44.entities.Car.list('-created_date',100).then(d=>setCars(Array.isArray(d)?d:[])).catch(()=>setCars([])).finally(()=>setLoading(false));},[]);
 const newCars=useMemo(()=>cars.filter(c=>String(c.condition||c.listing_type||'New').toLowerCase()!=='used'),[cars]);
 const usedCars=useMemo(()=>cars.filter(c=>String(c.condition||c.listing_type||'').toLowerCase()==='used'),[cars]);
 const go=(extra='')=>{const p=new URLSearchParams();p.set('condition',kind);if(query)p.set('q',query);if(city)p.set('city',city);if(extra)p.set('budget',extra);window.location.href='/browse?'+p.toString();};
 return <div className="min-h-screen bg-white text-slate-800">
  <section className="w-full bg-white">
   <div className="relative h-[300px] w-full overflow-hidden sm:h-[390px] lg:h-[460px]">
    <img src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=2200&q=90" alt="Premium car on the road" className="absolute inset-0 h-full w-full object-cover object-center"/>
    <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/10 to-transparent"/>
   </div>
   <div className="mx-auto max-w-6xl px-4 pb-8 sm:px-6">
    <div className="relative -mt-1 rounded-b-xl border border-slate-200 bg-white p-4 shadow-lg sm:p-6">
     <div className="mb-4 flex items-center gap-5 border-b border-slate-100 pb-3">
      {['New','Used'].map(v=><button key={v} onClick={()=>setKind(v)} className={'relative pb-2 text-sm font-bold '+(kind===v?'text-red-600 after:absolute after:bottom-[-13px] after:left-0 after:h-0.5 after:w-full after:bg-red-600':'text-slate-500 hover:text-slate-800')}>{v} Cars</button>)}
     </div>
     <div className="grid gap-3 sm:grid-cols-[1fr_190px_auto]">
      <div className="flex min-w-0 items-center gap-3 rounded-md border border-slate-200 px-4"><Search className="h-5 w-5 shrink-0 text-slate-400"/><input value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>e.key==='Enter'&&go()} placeholder="Search by car name, brand or model" className="w-full py-3 text-sm outline-none"/></div>
      <div className="flex items-center gap-2 rounded-md border border-slate-200 px-3"><MapPin className="h-4 w-4 shrink-0 text-red-600"/><select value={city} onChange={e=>setCity(e.target.value)} className="w-full bg-transparent py-3 text-sm outline-none"><option>Patna</option><option>Delhi NCR</option><option>Mumbai</option><option>Bengaluru</option><option>Hyderabad</option><option>Pune</option><option>Kolkata</option><option>Lucknow</option></select></div>
      <button onClick={()=>go()} className="flex items-center justify-center gap-2 rounded-md bg-red-600 px-8 py-3 text-sm font-bold text-white hover:bg-red-700">Search Cars <ArrowRight className="h-4 w-4"/></button>
     </div>
     <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500"><span className="font-semibold text-slate-600">Popular:</span>{['Maruti Swift','Tata Nexon','Hyundai Creta','Mahindra Thar'].map(x=><button key={x} onClick={()=>{setQuery(x);window.location.href='/browse?q='+encodeURIComponent(x)+'&condition='+kind;}} className="text-blue-700 hover:underline">{x}</button>)}</div>
    </div>
   </div>
  </section>
  <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
   <SectionHeading title="Explore cars by" subtitle="Find cars that match your needs"/>
   <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">{TYPES.map(([label,value])=><Link key={label} to={'/browse?body='+value} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 transition hover:border-red-300 hover:shadow-sm"><span className="grid h-10 w-10 place-items-center rounded-full bg-red-50 text-red-600"><CarFront className="h-5 w-5"/></span><span className="text-sm font-semibold">{label}</span></Link>)}</div>
  </section>
  <section className="border-y border-slate-100 bg-slate-50"><div className="mx-auto max-w-6xl px-4 py-8 sm:px-6"><SectionHeading title="Popular car brands" subtitle="Browse the latest models from top manufacturers" action="View all brands" to="/browse"/><div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">{BRANDS.map(b=><Link key={b} to={'/brand/'+b.toLowerCase().replace(/\s+/g,'-')} className="flex min-h-20 items-center justify-center rounded-lg border border-slate-200 bg-white px-2 text-center text-sm font-semibold text-slate-700 hover:border-red-300 hover:text-red-600">{b}</Link>)}</div></div></section>
  <section className="mx-auto max-w-6xl px-4 py-9 sm:px-6"><SectionHeading title="Cars by budget" subtitle="Choose a car that fits your budget"/><div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">{BUDGETS.map(([label,range])=><Link key={label} to={'/browse?condition='+kind+'&budget='+encodeURIComponent(label)} className="rounded-lg border border-slate-200 p-4 hover:border-red-300 hover:shadow-sm"><Wallet className="mb-3 h-5 w-5 text-red-600"/><p className="text-sm font-bold">{label}</p><p className="mt-1 text-xs text-slate-500">Explore cars</p></Link>)}</div></section>
  <CarSection title="Popular new cars" subtitle="Most searched new cars" cars={newCars} loading={loading} to="/browse?condition=New"/>
  <CarSection title="Latest used cars" subtitle="Find pre-owned cars near you" cars={usedCars} loading={loading} to="/browse?condition=Used"/>
  <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6"><SectionHeading title="Why choose ShowCarDetail?" subtitle="Everything you need to make a confident car decision"/><div className="grid gap-4 sm:grid-cols-3">{[[ShieldCheck,'Helpful car information','Explore specifications, features and safety details.'],[SlidersHorizontal,'Smart car discovery','Filter cars by budget, body type, fuel and more.'],[Star,'Compare with confidence','Shortlist models and compare important details.']].map(([Icon,title,desc])=><div key={title} className="rounded-lg border border-slate-200 p-5"><Icon className="mb-3 h-6 w-6 text-red-600"/><h3 className="font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{desc}</p></div>)}</div></section>
  <section className="bg-[#fff5f4]"><div className="mx-auto flex max-w-6xl flex-col justify-between gap-4 px-4 py-8 sm:px-6 md:flex-row md:items-center"><div><p className="text-sm font-semibold text-red-600">Stay updated</p><h2 className="mt-1 text-2xl font-bold text-slate-900">Latest car news and expert reviews</h2><p className="mt-2 text-sm text-slate-600">Read the latest updates before you choose your next car.</p></div><Link to="/news-reviews" className="inline-flex items-center gap-2 self-start rounded-md bg-red-600 px-5 py-3 text-sm font-bold text-white md:self-center">Explore News & Reviews <Newspaper className="h-4 w-4"/></Link></div></section>
 </div>;
}
function SectionHeading({title,subtitle,action,to}){return <div className="mb-5 flex items-end justify-between gap-3"><div><h2 className="text-xl font-bold text-slate-900 sm:text-2xl">{title}</h2><p className="mt-1 text-sm text-slate-500">{subtitle}</p></div>{action&&<Link to={to} className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-red-600 hover:underline">{action}<ChevronRight className="h-4 w-4"/></Link>}</div>}
function CarSection({title,subtitle,cars,loading,to}){const list=cars.slice(0,4);return <section className="border-t border-slate-100 bg-white"><div className="mx-auto max-w-6xl px-4 py-9 sm:px-6"><SectionHeading title={title} subtitle={subtitle} action="View all cars" to={to}/>{loading?<div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{[1,2,3,4].map(x=><div key={x} className="h-64 animate-pulse rounded-lg bg-slate-100"/>)}</div>:list.length?<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">{list.map(c=><CarCard key={c.id} car={c}/>)}</div>:<div className="rounded-lg border border-dashed border-slate-300 py-8 text-center text-sm text-slate-500">Cars will appear here when listings are added from the admin dashboard.</div>}</div></section>}
