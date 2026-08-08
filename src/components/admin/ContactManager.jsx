import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Mail, Trash2, Loader2, Search } from "lucide-react";

export default function ContactManager() {
  const [items, setItems] = useState(null);
  const [q, setQ] = useState("");

  const load = async () => setItems(await base44.entities.Contact.list("-created_date", 200));
  useEffect(() => { load(); }, []);

  const remove = async (id) => {
    if (!confirm("Delete this inquiry?")) return;
    await base44.entities.Contact.delete(id);
    load();
  };

  if (!items) return <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />;

  const filtered = items.filter(
    (c) =>
      !q ||
      `${c.name} ${c.email} ${c.subject} ${c.message}`.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-4 gap-4">
        <h2 className="font-heading text-xl font-semibold">Contact Inquiries ({items.length})</h2>
        <div className="flex items-center bg-obsidian border border-hairline px-3 h-9">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className="bg-transparent text-sm ml-2 outline-none w-48" />
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((c) => (
          <div key={c.id} className="bg-gunmetal border border-hairline p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="font-medium">{c.name}</span>
                  <a href={`mailto:${c.email}`} className="text-xs text-primary underline-offset-2 hover:underline">{c.email}</a>
                  {c.phone && <span className="chip">{c.phone}</span>}
                </div>
                {c.subject && <div className="text-sm font-semibold mb-1">{c.subject}</div>}
                <p className="text-sm text-muted-foreground leading-relaxed">{c.message}</p>
                <div className="text-[11px] font-mono-data uppercase tracking-widest text-muted-foreground/70 mt-2">
                  {new Date(c.created_date).toLocaleString()}
                </div>
              </div>
              <div className="flex gap-1 shrink-0">
                <a href={`mailto:${c.email}`} className="p-1.5 text-muted-foreground hover:text-primary"><Mail className="w-4 h-4" /></a>
                <button onClick={() => remove(c.id)} className="p-1.5 text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div className="text-muted-foreground text-center py-10">No inquiries found.</div>}
      </div>
    </div>
  );
}