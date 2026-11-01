import React, { useState, useEffect, useRef } from 'react';
import { useERP } from '../../context/ERPContext';
import { MasterBOQItem, VariationOrder, IPCClaim } from '../../types/erp';
import {
  Calculator,
  ListOrdered,
  Gavel,
  Scale,
  FileSignature,
  GitCompare,
  Layers,
  Plus,
  FileDown,
  Sparkles,
  Edit2,
  Trash2,
  CheckCircle2,
  Printer,
} from 'lucide-react';
import Chart from 'chart.js/auto';

export const EstimationCommercialWorkspace: React.FC = () => {
  const {
    activeProject,
    boqItems,
    addBOQItem,
    updateBOQItem,
    deleteBOQItem,
    variations,
    addVariation,
    deleteVariation,
    ipcClaims,
    addIPCClaim,
    activeSubPage,
    setActiveSubPage,
  } = useERP();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'boq' | 'tendering' | 'budget' | 'contract' | 'variations' | 'qto'>('dashboard');

  useEffect(() => {
    if (activeSubPage === 'comm-dashboard') setActiveTab('dashboard');
    else if (activeSubPage === 'comm-boq') setActiveTab('boq');
    else if (activeSubPage === 'comm-tendering') setActiveTab('tendering');
    else if (activeSubPage === 'comm-budget') setActiveTab('budget');
    else if (activeSubPage === 'comm-contract') setActiveTab('contract');
    else if (activeSubPage === 'comm-variations') setActiveTab('variations');
  }, [activeSubPage]);

  const pBOQ = boqItems.filter((b) => b.projectId === activeProject.id);
  const pVariations = variations.filter((v) => v.projectId === activeProject.id);
  const pIPC = ipcClaims.filter((c) => c.projectId === activeProject.id);

  // Totals
  const totalCost = pBOQ.reduce((s, b) => s + b.qty * b.rate, 0);
  const costPerSqft = activeProject.areaSqFt > 0 ? (totalCost / activeProject.areaSqFt).toFixed(2) : '0.00';
  const approvedVars = pVariations.filter((v) => v.status === 'Approved').reduce((s, v) => s + v.approved, 0);
  const pendingVars = pVariations.filter((v) => v.status === 'Submitted').reduce((s, v) => s + v.claimed, 0);
  const billedGross = pIPC.reduce((s, c) => s + c.gross, 0);
  const retentionVal = pIPC.reduce((s, c) => s + c.retention, 0);

  // New BOQ Line Item Form State
  const [bDiscipline, setBDiscipline] = useState('Civil & Structural');
  const [bDesc, setBDesc] = useState('');
  const [bUnit, setBUnit] = useState('Cu.m');
  const [bQty, setBQty] = useState<number>(100);
  const [bRate, setBRate] = useState<number>(380);
  const [bDrawingRef, setBDrawingRef] = useState('STR-01');

  // VO Form Modal State
  const [showVOModal, setShowVOMODAL] = useState(false);
  const [voDesc, setVoDesc] = useState('');
  const [voClaimed, setVoClaimed] = useState<number>(150000);
  const [voApproved, setVoApproved] = useState<number>(120000);
  const [voStatus, setVoStatus] = useState<VariationOrder['status']>('Submitted');

  // IPC Form Modal State
  const [showIPCModal, setShowIPCModal] = useState(false);
  const [ipcGross, setIpcGross] = useState<number>(1500000);

  // Pre-Bid Queries
  const [preBidQueries, setPreBidQueries] = useState([
    { id: 1, ref: 'Spec Sec 03300', query: 'Confirm third-party concrete testing (Sharjah Municipality approved lab) and SEWA fees are in contractor scope.', response: 'Yes, included in preliminaries allowance.', status: 'Closed' },
    { id: 2, ref: 'ARC-DWG-L08', query: 'Clarification regarding double glazed low-e solar heat gain coefficient (SHGC <= 0.25).', response: 'Architect confirmed Saint-Gobain Cool-Lite SKN 165 or equal.', status: 'Closed' }
  ]);

  // Drawing checklist
  const [drawingChecklist, setDrawingChecklist] = useState([
    { name: 'Architectural Floor Plans, Sections & Elevations', checked: true },
    { name: 'Structural Framing, Columns & Post-Tensioned Slabs', checked: true },
    { name: 'Substructure Excavation & Shoring Layout', checked: true },
    { name: 'MEP Schematic Single-Line Diagrams & HVAC Header', checked: true },
    { name: 'Geotechnical Soil Report & Water Table Level', checked: true },
    { name: 'Sharjah Municipality & Civil Defence Approved Stamp', checked: true },
    { name: 'SEWA Electrical Substation NOC', checked: false }
  ]);

  // Chart Refs
  const doughnutRef = useRef<HTMLCanvasElement | null>(null);
  const doughnutInstance = useRef<Chart | null>(null);

  const barChartRef = useRef<HTMLCanvasElement | null>(null);
  const barChartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (activeTab !== 'dashboard') return;

    // Discipline chart
    if (doughnutRef.current) {
      if (doughnutInstance.current) doughnutInstance.current.destroy();

      const discMap: Record<string, number> = {};
      pBOQ.forEach((b) => {
        discMap[b.discipline] = (discMap[b.discipline] || 0) + b.qty * b.rate;
      });

      doughnutInstance.current = new Chart(doughnutRef.current, {
        type: 'doughnut',
        data: {
          labels: Object.keys(discMap).length > 0 ? Object.keys(discMap) : ['Civil', 'MEP', 'Finishes'],
          datasets: [
            {
              data: Object.values(discMap).length > 0 ? Object.values(discMap) : [45, 30, 25],
              backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#06b6d4'],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'right', labels: { color: '#94a3b8', font: { size: 10 } } } },
        },
      });
    }

    // Bar comparison chart
    if (barChartRef.current) {
      if (barChartInstance.current) barChartInstance.current.destroy();

      barChartInstance.current = new Chart(barChartRef.current, {
        type: 'bar',
        data: {
          labels: ['Baseline Contract', 'QS Estimate Cost', 'Approved Variations', 'Revised Total'],
          datasets: [
            {
              label: 'Value (AED)',
              data: [
                activeProject.contractBaselineAED,
                totalCost,
                approvedVars,
                activeProject.contractBaselineAED + approvedVars,
              ],
              backgroundColor: ['#1e293b', '#10b981', '#06b6d4', '#3b82f6'],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { ticks: { color: '#64748b', font: { size: 10 } }, grid: { display: false } },
            y: { ticks: { color: '#64748b', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.05)' } },
          },
        },
      });
    }

    return () => {
      if (doughnutInstance.current) doughnutInstance.current.destroy();
      if (barChartInstance.current) barChartInstance.current.destroy();
    };
  }, [activeTab, pBOQ, approvedVars, activeProject]);

  const handleAddBOQ = (e: React.FormEvent) => {
    e.preventDefault();
    addBOQItem({
      id: Date.now(),
      projectId: activeProject.id,
      discipline: bDiscipline,
      category: bDiscipline,
      description: bDesc,
      unit: bUnit,
      qty: bQty,
      rate: bRate,
      drawingRef: bDrawingRef,
    });
    setBDesc('');
    setBQty(100);
    setBRate(380);
  };

  const handleSaveVO = (e: React.FormEvent) => {
    e.preventDefault();
    addVariation({
      id: Date.now(),
      projectId: activeProject.id,
      ref: `VO-0${pVariations.length + 1}`,
      description: voDesc,
      claimed: voClaimed,
      approved: voStatus === 'Approved' ? voApproved : 0,
      status: voStatus,
      date: new Date().toISOString().split('T')[0],
    });
    setShowVOMODAL(false);
    setVoDesc('');
  };

  const handleSaveIPC = (e: React.FormEvent) => {
    e.preventDefault();
    const retention = ipcGross * 0.10;
    const advRec = ipcGross * 0.10;
    const vat = (ipcGross - retention - advRec) * 0.05;
    const net = ipcGross - retention - advRec + vat;

    addIPCClaim({
      id: Date.now(),
      projectId: activeProject.id,
      billNo: `IPC-0${pIPC.length + 1}`,
      date: new Date().toISOString().split('T')[0],
      gross: ipcGross,
      retention,
      advRec,
      vat,
      net,
      status: 'Submitted',
      contractor: 'Al-Bahar Structural LLC',
    });
    setShowIPCModal(false);
  };

  const exportBOQCSV = () => {
    let csv = 'Discipline,Description,Unit,Quantity,Rate (AED),Total (AED),Drawing Ref\n';
    pBOQ.forEach((b) => {
      csv += `"${b.discipline}","${b.description}","${b.unit}",${b.qty},${b.rate},${b.qty * b.rate},"${b.drawingRef}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeProject.code}_Master_BOQ.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Workspace Tabs */}
      <div className="glass-panel rounded-2xl border border-slate-800 p-1 flex overflow-x-auto text-xs no-print">
        {[
          { id: 'dashboard', name: 'Executive QS Overview', icon: Calculator },
          { id: 'boq', name: 'Master BOQ & Pricing', icon: ListOrdered },
          { id: 'tendering', name: 'Tender & Bid Strategy', icon: Gavel },
          { id: 'budget', name: 'Budget & Margins', icon: Scale },
          { id: 'contract', name: 'FIDIC IPC Billing', icon: FileSignature },
          { id: 'variations', name: 'Variation Orders (VO)', icon: GitCompare },
          { id: 'qto', name: 'Drawing Specs Readiness', icon: Layers },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setActiveSubPage(`comm-${tab.id}`);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold whitespace-nowrap transition ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* ================= TAB 1: EXECUTIVE QS DASHBOARD ================= */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Contract Value</span>
              <div className="text-xl font-black text-slate-100 font-mono">
                AED {(activeProject.contractBaselineAED / 1e6).toFixed(1)}M
              </div>
              <span className="text-[10px] text-slate-500 block truncate">{activeProject.contractType}</span>
            </div>

            <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">QS Estimated Cost</span>
              <div className="text-xl font-black text-emerald-400 font-mono">
                AED {(totalCost / 1e6).toFixed(2)}M
              </div>
              <span className="text-[10px] text-slate-400 block font-mono">AED {costPerSqft} / sq.ft BUA</span>
            </div>

            <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Approved Variations</span>
              <div className="text-xl font-black text-cyan-400 font-mono">
                +AED {approvedVars.toLocaleString()}
              </div>
              <span className="text-[10px] text-amber-400 block font-mono">AED {pendingVars.toLocaleString()} Pending</span>
            </div>

            <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Target Profit Margin</span>
              <div className="text-xl font-black text-indigo-400 font-mono">14.5%</div>
              <span className="text-[10px] text-indigo-300 block font-mono">
                AED {((activeProject.contractBaselineAED * 0.145) / 1e6).toFixed(2)}M Margin
              </span>
            </div>

            <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Billed Progress (IPC)</span>
              <div className="text-xl font-black text-blue-400 font-mono">
                AED {(billedGross / 1e6).toFixed(2)}M
              </div>
              <span className="text-[10px] text-slate-400 block font-mono">AED {retentionVal.toLocaleString()} Held</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Direct Cost Distribution by Discipline
              </h3>
              <div className="h-64">
                <canvas ref={doughnutRef}></canvas>
              </div>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Baseline Budget vs Variations Impact
              </h3>
              <div className="h-64">
                <canvas ref={barChartRef}></canvas>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: MASTER BOQ & PRICING ================= */}
      {activeTab === 'boq' && (
        <div className="space-y-6">
          {/* Add BOQ Form */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4 no-print">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-400" /> Add Master BOQ Line Item
              </h3>
            </div>
            <form onSubmit={handleAddBOQ} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Discipline *</label>
                <select
                  value={bDiscipline}
                  onChange={(e) => setBDiscipline(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 font-bold"
                >
                  <option value="Civil & Structural">Civil & Structural</option>
                  <option value="MEP Services">MEP Services</option>
                  <option value="Architectural Finishes">Architectural Finishes</option>
                  <option value="Misc & External">Misc & External</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-400 font-bold mb-1">Description *</label>
                <input
                  type="text"
                  required
                  value={bDesc}
                  onChange={(e) => setBDesc(e.target.value)}
                  placeholder="e.g. C40/50 SRC Concrete in Columns"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Unit *</label>
                <input
                  type="text"
                  required
                  value={bUnit}
                  onChange={(e) => setBUnit(e.target.value)}
                  placeholder="Cu.m / Sq.m / Kg"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Quantity *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={bQty}
                  onChange={(e) => setBQty(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 font-mono text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Unit Rate (AED) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={bRate}
                  onChange={(e) => setBRate(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 font-mono text-emerald-400 font-bold"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition"
                >
                  Save Line
                </button>
              </div>
            </form>
          </div>

          {/* Master BOQ Table */}
          <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/60 no-print">
              <span className="font-bold text-xs uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <ListOrdered className="w-4 h-4 text-emerald-400" /> Master Bill of Quantities (BOQ) Table
              </span>
              <button
                onClick={exportBOQCSV}
                className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <FileDown className="w-3.5 h-3.5" /> Export BOQ CSV
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 text-slate-400 uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Discipline</th>
                    <th className="p-3 min-w-[200px]">Description</th>
                    <th className="p-3 text-center w-16">Unit</th>
                    <th className="p-3 text-right w-24">Quantity</th>
                    <th className="p-3 text-right w-28">Unit Rate</th>
                    <th className="p-3 text-right w-32">Total Amount</th>
                    <th className="p-3 text-center w-28">Drawing Ref</th>
                    <th className="p-3 text-center w-16 no-print">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {pBOQ.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-900/40">
                      <td className="p-3 font-semibold text-emerald-400">{item.discipline}</td>
                      <td className="p-3 font-medium text-slate-200">{item.description}</td>
                      <td className="p-3 text-center font-mono text-slate-400">{item.unit}</td>
                      <td className="p-3 text-right font-mono text-slate-200">{item.qty.toLocaleString()}</td>
                      <td className="p-3 text-right font-mono text-slate-300">AED {item.rate.toFixed(2)}</td>
                      <td className="p-3 text-right font-mono font-bold text-emerald-400">
                        AED {(item.qty * item.rate).toLocaleString()}
                      </td>
                      <td className="p-3 text-center font-mono text-slate-400">{item.drawingRef}</td>
                      <td className="p-3 text-center no-print">
                        <button
                          onClick={() => deleteBOQItem(item.id)}
                          className="p-1 hover:text-rose-400 text-slate-500"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-900 font-bold border-t border-slate-700">
                    <td colSpan={5} className="p-3 text-right uppercase text-slate-300">Master BOQ Grand Total:</td>
                    <td className="p-3 text-right font-mono text-emerald-400 text-sm font-black">
                      AED {totalCost.toLocaleString()}
                    </td>
                    <td colSpan={2}></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: TENDERING & BID STRATEGY ================= */}
      {activeTab === 'tendering' && (
        <div className="space-y-6">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4 text-xs">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <Gavel className="w-4 h-4 text-emerald-400" /> Tender Overview & Pre-Bid Clarifications
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Tender Ref</span>
                <span className="font-mono font-bold text-slate-200 text-sm">TND-2026-SHJ-01</span>
              </div>
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Bid Security Bond (AED)</span>
                <span className="font-mono font-bold text-amber-400 text-sm">AED 1,125,000 (5%)</span>
              </div>
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Client Budget (AED)</span>
                <span className="font-mono font-bold text-slate-200 text-sm">AED 26,000,000</span>
              </div>
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Submitted Bid (AED)</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">AED 24,500,000 (Awarded)</span>
              </div>
            </div>

            {/* Pre-Bid Queries */}
            <div className="pt-2">
              <h4 className="font-bold text-slate-300 mb-2">Pre-Bid Technical & Commercial Query Register</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-800/80 rounded-xl overflow-hidden">
                  <thead className="bg-slate-900 text-slate-400 uppercase text-[10px]">
                    <tr>
                      <th className="p-2.5">Clause / Drawing</th>
                      <th className="p-2.5">Commercial Query</th>
                      <th className="p-2.5">Client Clarification</th>
                      <th className="p-2.5 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {preBidQueries.map((q) => (
                      <tr key={q.id}>
                        <td className="p-2.5 font-mono text-emerald-400 font-bold">{q.ref}</td>
                        <td className="p-2.5 text-slate-200">{q.query}</td>
                        <td className="p-2.5 text-slate-400">{q.response}</td>
                        <td className="p-2.5 text-center">
                          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
                            {q.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 4: BUDGET CONTROL & MARGINS ================= */}
      {activeTab === 'budget' && (
        <div className="space-y-6">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4 text-xs">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <Scale className="w-4 h-4 text-emerald-400" /> Commercial Budget Allocation & Margin Controls
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Allowable Direct Cost</span>
                <div className="text-xl font-bold font-mono text-slate-100">
                  AED {(activeProject.contractBaselineAED * 0.855).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
                <p className="text-[10px] text-slate-500">Contract Value minus 14.5% Target Net Profit</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase">QS Estimated Direct Cost</span>
                <div className="text-xl font-bold font-mono text-emerald-400">
                  AED {totalCost.toLocaleString()}
                </div>
                <p className="text-[10px] text-slate-500">From Master BOQ Line Items</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Cost Variance Buffer</span>
                <div className="text-xl font-bold font-mono text-emerald-400">
                  +AED {(activeProject.contractBaselineAED * 0.855 - totalCost).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
                <p className="text-[10px] text-emerald-400 font-bold">Within Allowable Budget</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 5: FIDIC IPC BILLING ================= */}
      {activeTab === 'contract' && (
        <div className="space-y-6">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-200 flex items-center gap-2">
                  <FileSignature className="w-4 h-4 text-emerald-400" /> FIDIC Interim Payment Certificate (IPC) Register
                </h3>
                <p className="text-[11px] text-slate-400">10% Retention, 10% Advance Recovery & 5% UAE VAT Calculations</p>
              </div>
              <button
                onClick={() => setShowIPCModal(true)}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition"
              >
                <Plus className="w-3.5 h-3.5" /> Submit IPC Claim
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 text-slate-400 uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Bill #</th>
                    <th className="p-3">Claim Date</th>
                    <th className="p-3 text-right">Gross Claimed</th>
                    <th className="p-3 text-right">Retention (10%)</th>
                    <th className="p-3 text-right">Adv. Recovery</th>
                    <th className="p-3 text-right">5% UAE VAT</th>
                    <th className="p-3 text-right">Net Payable</th>
                    <th className="p-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {pIPC.map((ipc) => (
                    <tr key={ipc.id} className="hover:bg-slate-900/40">
                      <td className="p-3 font-mono font-bold text-blue-400">{ipc.billNo}</td>
                      <td className="p-3 text-slate-400">{ipc.date}</td>
                      <td className="p-3 text-right font-mono font-bold text-slate-100">AED {ipc.gross.toLocaleString()}</td>
                      <td className="p-3 text-right font-mono text-rose-400">-AED {ipc.retention.toLocaleString()}</td>
                      <td className="p-3 text-right font-mono text-amber-400">-AED {ipc.advRec.toLocaleString()}</td>
                      <td className="p-3 text-right font-mono text-emerald-400">+AED {ipc.vat.toLocaleString()}</td>
                      <td className="p-3 text-right font-mono font-black text-emerald-400">AED {ipc.net.toLocaleString()}</td>
                      <td className="p-3 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-800 text-slate-200 border border-slate-700">
                          {ipc.status}
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

      {/* ================= TAB 6: VARIATION ORDERS ================= */}
      {activeTab === 'variations' && (
        <div className="space-y-6">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-200 flex items-center gap-2">
                  <GitCompare className="w-4 h-4 text-emerald-400" /> Scope Variation Orders (VO Register)
                </h3>
                <p className="text-[11px] text-slate-400">Track client variations, consultant approvals, and revised contract totals.</p>
              </div>
              <button
                onClick={() => setShowVOMODAL(true)}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition"
              >
                <Plus className="w-3.5 h-3.5" /> Log Variation Claim
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 text-slate-400 uppercase text-[10px]">
                  <tr>
                    <th className="p-3">VO Ref #</th>
                    <th className="p-3">Variation Description</th>
                    <th className="p-3 text-right">Claimed (AED)</th>
                    <th className="p-3 text-right">Approved (AED)</th>
                    <th className="p-3 text-center">Status</th>
                    <th className="p-3 text-center no-print">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {pVariations.map((vo) => (
                    <tr key={vo.id} className="hover:bg-slate-900/40">
                      <td className="p-3 font-mono font-bold text-blue-400">{vo.ref}</td>
                      <td className="p-3 font-semibold text-slate-200">{vo.description}</td>
                      <td className="p-3 text-right font-mono">AED {vo.claimed.toLocaleString()}</td>
                      <td className="p-3 text-right font-mono font-bold text-emerald-400">AED {vo.approved.toLocaleString()}</td>
                      <td className="p-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            vo.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}
                        >
                          {vo.status}
                        </span>
                      </td>
                      <td className="p-3 text-center no-print">
                        <button onClick={() => deleteVariation(vo.id)} className="p-1 hover:text-rose-400 text-slate-500">
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

      {/* ================= TAB 7: DRAWING SPECS READINESS ================= */}
      {activeTab === 'qto' && (
        <div className="space-y-6">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4 text-xs">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" /> Drawing Specs & Takeoff Readiness Checklist
            </h3>

            <div className="space-y-2">
              {drawingChecklist.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <label className="flex items-center gap-2.5 cursor-pointer text-slate-200 font-medium">
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => {
                        const updated = [...drawingChecklist];
                        updated[idx].checked = !updated[idx].checked;
                        setDrawingChecklist(updated);
                      }}
                      className="rounded border-slate-700 text-emerald-500"
                    />
                    <span>{item.name}</span>
                  </label>
                  <span className={`text-[10px] font-bold uppercase ${item.checked ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {item.checked ? 'Verified' : 'Pending Verification'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VO Modal */}
      {showVOModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="glass-panel rounded-2xl border border-slate-800 p-6 max-w-md w-full space-y-4">
            <h3 className="font-bold text-sm text-slate-100">Log Scope Variation Order</h3>
            <form onSubmit={handleSaveVO} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Description *</label>
                <input
                  type="text"
                  required
                  value={voDesc}
                  onChange={(e) => setVoDesc(e.target.value)}
                  placeholder="e.g. Addition of Post-Tensioned Beams"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Claimed (AED) *</label>
                  <input
                    type="number"
                    required
                    value={voClaimed}
                    onChange={(e) => setVoClaimed(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Approved (AED)</label>
                  <input
                    type="number"
                    value={voApproved}
                    onChange={(e) => setVoApproved(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 font-mono text-emerald-400"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-400 font-bold mb-1">Status</label>
                <select
                  value={voStatus}
                  onChange={(e) => setVoStatus(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 font-bold"
                >
                  <option value="Submitted">Submitted / Under Review</option>
                  <option value="Approved">Approved by Consultant</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button type="button" onClick={() => setShowVOMODAL(false)} className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-1.5 bg-emerald-600 text-white font-bold rounded-lg">
                  Save Variation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* IPC Modal */}
      {showIPCModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="glass-panel rounded-2xl border border-slate-800 p-6 max-w-md w-full space-y-4">
            <h3 className="font-bold text-sm text-slate-100">Submit IPC Progress Claim</h3>
            <form onSubmit={handleSaveIPC} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Gross Work Claimed (AED) *</label>
                <input
                  type="number"
                  required
                  value={ipcGross}
                  onChange={(e) => setIpcGross(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 font-mono font-bold text-slate-100"
                />
              </div>
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 font-mono text-[11px] space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>10% Retention Hold:</span>
                  <span className="text-rose-400">-AED {(ipcGross * 0.1).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>10% Advance Recovery:</span>
                  <span className="text-amber-400">-AED {(ipcGross * 0.1).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>5% UAE VAT:</span>
                  <span className="text-emerald-400">+AED {(ipcGross * 0.8 * 0.05).toLocaleString()}</span>
                </div>
                <div className="border-t border-slate-700 pt-1 flex justify-between font-bold text-slate-200">
                  <span>Net Payable:</span>
                  <span className="text-emerald-400">AED {(ipcGross * 0.84).toLocaleString()}</span>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button type="button" onClick={() => setShowIPCModal(false)} className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-1.5 bg-emerald-600 text-white font-bold rounded-lg">
                  Submit Claim
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
