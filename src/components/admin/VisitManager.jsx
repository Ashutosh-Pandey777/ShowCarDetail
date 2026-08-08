import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Search, Loader2 } from "lucide-react";

export default function VisitManager() {
  const [items, setItems] = useState(null);
  const [q, setQ] = useState("");

  const load = async () => setItems(await base44.entities.Visit.list("-created_date", 200));
  useEffect(() => { load(); }, []);

  if (!items) return <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />;

  const filtered = items.filter(
    (v) => !q || `${v.page} ${v.visitor_name} ${v.visitor_email}`.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-4 gap-4">
        <h2 className="font-heading text-xl font-semibold">Site Visits ({items.length})</h2>
        <div className="flex items-center bg-obsidian border border-hairline px-3 h-9">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search page or visitor…" className="bg-transparent text-sm ml-2 outline-none w-56" />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs font-mono-data uppercase tracking-widest text-muted-foreground border-b border-hairline">
              <th className="py-3 pr-4 font-medium">Page</th>
              <th className="py-3 pr-4 font-medium">Visitor</th>
              <th className="py-3 pr-4 font-medium">Email</th>
              <th className="py-3 pr-4 font-medium">When</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((v) => (
              <tr key={v.id} className="border-b border-hairline/60">
                <td className="py-3 pr-4 font-mono-data text-xs">{v.page}</td>
                <td className="py-3 pr-4">{v.visitor_name || "—"}</td>
                <td className="py-3 pr-4 text-muted-foreground">{v.visitor_email || "—"}</td>
                <td className="py-3 pr-4 text-muted-foreground whitespace-nowrap">{new Date(v.created_date).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="text-muted-foreground text-center py-10">No visits recorded.</div>}
      </div>
    </div>
  );
}