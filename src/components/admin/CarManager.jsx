import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import AdminModal, { Field, TextInput, TextArea, Select, toList } from "@/components/admin/AdminModal";

const EMPTY = {
  name: "", brand: "", brand_slug: "", body_type: "SUV", fuel_type: "Petrol",
  transmission: "Manual", price: "", on_road_price: "", mileage: "", engine: "",
  power: "", torque: "", seating: "", boot_space: "", safety_rating: "",
  launch_year: "", range_km: "", image_url: "", city: "", description: "",
  colors: "", features: "", tags: "",
};

export default function CarManager() {
  const [items, setItems] = useState(null);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => setItems(await base44.entities.Car.list("-created_date", 100));
  useEffect(() => { load(); }, []);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    const data = {
      ...editing,
      price: Number(editing.price) || 0,
      on_road_price: Number(editing.on_road_price) || undefined,
      seating: editing.seating ? Number(editing.seating) : undefined,
      safety_rating: editing.safety_rating ? Number(editing.safety_rating) : undefined,
      launch_year: editing.launch_year ? Number(editing.launch_year) : undefined,
      range_km: editing.range_km ? Number(editing.range_km) : undefined,
      colors: toList(editing.colors),
      features: toList(editing.features),
      tags: toList(editing.tags),
    };
    try {
      if (editing.id) await base44.entities.Car.update(editing.id, data);
      else await base44.entities.Car.create(data);
      setEditing(null);
      load();
    } finally { setSaving(false); }
  };

  const remove = async (id) => {
    if (!confirm("Delete this vehicle?")) return;
    await base44.entities.Car.delete(id);
    load();
  };

  if (!items) return <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-heading text-xl font-semibold">Vehicles ({items.length})</h2>
        <button onClick={() => setEditing({ ...EMPTY })} className="btn-kinetic py-2 px-4 text-xs">
          <Plus className="w-4 h-4" /> Add Vehicle
        </button>
      </div>

      <div className="overflow-x-auto scrollbar-thin border border-hairline">
        <table className="w-full text-sm min-w-[640px]">
          <thead className="bg-secondary text-muted-foreground text-xs uppercase tracking-widest">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Vehicle</th>
              <th className="text-left px-4 py-3 font-medium">Type</th>
              <th className="text-left px-4 py-3 font-medium">Fuel</th>
              <th className="text-right px-4 py-3 font-medium">Price (₹)</th>
              <th className="text-right px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((c) => (
              <tr key={c.id} className="border-t border-hairline hover:bg-secondary/40">
                <td className="px-4 py-3">
                  <div className="font-medium">{c.name}</div>
                  <div className="text-xs text-muted-foreground">{c.brand}</div>
                </td>
                <td className="px-4 py-3">{c.body_type}</td>
                <td className="px-4 py-3">{c.fuel_type}</td>
                <td className="px-4 py-3 text-right font-mono-data">{(c.price || 0).toLocaleString("en-IN")}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setEditing({ ...c, colors: (c.colors || []).join(", "), features: (c.features || []).join(", "), tags: (c.tags || []).join(", ") })} className="p-1.5 text-muted-foreground hover:text-primary"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => remove(c.id)} className="p-1.5 text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">No vehicles yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <AdminModal title={editing.id ? "Edit Vehicle" : "Add Vehicle"} onClose={() => setEditing(null)}>
          <form onSubmit={save} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Name"><TextInput required value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></Field>
              <Field label="Brand"><TextInput required value={editing.brand} onChange={(e) => setEditing({ ...editing, brand: e.target.value })} /></Field>
              <Field label="Brand slug"><TextInput value={editing.brand_slug} onChange={(e) => setEditing({ ...editing, brand_slug: e.target.value })} /></Field>
              <Field label="City"><TextInput value={editing.city} onChange={(e) => setEditing({ ...editing, city: e.target.value })} /></Field>
              <Field label="Body type"><Select value={editing.body_type} onChange={(e) => setEditing({ ...editing, body_type: e.target.value })}>{["SUV","Sedan","Hatchback","Coupe","Convertible","MUV","Pickup"].map((o) => <option key={o}>{o}</option>)}</Select></Field>
              <Field label="Fuel type"><Select value={editing.fuel_type} onChange={(e) => setEditing({ ...editing, fuel_type: e.target.value })}>{["Petrol","Diesel","Electric","Hybrid","CNG"].map((o) => <option key={o}>{o}</option>)}</Select></Field>
              <Field label="Transmission"><Select value={editing.transmission} onChange={(e) => setEditing({ ...editing, transmission: e.target.value })}>{["Manual","Automatic"].map((o) => <option key={o}>{o}</option>)}</Select></Field>
              <Field label="Price (₹)"><TextInput type="number" required value={editing.price} onChange={(e) => setEditing({ ...editing, price: e.target.value })} /></Field>
              <Field label="On-road price (₹)"><TextInput type="number" value={editing.on_road_price} onChange={(e) => setEditing({ ...editing, on_road_price: e.target.value })} /></Field>
              <Field label="Mileage"><TextInput value={editing.mileage} onChange={(e) => setEditing({ ...editing, mileage: e.target.value })} /></Field>
              <Field label="Engine"><TextInput value={editing.engine} onChange={(e) => setEditing({ ...editing, engine: e.target.value })} /></Field>
              <Field label="Power"><TextInput value={editing.power} onChange={(e) => setEditing({ ...editing, power: e.target.value })} /></Field>
              <Field label="Torque"><TextInput value={editing.torque} onChange={(e) => setEditing({ ...editing, torque: e.target.value })} /></Field>
              <Field label="Seating"><TextInput type="number" value={editing.seating} onChange={(e) => setEditing({ ...editing, seating: e.target.value })} /></Field>
              <Field label="Boot space"><TextInput value={editing.boot_space} onChange={(e) => setEditing({ ...editing, boot_space: e.target.value })} /></Field>
              <Field label="Safety rating (0-5)"><TextInput type="number" step="0.1" value={editing.safety_rating} onChange={(e) => setEditing({ ...editing, safety_rating: e.target.value })} /></Field>
              <Field label="Launch year"><TextInput type="number" value={editing.launch_year} onChange={(e) => setEditing({ ...editing, launch_year: e.target.value })} /></Field>
              <Field label="Range (km)"><TextInput type="number" value={editing.range_km} onChange={(e) => setEditing({ ...editing, range_km: e.target.value })} /></Field>
              <Field label="Image URL"><TextInput value={editing.image_url} onChange={(e) => setEditing({ ...editing, image_url: e.target.value })} /></Field>
            </div>
            <Field label="Colors (comma-separated)"><TextInput value={editing.colors} onChange={(e) => setEditing({ ...editing, colors: e.target.value })} /></Field>
            <Field label="Features (comma-separated)"><TextInput value={editing.features} onChange={(e) => setEditing({ ...editing, features: e.target.value })} /></Field>
            <Field label="Tags (comma-separated)"><TextInput value={editing.tags} onChange={(e) => setEditing({ ...editing, tags: e.target.value })} /></Field>
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