import React from 'react';
import { useERP } from '../../context/ERPContext';
import { FileSignature, Shield, CheckCircle2, AlertTriangle, FileText, Download } from 'lucide-react';

export const ContractsWorkspace: React.FC = () => {
  const { activeProject, workOrders } = useERP();

  const contracts = [
    {
      id: 'FIDIC-MAIN-001',
      type: 'Main Construction Contract',
      title: `${activeProject.name} - FIDIC Red Book 1999 (First Edition)`,
      parties: `${activeProject.client} & Main Contractor`,
      value: activeProject.contractBaselineAED,
      advanceBond: activeProject.contractBaselineAED * 0.10,
      perfBond: activeProject.contractBaselineAED * 0.10,
      retention: '10% on each IPC claim (5% released on Taking-Over, 5% on DLP expiry)',
      dlp: '365 Days (12 Months Defect Liability Period)',
      governingLaw: 'Laws of the United Arab Emirates & Sharjah / Dubai Courts',
      status: 'Active & Executed',
    },
    ...workOrders.map((wo) => ({
      id: wo.id,
      type: 'Nominated / Domestic Subcontract',
      title: `${wo.subcontractor} - ${wo.title}`,
      parties: `Main Contractor & ${wo.subcontractor} (TRN: ${wo.trn})`,
      value: wo.orderValueAED,
      advanceBond: wo.orderValueAED * 0.10,
      perfBond: wo.orderValueAED * 0.10,
      retention: `${wo.retentionPct}% Retention Holdback with Backcharge Offset`,
      dlp: '12 Months DLP with Warranty Back-to-Back with Employer',
      governingLaw: 'UAE Civil Transactions Law No. 5 of 1985',
      status: wo.status,
    })),
  ];

  return (
    <div className="space-y-6">
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <FileSignature className="w-4 h-4 text-purple-400" /> FIDIC Red Book Contracts & Subcontracts Register
            </h3>
            <p className="text-[11px] text-slate-400">
              Contractual governance, performance bonds, advance payment guarantees, retention releases, and DLP tracking.
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30 font-mono">
            {contracts.length} Active Contracts
          </span>
        </div>

        <div className="space-y-4">
          {contracts.map((c) => (
            <div key={c.id} className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-3 text-xs">
              <div className="flex flex-wrap justify-between items-start gap-2 border-b border-slate-800 pb-2">
                <div>
                  <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 font-mono text-[10px] font-bold">
                    {c.type}
                  </span>
                  <h4 className="font-bold text-slate-100 text-sm mt-1">{c.title}</h4>
                  <p className="text-[11px] text-slate-400">Parties: {c.parties}</p>
                </div>
                <div className="text-right font-mono">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Contract Value</span>
                  <span className="text-base font-black text-emerald-400">
                    AED {c.value.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px]">
                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-0.5">
                  <span className="text-slate-500 block font-bold text-[10px]">PERFORMANCE & ADVANCE BONDS</span>
                  <p className="text-slate-200 font-mono">
                    Perf: AED {c.perfBond.toLocaleString()} (10%)<br />
                    Adv: AED {c.advanceBond.toLocaleString()} (10%)
                  </p>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-0.5">
                  <span className="text-slate-500 block font-bold text-[10px]">RETENTION TERMS</span>
                  <p className="text-slate-200">{c.retention}</p>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-0.5">
                  <span className="text-slate-500 block font-bold text-[10px]">DEFECT LIABILITY & GOVERNING LAW</span>
                  <p className="text-slate-200">{c.dlp}<br /><span className="text-slate-400">{c.governingLaw}</span></p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
