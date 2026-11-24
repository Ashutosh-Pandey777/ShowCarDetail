import React from 'react';

const FALLBACKS={
 suv:'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=85',
 hatchback:'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1200&q=85',
 sedan:'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=85',
 muv:'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=85',
 luxury:'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=85',
 coupe:'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=85',
 convertible:'https://images.unsplash.com/photo-1504215680853-026ed2a45def?auto=format&fit=crop&w=1200&q=85',
 pickup:'https://images.unsplash.com/photo-1551830820-330a71b99659?auto=format&fit=crop&w=1200&q=85',
 minivan:'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1200&q=85'
};

export function getCarFallback(car={}){
 const body=String(car.body_type||'').toLowerCase().replace(/[^a-z]/g,'');
 if(body.includes('suv'))return FALLBACKS.suv;
 if(body.includes('hatch'))return FALLBACKS.hatchback;
 if(body.includes('sedan'))return FALLBACKS.sedan;
 if(['muv','mpv'].includes(body))return FALLBACKS.muv;
 if(body.includes('luxury'))return FALLBACKS.luxury;
 if(body.includes('coupe'))return FALLBACKS.coupe;
 if(body.includes('convertible'))return FALLBACKS.convertible;
 if(body.includes('pickup'))return FALLBACKS.pickup;
 if(body.includes('mini'))return FALLBACKS.minivan;
 if(String(car.fuel_type||'').toLowerCase()==='electric')return FALLBACKS.sedan;
 return FALLBACKS.suv;
}

// Stateless image rendering prevents a reused card component from retaining
// the previous vehicle's image when its record or image URL changes.
export default function CarPhoto({car={},className='',alt,onClick}){
 const fallback=getCarFallback(car);
 const imageUrl=String(car.image_url||'').trim()||fallback;
 const identity=String(car.id||car.name||'car')+'|'+imageUrl;
 return <img
  key={identity}
  src={imageUrl}
  alt={alt||[car.brand,car.name].filter(Boolean).join(' ')||'Car'}
  className={className}
  loading="lazy"
  decoding="async"
  onClick={onClick}
  onError={e=>{
   const img=e.currentTarget;
   if(img.dataset.fallbackApplied==='true')return;
   img.dataset.fallbackApplied='true';
   if(img.src!==fallback)img.src=fallback;
  }}
 />;
}
