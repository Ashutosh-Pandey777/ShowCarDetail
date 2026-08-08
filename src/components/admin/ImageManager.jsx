import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Plus, Trash2, Loader2, Upload, Eye, EyeOff } from "lucide-react";
import { Image } from "@/components/ui/image";

export default function ImageManager() {
  const [items, setItems] = useState(null);
  const [title, setTitle] = useState("");
  const [section, setSection] = useState("Showroom");
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = async () => setItems(await base44.entities.GalleryImage.list("-created_date", 100));
  useEffect(() => { load(); }, []);

  const upload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setBusy(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      await base44.entities.GalleryImage.create({
        title: title || file.name || "Untitled",
        image_url: file_url,
        section,
        active: true,
      });
      setTitle("");
      setFile(null);
      load();
    } finally {
      setBusy(false);
    }
  };

  const toggle = async (img) => {
    await base44.entities.GalleryImage.update(img.id, { active: !img.active });
    load();
  };

  const remove = async (id) => {
    if (!confirm("Delete this image?")) return;
    await base44.entities.GalleryImage.delete(id);
    load();
  };

  if (!items) return <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />;

  return (
    <div>
      <h2 className="font-heading text-xl font-semibold mb-4">Gallery Images ({items.length})</h2>

      <form onSubmit={upload} className="bg-gunmetal border border-hairline p-4 mb-6 flex flex-col sm:flex-row gap-3 sm:items-end">
        <label className="block flex-1">
          <span className="block text-xs font-mono-data uppercase tracking-widest text-muted-foreground mb-1.5">Title</span>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Image title" className="w-full bg-obsidian border border-hairline px-3 py-2 text-sm outline-none focus:border-primary/60" />
        </label>
        <label className="block flex-1">
          <span className="block text-xs font-mono-data uppercase tracking-widest text-muted-foreground mb-1.5">Section</span>
          <input value={section} onChange={(e) => setSection(e.target.value)} className="w-full bg-obsidian border border-hairline px-3 py-2 text-sm outline-none focus:border-primary/60" />
        </label>
        <label className="block flex-1">
          <span className="block text-xs font-mono-data uppercase tracking-widest text-muted-foreground mb-1.5">Image file</span>
          <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="w-full text-sm file:mr-3 file:px-3 file:py-1.5 file:border file:border-hairline file:bg-obsidian file:text-foreground" />
        </label>
        <button type="submit" disabled={busy || !file} className="btn-kinetic py-2 px-4 text-xs whitespace-nowrap">
          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Upload className="w-4 h-4" /> Upload</>}
        </button>
      </form>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {items.map((img) => (
          <div key={img.id} className="bg-gunmetal border border-hairline group">
            <div className="relative aspect-[4/3] overflow-hidden bg-obsidian">
              <Image src={img.image_url} alt={img.title} fittingType="fill" className="w-full h-full" />
              {!img.active && <div className="absolute inset-0 bg-black/60 flex items-center justify-center"><span className="chip text-white border-white/40">Hidden</span></div>}
            </div>
            <div className="p-3 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <div className="text-sm font-medium truncate">{img.title}</div>
                <div className="text-[11px] font-mono-data uppercase tracking-widest text-muted-foreground">{img.section}</div>
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => toggle(img)} className="p-1.5 text-muted-foreground hover:text-primary">
                  {img.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button onClick={() => remove(img.id)} className="p-1.5 text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && <div className="col-span-full text-muted-foreground text-center py-10">No images uploaded yet.</div>}
      </div>
    </div>
  );
}