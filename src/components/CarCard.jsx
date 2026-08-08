import React from 'react';
import { Link } from 'react-router-dom';
import { Fuel, Gauge, Cog, Users, Heart } from 'lucide-react';
import { Image } from '@/components/ui/image';

export default function CarCard({ car }) {
  return (
    <Link
      to={`/car/${car.id}`}
      className="group relative block bg-card border border-hairline overflow-hidden transition-all duration-300 hover:border-primary/50"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-gunmetal">
        <Image
          src={car.image_url}
          alt={`${car.brand} ${car.name}`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent" />
        {car.tags?.includes('Upcoming') && (
          <span className="absolute top-3 left-3 chip bg-primary/15 text-primary border-primary/30">Upcoming</span>
        )}
        {car.tags?.includes('Electric') && (
          <span className="absolute top-3 left-3 chip bg-primary/15 text-primary border-primary/30">EV</span>
        )}
        <span className="absolute top-3 right-3 chip bg-obsidian/70 backdrop-blur">{car.body_type}</span>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[11px] font-mono-data uppercase tracking-widest text-muted-foreground">{car.brand}</p>
            <h3 className="font-heading text-lg font-bold leading-tight mt-0.5 group-hover:text-primary transition-colors">{car.name}</h3>
          </div>
          <button onClick={(e) => e.preventDefault()} className="text-muted-foreground hover:text-primary transition-colors mt-1">
            <Heart className="w-4 h-4" />
          </button>
        </div>
        <div className="mt-3 flex items-baseline gap-1.5">
          <span className="text-[10px] font-mono-data uppercase tracking-widest text-muted-foreground">From</span>
          <span className="font-mono-data text-xl font-semibold text-primary">₹{(car.price / 100000).toFixed(2)}L</span>
        </div>
        <div className="mt-4 grid grid-cols-4 gap-2 pt-3 border-t border-hairline">
          <Spec icon={Fuel} label={car.fuel_type} />
          <Spec icon={Gauge} label={car.mileage} />
          <Spec icon={Cog} label={car.transmission} />
          <Spec icon={Users} label={`${car.seating}p`} />
        </div>
      </div>
    </Link>
  );
}

function Spec({ icon: Icon, label }) {
  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <Icon className="w-3.5 h-3.5 text-muted-foreground" />
      <span className="text-[10px] font-mono-data text-muted-foreground truncate w-full">{label || '—'}</span>
    </div>
  );
}