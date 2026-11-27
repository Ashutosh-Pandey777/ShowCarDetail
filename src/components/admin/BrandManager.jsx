import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import AdminModal, { Field, TextInput, TextArea } from "@/components/admin/AdminModal";

const EMPTY = { name: "", slug: "", country: "", founded: "", description: "", tagline: "", accent_color: "", image_url: "", comparisons: "", popular_used_models: "", key_highlights: "" };

export default function BrandManager() {
  const [items, setItems] = useState(null);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [logoFile, setLogoFile] = useState(null);

  const load = async () => setItems((await base44.entities.Brand.list("-created_date", 300)).filter((brand) => brand.category !== "Bike"));
  useEffect(() => { load(); }, []);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    let image_url = editing.image_url || "";
    try {
      if (logoFile) image_url = (await base44.integrations.Core.UploadFile({ file: logoFile })).file_url;
      const data = { ...editing, image_url, founded: editing.founded ? Number(editing.founded) : undefined };
      if (editing.id) await base44.entities.Brand.update(editing.id, data);
      else await base44.entities.Brand.create(data);
      setEditing(null);
      setLogoFile(null);
      await load();
    } finally { setSaving(false); }
  };

  const remove = async (id) => {
    if (!confirm("Delete this brand?")) return;
    await base44.entities.Brand.delete(id);
    load();
  };

  if (!items) return <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div><h2 className="font-heading text-xl font-semibold">Car Brands ({items.length})</h2><p className="mt-1 text-xs text-muted-foreground">Brand profile content shown on each brand page.</p></div>
        <button onClick={() => { setLogoFile(null); setEditing({ ...EMPTY }); }} className="btn-showcardetail px-4 py-2 text-xs"><Plus className="h-4 w-4" /> Add Brand</button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((b) => <div key={b.id} className="border border-hairline bg-gunmetal p-4">
          <div className="mb-3 flex items-start justify-between gap-2">
            <div className="flex items-center gap-3"><div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded bg-white">{b.image_url ? <img src={b.image_url} alt={b.name} className="h-full w-full object-contain" /> : <span className="text-xs font-bold text-slate-500">{String(b.name || "").split(" ").map((w) => w[0]).join("").slice(0,2)}</span>}</div><div><div className="font-heading font-semibold">{b.name}</div><div className="text-xs text-muted-foreground">{b.country || "India"} · /brand/{b.slug || String(b.name||"").toLowerCase().replace(/[^a-z0-9]+/g,"-")}</div></div></div>
            <div className="flex gap-1"><button onClick={() => { setLogoFile(null); setEditing({ ...EMPTY, ...b }); }} className="p-1.5 text-muted-foreground hover:text-primary"><Pencil className="h-4 w-4" /></button><button onClick={() => remove(b.id)} className="p-1.5 text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button></div>
          </div>
          <p className="line-clamp-2 text-xs text-muted-foreground">{b.description || "No brand description added."}</p>
        </div>)}
        {!items.length && <div className="col-span-full py-10 text-center text-muted-foreground">No car brands yet. Add a brand profile to manage its logo and content.</div>}
      </div>
      {editing && <AdminModal title={editing.id ? "Edit Brand Profile" : "Add Brand Profile"} onClose={() => setEditing(null)}>
        <form onSubmit={save} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Brand name"><TextInput required value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></Field>
            <Field label="URL slug (e.g. maruti-suzuki)"><TextInput required value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} /></Field>
            <Field label="Country"><TextInput value={editing.country || ""} onChange={(e) => setEditing({ ...editing, country: e.target.value })} /></Field>
            <Field label="Founded year"><TextInput type="number" value={editing.founded || ""} onChange={(e) => setEditing({ ...editing, founded: e.target.value })} /></Field>
            <Field label="Brand logo URL"><TextInput value={editing.image_url || ""} onChange={(e) => setEditing({ ...editing, image_url: e.target.value })} /></Field>
            <Field label="Upload brand logo"><input type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files?.[0] || null)} className="w-full text-sm" />{logoFile && <span className="text-xs text-muted-foreground">{logoFile.name}</span>}</Field>
            <Field label="Tagline"><TextInput value={editing.tagline || ""} onChange={(e) => setEditing({ ...editing, tagline: e.target.value })} /></Field>
            <Field label="Accent color (hex)"><TextInput value={editing.accent_color || ""} onChange={(e) => setEditing({ ...editing, accent_color: e.target.value })} /></Field>
          </div>
          <Field label="Brand page description (shown below the brand heading)"><TextArea value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></Field>
          <p className="text-xs text-muted-foreground">Write the full brand introduction here. New lines and paragraphs will be preserved on the public brand page. This is where you can add the Maruti Suzuki overview text, price context, model count and brand information.</p>
          <Field label="Cars Comparisons (one entry per line)"><TextArea value={editing.comparisons || ""} onChange={(e) => setEditing({ ...editing, comparisons: e.target.value })} /></Field>
          <Field label="Popular Used Models / notes (one per line)"><TextArea value={editing.popular_used_models || ""} onChange={(e) => setEditing({ ...editing, popular_used_models: e.target.value })} /></Field>
          <Field label="Key Highlights (one per line)"><TextArea value={editing.key_highlights || ""} onChange={(e) => setEditing({ ...editing, key_highlights: e.target.value })} /></Field>
          <p className="text-xs text-muted-foreground">Car models, prices, condition (New / Used / Upcoming / Discontinued), cover images and galleries are managed separately under Admin Dashboard → Cars. Brand pages automatically use those records.</p>
          <div className="flex justify-end gap-3 pt-2"><button type="button" onClick={() => setEditing(null)} className="btn-ghost px-4 py-2 text-xs">Cancel</button><button type="submit" disabled={saving} className="btn-showcardetail px-4 py-2 text-xs">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Brand"}</button></div>
        </form>
      </AdminModal>}
    </div>
  );
}
