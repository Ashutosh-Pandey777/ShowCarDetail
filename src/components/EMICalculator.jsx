import React, { useState, useMemo } from 'react';

export default function EMICalculator({ price = 1500000, compact = false }) {
  const [principal, setPrincipal] = useState(price);
  const [downPayment, setDownPayment] = useState(Math.round(price * 0.2));
  const [rate, setRate] = useState(9.5);
  const [tenure, setTenure] = useState(60);

  const loanAmount = Math.max(0, principal - downPayment);
  const monthlyRate = rate / 12 / 100;
  const emi = useMemo(() => {
    if (loanAmount <= 0 || tenure <= 0) return 0;
    const r = monthlyRate;
    const n = tenure;
    if (r === 0) return loanAmount / n;
    return Math.round((loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
  }, [loanAmount, rate, tenure]);

  const totalPayable = emi * tenure;
  const totalInterest = totalPayable - loanAmount;

  const fmt = (n) => '₹' + n.toLocaleString('en-IN');

  return (
    <div className={`bg-card border border-hairline ${compact ? 'p-5' : 'p-7'}`}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-heading text-xl font-bold">EMI Calculator</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Instant finance estimation</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-mono-data uppercase tracking-widest text-muted-foreground">Monthly EMI</p>
          <p className="font-mono-data text-2xl font-bold text-primary">{fmt(emi)}</p>
        </div>
      </div>

      <div className="space-y-5">
        <Slider label="Vehicle Price" value={principal} min={300000} max={10000000} step={50000} onChange={(v) => { setPrincipal(v); setDownPayment(Math.round(v * 0.2)); }} format={fmt} />
        <Slider label="Down Payment" value={downPayment} min={0} max={Math.round(principal * 0.9)} step={10000} onChange={setDownPayment} format={fmt} />
        <Slider label="Interest Rate (% p.a.)" value={rate} min={6} max={16} step={0.1} onChange={setRate} format={(v) => v.toFixed(1) + '%'} />
        <Slider label="Tenure (months)" value={tenure} min={12} max={84} step={6} onChange={setTenure} format={(v) => v + ' mo'} />
      </div>

      <div className="mt-6 pt-5 border-t border-hairline grid grid-cols-3 gap-4">
        <Stat label="Loan Amount" value={fmt(loanAmount)} />
        <Stat label="Total Interest" value={fmt(totalInterest)} />
        <Stat label="Total Payable" value={fmt(totalPayable)} />
      </div>
    </div>
  );
}

function Slider({ label, value, min, max, step, onChange, format }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex justify-between items-baseline mb-2">
        <span className="text-xs font-mono-data uppercase tracking-widest text-muted-foreground">{label}</span>
        <span className="font-mono-data text-sm font-semibold">{format(value)}</span>
      </div>
      <input
        type="range"
        min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1 appearance-none cursor-pointer rounded-full outline-none"
        style={{ background: `linear-gradient(to right, #F5B324 ${pct}%, #2a2a2e ${pct}%)` }}
      />
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <p className="text-[10px] font-mono-data uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="font-mono-data text-sm font-semibold mt-1">{value}</p>
    </div>
  );
}