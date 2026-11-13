import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Plus, Pencil, Trash2, Loader2, Eye, EyeOff } from "lucide-react";
import AdminModal, { Field, TextInput, TextArea } from "@/components/admin/AdminModal";

const SECTION = "Body Type";
const DEFAULTS = [
  ["SUV","Spacious cars for family trips and all-road comfort.","https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=900&q=85"],
  ["Hatchback","Compact, practical cars for everyday city drives.","https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=900&q=85"],
  ["Sedan","Comfortable rides with elegant design and boot space.","https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=900&q=85"],
  ["MUV","Flexible space and seating for the whole family.","https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=900&q=85"],
  ["Luxury","Premium comfort, technology and performance.","https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=85"],
  ["Coupe","Sporty styling with a distinctive roofline.","https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=900&q=85"],
  ["Convertible","Open-top driving for a more engaging journey.","https://images.unsplash.com/photo-1504215680853-026ed2a45def?auto=format&fit=crop&w=900&q=85"],
  ["Pickup","Utility-focused vehicles for work and adventure.","https://images.unsplash.com/photo-1551830820-330a71b99659?auto=format&fit=crop&w=900&q=85"],
  ["Compact SUV","SUV-inspired space in an easy-to-drive size.","https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=900&q=85"],
  ["Compact Sedan","The balance of sedan comfort and compact size.","https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=900&q=85"],
  ["Minivan","Roomy people movers for larger families.","https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=900&q=85"]
].map(([title,description,image_url],sort_order)=>({title,description,image_url,section:SECTION,sort_order,active:true,isDefault:true}));

export default function BodyTypeManager() {
  const [items,setItems] = useState(null);
  const [editing,setEditing] = useState(null);
  const [file,setFile] = useState(null);
  const [saving,setSaving] = useState(false);
  const [error,setError] = useState("");

  const load = async () => {
    const all = await base44.entities.GalleryImage.list("-created_date",300);
    const saved = all.filter(x => String(x.section || "").toLowerCase() === SECTION.toLowerCase());
    const defaults = DEFAULTS.map(base => {
      const custom = saved.find(x => String(x.title || "").toLowerCase() === base.title.toLowerCase());
      return custom ? {...base,...custom,isDefault:false} : base;
    });
    const extras = saved.filter(x => !DEFAULTS.some(d => d.title.toLowerCase() === String(x.title || "").toLowerCase())).map(x=>({...x,isDefault:false}));
    setItems([...defaults,...extras].sort((a,b)=>(Number(a.sort_order)||0)-(Number(b.sort_order)||0)));
  };
  useEffect(() => { load().catch(e => {setItems([]);setError(e.message || "Unable to load categories.");}); }, []);

  const save = async e => {
    e.preventDefault(); setSaving(true); setError("");
    try {
      let imageUrl = editing.image_url || "";
      if (file) imageUrl = (await base44.integrations.Core.UploadFile({file})).file_url;
      if (!imageUrl) throw new Error("Please add a category image URL or upload an image.");
      const data = {title:editing.title.trim(),description:editing.description||"",image_url:imageUrl,section:SECTION,sort_order:Number(editing.sort_order)||0,active:Boolean(editing.active)};
      if (editing.id) await base44.entities.GalleryImage.update(editing.id,data);
      else await base44.entities.GalleryImage.create(data);
      setEditing(null);setFile(null);await load();
    } catch(e2) {setError(e2.message||"Unable to save category.");}
    finally {setSaving(false);}
  };

  const toggle = async item => {
    try {
      const data={title:item.title,description:item.description||"",image_url:item.image_url,section:SECTION,sort_order:Number(item.sort_order)||0,active:!item.active};
      if(item.id) await base44.entities.GalleryImage.update(item.id,{active:!item.active});
      else await base44.entities.GalleryImage.create(data);
      await load();
    } catch(e) {setError(e.message||"Unable to update category.");}
  };

  const remove = async item => {
    if(!window.confirm("Remove this category override?")) return;
    try {
      if(item.id) await base44.entities.GalleryImage.delete(item.id);
      else await base44.entities.GalleryImage.create({...item,section:SECTION,active:false});
      await load();
    } catch(e) {setError(e.message||"Unable to remove category.");}
  };

  if(!items) return <Loader2 className="h-5 w-5 animate-spin text-muted-foreground"/>;
  return <div>
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <div><h2 className="font-heading text-xl font-semibold">Body Type Categories ({items.length})</h2><p className="mt-1 text-sm text-muted-foreground">Homepage ke category cards, photos aur descriptions yahin se manage honge. Default categories bhi edit kar sakte hain.</p></div>
      <button onClick={()=>{setFile(null);setError("");setEditing({title:"",description:"",image_url:"",sort_order:String(items.length),active:true});}} className="btn-kinetic px-4 py-2 text-xs"><Plus className="h-4 w-4"/> Add Category</button>
    </div>
    {error&&<p role="alert" className="mb-4 text-sm text-destructive">{error}</p>}
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {items.map(item=><div key={item.id||item.title} className="overflow-hidden border border-hairline bg-gunmetal">
        <div className="relative aspect-[16/9] bg-obsidian"><img src={item.image_url} alt={item.title} className="h-full w-full object-cover"/>{!item.active&&<div className="absolute inset-0 grid place-items-center bg-black/60 text-sm font-semibold text-white">Hidden on homepage</div>}</div>
        <div className="flex items-start justify-between gap-3 p-3"><div className="min-w-0"><h3 className="font-semibold">{item.title}</h3><p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{item.description}</p><p className="mt-2 text-[11px] text-muted-foreground">{item.isDefault?"Default category":"Custom category"} · Order: {item.sort_order||0}</p></div>
          <div className="flex shrink-0 gap-1"><button title={item.active?"Hide":"Show"} onClick={()=>toggle(item)} className="p-2 text-muted-foreground hover:text-primary">{item.active?<Eye className="h-4 w-4"/>:<EyeOff className="h-4 w-4"/>}</button><button title="Edit" onClick={()=>{setFile(null);setError("");setEditing({...item,sort_order:String(item.sort_order??0)});}} className="p-2 text-muted-foreground hover:text-primary"><Pencil className="h-4 w-4"/></button><button title="Hide or remove override" onClick={()=>remove(item)} className="p-2 text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4"/></button></div>
        </div>
      </div>)}
    </div>
    {editing&&<AdminModal title={editing.id?"Edit Body Type":"Add Body Type"} onClose={()=>setEditing(null)}>
      <form onSubmit={save} className="space-y-4">
        <Field label="Category name"><TextInput required value={editing.title} onChange={e=>setEditing({...editing,title:e.target.value})} placeholder="SUV / Hatchback / Sedan"/></Field>
        <Field label="Short description"><TextArea value={editing.description||""} onChange={e=>setEditing({...editing,description:e.target.value})}/></Field>
        <Field label="Image URL (optional if uploading)"><TextInput value={editing.image_url||""} onChange={e=>setEditing({...editing,image_url:e.target.value})} placeholder="https://..."/></Field>
        <Field label="Upload category image"><input type="file" accept="image/jpeg,image/png,image/webp" onChange={e=>setFile(e.target.files?.[0]||null)} className="w-full text-sm file:mr-3 file:px-3 file:py-2 file:border file:border-hairline file:bg-secondary file:text-foreground"/>{file&&<span className="text-xs text-muted-foreground">{file.name}</span>}</Field>
        <Field label="Display order (smaller number appears first)"><TextInput type="number" value={editing.sort_order} onChange={e=>setEditing({...editing,sort_order:e.target.value})}/></Field>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={Boolean(editing.active)} onChange={e=>setEditing({...editing,active:e.target.checked})}/> Show on homepage</label>
        {error&&<p role="alert" className="text-sm text-destructive">{error}</p>}
        <div className="flex justify-end gap-3"><button type="button" onClick={()=>setEditing(null)} className="btn-ghost px-4 py-2 text-xs">Cancel</button><button disabled={saving} className="btn-kinetic px-4 py-2 text-xs">{saving?<Loader2 className="h-4 w-4 animate-spin"/>:"Save Category"}</button></div>
      </form>
    </AdminModal>}
  </div>;
}
