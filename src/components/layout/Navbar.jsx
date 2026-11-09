import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, ChevronDown, LogOut, ShieldCheck, MapPin, UserRound, Navigation } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';

const BRANDS = ['Maruti Suzuki','Hyundai','Tata','Mahindra','Kia','Toyota','Honda','BMW','Mercedes-Benz','Audi','MG','Skoda','Volkswagen','Nissan','Renault','BYD'];
const STATE_CITIES = {
  'Andhra Pradesh':['Visakhapatnam','Vijayawada','Guntur','Tirupati','Nellore','Kurnool','Rajahmundry','Kakinada'],
  'Arunachal Pradesh':['Itanagar','Naharlagun','Tawang','Pasighat'],
  'Assam':['Guwahati','Dibrugarh','Silchar','Jorhat','Tezpur','Nagaon'],
  'Bihar':['Patna','Gaya','Muzaffarpur','Bhagalpur','Darbhanga','Purnia','Ara','Begusarai','Katihar','Munger','Chhapra','Samastipur','Bihar Sharif','Sasaram'],
  'Chhattisgarh':['Raipur','Bhilai','Bilaspur','Korba','Durg','Rajnandgaon','Jagdalpur'],
  'Goa':['Panaji','Margao','Vasco da Gama','Mapusa'],
  'Gujarat':['Ahmedabad','Surat','Vadodara','Rajkot','Gandhinagar','Bhavnagar','Jamnagar','Junagadh','Anand','Nadiad'],
  'Haryana':['Gurugram','Faridabad','Panipat','Ambala','Hisar','Karnal','Rohtak','Sonipat'],
  'Himachal Pradesh':['Shimla','Dharamshala','Solan','Mandi','Kullu','Hamirpur'],
  'Jharkhand':['Ranchi','Jamshedpur','Dhanbad','Bokaro','Deoghar','Hazaribagh'],
  'Karnataka':['Bengaluru','Mysuru','Mangaluru','Hubballi','Belagavi','Kalaburagi','Davanagere','Udupi'],
  'Kerala':['Kochi','Thiruvananthapuram','Kozhikode','Thrissur','Kollam','Kannur','Kottayam'],
  'Madhya Pradesh':['Indore','Bhopal','Jabalpur','Gwalior','Ujjain','Sagar','Dewas','Satna','Ratlam'],
  'Maharashtra':['Mumbai','Pune','Nagpur','Nashik','Thane','Navi Mumbai','Chhatrapati Sambhajinagar','Kolhapur','Solapur','Amravati'],
  'Manipur':['Imphal','Thoubal','Bishnupur'],
  'Meghalaya':['Shillong','Tura','Jowai'],
  'Mizoram':['Aizawl','Lunglei','Champhai'],
  'Nagaland':['Kohima','Dimapur','Mokokchung'],
  'Odisha':['Bhubaneswar','Cuttack','Rourkela','Berhampur','Sambalpur','Puri','Balasore'],
  'Punjab':['Ludhiana','Amritsar','Jalandhar','Patiala','Bathinda','Mohali','Pathankot'],
  'Rajasthan':['Jaipur','Jodhpur','Udaipur','Kota','Ajmer','Bikaner','Alwar','Bharatpur','Sikar'],
  'Sikkim':['Gangtok','Namchi','Gyalshing'],
  'Tamil Nadu':['Chennai','Coimbatore','Madurai','Tiruchirappalli','Salem','Tiruppur','Erode','Vellore'],
  'Telangana':['Hyderabad','Warangal','Karimnagar','Nizamabad','Khammam','Ramagundam'],
  'Tripura':['Agartala','Udaipur','Dharmanagar'],
  'Uttar Pradesh':['Lucknow','Kanpur','Varanasi','Agra','Prayagraj','Noida','Ghaziabad','Meerut','Gorakhpur','Bareilly','Aligarh','Moradabad','Jhansi','Mathura'],
  'Uttarakhand':['Dehradun','Haridwar','Rishikesh','Roorkee','Haldwani','Rudrapur','Kashipur'],
  'West Bengal':['Kolkata','Howrah','Durgapur','Asansol','Siliguri','Kharagpur','Darjeeling'],
  'Andaman and Nicobar Islands':['Port Blair'],
  'Chandigarh':['Chandigarh'],
  'Dadra and Nagar Haveli and Daman and Diu':['Daman','Diu','Silvassa'],
  'Delhi':['New Delhi','Delhi'],
  'Jammu and Kashmir':['Srinagar','Jammu','Anantnag','Baramulla'],
  'Ladakh':['Leh','Kargil'],
  'Lakshadweep':['Kavaratti'],
  'Puducherry':['Puducherry','Karaikal','Yanam']
};
const POPULAR_CITIES = ['Delhi NCR','Mumbai','Bengaluru','Hyderabad','Chennai','Pune','Kolkata','Ahmedabad','Jaipur','Lucknow','Patna','Chandigarh','Indore','Bhopal','Nagpur','Surat','Vadodara','Kanpur','Varanasi','Ranchi','Bhubaneswar','Guwahati','Dehradun','Noida','Gurugram'];

export default function Navbar() {
  const [open,setOpen]=useState(false), [activeMenu,setActiveMenu]=useState(''), [query,setQuery]=useState(''), [accountOpen,setAccountOpen]=useState(false), [locationOpen,setLocationOpen]=useState(false), [citySearch,setCitySearch]=useState(''), [detecting,setDetecting]=useState(false), [locationError,setLocationError]=useState('');
  const [city,setCity]=useState(()=>localStorage.getItem('showcardetail_city') || 'Select City');
  const navigate=useNavigate();
  const {user,isAuthenticated,logout}=useAuth();
  const close=()=>{setOpen(false);setActiveMenu('');setAccountOpen(false);setLocationOpen(false);};
  const chooseCity=value=>{setCity(value);localStorage.setItem('showcardetail_city',value);setLocationOpen(false);setCitySearch('');setLocationError('');};
  const detectLocation=()=>{
    setLocationError('');
    if(!navigator.geolocation){setLocationError('Your browser does not support location detection. Please select your city.');return;}
    setDetecting(true);
    navigator.geolocation.getCurrentPosition(async position=>{
      const {latitude,longitude}=position.coords;
      try{
        const response=await fetch('https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat='+latitude+'&lon='+longitude);
        if(!response.ok) throw new Error('Could not identify your city.');
        const data=await response.json();
        const address=data.address||{};
        const detectedCity=address.city||address.town||address.city_district||address.suburb||address.county||address.state_district||address.state||'Current Location';
        chooseCity(detectedCity);
      }catch(error){chooseCity('Current Location');setLocationError('Location detected, but city name could not be fetched.');}
      finally{setDetecting(false);}
    },error=>{setDetecting(false);setLocationError(error.code===1?'Location permission was denied. Allow location access in your browser, or select a city below.':'Unable to detect your location. Please select a city below.');},{enableHighAccuracy:true,timeout:12000,maximumAge:60000});
  };
  const LocationPicker=({mobile=false})=><button type="button" onClick={()=>setLocationOpen(true)} aria-label={city==='Select City'?'Select location': 'Selected location: '+city} title={city==='Select City'?'Select location':city} className={'flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-red-300 hover:bg-red-50 hover:text-red-600 '+(mobile?'mb-3':'')}><MapPin className="h-5 w-5 text-red-600"/></button>;
  const submit=e=>{e.preventDefault();navigate('/browse?q='+encodeURIComponent(query));close();};
  const menus={
    'New Cars':[
      ['Find New Cars','/browse?condition=New'],['By Budget','/browse?condition=New'],['By Body Type','/browse?condition=New'],['By Fuel Type','/browse?condition=New'],['By Brand','/browse?condition=New'],['Electric Cars','/browse?condition=New&fuel=Electric'],['Compare Cars','/compare']
    ],
    'Used Cars':[
      ['Find Used Cars','/browse?condition=Used'],['Under ₹5 Lakh','/browse?condition=Used'],['Under ₹10 Lakh','/browse?condition=Used'],['SUVs','/browse?condition=Used&body=SUV'],['Sedans','/browse?condition=Used&body=Sedan'],['Browse by Brand','/browse?condition=Used']
    ],
    'News & Reviews':[
      ['Latest News','/news-reviews?tab=news'],['Car Reviews','/news-reviews?tab=reviews'],['Expert Reviews','/news-reviews?tab=expert'],['Videos','/news-reviews?tab=videos']
    ]
  };
  const MenuGroup=({name})=><div className="relative" onMouseEnter={()=>setActiveMenu(name)} onMouseLeave={()=>setActiveMenu('')}>
    <button type="button" onClick={()=>setActiveMenu(activeMenu===name?'':name)} className="flex items-center gap-1 px-3 py-3 text-sm font-semibold text-slate-700 hover:text-red-600">{name}<ChevronDown className="w-4 h-4"/></button>
    {activeMenu===name&&<div className="absolute left-0 top-full z-50 w-60 rounded-b-lg border border-slate-200 bg-white p-2 shadow-xl">
      {menus[name].map(([label,to])=><Link key={label} to={to} onClick={close} className="block rounded px-3 py-2.5 text-sm text-slate-700 hover:bg-red-50 hover:text-red-600">{label}</Link>)}
    </div>}
  </div>;
  return <header className="sticky top-0 z-50 border-b border-slate-200 bg-white text-slate-900 shadow-sm">
    <div className="mx-auto max-w-chassis px-4 sm:px-6">
      <div className="flex h-[72px] items-center justify-between gap-4">
        <Link to="/" onClick={close} className="flex shrink-0 items-center gap-2">
          <svg width="34" height="34" viewBox="0 0 36 36" fill="none" aria-hidden="true"><path d="M4 24.5 9.5 12h17L32 24.5M7 24.5h22" stroke="#e31e24" strokeWidth="2.4" strokeLinejoin="round"/><circle cx="11" cy="25" r="3" fill="white" stroke="#e31e24" strokeWidth="2"/><circle cx="25" cy="25" r="3" fill="white" stroke="#e31e24" strokeWidth="2"/></svg>
          <span className="font-heading text-lg font-extrabold tracking-tight">SHOW<span className="text-red-600">CAR</span>DETAIL</span>
        </Link>
        <nav className="hidden lg:flex items-center"><MenuGroup name="New Cars"/><MenuGroup name="Used Cars"/><MenuGroup name="News & Reviews"/></nav>
        <div className="hidden md:flex items-center gap-3">
          <LocationPicker/>
          <form onSubmit={submit} className="flex h-10 w-44 items-center gap-2 rounded border border-slate-200 px-3"><Search className="h-4 w-4 text-slate-500"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search cars" aria-label="Search cars" className="w-full bg-transparent text-sm outline-none"/></form>
          <div className="relative">
            <button type="button" aria-label="Account menu" aria-expanded={accountOpen} onClick={()=>setAccountOpen(v=>!v)} className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-red-300 hover:bg-red-50 hover:text-red-600">
              <UserRound className="h-5 w-5"/>
            </button>
            {accountOpen&&<div className="absolute right-0 top-full z-[60] mt-2 w-56 overflow-hidden rounded-lg border border-slate-200 bg-white py-2 shadow-xl">
              <div className="border-b border-slate-100 px-4 py-3"><p className="text-sm font-semibold text-slate-900">{isAuthenticated&&user?'My Account':'Welcome to ShowCarDetail'}</p><p className="mt-1 text-xs text-slate-500">{isAuthenticated&&user?'Manage your account':'Login to access your account'}</p></div>
              {isAuthenticated&&user?<><Link to="/admin" onClick={close} className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50"><ShieldCheck className="h-4 w-4"/>Admin Dashboard</Link><button type="button" onClick={()=>{close();logout(false);}} className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-50"><LogOut className="h-4 w-4"/>Logout</button></>:<Link to="/login" onClick={close} className="mx-3 mt-2 flex items-center justify-center rounded bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700">Login / Sign Up</Link>}
            </div>}
          </div>
        </div>
        <button type="button" aria-label="Toggle menu" onClick={()=>setOpen(!open)} className="p-2 text-slate-800 lg:hidden">{open?<X/>:<Menu/>}</button>
      </div>
    </div>
    {open&&<div className="border-t border-slate-200 bg-white px-4 py-4 lg:hidden">
      <LocationPicker mobile/>
      <form onSubmit={submit} className="mb-3 flex h-10 items-center gap-2 rounded border border-slate-200 px-3"><Search className="h-4 w-4"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search cars" className="w-full bg-transparent text-sm outline-none"/></form>
      {Object.entries(menus).map(([name,items])=><section key={name} className="border-b border-slate-100 py-2"><button onClick={()=>setActiveMenu(activeMenu===name?'':name)} className="flex w-full items-center justify-between py-2 font-semibold text-slate-800">{name}<ChevronDown className="h-4 w-4"/></button>{activeMenu===name&&<div className="grid grid-cols-2 gap-1">{items.map(([label,to])=><Link key={label} to={to} onClick={close} className="rounded px-2 py-2 text-sm text-slate-600 hover:bg-red-50">{label}</Link>)}</div>}</section>)}
      <div className="flex items-center justify-between border-t border-slate-100 pt-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-800"><UserRound className="h-5 w-5 text-red-600"/>{isAuthenticated&&user?'My Account':'Your Account'}</div>
        {isAuthenticated&&user?<div className="flex gap-4"><Link to="/admin" onClick={close} className="text-sm font-medium text-red-600">Admin</Link><button type="button" onClick={()=>{close();logout(false)}} className="text-sm text-slate-700">Logout</button></div>:<Link to="/login" onClick={close} className="rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white">Login / Sign Up</Link>}
      </div>
    </div>}

    {locationOpen&&<div className="fixed inset-0 z-[100] flex items-start justify-center bg-slate-950/50 px-4 py-16 sm:items-center" onMouseDown={e=>{if(e.target===e.currentTarget)setLocationOpen(false);}}>
      <section role="dialog" aria-modal="true" aria-labelledby="location-picker-title" className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4"><div><h2 id="location-picker-title" className="text-lg font-bold text-slate-900">Select your city</h2><p className="mt-1 text-xs text-slate-500">Find cars and prices available near you</p></div><button type="button" aria-label="Close location selector" onClick={()=>setLocationOpen(false)} className="rounded-full p-2 text-slate-500 hover:bg-slate-100"><X className="h-5 w-5"/></button></div>
        <div className="p-5">
          <button type="button" onClick={detectLocation} disabled={detecting} className="flex w-full items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-left text-red-700 hover:bg-red-100 disabled:opacity-60"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-white"><Navigation className="h-4 w-4"/></span><span className="flex-1"><span className="block text-sm font-semibold">{detecting?'Detecting your location…':'Detect my location'}</span><span className="mt-0.5 block text-xs text-red-600">Use your device location</span></span></button>
          {locationError&&<p role="status" className="mt-3 rounded-md bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-800">{locationError}</p>}
          <div className="relative mt-5"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"/><input value={citySearch} onChange={e=>setCitySearch(e.target.value)} placeholder="Search your city" aria-label="Search city" className="h-11 w-full rounded-lg border border-slate-200 pl-9 pr-3 text-sm text-slate-800 outline-none focus:border-red-400"/></div>
          { !citySearch.trim() ? <>
            <p className="mb-3 mt-5 text-xs font-semibold uppercase tracking-wide text-slate-500">Popular cities</p>
            <div className="grid max-h-64 grid-cols-2 gap-2 overflow-y-auto">{POPULAR_CITIES.map(c=><button type="button" key={c} onClick={()=>chooseCity(c)} className={'rounded-lg border px-3 py-2.5 text-left text-sm transition hover:border-red-300 hover:bg-red-50 '+(city===c?'border-red-300 bg-red-50 font-semibold text-red-700':'border-slate-100 text-slate-700')}>{c}</button>)}</div>
          </> : <>
            {Object.entries(STATE_CITIES).filter(([state,cities])=>state.toLowerCase().includes(citySearch.trim().toLowerCase())||cities.some(c=>c.toLowerCase().includes(citySearch.trim().toLowerCase()))).map(([state,cities])=>{
              const stateMatches=state.toLowerCase().includes(citySearch.trim().toLowerCase());
              const matches=stateMatches?cities:cities.filter(c=>c.toLowerCase().includes(citySearch.trim().toLowerCase()));
              return matches.length>0?<section key={state} className="mt-5">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">{state}</h3>
                <div className="grid grid-cols-2 gap-2">{matches.map(c=><button type="button" key={state+'-'+c} onClick={()=>chooseCity(c)} className={'rounded-lg border px-3 py-2.5 text-left text-sm transition hover:border-red-300 hover:bg-red-50 '+(city===c?'border-red-300 bg-red-50 font-semibold text-red-700':'border-slate-100 text-slate-700')}>{c}</button>)}</div>
              </section>:null;
            })}
            {!Object.entries(STATE_CITIES).some(([state,cities])=>state.toLowerCase().includes(citySearch.trim().toLowerCase())||cities.some(c=>c.toLowerCase().includes(citySearch.trim().toLowerCase())))&&<p className="mt-5 py-4 text-center text-sm text-slate-500">No city found. Try another city or state name.</p>}
          </>}
        </div>
      </section>
    </div>}
  </header>;
}
