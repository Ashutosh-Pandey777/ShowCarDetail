import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Mail, Phone, MapPin, Clock, Send, Loader2, CheckCircle2 } from "lucide-react";

const INFO = [
  { icon: Mail, label: "Email", value: "hello@kinetic.auto", href: "mailto:hello@kinetic.auto" },
  { icon: Phone, label: "Phone", value: "+91 98765 43210", href: "tel:+919876543210" },
  { icon: MapPin, label: "Showroom", value: "Unit 12, Auto District, Mumbai 400001" },
  { icon: Clock, label: "Hours", value: "Mon–Sat · 10:00–19:00" },
];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await base44.entities.Contact.create(form);
      setDone(true);
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } finally { setSaving(false); }
  };

  const input = "w-full bg-white border border-black/15 px-4 py-3 text-sm outline-none focus:border-black transition-colors";

  return (
    <div className="min-h-screen bg-obsidian">
      <div className="max-w-chassis mx-auto px-4 sm:px-6 py-16">
        <div className="section-label mb-3">Get in touch</div>
        <h1 className="font-heading text-4xl sm:text-5xl font-bold tracking-tight mb-3">Contact Us</h1>
        <p className="text-muted-foreground max-w-xl mb-12">
          Questions about a vehicle, financing, or your booking? Reach out — our team responds within one business day.
        </p>

        <div className="grid lg:grid-cols-[1fr_1.3fr] gap-8">
          <div className="space-y-4">
            {INFO.map((i) => {
              const Icon = i.icon;
              const inner = (
                <div className="bg-gunmetal border border-hairline p-5 flex items-start gap-4 hover:border-black/40 transition-colors">
                  <div className="bg-black text-white p-2.5"><Icon className="w-5 h-5" /></div>
                  <div>
                    <div className="text-xs font-mono-data uppercase tracking-widest text-muted-foreground mb-1">{i.label}</div>
                    <div className="font-medium">{i.value}</div>
                  </div>
                </div>
              );
              return i.href ? (
                <a key={i.label} href={i.href} className="block">{inner}</a>
              ) : (
                <div key={i.label}>{inner}</div>
              );
            })}
          </div>

          <div className="bg-gunmetal border border-hairline p-6 sm:p-8">
            {done ? (
              <div className="flex flex-col items-center justify-center text-center py-16">
                <CheckCircle2 className="w-12 h-12 mb-4" />
                <h3 className="font-heading text-xl font-semibold mb-2">Message sent</h3>
                <p className="text-muted-foreground text-sm mb-6">Thanks for reaching out — we'll reply within one business day.</p>
                <button onClick={() => setDone(false)} className="btn-ghost py-2 px-5 text-xs">Send another</button>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono-data uppercase tracking-widest text-muted-foreground mb-1.5">Name</label>
                    <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={input} />
                  </div>
                  <div>
                    <label className="block text-xs font-mono-data uppercase tracking-widest text-muted-foreground mb-1.5">Email</label>
                    <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={input} />
                  </div>
                  <div>
                    <label className="block text-xs font-mono-data uppercase tracking-widest text-muted-foreground mb-1.5">Phone</label>
                    <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={input} />
                  </div>
                  <div>
                    <label className="block text-xs font-mono-data uppercase tracking-widest text-muted-foreground mb-1.5">Subject</label>
                    <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className={input} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-mono-data uppercase tracking-widest text-muted-foreground mb-1.5">Message</label>
                  <textarea required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className={`${input} min-h-[140px]`} />
                </div>
                <button type="submit" disabled={saving} className="btn-kinetic w-full sm:w-auto py-3 px-6 text-xs">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4" /> Send Message</>}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}