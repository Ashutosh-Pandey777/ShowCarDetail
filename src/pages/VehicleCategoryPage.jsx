import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Bike, Truck, ArrowLeft } from 'lucide-react';

const CATEGORY_INFO = {
  'find-new-bikes': { title: 'Find New Bikes', description: 'New bike listings will appear here once bike inventory is added.', icon: Bike },
  'popular-bikes': { title: 'Popular Bikes', description: 'Popular bike listings will appear here once bike inventory is added.', icon: Bike },
  'bikes-by-budget': { title: 'Bikes by Budget', description: 'Bike options by price range will appear here once bike inventory and prices are added.', icon: Bike },
  'bikes-by-brand': { title: 'Bikes by Brand', description: 'Bike brands and their models will appear here once bike inventory is added.', icon: Bike },
  'upcoming-bikes': { title: 'Upcoming Bikes', description: 'Upcoming bike updates will appear here soon.', icon: Bike },
  scooters: { title: 'Scooters', description: 'Scooter listings will appear here once scooter inventory is added.', icon: Bike },
  'commercial-vehicles': { title: 'Commercial Vehicles', description: 'Commercial vehicle listings are not available yet.', icon: Truck }
};

export default function VehicleCategoryPage() {
  const { category = '' } = useParams();
  const info = CATEGORY_INFO[category] || CATEGORY_INFO['popular-bikes'];
  const Icon = info.icon;
  return (
    <main className="min-h-[60vh] bg-slate-50 px-4 py-16">
      <div className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-red-50 text-red-600"><Icon className="h-8 w-8" /></div>
        <h1 className="mt-5 text-2xl font-extrabold text-slate-900">{info.title}</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600">{info.description}</p>
        <Link to="/" className="mt-7 inline-flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700"><ArrowLeft className="h-4 w-4" /> Back to Home</Link>
      </div>
    </main>
  );
}
