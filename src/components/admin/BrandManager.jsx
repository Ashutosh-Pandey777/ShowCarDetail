import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import AdminModal, { Field, TextInput, TextArea, toList } from "@/components/admin/AdminModal";

const EMPTY = { name: "", slug: "", country: "", founded: "", description: "", tagline: "", accent_color: "" };

export default function BrandManager() {
  const [items, setItems] = useState(null);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => setItems(await base44.entities.Brand.list("-created_date", 100));
  useEffect(() => { load(); }, []);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    const data = { ...editing, founded: editing.founded ? Number(editing.founded) : undefined };
    try {
      if (editing.id) await base44.entities.Brand.update(editing.id, data);
      else await base44.entities.Brand.create(data);
      setEditing(null);
      load();
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
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-heading text-xl font-semibold">Brands ({items.length})</h2>
        <button onClick={() => setEditing({ ...EMPTY })} className="btn-kinetic py-2 px-4 text-xs">
          <Plus className="w-4 h-4" /> Add Brand
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((b) => (
          <div key={b.id} className="bg-gunmetal border border-hairline p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="font-heading font-semibold">{b.name}</div>
                <div className="text-xs text-muted-foreground">{b.country || "—"}</div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => setEditing({ ...b })} className="p-1.5 text-muted-foreground hover:text-primary"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => remove(b.id)} className="p-1.5 text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
            {b.tagline && <div className="text-xs text-primary mb-2">{b.tagline}</div>}
            <div className="text-xs text-muted-foreground line-clamp-2">{b.description || "No description."}</div>
          </div>
        ))}
        {items.length === 0 && <div className="text-muted-foreground col-span-full text-center py-10">No brands yet.</div>}
      </div>

      {editing && (
        <AdminModal title={editing.id ? "Edit Brand" : "Add Brand"} onClose={() => setEditing(null)}>
          <form onSubmit={save} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Name"><TextInput required value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></Field>
              <Field label="Slug"><TextInput required value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} /></Field>
              <Field label="Country"><TextInput value={editing.country} onChange={(e) => setEditing({ ...editing, country: e.target.value })} /></Field>
              <Field label="Founded year"><TextInput type="number" value={editing.founded} onChange={(e) => setEditing({ ...editing, founded: e.target.value })} /></Field>
              <Field label="Tagline"><TextInput value={editing.tagline} onChange={(e) => setEditing({ ...editing, tagline: e.target.value })} /></Field>
              <Field label="Accent color (hex)"><TextInput value={editing.accent_color} onChange={(e) => setEditing({ ...editing, accent_color: e.target.value })} /></Field>
            </div>
            <Field label="Description"><TextArea value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></Field>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setEditing(null)} className="btn-ghost py-2 px-4 text-xs">Cancel</button>
              <button type="submit" disabled={saving} className="btn-kinetic py-2 px-4 text-xs">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
              </button>
            </div>
          </form>
        </AdminModal>
      )}
    </div>
  );
}