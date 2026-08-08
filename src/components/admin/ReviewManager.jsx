import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Plus, Pencil, Trash2, Loader2, Star } from "lucide-react";
import AdminModal, { Field, TextInput, TextArea, Select, toList } from "@/components/admin/AdminModal";

const EMPTY = { car_name: "", author: "", type: "Expert", rating: "", title: "", body: "", pros: "", cons: "" };

export default function ReviewManager() {
  const [items, setItems] = useState(null);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => setItems(await base44.entities.Review.list("-created_date", 100));
  useEffect(() => { load(); }, []);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    const data = { ...editing, rating: Number(editing.rating) || 0, pros: toList(editing.pros), cons: toList(editing.cons) };
    try {
      if (editing.id) await base44.entities.Review.update(editing.id, data);
      else await base44.entities.Review.create(data);
      setEditing(null);
      load();
    } finally { setSaving(false); }
  };

  const remove = async (id) => {
    if (!confirm("Delete this review?")) return;
    await base44.entities.Review.delete(id);
    load();
  };

  if (!items) return <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-heading text-xl font-semibold">Reviews ({items.length})</h2>
        <button onClick={() => setEditing({ ...EMPTY })} className="btn-kinetic py-2 px-4 text-xs">
          <Plus className="w-4 h-4" /> Add Review
        </button>
      </div>

      <div className="space-y-3">
        {items.map((r) => (
          <div key={r.id} className="bg-gunmetal border border-hairline p-4 flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="chip">{r.type}</span>
                <span className="flex items-center gap-0.5 text-primary text-xs">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`w-3 h-3 ${i < (r.rating || 0) ? "fill-current" : "opacity-30"}`} />)}
                </span>
              </div>
              <div className="font-medium">{r.title}</div>
              <div className="text-xs text-muted-foreground">{r.car_name} · by {r.author}</div>
            </div>
            <div className="flex gap-1 shrink-0">
              <button onClick={() => setEditing({ ...r, pros: (r.pros || []).join(", "), cons: (r.cons || []).join(", ") })} className="p-1.5 text-muted-foreground hover:text-primary"><Pencil className="w-4 h-4" /></button>
              <button onClick={() => remove(r.id)} className="p-1.5 text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
        {items.length === 0 && <div className="text-muted-foreground text-center py-10">No reviews yet.</div>}
      </div>

      {editing && (
        <AdminModal title={editing.id ? "Edit Review" : "Add Review"} onClose={() => setEditing(null)}>
          <form onSubmit={save} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Car name"><TextInput required value={editing.car_name} onChange={(e) => setEditing({ ...editing, car_name: e.target.value })} /></Field>
              <Field label="Author"><TextInput required value={editing.author} onChange={(e) => setEditing({ ...editing, author: e.target.value })} /></Field>
              <Field label="Type"><Select value={editing.type} onChange={(e) => setEditing({ ...editing, type: e.target.value })}><option>Expert</option><option>User</option></Select></Field>
              <Field label="Rating (0-5)"><TextInput type="number" step="0.1" max="5" value={editing.rating} onChange={(e) => setEditing({ ...editing, rating: e.target.value })} /></Field>
            </div>
            <Field label="Title"><TextInput required value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></Field>
            <Field label="Body"><TextArea value={editing.body} onChange={(e) => setEditing({ ...editing, body: e.target.value })} /></Field>
            <Field label="Pros (comma-separated)"><TextInput value={editing.pros} onChange={(e) => setEditing({ ...editing, pros: e.target.value })} /></Field>
            <Field label="Cons (comma-separated)"><TextInput value={editing.cons} onChange={(e) => setEditing({ ...editing, cons: e.target.value })} /></Field>
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