import React, { useState } from "react";
import { Link } from "react-router-dom";
import { LayoutDashboard, Car, BadgeCheck, Star, Newspaper, Mail, Eye, ImageIcon, ArrowLeft } from "lucide-react";
import AdminStats from "@/components/admin/AdminStats";
import CarManager from "@/components/admin/CarManager";
import BrandManager from "@/components/admin/BrandManager";
import ReviewManager from "@/components/admin/ReviewManager";
import NewsManager from "@/components/admin/NewsManager";
import ContactManager from "@/components/admin/ContactManager";
import VisitManager from "@/components/admin/VisitManager";
import ImageManager from "@/components/admin/ImageManager";

const NAV = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "cars", label: "Cars", icon: Car },
  { id: "brands", label: "Brands", icon: BadgeCheck },
  { id: "reviews", label: "Reviews", icon: Star },
  { id: "news", label: "News", icon: Newspaper },
  { id: "contacts", label: "Inquiries", icon: Mail },
  { id: "visits", label: "Visits", icon: Eye },
  { id: "gallery", label: "Gallery", icon: ImageIcon },
];

export default function Admin() {
  const [active, setActive] = useState("overview");

  return (
    <div className="min-h-screen bg-obsidian grain">
      <div className="max-w-chassis mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="section-label mb-2">Management Cockpit</div>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight">
              Admin Dashboard
            </h1>
          </div>
          <Link to="/" className="btn-ghost py-2 px-4 text-xs">
            <ArrowLeft className="w-4 h-4" /> Back to site
          </Link>
        </div>

        <div className="grid lg:grid-cols-[220px_1fr] gap-6">
          <aside className="lg:sticky lg:top-6 h-max">
            <nav className="flex lg:flex-col gap-1 overflow-x-auto pb-2 lg:pb-0">
              {NAV.map((n) => {
                const Icon = n.icon;
                const on = active === n.id;
                return (
                  <button
                    key={n.id}
                    onClick={() => setActive(n.id)}
                    className={`flex items-center gap-3 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-l-2 ${
                      on
                        ? "border-primary text-primary bg-secondary"
                        : "border-transparent text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    }`}
                  >
                    <Icon className="w-4 h-4" /> {n.label}
                  </button>
                );
              })}
            </nav>
          </aside>

          <section className="min-w-0">
            {active === "overview" && <AdminStats onNavigate={setActive} />}
            {active === "cars" && <CarManager />}
            {active === "brands" && <BrandManager />}
            {active === "reviews" && <ReviewManager />}
            {active === "news" && <NewsManager />}
            {active === "contacts" && <ContactManager />}
            {active === "visits" && <VisitManager />}
            {active === "gallery" && <ImageManager />}
          </section>
        </div>
      </div>
    </div>
  );
}