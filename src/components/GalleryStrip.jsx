import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Image } from "@/components/ui/image";
import { Loader2 } from "lucide-react";

export default function GalleryStrip() {
  const [images, setImages] = useState(null);

  useEffect(() => {
    base44.entities.GalleryImage.list("-created_date", 12)
      .then((imgs) => setImages(imgs.filter((i) => i.active)))
      .catch(() => setImages([]));
  }, []);

  if (!images) return null;
  if (images.length === 0) return null;

  return (
    <section className="py-16">
      <div className="max-w-chassis mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="section-label mb-2"><span className="w-8 h-px bg-primary" />Showroom Gallery</div>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight">In frame.</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {images.map((img) => (
            <div key={img.id} className="group relative aspect-square overflow-hidden bg-card border border-hairline">
              <Image src={img.image_url} alt={img.title} fittingType="fill" className="w-full h-full transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 left-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-sm font-medium">{img.title}</p>
                <p className="text-white/60 text-[11px] font-mono-data uppercase tracking-widest">{img.section}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}