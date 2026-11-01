import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { MaterialRequisition, PurchaseOrder, GRNInspection } from '../../types/erp';
import {
  ShoppingCart,
  FilePlus2,
  Warehouse,
  ShoppingBag,
  Truck,
  Scale,
  Sparkles,
  ArrowLeftRight,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Cpu,
  RefreshCw,
} from 'lucide-react';

export const ProcurementWorkspace: React.FC = () => {
  const {
    activeProject,
    materialRequisitions,
    addMaterialRequisition,
    purchaseOrders,
    addPurchaseOrder,
    grnInspections,
    addGRNInspection,
    updateGRNInspection,
    activeSubPage,
    setActiveSubPage,
  } = useERP();

  const [activeTab, setActiveTab] = useState<'mr' | 'stores' | 'po' | 'grn' | 'recon' | 'ai'>('mr');

  React.useEffect(() => {
    if (activeSubPage === 'proc-mr') setActiveTab('mr');
    else if (activeSubPage === 'proc-stores') setActiveTab('stores');
    else if (activeSubPage === 'proc-po') setActiveTab('po');
    else if (activeSubPage === 'proc-grn') setActiveTab('grn');
    else if (activeSubPage === 'proc-recon') setActiveTab('recon');
  }, [activeSubPage]);

  // Inventory Store States
  const [stockState, setStockState] = useState({
    rebarSajaa: 120,
    rebarAljada: 32,
    rebarMuwaileh: 18,
    blockSajaa: 42000,
    blockAljada: 2500,
    blockMuwaileh: 8000,
    mivanSajaa: 12500,
    mivanAljada: 4200,
    mivanMuwaileh: 1800,
  });

  // Modal States
  const [showMRModal, setShowMRModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showPOModal, setShowPOModal] = useState(false);
  const [showGRNModal, setShowGRNModal] = useState(false);

  // New MR Form
  const [mrCat, setMrCat] = useState('Civil & Structural');
  const [mrSubCat, setMrSubCat] = useState('C-02 Concrete');
  const [mrSpec, setMrSpec] = useState('Ready Mix Concrete C40/50 (SRC)');
  const [mrWbs, setMrWbs] = useState('WBS-CONC-001');
  const [mrSite, setMrSite] = useState('Aljada Site 01');
  const [mrQty, setMrQty] = useState<number>(350);
  const [mrUnit, setMrUnit] = useState('Cu.m');

  // Transfer Form
  const [tItem, setTItem] = useState('Rebar Grade 500B (20mm)');
  const [tDest, setTDest] = useState('Aljada Site Store');
  const [tQty, setTQty] = useState<number>(10);

  // PO Form
  const [poSupplier, setPoSupplier] = useState('Sharjah National Concrete Co. WLL');
  const [poTrn, setPoTrn] = useState('100293847500003');
  const [poItem, setPoItem] = useState('Ready Mix Concrete C40/50 (SRC)');
  const [poSubtotal, setPoSubtotal] = useState<number>(171000);

  // GRN Form
  const [grnItem, setGrnItem] = useState('Ready Mix Concrete C40/50');
  const [grnQty, setGrnQty] = useState<number>(120);
  const [grnRequiresLab, setGrnRequiresLab] = useState(true);

  // AI Assistant State
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiRateResult, setAiRateResult] = useState<string | null>(null);

  const handleSaveMR = (e: React.FormEvent) => {
    e.preventDefault();
    addMaterialRequisition({
      id: `MR-SHJ-2026-${Math.floor(100 + Math.random() * 900)}`,
      projectId: activeProject.id,
      date: new Date().toISOString().split('T')[0],
      mainCategory: mrCat,
      subCategory: mrSubCat,
      itemSpec: mrSpec,
      wbs: mrWbs,
      targetSite: mrSite,
      reqQty: mrQty,
      unit: mrUnit,
      yardStock: mrCat.includes('Steel') ? stockState.rebarSajaa : 0,
      status: 'Approved PM',
    });
    setShowMRModal(false);
  };

  const handleExecuteTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (tItem.includes('Rebar')) {
      if (stockState.rebarSajaa < tQty) {
        alert("Insufficient stock in Saja'a Central Yard!");
        return;
      }
      setStockState((prev) => ({
        ...prev,
        rebarSajaa: prev.rebarSajaa - tQty,
        rebarAljada: tDest.includes('Aljada') ? prev.rebarAljada + tQty : prev.rebarAljada,
        rebarMuwaileh: tDest.includes('Muwaileh') ? prev.rebarMuwaileh + tQty : prev.rebarMuwaileh,
      }));
    } else {
      if (stockState.blockSajaa < tQty) {
        alert("Insufficient block stock in Saja'a Central Yard!");
        return;
      }
      setStockState((prev) => ({
        ...prev,
        blockSajaa: prev.blockSajaa - tQty,
        blockAljada: tDest.includes('Aljada') ? prev.blockAljada + tQty : prev.blockAljada,
        blockMuwaileh: tDest.includes('Muwaileh') ? prev.blockMuwaileh + tQty : prev.blockMuwaileh,
      }));
    }
    setShowTransferModal(false);
    alert(`Successfully transferred ${tQty} units of ${tItem} to ${tDest}.`);
  };

  const handleSavePO = (e: React.FormEvent) => {
    e.preventDefault();
    const vat = poSubtotal * 0.05;
    addPurchaseOrder({
      id: `PO-UAE-2026-${Math.floor(100 + Math.random() * 900)}`,
      projectId: activeProject.id,
      date: new Date().toISOString().split('T')[0],
      supplier: poSupplier,
      trn: poTrn,
      items: poItem,
      subtotal: poSubtotal,
      vatAmount: vat,
      totalWithVat: poSubtotal + vat,
      deliverySite: activeProject.name,
      deliveryStatus: 'Pending Delivery',
    });
    setShowPOModal(false);
  };

  const handleSaveGRN = (e: React.FormEvent) => {
    e.preventDefault();
    addGRNInspection({
      id: `GRN-SHJ-2026-${Math.floor(10 + Math.random() * 90)}`,
      projectId: activeProject.id,
      poRef: 'PO-UAE-2026-088',
      date: new Date().toISOString().split('T')[0],
      item: grnItem,
      deliveredQty: grnQty,
      acceptedQty: grnRequiresLab ? 0 : grnQty,
      rejectedQty: 0,
      requiresLabTesting: grnRequiresLab,
      labTestStatus: grnRequiresLab ? 'Under Quarantine' : 'Passed',
      stockPosted: !grnRequiresLab,
    });
    setShowGRNModal(false);
  };

  const handleApproveQuarantine = (id: string) => {
    updateGRNInspection(id, {
      labTestStatus: 'Passed',
      acceptedQty: 25,
      stockPosted: true,
    });
    alert('Laboratory 28-day compressive/tensile strength verified! Material posted into active stock.');
  };

  const runRateAnalysis = () => {
    setAiAnalyzing(true);
    setTimeout(() => {
      setAiAnalyzing(false);
      setAiRateResult(
        'Sharjah Landed Rate Analysis: Hollow Concrete Blockwork 200mm = AED 48.50 / m² (Includes 12.5 blocks @ AED 2.20/pc + Mortar Sand/Cement AED 6.00 + Mason Labour AED 12.00/m² + 5% Wastage Norm + 5% UAE VAT).'
      );
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Navigation Sub-Tabs */}
      <div className="glass-panel rounded-2xl border border-slate-800 p-1 flex overflow-x-auto text-xs no-print">
        {[
          { id: 'mr', name: 'Material Requisitions (MR/MAR)', icon: FilePlus2 },
          { id: 'stores', name: 'Stores & Central Yard Stock', icon: Warehouse },
          { id: 'po', name: 'Purchase Orders (5% VAT)', icon: ShoppingBag },
          { id: 'grn', name: 'Site GRN & Lab Inspection', icon: Truck },
          { id: 'recon', name: 'Material Reconciliation', icon: Scale },
          { id: 'ai', name: 'AI Quote Normalizer', icon: Sparkles },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setActiveSubPage(`proc-${tab.id}`);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold whitespace-nowrap transition ${
                isActive
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* ================= TAB 1: MATERIAL REQUISITIONS ================= */}
      {activeTab === 'mr' && (
        <div className="space-y-6">
          <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex flex-wrap justify-between items-center gap-3 bg-slate-900/60">
              <div>
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-200 flex items-center gap-2">
                  <FilePlus2 className="w-4 h-4 text-amber-400" />
                  3-Tier Taxonomy Material Demand Logging (MR / MAR)
                </h3>
                <p className="text-[11px] text-slate-400">
                  Standardized 18-category construction taxonomy hierarchy with multi-store yard balance checks.
                </p>
              </div>
              <button
                onClick={() => setShowMRModal(true)}
                className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition shadow"
              >
                <Plus className="w-3.5 h-3.5" /> Raise Material Requisition
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 text-slate-400 uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Req ID & Date</th>
                    <th className="p-3">Taxonomy Hierarchy</th>
                    <th className="p-3">Material Specification</th>
                    <th className="p-3">WBS / Target Site</th>
                    <th className="p-3 text-right">Req. Qty</th>
                    <th className="p-3 text-right">Yard Stock</th>
                    <th className="p-3 text-center">Status</th>
                    <th className="p-3 text-center no-print">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {materialRequisitions.map((mr) => (
                    <tr key={mr.id} className="hover:bg-slate-900/40">
                      <td className="p-3 font-mono text-blue-400">
                        {mr.id}
                        <span className="block text-[10px] text-slate-500">{mr.date}</span>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[10px] font-bold">
                          {mr.mainCategory}
                        </span>
                        <span className="block text-[10px] text-slate-400 mt-0.5">{mr.subCategory}</span>
                      </td>
                      <td className="p-3 font-semibold text-slate-200">{mr.itemSpec}</td>
                      <td className="p-3 font-mono text-slate-400">
                        {mr.wbs}
                        <span className="block text-[10px] text-slate-500">{mr.targetSite}</span>
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-slate-100">
                        {mr.reqQty.toLocaleString()} {mr.unit}
                      </td>
                      <td className="p-3 text-right font-mono text-amber-400">
                        {mr.yardStock ? `${mr.yardStock} in Yard` : 'Direct Pour'}
                      </td>
                      <td className="p-3 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {mr.status}
                        </span>
                      </td>
                      <td className="p-3 text-center no-print">
                        <button
                          onClick={() => {
                            setPoItem(mr.itemSpec);
                            setActiveTab('po');
                            setShowPOModal(true);
                          }}
                          className="px-2.5 py-1 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 rounded text-[11px] transition font-semibold"
                        >
                          Issue PO
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

      {/* ================= TAB 2: STORES & YARD INVENTORY ================= */}
      {activeTab === 'stores' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-bold">Saja&apos;a Industrial Central Yard</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
                  CENTRAL HUB
                </span>
              </div>
              <div className="text-xl font-bold font-mono text-emerald-400">
                {stockState.rebarSajaa} MT Rebar | {stockState.blockSajaa.toLocaleString()} Blocks
              </div>
              <p className="text-[10px] text-slate-500">
                Primary steel fabrication & aluminium Mivan formwork storage
              </p>
            </div>

            <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-bold">Aljada Site Store (Site 01)</span>
                <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[10px] font-bold">
                  ACTIVE TOWER
                </span>
              </div>
              <div className="text-xl font-bold font-mono text-blue-400">
                {stockState.rebarAljada} MT Steel | {stockState.blockAljada.toLocaleString()} Blocks
              </div>
              <p className="text-[10px] text-slate-500">3-day operational concrete & rebar buffer</p>
            </div>

            <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-bold">Muwaileh Complex Store (Site 02)</span>
                <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 text-[10px] font-bold">
                  ACTIVE SITE
                </span>
              </div>
              <div className="text-xl font-bold font-mono text-purple-400">
                {stockState.rebarMuwaileh} MT Steel | {stockState.blockMuwaileh.toLocaleString()} Blocks
              </div>
              <p className="text-[10px] text-slate-500">Optimal buffer balance</p>
            </div>
          </div>

          <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/60">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-200">
                Live Multi-Site Stock Ledger Matrix
              </h3>
              <button
                onClick={() => setShowTransferModal(true)}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition shadow"
              >
                <ArrowLeftRight className="w-3.5 h-3.5" /> Issue Inter-Site Transfer Note
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 text-slate-400 uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Item Specification</th>
                    <th className="p-3 text-right">Saja&apos;a Yard (Hub)</th>
                    <th className="p-3 text-right">Aljada Site Store</th>
                    <th className="p-3 text-right">Muwaileh Site Store</th>
                    <th className="p-3 text-right">Total UAE Stock</th>
                    <th className="p-3 text-center">Buffer Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  <tr className="hover:bg-slate-900/40">
                    <td className="p-3 font-sans font-bold text-slate-200">Rebar Steel Grade 500B (20mm)</td>
                    <td className="p-3 text-right text-emerald-400 font-bold">{stockState.rebarSajaa} MT</td>
                    <td className="p-3 text-right text-blue-400">{stockState.rebarAljada} MT</td>
                    <td className="p-3 text-right text-purple-400">{stockState.rebarMuwaileh} MT</td>
                    <td className="p-3 text-right font-bold text-slate-100">
                      {stockState.rebarSajaa + stockState.rebarAljada + stockState.rebarMuwaileh} MT
                    </td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-sans font-bold">
                        Optimal
                      </span>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-900/40">
                    <td className="p-3 font-sans font-bold text-slate-200">Hollow Concrete Blocks 200mm (12.5N)</td>
                    <td className="p-3 text-right text-emerald-400 font-bold">{stockState.blockSajaa.toLocaleString()} Pcs</td>
                    <td className="p-3 text-right text-blue-400">{stockState.blockAljada.toLocaleString()} Pcs</td>
                    <td className="p-3 text-right text-purple-400">{stockState.blockMuwaileh.toLocaleString()} Pcs</td>
                    <td className="p-3 text-right font-bold text-slate-100">
                      {(stockState.blockSajaa + stockState.blockAljada + stockState.blockMuwaileh).toLocaleString()} Pcs
                    </td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[10px] font-sans font-bold">
                        Reorder Aljada
                      </span>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-900/40">
                    <td className="p-3 font-sans font-bold text-slate-200">Mivan Aluminium Wall Tie Rods & PVC Cones</td>
                    <td className="p-3 text-right text-emerald-400 font-bold">{stockState.mivanSajaa.toLocaleString()} Pcs</td>
                    <td className="p-3 text-right text-blue-400">{stockState.mivanAljada.toLocaleString()} Pcs</td>
                    <td className="p-3 text-right text-purple-400">{stockState.mivanMuwaileh.toLocaleString()} Pcs</td>
                    <td className="p-3 text-right font-bold text-slate-100">
                      {(stockState.mivanSajaa + stockState.mivanAljada + stockState.mivanMuwaileh).toLocaleString()} Pcs
                    </td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-sans font-bold">
                        Optimal
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: PURCHASE ORDERS ================= */}
      {activeTab === 'po' && (
        <div className="space-y-6">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-200 flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-amber-400" /> Purchase Orders (PO) with 5% UAE VAT
                </h3>
                <p className="text-[11px] text-slate-400">Formal commitments issued to UAE suppliers with delivery schedules.</p>
              </div>
              <button
                onClick={() => setShowPOModal(true)}
                className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition shadow"
              >
                <Plus className="w-3.5 h-3.5" /> Draft Purchase Order
              </button>
            </div>

            <div className="space-y-3">
              {purchaseOrders.map((po) => (
                <div key={po.id} className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex flex-wrap justify-between items-center gap-2">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-bold text-amber-400">{po.id}</span>
                      <span className="font-bold text-slate-200 text-xs">{po.supplier}</span>
                      <span className="text-[10px] text-slate-500 font-mono">TRN: {po.trn}</span>
                    </div>
                    <div className="font-mono text-right text-xs">
                      <span className="text-slate-400">Total (incl. 5% VAT):</span>{' '}
                      <strong className="text-emerald-400 text-sm">AED {po.totalWithVat.toLocaleString()}</strong>
                    </div>
                  </div>
                  <div className="text-xs text-slate-300 flex justify-between pt-1 border-t border-slate-800/80">
                    <span>Scope: {po.items}</span>
                    <span className="text-amber-400 font-bold">{po.deliveryStatus}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 4: GRN & QA QUARANTINE ================= */}
      {activeTab === 'grn' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quarantine Testing Hold */}
            <div className="glass-panel p-5 rounded-2xl border border-amber-500/30 bg-amber-500/5 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-xs uppercase tracking-wider text-amber-300 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" /> Lab Testing Quarantine Hold
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold">
                  {grnInspections.filter((g) => g.labTestStatus === 'Under Quarantine').length} Lots
                </span>
              </div>

              {grnInspections
                .filter((g) => g.labTestStatus === 'Under Quarantine')
                .map((q) => (
                  <div key={q.id} className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 text-xs space-y-2">
                    <div className="flex justify-between font-mono text-amber-400">
                      <span>{q.id}</span>
                      <span>{q.date}</span>
                    </div>
                    <div className="font-bold text-slate-200">{q.item}</div>
                    <p className="text-[10px] text-amber-200/80 italic">
                      7-day tensile test report pending certification from Sharjah Municipality Independent Lab.
                    </p>
                    <div className="pt-2 flex gap-2">
                      <button
                        onClick={() => handleApproveQuarantine(q.id)}
                        className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-bold transition"
                      >
                        Accept & Move to Stock
                      </button>
                    </div>
                  </div>
                ))}
            </div>

            {/* Accepted GRN Log Table */}
            <div className="lg:col-span-2 glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-200">
                  Accepted Goods Receipt Notes (GRN) Log
                </h3>
                <button
                  onClick={() => setShowGRNModal(true)}
                  className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold transition"
                >
                  <Plus className="w-3.5 h-3.5 inline mr-1" /> Record Delivery
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900 text-slate-400 uppercase text-[10px]">
                    <tr>
                      <th className="p-2.5">GRN #</th>
                      <th className="p-2.5">PO Ref</th>
                      <th className="p-2.5">Item Delivered</th>
                      <th className="p-2.5 text-right">Accepted Qty</th>
                      <th className="p-2.5">Posting Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {grnInspections
                      .filter((g) => g.stockPosted)
                      .map((g) => (
                        <tr key={g.id}>
                          <td className="p-2.5 font-mono text-blue-400 font-bold">{g.id}</td>
                          <td className="p-2.5 font-mono text-slate-400">{g.poRef}</td>
                          <td className="p-2.5 text-slate-200">{g.item}</td>
                          <td className="p-2.5 text-right font-mono text-emerald-400 font-bold">{g.acceptedQty}</td>
                          <td className="p-2.5">
                            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
                              Stock Posted
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

      {/* ================= TAB 5: MATERIAL RECONCILIATION ================= */}
      {activeTab === 'recon' && (
        <div className="space-y-6">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <Scale className="w-4 h-4 text-amber-400" /> Material Reconciliation & Wastage Analytics vs UAE Norms
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 text-slate-400 uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Material Category</th>
                    <th className="p-3 text-right">BOQ Estimated</th>
                    <th className="p-3 text-right">Received via GRN</th>
                    <th className="p-3 text-right">In-Situ Executed</th>
                    <th className="p-3 text-right">Allowable UAE Norm</th>
                    <th className="p-3 text-right">Actual Wastage</th>
                    <th className="p-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  <tr className="hover:bg-slate-900/40">
                    <td className="p-3 font-sans font-bold text-slate-200">Ready Mix Concrete C40/50 SRC</td>
                    <td className="p-3 text-right text-slate-400">14,200 m³</td>
                    <td className="p-3 text-right text-slate-200">6,800 m³</td>
                    <td className="p-3 text-right text-slate-200">6,700 m³</td>
                    <td className="p-3 text-right text-cyan-400">1.50% Norm</td>
                    <td className="p-3 text-right text-emerald-400 font-bold">1.48%</td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-sans font-bold">
                        Within Norm
                      </span>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-900/40">
                    <td className="p-3 font-sans font-bold text-slate-200">Deformed Rebar Steel Grade 500B</td>
                    <td className="p-3 text-right text-slate-400">1,850 MT</td>
                    <td className="p-3 text-right text-slate-200">890 MT</td>
                    <td className="p-3 text-right text-slate-200">868 MT</td>
                    <td className="p-3 text-right text-cyan-400">2.50% Norm</td>
                    <td className="p-3 text-right text-emerald-400 font-bold">2.48%</td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-sans font-bold">
                        Within Norm
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 6: AI QUOTE NORMALIZER ================= */}
      {activeTab === 'ai' && (
        <div className="space-y-6">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" /> SAM AI Quotation Normalizer & Landed Cost Optimizer
              </h3>
              <span className="text-[10px] bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded border border-amber-500/20 font-mono">
                UAE Rate Engine Active
              </span>
            </div>

            <p className="text-slate-400 leading-relaxed">
              Normalize quotes across ready-mix batching plants, steel mills, and MEP vendors into AED landed costs including freight, pump charges, cube testing allowances, and 5% UAE VAT.
            </p>

            <button
              onClick={runRateAnalysis}
              disabled={aiAnalyzing}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl transition flex items-center gap-2"
            >
              <Cpu className="w-4 h-4" />
              <span>{aiAnalyzing ? 'Analyzing Landed UAE Prices...' : 'Run Sharjah Blockwork & Concrete Rate Analysis'}</span>
            </button>

            {aiRateResult && (
              <div className="p-4 bg-slate-900/80 rounded-xl border border-amber-500/30 text-amber-200 font-mono leading-relaxed animate-in fade-in">
                {aiRateResult}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MR Modal */}
      {showMRModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="glass-panel rounded-2xl border border-slate-800 p-6 max-w-lg w-full space-y-4 text-xs">
            <h3 className="font-bold text-sm text-slate-100">Raise Material Requisition (MR / MAR)</h3>
            <form onSubmit={handleSaveMR} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Taxonomy Category</label>
                  <select
                    value={mrCat}
                    onChange={(e) => setMrCat(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 font-bold"
                  >
                    <option value="Civil & Structural">Civil & Structural</option>
                    <option value="Waterproofing Systems">Waterproofing Systems</option>
                    <option value="Aluminium Formwork (Mivan)">Aluminium Formwork (Mivan)</option>
                    <option value="Architectural & Finishes">Architectural & Finishes</option>
                    <option value="MEP & Plumbing">MEP & Plumbing</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Sub-Category</label>
                  <input
                    type="text"
                    value={mrSubCat}
                    onChange={(e) => setMrSubCat(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-400 font-bold mb-1">Specification *</label>
                <input
                  type="text"
                  required
                  value={mrSpec}
                  onChange={(e) => setMrSpec(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 font-semibold"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">WBS Code</label>
                  <input
                    type="text"
                    value={mrWbs}
                    onChange={(e) => setMrWbs(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Quantity</label>
                  <input
                    type="number"
                    required
                    value={mrQty}
                    onChange={(e) => setMrQty(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Unit</label>
                  <input
                    type="text"
                    required
                    value={mrUnit}
                    onChange={(e) => setMrUnit(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button type="button" onClick={() => setShowMRModal(false)} className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-1.5 bg-amber-600 text-white font-bold rounded-lg">
                  Save Requisition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Transfer Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="glass-panel rounded-2xl border border-slate-800 p-6 max-w-md w-full space-y-4 text-xs">
            <h3 className="font-bold text-sm text-slate-100">Issue Inter-Site Transfer Note</h3>
            <form onSubmit={handleExecuteTransfer} className="space-y-3">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Material to Transfer</label>
                <select
                  value={tItem}
                  onChange={(e) => setTItem(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 font-bold"
                >
                  <option value="Rebar Grade 500B (20mm)">Rebar Grade 500B (20mm)</option>
                  <option value="Hollow Concrete Blocks 200mm">Hollow Concrete Blocks 200mm</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-400 font-bold mb-1">Destination Site Store</label>
                <select
                  value={tDest}
                  onChange={(e) => setTDest(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 font-bold"
                >
                  <option value="Aljada Site Store">Aljada Site Store (Site 01)</option>
                  <option value="Muwaileh Complex Store">Muwaileh Complex Store (Site 02)</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-400 font-bold mb-1">Transfer Quantity</label>
                <input
                  type="number"
                  required
                  value={tQty}
                  onChange={(e) => setTQty(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 font-mono font-bold"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button type="button" onClick={() => setShowTransferModal(false)} className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-1.5 bg-emerald-600 text-white font-bold rounded-lg">
                  Execute Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PO Modal */}
      {showPOModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="glass-panel rounded-2xl border border-slate-800 p-6 max-w-md w-full space-y-4 text-xs">
            <h3 className="font-bold text-sm text-slate-100">Draft Purchase Order (5% UAE VAT)</h3>
            <form onSubmit={handleSavePO} className="space-y-3">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Supplier</label>
                <input
                  type="text"
                  required
                  value={poSupplier}
                  onChange={(e) => setPoSupplier(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-bold mb-1">15-Digit UAE TRN</label>
                <input
                  type="text"
                  required
                  value={poTrn}
                  onChange={(e) => setPoTrn(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-bold mb-1">Item Scope</label>
                <input
                  type="text"
                  required
                  value={poItem}
                  onChange={(e) => setPoItem(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 font-bold"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-bold mb-1">Subtotal (AED excl. VAT)</label>
                <input
                  type="number"
                  required
                  value={poSubtotal}
                  onChange={(e) => setPoSubtotal(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 font-mono font-bold text-slate-100"
                />
              </div>
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 font-mono text-[11px] flex justify-between">
                <span>Total with 5% VAT:</span>
                <span className="text-emerald-400 font-bold">AED {(poSubtotal * 1.05).toLocaleString()}</span>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button type="button" onClick={() => setShowPOModal(false)} className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-1.5 bg-amber-600 text-white font-bold rounded-lg">
                  Issue PO
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GRN Modal */}
      {showGRNModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="glass-panel rounded-2xl border border-slate-800 p-6 max-w-md w-full space-y-4 text-xs">
            <h3 className="font-bold text-sm text-slate-100">Record Site Delivery (GRN)</h3>
            <form onSubmit={handleSaveGRN} className="space-y-3">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Item Delivered</label>
                <input
                  type="text"
                  required
                  value={grnItem}
                  onChange={(e) => setGrnItem(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-bold mb-1">Delivered Quantity</label>
                <input
                  type="number"
                  required
                  value={grnQty}
                  onChange={(e) => setGrnQty(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 font-mono font-bold"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={grnRequiresLab}
                    onChange={(e) => setGrnRequiresLab(e.target.checked)}
                    className="rounded text-amber-500"
                  />
                  <span>Send to Independent Test Lab Quarantine (Cube/Tensile Test)</span>
                </label>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button type="button" onClick={() => setShowGRNModal(false)} className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-1.5 bg-amber-600 text-white font-bold rounded-lg">
                  Log GRN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
