import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { DigitalMBEntry, ExtraItemVariation, StatutoryVATRecord } from '../../types/erp';
import {
  Receipt,
  Ruler,
  FileSignature,
  Sparkles,
  Scale,
  ShieldCheck,
  BookOpenCheck,
  TrendingUp,
  Landmark,
  FolderTree,
  Plus,
  Trash2,
  CheckCircle2,
} from 'lucide-react';

export const FinanceAccountsWorkspace: React.FC = () => {
  const {
    activeProject,
    ipcClaims,
    addIPCClaim,
    digitalMB,
    addDigitalMB,
    deleteDigitalMB,
    workOrders,
    extraItems,
    addExtraItem,
    vatRecords,
    addVATRecord,
    activeSubPage,
    setActiveSubPage,
  } = useERP();

  const [activeTab, setActiveTab] = useState<'billing' | 'mb' | 'wo' | 'extra' | 'recovery' | 'approval' | 'ledger' | 'vat' | 'directory'>('billing');

  React.useEffect(() => {
    if (activeSubPage === 'fin-billing') setActiveTab('billing');
    else if (activeSubPage === 'fin-mb') setActiveTab('mb');
    else if (activeSubPage === 'fin-extra') setActiveTab('extra');
    else if (activeSubPage === 'fin-ledger') setActiveTab('ledger');
    else if (activeSubPage === 'fin-vat') setActiveTab('vat');
  }, [activeSubPage]);

  // Form states
  const [showMBModal, setShowMBModal] = useState(false);
  const [mbLoc, setMbLoc] = useState('');
  const [mbDesc, setMbDesc] = useState('');
  const [mbNos, setMbNos] = useState<number>(1);
  const [mbL, setMbL] = useState<number>(10);
  const [mbB, setMbB] = useState<number>(5);
  const [mbH, setMbH] = useState<number>(0.3);
  const [mbUnit, setMbUnit] = useState('m³');

  const [showExtraModal, setShowExtraModal] = useState(false);
  const [exDesc, setExDesc] = useState('');
  const [exMat, setExMat] = useState<number>(12000);
  const [exLab, setExLab] = useState<number>(5000);
  const [exPlant, setExPlant] = useState<number>(2000);

  const [showVATModal, setShowVATModal] = useState(false);
  const [vatPeriod, setVatPeriod] = useState('Q4 2026 (Oct - Dec)');
  const [vatOutput, setVatOutput] = useState<number>(122500);
  const [vatInput, setVatInput] = useState<number>(51200);

  const pClaims = ipcClaims.filter((c) => c.projectId === activeProject.id);
  const pMB = digitalMB.filter((m) => m.projectId === activeProject.id);
  const pWO = workOrders.filter((w) => w.projectId === activeProject.id);
  const pExtra = extraItems.filter((e) => e.projectId === activeProject.id);

  const totalCertifiedGross = pClaims.reduce((s, c) => s + c.gross, 0);
  const totalRetentionHeld = pClaims.reduce((s, c) => s + c.retention, 0);
  const totalAdvRecovered = pClaims.reduce((s, c) => s + c.advRec, 0);
  const totalNetDisbursed = pClaims.filter((c) => c.status === 'Paid').reduce((s, c) => s + c.net, 0);

  const handleSaveMB = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = +(mbNos * mbL * mbB * mbH).toFixed(2);
    addDigitalMB({
      id: `MB-0${pMB.length + 1}`,
      projectId: activeProject.id,
      date: new Date().toISOString().split('T')[0],
      location: mbLoc,
      itemDescription: mbDesc,
      nos: mbNos,
      length: mbL,
      width: mbB,
      height: mbH,
      calculatedQty: qty,
      unit: mbUnit,
      inspectionRef: `INSP-STR-0${pMB.length + 1}`,
    });
    setShowMBModal(false);
    setMbLoc('');
    setMbDesc('');
  };

  const handleSaveExtra = (e: React.FormEvent) => {
    e.preventDefault();
    const approved = +((exMat + exLab + exPlant) * 1.20).toFixed(2);
    addExtraItem({
      id: `VAR-0${pExtra.length + 1}`,
      projectId: activeProject.id,
      description: exDesc,
      materialCost: exMat,
      labourCost: exLab,
      plantCost: exPlant,
      overheadProfitPct: 20,
      approvedRate: approved,
      status: 'Approved Consultant',
    });
    setShowExtraModal(false);
    setExDesc('');
  };

  const handleSaveVAT = (e: React.FormEvent) => {
    e.preventDefault();
    addVATRecord({
      id: `VAT-Q${vatRecords.length + 1}-2026`,
      period: vatPeriod,
      category: 'UAE 5% Federal VAT',
      outputTax: vatOutput,
      inputTaxCredit: vatInput,
      netPayable: vatOutput - vatInput,
      filingStatus: 'Draft',
    });
    setShowVATModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Workspace Tabs */}
      <div className="glass-panel rounded-2xl border border-slate-800 p-1 flex overflow-x-auto text-xs no-print">
        {[
          { id: 'billing', name: 'Contractor RA / IPC Claims', icon: Receipt },
          { id: 'mb', name: 'Digital Measurement Book (MB)', icon: Ruler },
          { id: 'wo', name: 'FIDIC Work Orders (WO)', icon: FileSignature },
          { id: 'extra', name: 'Extra Items Rate Analysis', icon: Sparkles },
          { id: 'recovery', name: 'Material & Advance Rec.', icon: Scale },
          { id: 'approval', name: '8-Step Approval Matrix', icon: ShieldCheck },
          { id: 'ledger', name: 'Payment & Sub-Ledger', icon: BookOpenCheck },
          { id: 'vat', name: 'Statutory 5% VAT Register', icon: Landmark },
          { id: 'directory', name: 'Virtual Audit Tree', icon: FolderTree },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setActiveSubPage(`fin-${tab.id}`);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold whitespace-nowrap transition ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* ================= TAB 1: CONTRACTOR RA / IPC BILLING ================= */}
      {activeTab === 'billing' && (
        <div className="space-y-6">
          {/* Financial Header Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Gross Work Certified</span>
              <div className="text-xl font-bold font-mono text-slate-100">AED {totalCertifiedGross.toLocaleString()}</div>
              <span className="text-[10px] text-slate-500">Cumulative Progress Claims</span>
            </div>

            <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase">10% Retention Holdback</span>
              <div className="text-xl font-bold font-mono text-rose-400">-AED {totalRetentionHeld.toLocaleString()}</div>
              <span className="text-[10px] text-slate-500">Defect Liability Guarantee</span>
            </div>

            <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase">10% Mobilisation Recovery</span>
              <div className="text-xl font-bold font-mono text-amber-400">-AED {totalAdvRecovered.toLocaleString()}</div>
              <span className="text-[10px] text-slate-500">Advance Amortization</span>
            </div>

            <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Net Disbursed Funds</span>
              <div className="text-xl font-bold font-mono text-emerald-400">AED {totalNetDisbursed.toLocaleString()}</div>
              <span className="text-[10px] text-emerald-500">Paid via UAE Bank Wires</span>
            </div>
          </div>

          {/* Bills Register */}
          <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/60">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <Receipt className="w-4 h-4 text-indigo-400" /> Interim Payment Certificate (IPC) Ledger
              </h3>
              <span className="text-xs text-slate-400 font-mono">FIDIC Red Book Clause 14</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 text-slate-400 uppercase text-[10px]">
                  <tr>
                    <th className="p-3">IPC #</th>
                    <th className="p-3">Contractor Trade</th>
                    <th className="p-3">Claim Date</th>
                    <th className="p-3 text-right">Gross Certified</th>
                    <th className="p-3 text-right">Retention (10%)</th>
                    <th className="p-3 text-right">Adv. Recovery</th>
                    <th className="p-3 text-right">5% UAE VAT</th>
                    <th className="p-3 text-right">Net Approved</th>
                    <th className="p-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {pClaims.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-900/40">
                      <td className="p-3 font-bold text-blue-400">{c.billNo}</td>
                      <td className="p-3 font-sans font-bold text-slate-200">{c.contractor}</td>
                      <td className="p-3 text-slate-400">{c.date}</td>
                      <td className="p-3 text-right text-slate-100">AED {c.gross.toLocaleString()}</td>
                      <td className="p-3 text-right text-rose-400">-AED {c.retention.toLocaleString()}</td>
                      <td className="p-3 text-right text-amber-400">-AED {c.advRec.toLocaleString()}</td>
                      <td className="p-3 text-right text-emerald-400">+AED {c.vat.toLocaleString()}</td>
                      <td className="p-3 text-right font-black text-emerald-400 text-sm">
                        AED {c.net.toLocaleString()}
                      </td>
                      <td className="p-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-sans font-bold uppercase ${
                            c.status === 'Paid'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}
                        >
                          {c.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: DIGITAL MEASUREMENT BOOK (MB) ================= */}
      {activeTab === 'mb' && (
        <div className="space-y-6">
          <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/60">
              <div>
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-200 flex items-center gap-2">
                  <Ruler className="w-4 h-4 text-pink-400" /> Digital Measurement Book (MB Register)
                </h3>
                <p className="text-[11px] text-slate-400">Itemized L × B × H measurements linked to pour cards and inspection submittals.</p>
              </div>
              <button
                onClick={() => setShowMBModal(true)}
                className="px-3.5 py-1.5 bg-pink-600 hover:bg-pink-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition shadow"
              >
                <Plus className="w-3.5 h-3.5" /> Log Measurement
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 text-slate-400 uppercase text-[10px]">
                  <tr>
                    <th className="p-3">MB Sheet #</th>
                    <th className="p-3">Location / Grid Lines</th>
                    <th className="p-3 min-w-[200px]">Item Description</th>
                    <th className="p-3 text-right w-14">Nos</th>
                    <th className="p-3 text-right w-16">Length</th>
                    <th className="p-3 text-right w-16">Width</th>
                    <th className="p-3 text-right w-16">Height</th>
                    <th className="p-3 text-right w-24">Calculated Qty</th>
                    <th className="p-3 text-center">Inspection Ref</th>
                    <th className="p-3 text-center no-print w-16">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {pMB.map((mb) => (
                    <tr key={mb.id} className="hover:bg-slate-900/40">
                      <td className="p-3 font-bold text-pink-400">{mb.id}</td>
                      <td className="p-3 font-sans text-slate-200">{mb.location}</td>
                      <td className="p-3 font-sans text-slate-300 font-medium">{mb.itemDescription}</td>
                      <td className="p-3 text-right text-slate-300">{mb.nos}</td>
                      <td className="p-3 text-right text-slate-300">{mb.length}</td>
                      <td className="p-3 text-right text-slate-300">{mb.width}</td>
                      <td className="p-3 text-right text-slate-300">{mb.height}</td>
                      <td className="p-3 text-right font-bold text-emerald-400">
                        {mb.calculatedQty} {mb.unit}
                      </td>
                      <td className="p-3 text-center text-slate-400 font-sans">{mb.inspectionRef}</td>
                      <td className="p-3 text-center no-print">
                        <button onClick={() => deleteDigitalMB(mb.id)} className="p-1 hover:text-rose-400 text-slate-500">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: FIDIC WORK ORDERS ================= */}
      {activeTab === 'wo' && (
        <div className="space-y-6">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <FileSignature className="w-4 h-4 text-purple-400" /> FIDIC Subcontract Work Orders
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pWO.map((wo) => (
                <div key={wo.id} className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-purple-400 font-bold">{wo.id}</span>
                    <span className="font-mono text-emerald-400 font-bold">AED {wo.orderValueAED.toLocaleString()}</span>
                  </div>
                  <div className="font-bold text-slate-200">{wo.subcontractor}</div>
                  <p className="text-slate-400">{wo.title}</p>
                  <div className="flex justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800">
                    <span>Certified: AED {wo.certifiedToDateAED.toLocaleString()}</span>
                    <span>10% Retention | 10% Advance</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 4: EXTRA ITEMS RATE ANALYSIS ================= */}
      {activeTab === 'extra' && (
        <div className="space-y-6">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-200 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400" /> Extra Items Non-BOQ Rate Analysis Engine
                </h3>
                <p className="text-[11px] text-slate-400">
                  Derive variation rates: Direct Material + Labour + Plant Equipment + 20% Overhead & Profit.
                </p>
              </div>
              <button
                onClick={() => setShowExtraModal(true)}
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Log Extra Item Rate
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 text-slate-400 uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Ref #</th>
                    <th className="p-3">Description</th>
                    <th className="p-3 text-right">Material</th>
                    <th className="p-3 text-right">Labour</th>
                    <th className="p-3 text-right">Plant/Equip</th>
                    <th className="p-3 text-right">20% OH & Profit</th>
                    <th className="p-3 text-right">Approved Rate</th>
                    <th className="p-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {pExtra.map((e) => (
                    <tr key={e.id}>
                      <td className="p-3 text-blue-400 font-bold">{e.id}</td>
                      <td className="p-3 font-sans text-slate-200">{e.description}</td>
                      <td className="p-3 text-right">AED {e.materialCost.toLocaleString()}</td>
                      <td className="p-3 text-right">AED {e.labourCost.toLocaleString()}</td>
                      <td className="p-3 text-right">AED {e.plantCost.toLocaleString()}</td>
                      <td className="p-3 text-right text-indigo-300">20% Applied</td>
                      <td className="p-3 text-right font-black text-emerald-400">AED {e.approvedRate.toLocaleString()}</td>
                      <td className="p-3 text-center">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-sans font-bold">
                          {e.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 5: MATERIAL OVER-CONSUMPTION RECOVERY ================= */}
      {activeTab === 'recovery' && (
        <div className="space-y-6">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4 text-xs">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <Scale className="w-4 h-4 text-cyan-400" /> Client-Supplied Material Over-Consumption Ledger
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 text-slate-400 uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Material Category</th>
                    <th className="p-3 text-right">Total Issued</th>
                    <th className="p-3 text-right">Theoretical In-Situ</th>
                    <th className="p-3 text-right">Allowable Norm</th>
                    <th className="p-3 text-right">Excess Qty</th>
                    <th className="p-3 text-right">Recovery Rate</th>
                    <th className="p-3 text-right">Deduction (AED)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  <tr>
                    <td className="p-3 font-sans font-bold text-slate-200">Deformed Rebar Steel Grade 500B</td>
                    <td className="p-3 text-right text-slate-300">120.0 MT</td>
                    <td className="p-3 text-right text-slate-300">115.0 MT</td>
                    <td className="p-3 text-right text-cyan-400">2.87 MT (2.5%)</td>
                    <td className="p-3 text-right text-rose-400">2.13 MT</td>
                    <td className="p-3 text-right">AED 2,800 / MT</td>
                    <td className="p-3 text-right font-black text-rose-400">-AED 5,964.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 6: 8-STEP APPROVAL MATRIX ================= */}
      {activeTab === 'approval' && (
        <div className="space-y-6">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4 text-xs">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> 8-Step Certification & Billing Approval Flow
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { step: '1', role: 'Contractor QS', act: 'Upload Measurement & Invoice Draft', col: 'text-blue-400' },
                { step: '2', role: 'Main Contractor Site QS', act: 'Joint Site Verification (JMS)', col: 'text-teal-400' },
                { step: '3', role: 'Project Manager (PM)', act: 'Execution Milestones & Snags Check', col: 'text-indigo-400' },
                { step: '4', role: 'Consultant Engineer (PMC)', act: 'Interim Certificate Certification', col: 'text-purple-400' },
                { step: '5', role: 'Senior Commercial QS', act: 'Deductions (10% Retention + Adv)', col: 'text-amber-400' },
                { step: '6', role: 'Finance Director (CFO)', act: 'Tax Invoicing & 5% VAT Verification', col: 'text-rose-400' },
                { step: '7', role: 'Managing Director (MD)', act: 'Executive Payment Authorisation', col: 'text-cyan-400' },
                { step: '8', role: 'Treasury & Accounts', act: 'Bank Wire Release (WPS / ENBD)', col: 'text-emerald-400' },
              ].map((s) => (
                <div key={s.step} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                  <span className={`font-mono text-[10px] font-bold ${s.col}`}>Step {s.step} Approval</span>
                  <div className="font-bold text-slate-200 text-xs">{s.role}</div>
                  <p className="text-[10px] text-slate-400">{s.act}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 7: PAYMENT SUB-LEDGER ================= */}
      {activeTab === 'ledger' && (
        <div className="space-y-6">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4 text-xs">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <BookOpenCheck className="w-4 h-4 text-teal-400" /> Contractor Payment Register & Sub-Ledger
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 text-slate-400 uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Payment Ref</th>
                    <th className="p-3">Payee Subcontractor</th>
                    <th className="p-3">Disbursement Date</th>
                    <th className="p-3 text-right">Certified</th>
                    <th className="p-3 text-right">Deductions</th>
                    <th className="p-3 text-right">Net Bank Wire</th>
                    <th className="p-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {pClaims.map((c) => (
                    <tr key={c.id}>
                      <td className="p-3 text-blue-400">UTR-SHJ-90{c.id}</td>
                      <td className="p-3 font-sans font-bold text-slate-200">{c.contractor}</td>
                      <td className="p-3 text-slate-400">{c.date}</td>
                      <td className="p-3 text-right">AED {c.gross.toLocaleString()}</td>
                      <td className="p-3 text-right text-rose-400">-AED {(c.retention + c.advRec).toLocaleString()}</td>
                      <td className="p-3 text-right font-black text-emerald-400">AED {c.net.toLocaleString()}</td>
                      <td className="p-3 text-center">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-sans font-bold">
                          Disbursed ENBD
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 8: STATUTORY 5% VAT ================= */}
      {activeTab === 'vat' && (
        <div className="space-y-6">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-200 flex items-center gap-2">
                  <Landmark className="w-4 h-4 text-sky-400" /> Federal Tax Authority (FTA) 5% VAT Compliance Register
                </h3>
                <p className="text-[11px] text-slate-400">Output tax on client billings vs Input Tax Credits (ITC) on supplier purchase orders.</p>
              </div>
              <button
                onClick={() => setShowVATModal(true)}
                className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Record VAT Return
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 text-slate-400 uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Tax Period</th>
                    <th className="p-3">Category</th>
                    <th className="p-3 text-right">Output Tax Collected</th>
                    <th className="p-3 text-right">Input Tax Credit (ITC)</th>
                    <th className="p-3 text-right">Net Tax Payable to FTA</th>
                    <th className="p-3 text-center">Filing Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {vatRecords.map((v) => (
                    <tr key={v.id}>
                      <td className="p-3 font-sans font-bold text-slate-200">{v.period}</td>
                      <td className="p-3 text-slate-400">{v.category}</td>
                      <td className="p-3 text-right text-slate-100">AED {v.outputTax.toLocaleString()}</td>
                      <td className="p-3 text-right text-emerald-400">AED {v.inputTaxCredit.toLocaleString()}</td>
                      <td className="p-3 text-right font-black text-sky-400">AED {v.netPayable.toLocaleString()}</td>
                      <td className="p-3 text-center">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-sans font-bold">
                          {v.filingStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 9: VIRTUAL AUDIT TREE ================= */}
      {activeTab === 'directory' && (
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 font-mono text-xs space-y-3">
            <div className="flex items-center text-amber-400 font-bold text-sm">
              <FolderTree className="w-4 h-4 mr-2" /> 📁 [{activeProject.code}_FINANCIAL_AUDIT_ARCHIVE]
            </div>
            <div className="ml-6 space-y-3 border-l-2 border-slate-800 pl-4 text-xs text-slate-300 font-sans">
              <div>
                <div className="font-bold text-slate-100 font-mono">📂 01_FIDIC_Contract_Baselines</div>
                <div className="ml-6 text-slate-400 text-[11px] space-y-0.5 mt-1 font-mono">
                  <div>📄 Approved_Contract_Agreement_FIDIC_RedBook.pdf</div>
                  <div>📄 Advance_Payment_Guarantee_Bond.pdf</div>
                </div>
              </div>
              <div>
                <div className="font-bold text-slate-100 font-mono">📂 02_Interim_Payment_Certificates_IPC</div>
                <div className="ml-6 text-slate-400 text-[11px] space-y-0.5 mt-1 font-mono">
                  <div>📄 Certified_IPC_01_AlBahar.pdf</div>
                  <div>📄 Digital_Measurement_Book_MB_01.xlsx</div>
                </div>
              </div>
              <div>
                <div className="font-bold text-slate-100 font-mono">📂 03_VAT_Tax_Invoices_and_FTA_Returns</div>
                <div className="ml-6 text-slate-400 text-[11px] space-y-0.5 mt-1 font-mono">
                  <div>📄 FTA_VAT_Return_2026.pdf</div>
                  <div>📄 TRN_Vendor_Validation_Logs.pdf</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MB Modal */}
      {showMBModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="glass-panel rounded-2xl border border-slate-800 p-6 max-w-lg w-full space-y-4 text-xs">
            <h3 className="font-bold text-sm text-slate-100">Log Digital Measurement Book (MB) Entry</h3>
            <form onSubmit={handleSaveMB} className="space-y-3">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Grid Location / Zone *</label>
                <input
                  type="text"
                  required
                  value={mbLoc}
                  onChange={(e) => setMbLoc(e.target.value)}
                  placeholder="Tower A - Level 09 Suspended Slab Axis C1-C8"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-bold mb-1">Item Description *</label>
                <input
                  type="text"
                  required
                  value={mbDesc}
                  onChange={(e) => setMbDesc(e.target.value)}
                  placeholder="Concrete Pour Grade C40/50 SRC"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200"
                />
              </div>
              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Nos</label>
                  <input
                    type="number"
                    value={mbNos}
                    onChange={(e) => setMbNos(parseFloat(e.target.value) || 1)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Length (m)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={mbL}
                    onChange={(e) => setMbL(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Width (m)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={mbB}
                    onChange={(e) => setMbB(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Height (m)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={mbH}
                    onChange={(e) => setMbH(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 font-mono"
                  />
                </div>
              </div>
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 font-mono text-[11px] flex justify-between">
                <span>Calculated Quantity:</span>
                <span className="text-emerald-400 font-bold">{(mbNos * mbL * mbB * mbH).toFixed(2)} {mbUnit}</span>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button type="button" onClick={() => setShowMBModal(false)} className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-1.5 bg-pink-600 text-white font-bold rounded-lg">
                  Save Measurement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Extra Items Modal */}
      {showExtraModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="glass-panel rounded-2xl border border-slate-800 p-6 max-w-md w-full space-y-4 text-xs">
            <h3 className="font-bold text-sm text-slate-100">Log Extra Item Variation Rate Analysis</h3>
            <form onSubmit={handleSaveExtra} className="space-y-3">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Description *</label>
                <input
                  type="text"
                  required
                  value={exDesc}
                  onChange={(e) => setExDesc(e.target.value)}
                  placeholder="e.g. Additional Waterproofing Injection Grout"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Material (AED)</label>
                  <input
                    type="number"
                    value={exMat}
                    onChange={(e) => setExMat(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Labour (AED)</label>
                  <input
                    type="number"
                    value={exLab}
                    onChange={(e) => setExLab(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Plant (AED)</label>
                  <input
                    type="number"
                    value={exPlant}
                    onChange={(e) => setExPlant(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 font-mono"
                  />
                </div>
              </div>
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 font-mono text-[11px] flex justify-between">
                <span>Approved Rate (+20% OH&P):</span>
                <span className="text-emerald-400 font-bold">AED {((exMat + exLab + exPlant) * 1.20).toFixed(2)}</span>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button type="button" onClick={() => setShowExtraModal(false)} className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-1.5 bg-indigo-600 text-white font-bold rounded-lg">
                  Approve Rate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VAT Modal */}
      {showVATModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="glass-panel rounded-2xl border border-slate-800 p-6 max-w-md w-full space-y-4 text-xs">
            <h3 className="font-bold text-sm text-slate-100">Record Statutory 5% VAT Return</h3>
            <form onSubmit={handleSaveVAT} className="space-y-3">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Tax Period</label>
                <input
                  type="text"
                  required
                  value={vatPeriod}
                  onChange={(e) => setVatPeriod(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Output Tax Collected (AED)</label>
                  <input
                    type="number"
                    required
                    value={vatOutput}
                    onChange={(e) => setVatOutput(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Input Tax Credit (AED)</label>
                  <input
                    type="number"
                    required
                    value={vatInput}
                    onChange={(e) => setVatInput(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 font-mono text-emerald-400"
                  />
                </div>
              </div>
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 font-mono text-[11px] flex justify-between">
                <span>Net Payable to FTA:</span>
                <span className="text-sky-400 font-bold">AED {(vatOutput - vatInput).toLocaleString()}</span>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button type="button" onClick={() => setShowVATModal(false)} className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-1.5 bg-sky-600 text-white font-bold rounded-lg">
                  Record VAT Return
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
