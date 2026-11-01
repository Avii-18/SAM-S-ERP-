import React, { useState, useEffect, useRef } from 'react';
import {
  CheckCircle2,
  FileCheck,
  Truck,
  Layers,
  FileText,
  Sliders,
  Plus,
  Printer,
  Download,
  AlertTriangle,
  Building2,
  ShieldCheck,
  Check,
  X,
  Wrench,
  Search,
} from 'lucide-react';
import Chart from 'chart.js/auto';

// Predefined 11 Trade Checklists per UAE / Sharjah Baladiya Standards
const TRADE_CHECKLISTS: Record<
  string,
  {
    title: string;
    formNo: string;
    items: Array<{ desc: string; status: 'OK' | 'FAIL' | 'NA'; remarks: string }>;
  }
> = {
  reinforcement: {
    title: 'CONSTRUCTION INSPECTION REPORT - REINFORCEMENT STEEL (BS 4449)',
    formNo: 'QAQC-SHJ-01',
    items: [
      { desc: 'Rebar Grade verified against specs (High-Yield Deformed Steel Grade B500B / BS 4449).', status: 'OK', remarks: 'Mill cert verified' },
      { desc: 'Rebar bar diameter, layout, pitch, and spacing match approved IFC drawing details.', status: 'OK', remarks: 'Compliant' },
      { desc: 'Adequate concrete cover spacers (heavy-duty concrete blocks) placed as specified (50mm).', status: 'OK', remarks: '50mm cover verified' },
      { desc: 'Lap lengths and lap locations comply with structural code requirements (65d minimum).', status: 'OK', remarks: 'Staggered laps' },
      { desc: 'Rebar tying wire firmly tied; thread-capped coupler connections properly torque-checked.', status: 'OK', remarks: 'Couplers torque checked' },
      { desc: 'Cleanliness of rebar: Free from loose rust, oil, grease, paint, or hardened laitance.', status: 'OK', remarks: 'Air-blown clean' },
      { desc: 'Embedded items, starter bars, and MEP sleeve penetrations tied securely prior to pour.', status: 'OK', remarks: 'Sleeves verified' },
    ],
  },
  formwork: {
    title: 'CONSTRUCTION INSPECTION REPORT - FORMWORK & SHUTTERING (BS 5975)',
    formNo: 'QAQC-SHJ-02',
    items: [
      { desc: 'Formwork dimensions, line, plumb, level, and squareness checked from survey bench marks.', status: 'OK', remarks: 'Total Station verified' },
      { desc: 'Rigidity and adequacy of shoring props, cup-lock bracing, and tie-rods to withstand wet concrete pressure.', status: 'OK', remarks: 'Props locked' },
      { desc: 'Plywood condition clean, coated with approved non-staining release mould oil.', status: 'OK', remarks: 'Release agent applied' },
      { desc: 'Formwork joints sealed with foam tape to prevent grout leakage during vibration.', status: 'OK', remarks: 'Fully sealed' },
      { desc: 'Clean-out pockets provided at core wall base and debris thoroughly removed.', status: 'OK', remarks: 'Inspected' },
    ],
  },
  pourcard: {
    title: 'CONCRETE POUR CARD & CASTING PERMIT (BS EN 12390 / UAE TEMP CODE)',
    formNo: 'QAQC-SHJ-03',
    items: [
      { desc: 'Approved Formwork and Reinforcement WIR sign-offs completed by Consultant.', status: 'OK', remarks: 'WIR approved' },
      { desc: 'Batching plant mix design C50/60 approved; transit mixer delivery interval planned.', status: 'OK', remarks: 'Mix C50/60' },
      { desc: 'Fresh concrete arrival temperature strictly controlled below 32°C (UAE Hot Weather Rule).', status: 'OK', remarks: 'Ice water used at plant' },
      { desc: 'Slump test within specified range (150-180mm flowable mix for congested core walls).', status: 'OK', remarks: 'Slump 170mm' },
      { desc: 'Cube sampling prepared per BS EN 12390 (Min 6 cubes cast per 50m³ or pour fraction).', status: 'OK', remarks: '6 Cubes taken' },
      { desc: 'Vibrators (primary and standby) available; curing water tanks/hessian cloth ready.', status: 'OK', remarks: '3 Poker vibrators on site' },
    ],
  },
  excavation: {
    title: 'FOUNDATION EXCAVATION & SHORING INSPECTION REPORT (SHJ BALADIYA)',
    formNo: 'QAQC-SHJ-04',
    items: [
      { desc: 'Sharjah Municipality excavation & trial pit NOC verified with existing utility maps.', status: 'OK', remarks: 'Baladiya NOC Active' },
      { desc: 'Shoring pile wall deflection sensors and anchors tension-tested per geotechnical report.', status: 'OK', remarks: 'Deflection < 3mm' },
      { desc: 'Soil bearing capacity verified by third-party geotechnical engineer prior to raft blinding.', status: 'OK', remarks: 'Bearing 250 kPa' },
      { desc: 'Safety perimeter fencing and warning lighting installed around deep excavation.', status: 'OK', remarks: 'HSE clear' },
    ],
  },
  waterproofing: {
    title: 'WATERPROOFING & SUNK SLAB PONDING TEST REPORT (24-48 HR TEST)',
    formNo: 'QAQC-SHJ-08',
    items: [
      { desc: 'Substrate surface cleaned, smoothed, and angle fillets (50x50mm) prepared at junctions.', status: 'OK', remarks: 'Fillets done' },
      { desc: 'Approved SBS modified bituminous membrane (4mm thick) applied with 100mm overlaps.', status: 'OK', remarks: 'Torch-applied' },
      { desc: 'Water tightness tested by 48-hour continuous ponding test (water depth min 100mm).', status: 'OK', remarks: 'No leak observed' },
      { desc: 'Protection screed (50mm thick) laid immediately after consultant leak test sign-off.', status: 'OK', remarks: 'Screed cast' },
    ],
  },
  plumbing: {
    title: 'PLUMBING & DRAINAGE PIPING INSPECTION REPORT (SEWA / BALADIYA)',
    formNo: 'QAQC-SHJ-09',
    items: [
      { desc: 'PPR pressure water pipes installed per SEWA guidelines and hydrostatic tested (1.5x pressure).', status: 'OK', remarks: '15 Bar tested' },
      { desc: 'UPVC drainage pipes laid with required gradient slope towards main SEWA inspection manhole.', status: 'OK', remarks: '1:100 slope verified' },
      { desc: 'Pipe sleeves provided through structural beams with approved fire-stop sealants.', status: 'OK', remarks: 'Fire-stopped' },
    ],
  },
};

export const QAQCWorkspace: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'checklists' | 'rmc' | 'steel' | 'commercial' | 'settings'>('dashboard');

  // Checklist state
  const [selectedTrade, setSelectedTrade] = useState('reinforcement');
  const [checklistItems, setChecklistItems] = useState(TRADE_CHECKLISTS.reinforcement.items);
  const [reportNo, setReportNo] = useState('WIR-SHJ-2026-088');
  const [location, setLocation] = useState('Level 12 - Core Wall & Slab Pour 2');
  const [dwgRef, setDwgRef] = useState('DWG-SHJ-STR-L12-04');
  const [inspectorName, setInspectorName] = useState('Eng. Rajesh Kumar');
  const [pmName, setPmName] = useState('Eng. Ahmad Al-Mansoori');
  const [consultantName, setConsultantName] = useState('Eng. Tariq CECC');

  // RMC Delivery and Cube Tests
  const [rmcDeliveries, setRmcDeliveries] = useState([
    { id: 1, date: '2026-10-30 08:30', plant: 'Unimix Sharjah', challan: 'CH-SHJ-8812', truck: 'SHJ 45120', grade: 'C50/60 OPC', loc: 'Level 12 Core Wall', qty: 12, temp: 28, slump: 175 },
    { id: 2, date: '2026-10-30 09:15', plant: 'Unimix Sharjah', challan: 'CH-SHJ-8813', truck: 'SHJ 45121', grade: 'C50/60 OPC', loc: 'Level 12 Core Wall', qty: 12, temp: 29, slump: 170 },
  ]);

  const [cubeTests, setCubeTests] = useState([
    { id: 1, cdate: '2026-10-02', refId: 'CUBE-L11-001', elem: 'Level 11 Columns', grade: 'C50/60', lab: 'Element Materials Lab Sharjah', age: '28-Day', load: 1350, str: 58.5, status: 'PASS' },
    { id: 2, cdate: '2026-10-23', refId: 'CUBE-L12-001', elem: 'Level 12 Core Wall', grade: 'C50/60', lab: 'Element Materials Lab Sharjah', age: '7-Day', load: 980, str: 41.2, status: 'PASS' },
  ]);

  const [steelShipments, setSteelShipments] = useState([
    { id: 1, date: '2026-10-25', challan: 'STL-SHJ-9012', brand: 'Emirates Steel Arkan', grade: 'Grade B500B', dia: 'T12-T32', wt: 48, millCert: 'Verified', labTest: 'Passed / Certified' },
  ]);

  const [ipcBills, setIpcBills] = useState([
    { id: 1, ipcNo: 'IPC-SHJ-SUB-005', sub: 'Sharjah Rebar Steel Fixing LLC', scope: 'Rebar Cutting & Fixing', loc: 'Level 11-12 Core', claim: 125000, qcClear: 'Cleared 100%', cert: 118000 },
  ]);

  // Chart Canvas Refs
  const itpCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const itpChartInstance = useRef<Chart | null>(null);

  const cubesCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const cubesChartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (TRADE_CHECKLISTS[selectedTrade]) {
      setChecklistItems(TRADE_CHECKLISTS[selectedTrade].items);
    }
  }, [selectedTrade]);

  useEffect(() => {
    if (activeTab === 'dashboard') {
      if (itpCanvasRef.current) {
        if (itpChartInstance.current) itpChartInstance.current.destroy();
        itpChartInstance.current = new Chart(itpCanvasRef.current, {
          type: 'bar',
          data: {
            labels: ['Reinforcement', 'Formwork', 'Concrete Pour', 'Waterproofing', 'MEP Riser', 'Blockwork'],
            datasets: [
              { label: 'Passed Inspections', data: [42, 38, 30, 22, 18, 15], backgroundColor: '#43856B' },
              { label: 'Pending Consultant Signoff', data: [3, 2, 1, 2, 1, 2], backgroundColor: '#C18A43' },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: { ticks: { color: '#77746D' }, grid: { color: 'rgba(226, 216, 203, 0.6)' } },
              x: { ticks: { color: '#77746D' }, grid: { display: false } },
            },
          },
        });
      }

      if (cubesCanvasRef.current) {
        if (cubesChartInstance.current) cubesChartInstance.current.destroy();
        cubesChartInstance.current = new Chart(cubesCanvasRef.current, {
          type: 'pie',
          data: {
            labels: ['BS EN Pass (>50 N/mm²)', 'Early Age 7-Day Pass', 'Awaiting 28-Day Test'],
            datasets: [
              {
                data: [85, 12, 3],
                backgroundColor: ['#43856B', '#826B52', '#B69A70'],
                borderWidth: 2,
                borderColor: '#FFFFFF',
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom', labels: { font: { size: 10 }, color: '#27332F' } } },
          },
        });
      }
    }

    return () => {
      if (itpChartInstance.current) {
        itpChartInstance.current.destroy();
        itpChartInstance.current = null;
      }
      if (cubesChartInstance.current) {
        cubesChartInstance.current.destroy();
        cubesChartInstance.current = null;
      }
    };
  }, [activeTab]);

  return (
    <div className="space-y-6 text-[#27332F] pb-12">
      {/* 1. Header Banner */}
      <div className="bg-white rounded-2xl border border-[#E2D8CB] p-5 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#27332F] text-[#B69A70] flex items-center justify-center font-bold shadow-sm shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#F2EDE5] text-[#826B52] border border-[#E2D8CB]">
                SHARJAH QA/QC & STATUTORY COMPLIANCE • SUITE
              </span>
              <span className="text-xs text-[#77746D]">|</span>
              <span className="text-xs text-[#43856B] font-semibold">BS EN 12390 & Grade B500B Rebar</span>
            </div>
            <h1 className="text-xl md:text-2xl font-extrabold text-[#27332F] tracking-tight mt-0.5">
              Site Operations & QA/QC Quality ERP
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('checklists')}
            className="bg-[#27332F] hover:bg-[#1a2320] text-white text-xs font-bold px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow-sm transition"
          >
            <FileCheck className="w-3.5 h-3.5 text-[#B69A70]" /> Open Checklist Generator
          </button>
        </div>
      </div>

      {/* 2. Submodule Tab Bar */}
      <div className="bg-white rounded-xl border border-[#E2D8CB] p-1.5 shadow-xs overflow-x-auto custom-scrollbar">
        <div className="flex items-center gap-1 min-w-max">
          {[
            { id: 'dashboard', name: '1. Executive Legal Dashboard', icon: ShieldCheck },
            { id: 'checklists', name: '2. QA/QC Checklist Generator', icon: FileCheck },
            { id: 'rmc', name: '3. RMC Delivery & Cube Tests', icon: Truck },
            { id: 'steel', name: '4. Steel Rebar & Tensile Tests', icon: Layers },
            { id: 'commercial', name: '5. Subcontractor IPC Billing', icon: FileText },
            { id: 'settings', name: '6. Sharjah Authority Config', icon: Sliders },
          ].map((tab) => {
            const Icon = tab.icon;
            const isCurr = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 ${
                  isCurr
                    ? 'bg-[#27332F] text-white shadow-xs'
                    : 'text-[#77746D] hover:text-[#27332F] hover:bg-[#F5F0E8]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isCurr ? 'text-[#B69A70]' : 'text-[#826B52]'}`} />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= TAB 1: EXECUTIVE LEGAL DASHBOARD ================= */}
      {activeTab === 'dashboard' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          {/* Authorities Status Banner */}
          <div className="bg-[#27332F] text-white p-4 rounded-xl border border-[#B69A70]/30 shadow-xs flex flex-wrap justify-between items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-[#B69A70] text-[#27332F] font-extrabold text-[10px] px-2 py-0.5 rounded">
                  REGIONAL LEGAL MATRIX
                </span>
                <h3 className="font-bold text-sm">Aljada Residential Tower - Sharjah (PRJ-SHJ-2026-01)</h3>
              </div>
              <p className="text-xs text-[#E2D8CB] mt-1">
                Sharjah Municipality Building Permit No: <span className="font-mono text-[#B69A70] font-bold">SHJ-MUN-2026-8812</span> | Consultant: CECC UAE
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="bg-[#43856B]/20 border border-[#43856B]/40 text-[#43856B] px-2.5 py-1 rounded-lg font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Baladiya Permit Active
              </span>
              <span className="bg-[#43856B]/20 border border-[#43856B]/40 text-[#43856B] px-2.5 py-1 rounded-lg font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> SCD Civil Defense NOC
              </span>
              <span className="bg-[#826B52]/20 border border-[#826B52]/40 text-[#B69A70] px-2.5 py-1 rounded-lg font-bold flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5" /> SEWA Power NOC
              </span>
            </div>
          </div>

          {/* 6 KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
            <div className="bg-white p-4 rounded-xl shadow-xs border border-[#E2D8CB]">
              <span className="text-[10px] text-[#77746D] block font-bold uppercase tracking-wider">Active ITP Checks</span>
              <span className="text-xl font-extrabold text-[#27332F] block mt-1">24</span>
              <span className="text-[10px] text-[#43856B] font-semibold block mt-0.5">100% Inspection Hold</span>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-xs border border-[#E2D8CB]">
              <span className="text-[10px] text-[#77746D] block font-bold uppercase tracking-wider">Open Quality NCRs</span>
              <span className="text-xl font-extrabold text-[#B85C50] block mt-1">1</span>
              <span className="text-[10px] text-[#77746D] block mt-0.5">Corrective Action Active</span>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-xs border border-[#E2D8CB]">
              <span className="text-[10px] text-[#77746D] block font-bold uppercase tracking-wider">28-Day Concrete Cubes</span>
              <span className="text-xl font-extrabold text-[#43856B] block mt-1">98.5%</span>
              <span className="text-[10px] text-[#77746D] block mt-0.5">BS EN 12390 Compliant</span>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-xs border border-[#E2D8CB]">
              <span className="text-[10px] text-[#77746D] block font-bold uppercase tracking-wider">Steel Rebar Received</span>
              <span className="text-xl font-extrabold text-[#826B52] block mt-1">480 MT</span>
              <span className="text-[10px] text-[#77746D] block mt-0.5">Grade B500B / BS 4449</span>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-xs border border-[#E2D8CB]">
              <span className="text-[10px] text-[#77746D] block font-bold uppercase tracking-wider">Midday Break Log</span>
              <span className="text-xl font-extrabold text-[#C18A43] block mt-1">Compliant</span>
              <span className="text-[10px] text-[#77746D] block mt-0.5">MoHRE Summer Rule</span>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-xs border border-[#E2D8CB]">
              <span className="text-[10px] text-[#77746D] block font-bold uppercase tracking-wider">IPC Billing Verified</span>
              <span className="text-xl font-extrabold text-[#43856B] block mt-1">AED 2.45M</span>
              <span className="text-[10px] text-[#77746D] block mt-0.5">Consultant Certified</span>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 bg-white p-5 rounded-xl shadow-xs border border-[#E2D8CB]">
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#27332F] mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#43856B]" /> Inspection Test Plan (ITP) Status by Trade
              </h3>
              <div className="h-64">
                <canvas ref={itpCanvasRef} />
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-xs border border-[#E2D8CB]">
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#27332F] mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#826B52]" /> Concrete Cube 28-Day Strength Distribution
              </h3>
              <div className="h-64">
                <canvas ref={cubesCanvasRef} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: QA/QC CHECKLIST GENERATOR ================= */}
      {activeTab === 'checklists' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Controls Bar */}
          <div className="bg-white p-4 rounded-xl border border-[#E2D8CB] flex flex-wrap justify-between items-center gap-3 no-print">
            <div className="flex flex-wrap items-center gap-2.5">
              <label className="text-xs font-bold text-[#77746D]">Select Trade Inspection Template:</label>
              <select
                value={selectedTrade}
                onChange={(e) => setSelectedTrade(e.target.value)}
                className="bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg px-3 py-1.5 text-xs font-bold text-[#27332F]"
              >
                <option value="reinforcement">Reinforcement Steel Works (Grade B500B / BS 4449)</option>
                <option value="formwork">Formwork & Shuttering (BS 5975 / Sharjah Code)</option>
                <option value="pourcard">Concrete Pour Card (M20-M60 Mix / Slump Control)</option>
                <option value="excavation">Foundation & Excavation / Shoring Work</option>
                <option value="waterproofing">Waterproofing & Sunk Slab Testing (Ponding Test)</option>
                <option value="plumbing">Plumbing & Drainage (SEWA Standards)</option>
              </select>
            </div>
            <button
              onClick={() => window.print()}
              className="bg-[#27332F] hover:bg-[#1a2320] text-white font-bold text-xs px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="w-3.5 h-3.5 text-[#B69A70]" /> Print Official Report
            </button>
          </div>

          {/* Official Printable Report Frame */}
          <div className="bg-white p-6 rounded-2xl border-2 border-[#27332F] space-y-5 text-xs">
            {/* Header */}
            <div className="flex justify-between items-center border-b-2 border-[#27332F] pb-3">
              <div>
                <h2 className="text-base font-extrabold uppercase text-[#27332F] tracking-tight">
                  {TRADE_CHECKLISTS[selectedTrade]?.title || 'CONSTRUCTION INSPECTION REPORT'}
                </h2>
                <p className="text-[11px] font-semibold text-[#77746D]">
                  Sharjah Municipality Building Permit: <span className="font-mono text-[#27332F] font-bold">SHJ-MUN-2026-8812</span>
                </p>
              </div>
              <div className="text-right">
                <span className="border-2 border-[#27332F] font-bold px-2.5 py-1 text-[11px] uppercase tracking-wider inline-block">
                  FORM NO: {TRADE_CHECKLISTS[selectedTrade]?.formNo || 'QAQC-SHJ-01'}
                </span>
                <p className="text-[10px] text-[#77746D] mt-1 font-semibold">ISO 9001:2015 Compliant</p>
              </div>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 bg-[#F5F0E8] p-3.5 rounded-xl border border-[#E2D8CB] font-medium text-[#27332F]">
              <div><strong>Project:</strong> Aljada Residential Tower</div>
              <div><strong>Contractor:</strong> Meluha Construction LLC</div>
              <div><strong>Consultant:</strong> CECC Engineering Consultants</div>
              <div><strong>Report Ref:</strong> <span className="font-mono font-bold">{reportNo}</span></div>
              <div><strong>Location:</strong> {location}</div>
              <div><strong>Drawing Ref:</strong> <span className="font-mono font-bold">{dwgRef}</span></div>
              <div><strong>Date:</strong> 2026-10-30</div>
              <div><strong>Temperature:</strong> 28°C (Below 32°C Limit)</div>
            </div>

            {/* Checklist Items Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-[#E2D8CB]">
                <thead className="bg-[#27332F] text-white">
                  <tr>
                    <th className="p-2.5 w-10 text-center">#</th>
                    <th className="p-2.5">Quality Inspection Clause & Specification Standard</th>
                    <th className="p-2.5 w-36 text-center">Verification Status</th>
                    <th className="p-2.5 w-52">Observations / Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2D8CB]">
                  {checklistItems.map((item, idx) => (
                    <tr key={idx} className="hover:bg-[#F5F0E8]/50">
                      <td className="p-2.5 text-center font-bold">{idx + 1}</td>
                      <td className="p-2.5 font-medium">{item.desc}</td>
                      <td className="p-2.5 text-center">
                        <span className="bg-[#43856B]/15 text-[#43856B] px-2 py-0.5 rounded font-bold text-[10px]">
                          ✓ VERIFIED OK
                        </span>
                      </td>
                      <td className="p-2.5 text-[#77746D]">{item.remarks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Quadruple Official Signatures Panel */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t-2 border-[#27332F] text-center text-xs">
              <div className="border border-[#E2D8CB] p-3 rounded-xl bg-[#F5F0E8] space-y-2">
                <span className="font-bold block uppercase text-[10px] text-[#77746D]">Contractor QA/QC Eng.</span>
                <p className="font-bold text-[#27332F]">{inspectorName}</p>
                <span className="text-[9px] text-[#43856B] block font-semibold">✓ Signed & Verified</span>
              </div>
              <div className="border border-[#E2D8CB] p-3 rounded-xl bg-[#F5F0E8] space-y-2">
                <span className="font-bold block uppercase text-[10px] text-[#77746D]">Project Manager</span>
                <p className="font-bold text-[#27332F]">{pmName}</p>
                <span className="text-[9px] text-[#43856B] block font-semibold">✓ Authorized</span>
              </div>
              <div className="border border-[#E2D8CB] p-3 rounded-xl bg-[#F5F0E8] space-y-2">
                <span className="font-bold block uppercase text-[10px] text-[#77746D]">Consultant RE</span>
                <p className="font-bold text-[#27332F]">{consultantName}</p>
                <span className="text-[9px] text-[#43856B] block font-semibold">✓ Approved</span>
              </div>
              <div className="border border-[#E2D8CB] p-3 rounded-xl bg-[#F5F0E8] space-y-2">
                <span className="font-bold block uppercase text-[10px] text-[#77746D]">Sharjah Municipality</span>
                <p className="font-bold text-[#27332F]">Authority Review</p>
                <span className="text-[9px] text-[#43856B] block font-semibold">✓ Audit Cleared</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: RMC DELIVERIES & CUBE TESTS ================= */}
      {activeTab === 'rmc' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          <div className="bg-white p-5 rounded-xl shadow-xs border border-[#E2D8CB] space-y-3">
            <h3 className="font-bold text-sm text-[#27332F] flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#826B52]" /> Ready-Mix Concrete Delivery & Temperature Control
            </h3>
            <p className="text-xs text-[#77746D]">Arrival temperature must remain &lt;32°C per UAE Hot Weather Construction Code.</p>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-[#F5F0E8] text-[#77746D] font-bold uppercase border-b border-[#E2D8CB]">
                  <tr>
                    <th className="p-3">Date / Time</th>
                    <th className="p-3">Batching Plant</th>
                    <th className="p-3">Challan No.</th>
                    <th className="p-3">Truck No.</th>
                    <th className="p-3">Grade</th>
                    <th className="p-3">Location</th>
                    <th className="p-3">Qty (m³)</th>
                    <th className="p-3">Temp (°C)</th>
                    <th className="p-3">Slump (mm)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2D8CB] text-[#27332F]">
                  {rmcDeliveries.map((r) => (
                    <tr key={r.id} className="hover:bg-[#F5F0E8]/50">
                      <td className="p-3 font-mono text-[#77746D]">{r.date}</td>
                      <td className="p-3 font-bold">{r.plant}</td>
                      <td className="p-3 font-mono font-bold text-[#826B52]">{r.challan}</td>
                      <td className="p-3 font-semibold">{r.truck}</td>
                      <td className="p-3 font-bold text-[#43856B]">{r.grade}</td>
                      <td className="p-3">{r.loc}</td>
                      <td className="p-3 font-extrabold">{r.qty} m³</td>
                      <td className="p-3 font-extrabold text-[#43856B]">{r.temp}°C</td>
                      <td className="p-3 font-bold">{r.slump} mm</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-xs border border-[#E2D8CB] space-y-3">
            <h3 className="font-bold text-sm text-[#27332F] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#43856B]" /> Concrete Cube Compressive Strength Tests (BS EN 12390)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-[#F5F0E8] text-[#77746D] font-bold uppercase border-b border-[#E2D8CB]">
                  <tr>
                    <th className="p-3">Casting Date</th>
                    <th className="p-3">Cube Ref</th>
                    <th className="p-3">Element</th>
                    <th className="p-3">Grade</th>
                    <th className="p-3">Accredited Laboratory</th>
                    <th className="p-3">Age</th>
                    <th className="p-3">Load (kN)</th>
                    <th className="p-3">Strength (N/mm²)</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2D8CB] text-[#27332F]">
                  {cubeTests.map((c) => (
                    <tr key={c.id} className="hover:bg-[#F5F0E8]/50">
                      <td className="p-3 font-mono text-[#77746D]">{c.cdate}</td>
                      <td className="p-3 font-mono font-bold text-[#826B52]">{c.refId}</td>
                      <td className="p-3 font-bold">{c.elem}</td>
                      <td className="p-3">{c.grade}</td>
                      <td className="p-3">{c.lab}</td>
                      <td className="p-3 font-semibold">{c.age}</td>
                      <td className="p-3 font-mono font-bold">{c.load} kN</td>
                      <td className="p-3 font-extrabold text-[#43856B] text-sm">{c.str} N/mm²</td>
                      <td className="p-3">
                        <span className="bg-[#43856B]/15 text-[#43856B] px-2 py-0.5 rounded font-bold text-[10px]">
                          ✓ {c.status}
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

      {/* ================= TAB 4: STEEL REBAR ================= */}
      {activeTab === 'steel' && (
        <div className="bg-white p-5 rounded-xl shadow-xs border border-[#E2D8CB] space-y-4 animate-in fade-in duration-200">
          <h2 className="text-base font-bold text-[#27332F]">4. Steel Rebar Received & Tensile Tests (BS 4449)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#F5F0E8] text-[#77746D] font-bold uppercase border-b border-[#E2D8CB]">
                <tr>
                  <th className="p-3">Date</th>
                  <th className="p-3">Challan Ref</th>
                  <th className="p-3">Manufacturer</th>
                  <th className="p-3">Grade</th>
                  <th className="p-3">Diameter Range</th>
                  <th className="p-3">Weight (MT)</th>
                  <th className="p-3">Mill Certificate</th>
                  <th className="p-3">3rd Party Test</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2D8CB] text-[#27332F]">
                {steelShipments.map((s) => (
                  <tr key={s.id} className="hover:bg-[#F5F0E8]/50">
                    <td className="p-3 font-mono text-[#77746D]">{s.date}</td>
                    <td className="p-3 font-mono font-bold text-[#826B52]">{s.challan}</td>
                    <td className="p-3 font-bold">{s.brand}</td>
                    <td className="p-3 font-semibold">{s.grade}</td>
                    <td className="p-3 font-mono">{s.dia}</td>
                    <td className="p-3 font-extrabold text-[#27332F]">{s.wt} MT</td>
                    <td className="p-3 font-semibold text-[#43856B]">{s.millCert}</td>
                    <td className="p-3 font-bold text-[#43856B]">{s.labTest}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 5: SUBCONTRACTOR IPC BILLS ================= */}
      {activeTab === 'commercial' && (
        <div className="bg-white p-5 rounded-xl shadow-xs border border-[#E2D8CB] space-y-4 animate-in fade-in duration-200">
          <h2 className="text-base font-bold text-[#27332F]">5. Subcontractor IPC Billing & QA/QC Clearance</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#F5F0E8] text-[#77746D] font-bold uppercase border-b border-[#E2D8CB]">
                <tr>
                  <th className="p-3">IPC Ref #</th>
                  <th className="p-3">Subcontractor</th>
                  <th className="p-3">Trade Scope</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Claimed (AED)</th>
                  <th className="p-3">QA/QC Clearance</th>
                  <th className="p-3">Certified (AED)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2D8CB] text-[#27332F]">
                {ipcBills.map((b) => (
                  <tr key={b.id} className="hover:bg-[#F5F0E8]/50">
                    <td className="p-3 font-mono font-bold text-[#826B52]">{b.ipcNo}</td>
                    <td className="p-3 font-bold">{b.sub}</td>
                    <td className="p-3">{b.scope}</td>
                    <td className="p-3">{b.loc}</td>
                    <td className="p-3 font-bold">AED {b.claim.toLocaleString()}</td>
                    <td className="p-3 font-bold text-[#43856B]">{b.qcClear}</td>
                    <td className="p-3 font-extrabold text-[#43856B]">AED {b.cert.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 6: SETTINGS ================= */}
      {activeTab === 'settings' && (
        <div className="bg-white p-5 rounded-xl shadow-xs border border-[#E2D8CB] space-y-4 animate-in fade-in duration-200">
          <h2 className="text-base font-bold text-[#27332F]">6. Sharjah Local Authorities Configuration</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-[#77746D] mb-1">Project Name</label>
              <input type="text" readOnly value="Aljada Residential Tower - Block C" className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2.5 font-bold" />
            </div>
            <div>
              <label className="block font-bold text-[#77746D] mb-1">Sharjah Baladiya Permit #</label>
              <input type="text" readOnly value="SHJ-MUN-2026-8812" className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2.5 font-mono font-bold" />
            </div>
            <div>
              <label className="block font-bold text-[#77746D] mb-1">Consultant</label>
              <input type="text" readOnly value="CECC Engineering Consultants" className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2.5 font-semibold" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
