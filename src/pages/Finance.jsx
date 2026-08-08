import React from 'react';
import EMICalculator from '@/components/EMICalculator';
import { Link } from 'react-router-dom';
import { ArrowLeft, Percent, Wallet, Shield } from 'lucide-react';

export default function Finance() {
  return (
    <div className="bg-obsidian min-h-screen">
      <div className="max-w-chassis mx-auto px-4 sm:px-6 py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-xs font-mono-data uppercase tracking-widest text-muted-foreground hover:text-primary mb-4"><ArrowLeft className="w-3 h-3" /> Back</Link>
        <div className="section-label mb-2"><span className="w-8 h-px bg-primary" />Finance Module</div>
        <h1 className="font-heading text-4xl font-bold mb-2">Calculate. Plan. Drive.</h1>
        <p className="text-muted-foreground mb-8 max-w-xl">Estimate your monthly outflow, model your down payment, and plan your loan tenure with precision.</p>

        <div className="grid lg:grid-cols-[1fr_360px] gap-8">
          <EMICalculator price={1500000} />

          <div className="space-y-4">
            <InfoCard icon={Percent} title="Interest Rates" desc="Competitive rates from 8.5% p.a. across our lending partners. Final rate depends on credit profile." />
            <InfoCard icon={Wallet} title="Down Payment" desc="Flexible down payments from 10% to 50% of the vehicle's ex-showroom price." />
            <InfoCard icon={Shield} title="Insurance" desc="Comprehensive coverage options bundled into your monthly EMI for peace of mind." />

            <div className="bg-card border border-hairline p-5">
              <h3 className="font-heading font-bold mb-3">Loan Offers</h3>
              {[
                ['Standard', '9.5%', 'Up to 7 yrs'],
                ['Premium', '8.5%', 'Up to 8 yrs'],
                ['EV Special', '7.9%', 'Up to 8 yrs'],
              ].map(([n, r, t]) => (
                <div key={n} className="flex items-center justify-between py-2 border-b border-hairline last:border-0">
                  <div><p className="text-sm font-medium">{n}</p><p className="text-xs text-muted-foreground">{t}</p></div>
                  <span className="font-mono-data text-primary font-semibold">{r}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ icon: Icon, title, desc }) {
  return (
    <div className="bg-card border border-hairline p-5">
      <Icon className="w-5 h-5 text-primary mb-2" />
      <h3 className="font-semibold text-sm mb-1">{title}</h3>
      <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  );
}