import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Plus, Pencil, Trash2, Loader2, Upload, Eye, EyeOff } from "lucide-react";
import AdminModal, { Field, TextInput, TextArea } from "@/components/admin/AdminModal";

const EMPTY = { title: "", description: "", image_url: "", sort_order: "0", active: true };
const SECTION = "Body Type";

export default function BodyTypeManager() {
  const [items, setItems] = useState(null);
  const [editing, setEditing] = useState(null);
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    const all = await base44.entities.GalleryImage.list("-created_date", 300);
    setItems(all.filter(x => String(x.section || "").toLowerCase() === SECTION.toLowerCase()));
  };
  useEffect(() => { load().catch(e => setError(e.message || "Unable to load categories.")); }, []);

  const save = async e => {
    e.preventDefault();
    setSaving(true); setError("");
    try {
      let imageUrl = editing.image_url || "";
      if (file) {
        const uploaded = await base44.integrations.Core.UploadFile({ file });
        imageUrl = uploaded.file_url;
      }
      if (!imageUrl) throw new Error("Please add a category image URL or upload an image.");
      const data = {
        title: editing.title.trim(),
        description: editing.description || "",
        image_url: imageUrl,
        section: SECTION,
        sort_order: Number(editing.sort_order) || 0,
        active: Boolean(editing.active),
      };
      if (editing.id) await base44.entities.GalleryImage.update(editing.id, data);
      else await base44.entities.GalleryImage.create(data);
      setEditing(null); setFile(null); await load();
    } catch (e2) { setError(e2.message || "Unable to save category."); }
    finally { setSaving(false); }
  };

  const toggle = async item => {
    try { await base44.entities.GalleryImage.update(item.id, { active: !item.active }); await load(); }
    catch (e) { setError(e.message || "Unable to update category."); }
  };
  const remove = async id => {
    if (!window.confirm("Delete this body type category?")) return;
    try { await base44.entities.GalleryImage.delete(id); await load(); }
    catch (e) { setError(e.message || "Unable to delete category."); }
  };

  if (!items) return <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />;

  return <div>
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <div><h2 className="font-heading text-xl font-semibold">Body Type Categories ({items.length})</h2><p className="mt-1 text-sm text-muted-foreground">Homepage ke SUV, Hatchback, Sedan, MUV aur Luxury image cards yahin se manage honge.</p></div>
      <button onClick={() => { setFile(null); setError(""); setEditing({ ...EMPTY }); }} className="btn-kinetic py-2 px-4 text-xs"><Plus className="h-4 w-4" /> Add Category</button>
    </div>
    {error && <p role="alert" className="mb-4 text-sm text-destructive">{error}</p>}
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {items.sort((a,b)=>(a.sort_order||0)-(b.sort_order||0)).map(item => <div key={item.id} className="overflow-hidden border border-hairline bg-gunmetal">
        <div className="relative aspect-[16/9] bg-obsidian"><img src={item.image_url} alt={item.title} className="h-full w-full object-cover" />{!item.active && <div className="absolute inset-0 grid place-items-center bg-black/60 text-sm font-semibold text-white">Hidden on homepage</div>}</div>
        <div className="flex items-start justify-between gap-3 p-3"><div className="min-w-0"><h3 className="font-semibold">{item.title}</h3><p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{item.description}</p><p className="mt-2 text-[11px] text-muted-foreground">Order: {item.sort_order || 0}</p></div>
          <div className="flex shrink-0 gap-1"><button title={item.active ? "Hide" : "Show"} onClick={() => toggle(item)} className="p-2 text-muted-foreground hover:text-primary">{item.active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}</button><button title="Edit" onClick={() => { setFile(null); setError(""); setEditing({ ...item, sort_order: String(item.sort_order ?? 0) }); }} className="p-2 text-muted-foreground hover:text-primary"><Pencil className="h-4 w-4" /></button><button title="Delete" onClick={() => remove(item.id)} className="p-2 text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button></div>
        </div>
      </div>)}
      {items.length === 0 && <div className="col-span-full border border-dashed border-hairline py-10 text-center text-sm text-muted-foreground">No custom body type categories yet. Add one to manage homepage images and descriptions.</div>}
    </div>
    {editing && <AdminModal title={editing.id ? "Edit Body Type" : "Add Body Type"} onClose={() => setEditing(null)}>
      <form onSubmit={save} className="space-y-4">
        <Field label="Category name"><TextInput required value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} placeholder="SUV / Hatchback / Sedan" /></Field>
        <Field label="Short description"><TextArea value={editing.description || ""} onChange={e => setEditing({ ...editing, description: e.target.value })} /></Field>
        <Field label="Image URL (optional if uploading)"><TextInput value={editing.image_url || ""} onChange={e => setEditing({ ...editing, image_url: e.target.value })} placeholder="https://..." /></Field>
        <Field label="Upload category image"><input type="file" accept="image/jpeg,image/png,image/webp" onChange={e => setFile(e.target.files?.[0] || null)} className="w-full text-sm file:mr-3 file:px-3 file:py-2 file:border file:border-hairline file:bg-secondary file:text-foreground" />{file && <span className="text-xs text-muted-foreground">{file.name}</span>}</Field>
        <Field label="Display order (smaller number appears first)"><TextInput type="number" value={editing.sort_order} onChange={e => setEditing({ ...editing, sort_order: e.target.value })} /></Field>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={Boolean(editing.active)} onChange={e => setEditing({ ...editing, active: e.target.checked })} /> Show on homepage</label>
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <div className="flex justify-end gap-3"><button type="button" onClick={() => setEditing(null)} className="btn-ghost px-4 py-2 text-xs">Cancel</button><button disabled={saving} className="btn-kinetic px-4 py-2 text-xs">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Category"}</button></div>
      </form>
    </AdminModal>}
  </div>;
}
