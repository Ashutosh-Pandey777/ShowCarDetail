import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Car, BadgeCheck, Star, Newspaper, Mail, Eye, ImageIcon, TrendingUp } from "lucide-react";

export default function AdminStats({ onNavigate }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const [cars, brands, reviews, news, contacts, visits, gallery] = await Promise.all([
          base44.entities.Car.list(),
          base44.entities.Brand.list(),
          base44.entities.Review.list(),
          base44.entities.News.list(),
          base44.entities.Contact.list(),
          base44.entities.Visit.list(),
          base44.entities.GalleryImage.list(),
        ]);
        setStats({
          cars: cars.length,
          brands: brands.length,
          reviews: reviews.length,
          news: news.length,
          contacts: contacts.length,
          visits: visits.length,
          gallery: gallery.length,
        });
      } catch (e) {
        setStats({ cars: 0, brands: 0, reviews: 0, news: 0, contacts: 0, visits: 0, gallery: 0 });
      }
    })();
  }, []);

  const cards = [
    { key: "cars", label: "Total Vehicles", icon: Car, value: stats?.cars },
    { key: "brands", label: "Brands", icon: BadgeCheck, value: stats?.brands },
    { key: "reviews", label: "Reviews", icon: Star, value: stats?.reviews },
    { key: "news", label: "News Articles", icon: Newspaper, value: stats?.news },
    { key: "contacts", label: "Inquiries", icon: Mail, value: stats?.contacts },
    { key: "visits", label: "Site Visits", icon: Eye, value: stats?.visits },
    { key: "gallery", label: "Gallery Images", icon: ImageIcon, value: stats?.gallery },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <button
              key={c.key}
              onClick={() => onNavigate(c.key)}
              className="text-left bg-gunmetal border border-hairline p-5 hover:border-primary/40 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <Icon className="w-5 h-5 text-primary" />
                <TrendingUp className="w-4 h-4 text-muted-foreground/40" />
              </div>
              <div className="font-mono-data text-3xl font-semibold">
                {c.value === undefined ? "—" : c.value}
              </div>
              <div className="text-xs text-muted-foreground uppercase tracking-widest mt-1">
                {c.label}
              </div>
            </button>
          );
        })}
      </div>

      <div className="bg-gunmetal border border-hairline p-6">
        <div className="section-label mb-4">Quick Actions</div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { k: "cars", label: "Add Vehicle" },
            { k: "brands", label: "Add Brand" },
            { k: "reviews", label: "Add Review" },
            { k: "news", label: "Publish News" },
            { k: "contacts", label: "View Inquiries" },
            { k: "visits", label: "View Visits" },
            { k: "gallery", label: "Upload Image" },
          ].map((a) => (
            <button
              key={a.k}
              onClick={() => onNavigate(a.k)}
              className="btn-ghost py-2 text-xs justify-center"
            >
              {a.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}