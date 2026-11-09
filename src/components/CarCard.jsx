import React from 'react';
import {Link} from 'react-router-dom';
import {Fuel,Gauge,Cog,Users,Heart,MapPin} from 'lucide-react';
import {Image} from '@/components/ui/image';
export default function CarCard({car}){
 const used=String(car.condition||car.listing_type||'New').toLowerCase()==='used';
 const price=Number(car.price||0);
 return <article className="group overflow-hidden rounded-lg border border-slate-200 bg-white transition hover:border-slate-300 hover:shadow-md">
  <Link to={'/car/'+car.id} className="block">
   <div className="relative aspect-[16/10] overflow-hidden bg-slate-100"><Image src={car.image_url} alt={(car.brand||'')+' '+(car.name||'Car')} className="h-full w-full object-cover transition duration-500 group-hover:scale-105"/><span className="absolute left-3 top-3 rounded bg-white px-2.5 py-1 text-[11px] font-bold text-slate-700 shadow-sm">{used?'Used':'New'}</span>{car.tags?.includes('Upcoming')&&<span className="absolute right-3 top-3 rounded bg-blue-700 px-2.5 py-1 text-[11px] font-bold text-white">Upcoming</span>}</div>
   <div className="p-4"><p className="text-xs font-medium text-slate-500">{car.brand||'Car'}</p><h3 className="mt-1 line-clamp-1 text-base font-bold text-slate-900 group-hover:text-red-600">{car.name||'Car model'}</h3><p className="mt-2 text-lg font-extrabold text-slate-900">{price>0?'₹'+(price/100000).toFixed(2)+' Lakh':'Price on request'}</p><p className="text-[11px] text-slate-500">{used?'Asking price':'Ex-showroom price'}</p>
    <div className="mt-3 grid grid-cols-4 gap-2 border-t border-slate-100 pt-3">{[[Fuel,car.fuel_type],[Gauge,car.mileage],[Cog,car.transmission],[Users,car.seating?car.seating+' Seats':'—']].map(([Icon,label],i)=><div key={i} className="min-w-0 text-center"><Icon className="mx-auto h-4 w-4 text-slate-400"/><p className="mt-1 truncate text-[10px] text-slate-500">{label||'—'}</p></div>)}</div>
   </div>
  </Link>
  {used&&<div className="flex items-center justify-between border-t border-slate-100 px-4 py-2 text-xs text-slate-500"><span className="flex items-center gap-1"><MapPin className="h-3 w-3"/>{car.city||'Location not specified'}</span><button type="button" aria-label="Save car" onClick={e=>e.currentTarget.classList.toggle('text-red-600')} className="text-slate-400 hover:text-red-600"><Heart className="h-4 w-4"/></button></div>}
 </article>
}