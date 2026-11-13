import React,{useEffect,useMemo,useState} from 'react';
import {Link} from 'react-router-dom';
import {base44} from '@/api/base44Client';
import CarCard from '@/components/CarCard';
import {Search,ChevronRight,MapPin,ArrowRight,CarFront,Wallet,SlidersHorizontal,Newspaper,Star,ShieldCheck} from 'lucide-react';

const BRANDS=['Maruti Suzuki','Hyundai','Tata','Mahindra','Kia','Toyota','Honda','Renault','Skoda','Volkswagen','BMW','Mercedes-Benz','MG','Jeep','Citroen','Nissan','Audi','Volvo','Lexus','BYD','Porsche','Isuzu','Force Motors'];
const BUDGETS=[['Under ₹5 Lakh','0-500000'],['₹5 - 10 Lakh','500000-1000000'],['₹10 - 20 Lakh','1000000-2000000'],['₹20 - 30 Lakh','2000000-3000000'],['₹30 - 50 Lakh','3000000-5000000'],['Above ₹50 Lakh','5000000-999999999']];
export default function Home(){
 const [cars,setCars]=useState([]),[loading,setLoading]=useState(true),[budgetItems,setBudgetItems]=useState([]),[kind,setKind]=useState('New'),[query,setQuery]=useState(''),[budget,setBudget]=useState(''),[body,setBody]=useState(''),[fuel,setFuel]=useState(''),[transmission,setTransmission]=useState(''),[city,setCity]=useState(()=>localStorage.getItem('showcardetail_city')||''),[state,setState]=useState(()=>localStorage.getItem('showcardetail_state')||'');
 useEffect(()=>{const syncLocation=()=>{setCity(localStorage.getItem('showcardetail_city')||'');setState(localStorage.getItem('showcardetail_state')||'');};window.addEventListener('storage',syncLocation);window.addEventListener('focus',syncLocation);window.addEventListener('showcardetail:locationchange',syncLocation);return()=>{window.removeEventListener('storage',syncLocation);window.removeEventListener('focus',syncLocation);window.removeEventListener('showcardetail:locationchange',syncLocation);};},[]);
 useEffect(()=>{base44.entities.Car.list('-created_date',500).then(d=>setCars(Array.isArray(d)?d:[])).catch(()=>setCars([])).finally(()=>setLoading(false));},[]);
 useEffect(()=>{base44.entities.GalleryImage.list('-created_date',300).then(d=>setBudgetItems((Array.isArray(d)?d:[]).filter(x=>String(x.section||'').toLowerCase()==='budget'&&x.active!==false))).catch(()=>setBudgetItems([]));},[]);
 const newCars=useMemo(()=>cars.filter(c=>String(c.condition||c.listing_type||'New').toLowerCase()!=='used'),[cars]);
 const usedCars=useMemo(()=>cars.filter(c=>String(c.condition||c.listing_type||'').toLowerCase()==='used'),[cars]);
 const normalize=v=>String(v||'').toLowerCase().replace(/[^a-z0-9]/g,'');
 const fuelOptions=['Petrol','Diesel','CNG','Electric','Hybrid'];
 const [selectedFuel,setSelectedFuel]=useState('Petrol');
 const fuelCars=useMemo(()=>newCars.filter(c=>normalize(c.fuel_type)===normalize(selectedFuel)).slice(0,4),[newCars,selectedFuel]);
 const DEFAULT_BUDGETS=[
  {title:'Sub Compact SUV',group:'under',mode:'body',body:'compact-suv',min:0,max:1000000,sort_order:0},
  {title:'Hatchback',group:'under',mode:'body',body:'hatchback',min:0,max:1000000,sort_order:1},
  {title:'Sedan & Others',group:'under',mode:'body',body:'others',min:0,max:1000000,sort_order:2},
  {title:'10 - 20 Lakh',group:'above',mode:'price',min:1000000,max:2000000,sort_order:3},
  {title:'20 - 30 Lakh',group:'above',mode:'price',min:2000000,max:3000000,sort_order:4},
  {title:'Luxury Cars',group:'above',mode:'luxury',min:3000000,max:999999999,sort_order:5},
  {title:'SUV',group:'above',mode:'body',body:'suv',min:1000000,max:999999999,sort_order:6},
  {title:'Sub Compact SUV',group:'above',mode:'body',body:'compact-suv',min:1000000,max:999999999,sort_order:7},
  {title:'Sedan & Others',group:'above',mode:'body',body:'others',min:1000000,max:999999999,sort_order:8}
 ];
 const configuredBudgets=useMemo(()=>{const parsed=budgetItems.map(x=>{let cfg={};try{cfg=JSON.parse(x.description||'{}')}catch{}return {...cfg,...x,title:x.title,group:cfg.group||'under',mode:cfg.mode||'price',min:Number(cfg.min)||0,max:Number(cfg.max)||999999999,sort_order:Number(x.sort_order)||0};});return parsed.length?parsed:DEFAULT_BUDGETS;},[budgetItems]);
 const [budgetGroup,setBudgetGroup]=useState('under');
 const [selectedBudget,setSelectedBudget]=useState('Sub Compact SUV');
 const currentBudgetOptions=configuredBudgets.filter(x=>x.group===budgetGroup).sort((a,b)=>a.sort_order-b.sort_order);
 const activeBudget=currentBudgetOptions.find(x=>x.title===selectedBudget)||currentBudgetOptions[0];
 const matchesBudget=(car,item)=>{const price=Number(car.price||0);if(price<item.min||price>=item.max)return false;const body=normalize(car.body_type);if(item.mode==='price')return true;if(item.mode==='luxury')return price>=item.min&&(String(car.tags||[]).join(' ').toLowerCase().includes('luxury')||price>=4000000);if(item.body==='suv')return body.includes('suv');if(item.body==='compact-suv')return body.includes('compact')&&body.includes('suv');if(item.body==='hatchback')return body.includes('hatch');if(item.body==='others')return !body.includes('suv')&&!body.includes('hatch');return true;};
 const budgetCars=useMemo(()=>activeBudget?newCars.filter(c=>matchesBudget(c,activeBudget)).slice(0,8):[],[newCars,activeBudget]);
 const popularNew=useMemo(()=>{const featured=newCars.filter(c=>c.is_popular===true);return (featured.length?featured:newCars).slice(0,8);},[newCars]);
 const latestUsed=useMemo(()=>[...usedCars].slice(0,8),[usedCars]);


 const go=()=>{const p=new URLSearchParams();p.set('condition',kind);if(query)p.set('q',query);if(city)p.set('city',city);if(state)p.set('state',state);if(kind==='New'){if(budget)p.set('budget',budget);if(body)p.set('body',body);if(fuel)p.set('fuel',fuel);if(transmission)p.set('transmission',transmission);}window.location.href='/browse?'+p.toString();};
 const openUsedModel=(model)=>{window.location.href='/browse?'+new URLSearchParams({condition:'Used',q:model}).toString();};
 const selectClass='min-w-0 w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-red-400';
 return <div className="min-h-screen bg-white text-slate-800">
  <section className="w-full bg-white">
   <div className="relative h-[300px] w-full overflow-hidden sm:h-[390px] lg:h-[460px]">
    <CarPhoto car={{body_type:"Luxury",image_url:"https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=2200&q=90"}} alt="Premium car on the road" className="absolute inset-0 h-full w-full object-cover object-center"/>
    <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/10 to-transparent"/>
   </div>
   <div className="mx-auto max-w-6xl px-4 pb-8 sm:px-6">
    <div className="relative -mt-1 rounded-b-xl border border-slate-200 bg-white p-4 shadow-lg sm:p-6">
     <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
      <div className="flex items-center gap-5">
       {['New','Used'].map(v=><button key={v} onClick={()=>setKind(v)} className={'relative pb-2 text-sm font-bold '+(kind===v?'text-red-600 after:absolute after:bottom-[-13px] after:left-0 after:h-0.5 after:w-full after:bg-red-600':'text-slate-500 hover:text-slate-800')}>{v} Cars</button>)}
      </div>
      <div className="flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1.5 text-right text-xs font-semibold text-red-700" aria-live="polite">
       <MapPin className="h-4 w-4 shrink-0"/><span>{state||'Select State'}{city?' · '+city:''}</span>
      </div>
     </div>
     <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
      <div className="flex min-w-0 items-center gap-3 rounded-md border border-slate-200 px-4"><Search className="h-5 w-5 shrink-0 text-slate-400"/><input value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>e.key==='Enter'&&go()} placeholder="Search by car name, brand or model" className="w-full py-3 text-sm outline-none"/></div>
      <button onClick={()=>go()} className="flex items-center justify-center gap-2 rounded-md bg-red-600 px-8 py-3 text-sm font-bold text-white hover:bg-red-700">Search Cars <ArrowRight className="h-4 w-4"/></button>
     </div>
     {kind==='New' ? <div className="mt-4 space-y-3">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
       <select aria-label="Budget" value={budget} onChange={e=>setBudget(e.target.value)} className={selectClass}><option value="">Budget</option>{['Under ₹10L','₹10-20L','₹20-40L','₹40L+'].map(x=><option key={x} value={x}>{x}</option>)}</select>
       <select aria-label="Body type" value={body} onChange={e=>setBody(e.target.value)} className={selectClass}><option value="">Body Type</option>{['SUV','Sedan','Hatchback','Coupe','MUV','Convertible'].map(x=><option key={x}>{x}</option>)}</select>
       <select aria-label="Fuel type" value={fuel} onChange={e=>setFuel(e.target.value)} className={selectClass}><option value="">Fuel Type</option>{['Petrol','Diesel','Electric','Hybrid','CNG'].map(x=><option key={x}>{x}</option>)}</select>
       <select aria-label="Transmission" value={transmission} onChange={e=>setTransmission(e.target.value)} className={selectClass}><option value="">Transmission</option>{['Manual','Automatic'].map(x=><option key={x}>{x}</option>)}</select>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs"><span className="text-slate-500">Filter new cars by your preferences</span><button type="button" onClick={()=>{window.location.href='/browse?'+new URLSearchParams({condition:'New',filters:'1'}).toString();}} className="inline-flex items-center gap-1.5 font-semibold text-red-600 hover:underline"><SlidersHorizontal className="h-3.5 w-3.5"/> All Filters <ChevronRight className="h-3.5 w-3.5"/></button></div>
     </div> : <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-600"><span className="mr-1 font-semibold">Popular used cars:</span>{['Maruti Swift','Maruti Wagon R','Hyundai i20','Hyundai Creta','Tata Nexon','Maruti Baleno','Mahindra Thar','Kia Seltos'].map(x=><button key={x} onClick={()=>openUsedModel(x)} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 font-medium text-blue-700 transition hover:border-red-300 hover:bg-red-50 hover:text-red-700">{x}</button>)}</div>}
    </div>
   </div>
  </section>
  <section className="mx-auto max-w-6xl px-4 py-9 sm:px-6">
   <SectionHeading title="Cars by Fuel Type" subtitle="Choose a fuel type to see matching cars"/>
   <div className="mb-5 flex flex-wrap gap-2">{fuelOptions.map(x=><button key={x} onClick={()=>setSelectedFuel(x)} className={'rounded-full border px-4 py-2 text-sm font-semibold '+(selectedFuel===x?'border-red-600 bg-red-600 text-white':'border-slate-200 bg-white text-slate-600')}>{x}</button>)}</div>
   {fuelCars.length?<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{fuelCars.map(car=><CarCard key={car.id} car={car}/>)}</div>:<EmptyCars label={selectedFuel+' cars'} to={'/browse?'+new URLSearchParams({condition:'New',fuel:selectedFuel})}/>}
   <div className="mt-4 text-right"><Link to={'/browse?'+new URLSearchParams({condition:'New',fuel:selectedFuel})} className="text-sm font-semibold text-red-600">View all {selectedFuel} cars →</Link></div>
  </section>
  <section className="mx-auto max-w-6xl px-4 py-9 sm:px-6">
   <SectionHeading title="Popular Cars by Budget" subtitle="Find your next car in the right price range"/>
   <div className="mb-5 flex flex-wrap gap-2">{[['under','Cars Under 10 Lakh'],['above','Cars Above 10 Lakh']].map(([key,label])=><button key={key} onClick={()=>{setBudgetGroup(key);const first=configuredBudgets.find(x=>x.group===key);if(first)setSelectedBudget(first.title);}} className={'rounded-md border px-5 py-3 text-sm font-bold '+(budgetGroup===key?'border-red-600 bg-red-600 text-white':'border-slate-200 bg-white text-slate-700 hover:border-red-300')}>{label}</button>)}</div>
   <div className="mb-5 flex flex-wrap gap-2">{currentBudgetOptions.map(item=><button key={item.id||item.title} onClick={()=>setSelectedBudget(item.title)} className={'rounded-full border px-4 py-2 text-sm font-semibold transition '+(activeBudget?.title===item.title?'border-red-600 bg-red-600 text-white':'border-slate-200 bg-white text-slate-600 hover:border-red-300')}>{item.title}</button>)}</div>
   {loading?<div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{[1,2,3,4].map(x=><div key={x} className="h-64 animate-pulse rounded-lg bg-slate-100"/>)}</div>:budgetCars.length?<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">{budgetCars.slice(0,4).map(car=><CarCard key={car.id} car={car}/>)}</div>:<EmptyCars label={activeBudget?.title||'budget'} to={'/browse?'+new URLSearchParams({condition:'New'}).toString()}/>}
   {activeBudget&&<div className="mt-4 text-right"><Link to={'/browse?'+new URLSearchParams(activeBudget.mode==='body'?{condition:'New',body:activeBudget.body==='compact-suv'?'CompactSUV':activeBudget.body==='others'?'SedanOthers':'SUV'}:{condition:'New',budget:activeBudget.min+'-'+activeBudget.max}).toString()} className="text-sm font-semibold text-red-600">View all {activeBudget.title} cars →</Link></div>}
  </section>
  <CarSection title="Popular New Cars" subtitle="Popular models from your car inventory" cars={popularNew} loading={loading} to="/browse?condition=New"/>
  <CarSection title="Latest Used Cars" subtitle="Recently added pre-owned cars" cars={latestUsed} loading={loading} to="/browse?condition=Used"/>
  <section className="border-y border-slate-100 bg-[#f7f8fa]"><div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-9 sm:px-6 md:flex-row md:items-center md:justify-between"><div><p className="text-sm font-semibold text-red-600">Make the right choice</p><h2 className="mt-1 text-2xl font-bold text-slate-900">Compare Cars</h2><p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">Compare prices, specifications, mileage, features and safety ratings side by side before choosing your next car.</p></div><Link to="/compare" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-red-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-red-700">Compare Cars <ArrowRight className="h-4 w-4"/></Link></div></section>
  <section className="bg-[#fff5f4]"><div className="mx-auto flex max-w-6xl flex-col justify-between gap-4 px-4 py-8 sm:px-6 md:flex-row md:items-center"><div><p className="text-sm font-semibold text-red-600">Stay updated</p><h2 className="mt-1 text-2xl font-bold text-slate-900">Latest car news and expert reviews</h2><p className="mt-2 text-sm text-slate-600">Read the latest updates before you choose your next car.</p></div><Link to="/news-reviews" className="inline-flex items-center gap-2 self-start rounded-md bg-red-600 px-5 py-3 text-sm font-bold text-white md:self-center">Explore News & Reviews <Newspaper className="h-4 w-4"/></Link></div></section>
  <section className="overflow-hidden border-y border-slate-100 bg-[#f7f8fa]">
   <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
    <SectionHeading title="All Car Brands" subtitle="Explore car manufacturers"/>
    <div className="brand-marquee relative mx-auto max-w-full overflow-hidden" aria-label="All car brands">
     <div className="brand-marquee-track flex w-max items-center gap-4 py-2">
      {[...BRANDS,...BRANDS].map((b,i)=>{const domains={'Maruti Suzuki':'marutisuzuki.com','Hyundai':'hyundai.com','Tata':'tatamotors.com','Mahindra':'mahindra.com','Kia':'kia.com','Toyota':'toyotabharat.com','Honda':'hondacarindia.com','Renault':'renault.co.in','Skoda':'skoda-auto.co.in','Volkswagen':'volkswagen.co.in','BMW':'bmw.in','Mercedes-Benz':'mercedes-benz.co.in','MG':'mgmotor.co.in','Jeep':'jeep-india.com','Citroen':'citroen.in','Nissan':'nissan.in','Audi':'audi.in','Volvo':'volvocars.com','Lexus':'lexusindia.co.in','BYD':'byd.com','Porsche':'porsche.com','Isuzu':'isuzu.in','Force Motors':'forcemotors.com'};return <Link key={b+i} to={'/brand/'+b.toLowerCase().replace(/\\s+/g,'-')} className="group flex h-28 w-32 shrink-0 flex-col items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 shadow-sm transition hover:border-red-300 hover:shadow-md" aria-label={b}>
       <div className="grid h-14 w-20 place-items-center rounded-lg bg-white">
        <img src={'https://www.google.com/s2/favicons?domain='+domains[b]+'&sz=128'} alt={b+' logo'} loading="eager" referrerPolicy="no-referrer" className="h-11 w-11 object-contain" onError={e=>{e.currentTarget.style.display='none';e.currentTarget.nextSibling.style.display='grid';}}/>
        <span style={{display:'none'}} className="h-11 w-11 place-items-center rounded-full bg-slate-100 text-2xl font-extrabold text-slate-600">{b.slice(0,1)}</span>
       </div>
       <span className="w-full truncate text-center text-xs font-semibold text-slate-700 group-hover:text-red-600">{b}</span>
      </Link>})}
     </div>
    </div>
   </div>
   <style>{`@keyframes brand-marquee-right{from{transform:translateX(-50%)}to{transform:translateX(0)}}.brand-marquee-track{animation:brand-marquee-right 48s linear infinite;will-change:transform}.brand-marquee:hover .brand-marquee-track{animation-play-state:paused}@media(prefers-reduced-motion:reduce){.brand-marquee-track{animation:none}}`}</style>
  </section>
 </div>;
}
function EmptyCars({label,to}){return <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center"><p className="text-sm font-semibold text-slate-700">No {label} added yet</p><p className="mt-1 text-xs text-slate-500">Admin Dashboard → Cars mein matching cars add karein.</p><Link to={to} className="mt-3 inline-block text-sm font-semibold text-red-600">Browse matching cars →</Link></div>}
function SectionHeading({title,subtitle,action,to}){return <div className="mb-5 flex items-end justify-between gap-3"><div><h2 className="text-xl font-bold text-slate-900 sm:text-2xl">{title}</h2><p className="mt-1 text-sm text-slate-500">{subtitle}</p></div>{action&&<Link to={to} className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-red-600 hover:underline">{action}<ChevronRight className="h-4 w-4"/></Link>}</div>}
function CarSection({title,subtitle,cars,loading,to}){const list=cars.slice(0,4);return <section className="border-t border-slate-100 bg-white"><div className="mx-auto max-w-6xl px-4 py-9 sm:px-6"><SectionHeading title={title} subtitle={subtitle} action="View all cars" to={to}/>{loading?<div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{[1,2,3,4].map(x=><div key={x} className="h-64 animate-pulse rounded-lg bg-slate-100"/>)}</div>:list.length?<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">{list.map(c=><CarCard key={c.id} car={c}/>)}</div>:<div className="rounded-lg border border-dashed border-slate-300 py-8 text-center text-sm text-slate-500">Cars will appear here when listings are added from the admin dashboard.</div>}</div></section>}
