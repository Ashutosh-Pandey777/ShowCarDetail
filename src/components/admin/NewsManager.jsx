import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import AdminModal, { Field, TextInput, TextArea, toList } from "@/components/admin/AdminModal";

const EMPTY = { title: "", slug: "", category: "", excerpt: "", body: "", image_url: "", author: "", tags: "", featured: false };

export default function NewsManager() {
  const [items, setItems] = useState(null);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => setItems(await base44.entities.News.list("-created_date", 100));
  useEffect(() => { load(); }, []);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    const data = { ...editing, tags: toList(editing.tags), featured: !!editing.featured };
    try {
      if (editing.id) await base44.entities.News.update(editing.id, data);
      else await base44.entities.News.create(data);
      setEditing(null);
      load();
    } finally { setSaving(false); }
  };

  const remove = async (id) => {
    if (!confirm("Delete this article?")) return;
    await base44.entities.News.delete(id);
    load();
  };

  if (!items) return <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-heading text-xl font-semibold">News ({items.length})</h2>
        <button onClick={() => setEditing({ ...EMPTY })} className="btn-kinetic py-2 px-4 text-xs">
          <Plus className="w-4 h-4" /> Add Article
        </button>
      </div>

      <div className="space-y-3">
        {items.map((n) => (
          <div key={n.id} className="bg-gunmetal border border-hairline p-4 flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {n.featured && <span className="chip text-primary border-primary/40">Featured</span>}
                <span className="chip">{n.category}</span>
              </div>
              <div className="font-medium">{n.title}</div>
              <div className="text-xs text-muted-foreground line-clamp-2">{n.excerpt}</div>
            </div>
            <div className="flex gap-1 shrink-0">
              <button onClick={() => setEditing({ ...n, tags: (n.tags || []).join(", ") })} className="p-1.5 text-muted-foreground hover:text-primary"><Pencil className="w-4 h-4" /></button>
              <button onClick={() => remove(n.id)} className="p-1.5 text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
        {items.length === 0 && <div className="text-muted-foreground text-center py-10">No articles yet.</div>}
      </div>

      {editing && (
        <AdminModal title={editing.id ? "Edit Article" : "Add Article"} onClose={() => setEditing(null)}>
          <form onSubmit={save} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Title"><TextInput required value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></Field>
              <Field label="Slug"><TextInput required value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} /></Field>
              <Field label="Category"><TextInput required value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} /></Field>
              <Field label="Author"><TextInput value={editing.author} onChange={(e) => setEditing({ ...editing, author: e.target.value })} /></Field>
            </div>
            <Field label="Image URL"><TextInput value={editing.image_url} onChange={(e) => setEditing({ ...editing, image_url: e.target.value })} /></Field>
            <Field label="Excerpt"><TextArea value={editing.excerpt} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })} /></Field>
            <Field label="Body"><TextArea className="min-h-[160px]" value={editing.body} onChange={(e) => setEditing({ ...editing, body: e.target.value })} /></Field>
            <Field label="Tags (comma-separated)"><TextInput value={editing.tags} onChange={(e) => setEditing({ ...editing, tags: e.target.value })} /></Field>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={editing.featured} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} className="accent-[#F5B324]" />
              Featured article
            </label>
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