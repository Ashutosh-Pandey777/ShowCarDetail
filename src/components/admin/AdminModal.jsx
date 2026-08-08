import React, { useState } from "react";

export default function AdminModal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-gunmetal border border-hairline w-full max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-thin">
        <div className="sticky top-0 bg-gunmetal border-b border-hairline px-6 py-4 flex items-center justify-between z-10">
          <h3 className="font-heading text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-2xl leading-none">×</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

export function Field({ label, children, hint }) {
  return (
    <label className="block">
      <span className="block text-xs font-mono-data uppercase tracking-widest text-muted-foreground mb-1.5">{label}</span>
      {children}
      {hint && <span className="block text-[11px] text-muted-foreground/70 mt-1">{hint}</span>}
    </label>
  );
}

export const inputCls =
  "w-full bg-obsidian border border-hairline px-3 py-2 text-sm outline-none focus:border-primary/60 transition-colors";

export function TextInput(props) {
  return <input {...props} className={`${inputCls} ${props.className || ""}`} />;
}

export function TextArea(props) {
  return <textarea {...props} className={`${inputCls} min-h-[80px] ${props.className || ""}`} />;
}

export function Select({ children, ...props }) {
  return (
    <select {...props} className={`${inputCls} ${props.className || ""}`}>
      {children}
    </select>
  );
}

export function toList(v) {
  if (!v) return [];
  if (Array.isArray(v)) return v;
  return String(v)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}