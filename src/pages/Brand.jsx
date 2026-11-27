import React,{useEffect,useMemo,useState} from 'react';
import {useParams,useSearchParams,Link} from 'react-router-dom';
import {ArrowLeft,ArrowRight,CarFront,Images,GitCompareArrows} from 'lucide-react';
import {base44} from '@/api/base44Client';
import CarCard from '@/components/CarCard';
import CarPhoto from '@/components/CarPhoto';

const variantSuffixes=['lxi','vxi','zxi','zxi+','vxi+','lxi(o)','vxi(o)','zxi(o)','sigma','delta','delta+','zeta','alpha','alpha+','amt','amt+','ag','cng','diesel','petrol','ev','base','mid','top','plus','pro','max','gt','gtx','gt line','turbo'];
function inferredModelName(item){
 const saved=String(item.model_name||'').trim();if(saved)return saved;
 let name=String(item.name||'').trim();
 const brand=String(item.brand||item.make||item.manufacturer||'').trim();
 if(brand&&name.toLowerCase().startsWith(brand.toLowerCase()+' '))name=name.slice(brand.length).trim();
 const parts=name.split(/\\s+/);let changed=true;
 while(parts.length>1&&changed){changed=false;const last=parts.slice(-2).join(' ').toLowerCase();if(variantSuffixes.includes(last)){parts.splice(-2);changed=true;continue;}if(variantSuffixes.includes(parts[parts.length-1].toLowerCase())){parts.pop();changed=true;}}
 return parts.join(' ')||name||'Other';
}
function ModelListingCard({group,brandName}){
 const lead=[...group.items].sort((a,b)=>Number(a.price||0)-Number(b.price||0))[0];
 const prices=group.items.map(x=>Number(x.price||0)).filter(x=>x>0);const min=prices.length?Math.min(...prices):0;const max=prices.length?Math.max(...prices):0;
 const priceText=min?('Rs. '+(min/100000).toFixed(2)+' Lakh'+(max>min?' - '+(max/100000).toFixed(2)+' Lakh':'')+' onwards'):'Price on request';
 const specs=[lead.safety_rating?lead.safety_rating+' Star Safety':null,lead.mileage?lead.mileage+' kmpl':null,lead.power?lead.power+' bhp':null].filter(Boolean).join('  |  ');
 const modelTitle=String(group.name).toLowerCase().startsWith(brandName.toLowerCase())?group.name:brandName+' '+group.name;
 return <Link to={'/car/'+lead.id} className="grid min-h-[190px] grid-cols-1 items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-slate-300 hover:shadow-md sm:grid-cols-[240px_minmax(0,1fr)] sm:px-6">
  <div className="flex h-36 items-center justify-center overflow-hidden"><CarPhoto car={lead} alt={modelTitle} className="h-full w-full object-contain"/></div>
  <div className="min-w-0"><h3 className="text-xl font-medium text-slate-800">{modelTitle} <span className="text-slate-500">›</span></h3>
   {specs&&<p className="mt-2 text-sm text-slate-500">{specs}</p>}
   <p className="mt-4 text-lg font-bold text-slate-900">{priceText}</p>
   <p className="mt-1 text-sm text-slate-500">Ex-showroom price</p>
   <p className="mt-4 text-sm font-semibold text-sky-700">View {group.items.length} {group.items.length===1?'variant':'variants'} <span aria-hidden="true">›</span></p>
  </div>
 </Link>;
}
const normalize=value=>String(value||'').toLowerCase().replace(/[^a-z0-9]/g,'');
const conditionOf=x=>String(x.condition||x.listing_type||x.type||'').toLowerCase();
const fuelOf=x=>String(x.fuel_type||x.fuel||x.fuelType||'').toLowerCase();
const tagsOf=x=>Array.isArray(x.tags)?x.tags.map(String):String(x.tags||'').split(',');
const isUpcoming=x=>conditionOf(x).includes('upcoming')||x.is_upcoming===true||tagsOf(x).some(t=>t.trim().toLowerCase()==='upcoming');
const isDiscontinued=x=>conditionOf(x).includes('discontinued')||x.is_discontinued===true||tagsOf(x).some(t=>t.trim().toLowerCase()==='discontinued');
const isUsed=x=>conditionOf(x).includes('used');
const lines=value=>Array.isArray(value)?value:String(value||'').split(/\r?\n/).map(x=>x.trim()).filter(Boolean);
function Section({id,title,children,icon:Icon}){return <section id={id} className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-5 sm:p-7"><div className="mb-5 flex items-center gap-2">{Icon&&<Icon size={20} className="text-red-600"/>}<h2 className="text-xl font-extrabold">{title}</h2></div>{children}</section>}
function BikeModelCard({bike}){return <Link to={'/browse?vehicle=Bike&brand='+encodeURIComponent(bike.brand||'')+'&q='+encodeURIComponent(bike.name||'')} className="overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:shadow-lg"><img src={bike.image_url||'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=700'} alt={bike.name||'Bike'} className="h-44 w-full bg-slate-100 object-cover"/><div className="p-4"><p className="text-xs font-semibold uppercase text-red-600">{bike.brand}</p><h3 className="mt-1 font-bold text-slate-900">{bike.name||'New Bike'}</h3><p className="mt-2 text-sm font-bold text-red-600">{Number(bike.price)>0?'₹'+Number(bike.price).toLocaleString('en-IN'):'Price coming soon'}</p></div></Link>}
export default function Brand(){
 const {slug}=useParams();const [params]=useSearchParams();const vehicle=params.get('vehicle')==='Bike'?'Bike':'Car';const isBike=vehicle==='Bike';const mode=params.get('mode')||'New';const isUsedMode=mode==='Used',isElectric=mode==='Electric';
 const [items,setItems]=useState([]),[profile,setProfile]=useState(null),[loading,setLoading]=useState(true);
 const fallbackName=slug.split('-').map(w=>w.charAt(0).toUpperCase()+w.slice(1)).join(' ');
 useEffect(()=>{let alive=true;setLoading(true);const entity=isBike?base44.entities.Bike:base44.entities.Car;Promise.all([entity.list('-created_date',500),base44.entities.Brand.list('-created_date',300).catch(()=>[])]).then(([vehicles,brands])=>{if(!alive)return;const brand=brands.find(x=>normalize(x.slug||x.name)===normalize(slug)||normalize(x.name)===normalize(fallbackName));setProfile(brand||null);setItems((Array.isArray(vehicles)?vehicles:[]).filter(x=>x.active!==false&&[x.brand,x.make,x.manufacturer].some(value=>{const candidate=normalize(value),target=normalize(brand?.name||fallbackName);return candidate&&target&&(candidate===target||candidate.startsWith(target)||target.startsWith(candidate))}))) }).catch(()=>{if(alive){setItems([]);setProfile(null)}}).finally(()=>{if(alive)setLoading(false)});return()=>{alive=false}},[slug,fallbackName,isBike]);
 const brandName=profile?.name||fallbackName;
 const newCars=useMemo(()=>items.filter(x=>!isUsed(x)&&!isUpcoming(x)&&!isDiscontinued(x)),[items]);
 const usedCars=useMemo(()=>items.filter(isUsed),[items]);
 const upcoming=useMemo(()=>items.filter(isUpcoming),[items]);
 const discontinued=useMemo(()=>items.filter(isDiscontinued),[items]);
 const electricCars=useMemo(()=>items.filter(x=>fuelOf(x).includes('electric')), [items]);
 const activeItems=isUsedMode?usedCars:isElectric?electricCars:isBike?items:newCars;
 const gallery=useMemo(()=>[...new Set(items.flatMap(x=>[x.image_url,...(Array.isArray(x.gallery)?x.gallery:String(x.gallery||'').split(',') )]).map(x=>String(x||'').trim()).filter(x=>/^https?:\/\//i.test(x)||x.startsWith('/uploads/')))], [items]);
 const comparisons=lines(profile?.comparisons),highlights=lines(profile?.key_highlights),popularUsed=lines(profile?.popular_used_models);
 const category=isBike?'Bikes':isUsedMode?'Used Cars':isElectric?'Electric Cars':'Cars';
 const backPath='/vehicle-category/'+(isBike?'find-new-bikes':isUsedMode?'find-used-cars':isElectric?'find-electric-cars':'find-new-cars');
 const models=activeItems;
 const modelGroups=useMemo(()=>{const groups=new Map();activeItems.forEach(item=>{const modelName=inferredModelName(item);const key=normalize(modelName);if(!groups.has(key))groups.set(key,{name:modelName,items:[]});groups.get(key).items.push(item)});return [...groups.values()].sort((a,b)=>a.name.localeCompare(b.name))},[activeItems]);
 const sections=[['models','Car Models'],['comparisons','Cars Comparisons'],['used','Popular Used Cars'],['images','Images'],['highlights','Key Highlights'],['discontinued','Discontinued Cars']];
 return <main className="min-h-screen bg-[#f7f8fa] text-slate-900">
  <section className="border-b border-slate-200 bg-white"><div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
   <Link to={backPath} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-red-600"><ArrowLeft size={16}/> All {isBike?'Bike':'Car'} Brands</Link>
   <div className="mt-5 flex flex-wrap items-center gap-4">{profile?.image_url&&<img src={profile.image_url} alt={brandName+' logo'} className="h-16 w-16 rounded-xl border border-slate-100 bg-white p-2 object-contain"/>}<div><p className="text-xs font-bold uppercase tracking-widest text-red-600">{category} Manufacturer</p><h1 className="mt-1 text-3xl font-extrabold sm:text-4xl">{brandName} {category}</h1><p className="mt-2 text-sm text-slate-500">{profile?.tagline||'Explore models, prices, images and details'}</p></div></div>
   <nav className="mt-6 flex flex-wrap gap-2">{sections.map(([id,label])=><a key={id} href={'#'+id} className="rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:border-red-300 hover:text-red-600">{label}</a>)}</nav>
  </div></section>
  <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6">

   <Section id="models" title={isUsedMode?'Popular Used '+brandName+' Cars':isElectric?brandName+' Electric Cars':brandName+' Car Models'} icon={CarFront}>
    {loading?<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[1,2,3,4].map(n=><div key={n} className="h-64 animate-pulse rounded-xl bg-slate-200"/>)}</div>:modelGroups.length?<div className="space-y-7">{modelGroups.map(group=><div key={group.name} className="space-y-3"><div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2"><h3 className="text-lg font-bold text-slate-900">{group.name}</h3><span className="text-xs text-slate-500">{group.items.length} {group.items.length===1?'variant':'variants'}</span></div><div className="space-y-3">{isBike?group.items.map(item=><BikeModelCard key={item.id} bike={item}/>):<ModelListingCard group={group} brandName={brandName}/>}</div></div>)}</div>:<p className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500">No matching {category.toLowerCase()} have been added for {brandName} yet. Add models from Admin Dashboard.</p>}
   </Section>
   {!isBike&&!isUsedMode&&!isElectric&&<>
    <Section id="comparisons" title={brandName+' Cars Comparisons'} icon={GitCompareArrows}>{comparisons.length?<ul className="grid gap-2 sm:grid-cols-2">{comparisons.map((x,i)=><li key={i} className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700">{x}</li>)}</ul>:<p className="text-sm text-slate-500">Add comparison names or notes in Admin Dashboard to show them here.</p>}</Section>
    <Section id="used" title={'Popular Used '+brandName+' Cars'}>{popularUsed.length?<ul className="mb-4 list-inside list-disc space-y-1 text-sm text-slate-600">{popularUsed.map((x,i)=><li key={i}>{x}</li>)}</ul>:null}{usedCars.length?<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{usedCars.map(item=><CarCard key={item.id} car={item}/>)}</div>:<p className="text-sm text-slate-500">No used {brandName} cars listed yet.</p>}</Section>
    <Section id="images" title={brandName+' Images'} icon={Images}>{gallery.length?<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">{gallery.map((src,i)=><img key={src+i} src={src} alt={brandName+' car '+(i+1)} loading="lazy" className="aspect-[4/3] w-full rounded-xl bg-slate-100 object-cover"/>)}</div>:<p className="text-sm text-slate-500">Car images uploaded in Admin Dashboard will appear here.</p>}</Section>
    <Section id="highlights" title={brandName+' Cars Key Highlights'}>{highlights.length?<ul className="grid gap-3 sm:grid-cols-2">{highlights.map((x,i)=><li key={i} className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700">{x}</li>)}</ul>:<p className="text-sm text-slate-500">{profile?.description||'Add key highlights from Admin Dashboard.'}</p>}</Section>
    <Section id="discontinued" title={'Discontinued '+brandName+' Cars'}>{discontinued.length?<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{discontinued.map(item=><CarCard key={item.id} car={item}/>)}</div>:<p className="text-sm text-slate-500">No discontinued models added yet. Mark a car as Discontinued in Admin Dashboard to show it here.</p>}</Section>
    {upcoming.length>0&&<Section id="upcoming" title={'Upcoming '+brandName+' Cars'}><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{upcoming.map(item=><CarCard key={item.id} car={item}/>)}</div></Section>}
   </>}
   <div className="text-right"><Link to={backPath} className="inline-flex items-center gap-2 text-sm font-semibold text-red-600">Explore other brands <ArrowRight size={15}/></Link></div>
  </div>
 </main>;
}
