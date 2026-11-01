import React, { useState, useEffect, useRef } from 'react';
import {
  Compass,
  FileCode2,
  FolderTree,
  Ruler,
  HelpCircle,
  Archive,
  Stamp,
  Settings,
  Plus,
  Download,
  Upload,
  BarChart3,
  PieChart,
  X,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  Building,
  Check,
} from 'lucide-react';
import Chart from 'chart.js/auto';

interface DrawingItem {
  id: number;
  number: string;
  disc: string;
  title: string;
  rev: string;
  status: string;
  ref: string;
  date: string;
}

interface ShopDrawingItem {
  id: number;
  code: string;
  elem: string;
  bbs: string;
  prep: string;
  rev: string;
  appr: string;
}

interface RFIItem {
  id: number;
  no: string;
  subj: string;
  dwg: string;
  loc: string;
  date: string;
  status: 'Open' | 'Resolved';
}

interface SubmittalItem {
  id: number;
  ref: string;
  desc: string;
  brand: string;
  date: string;
  code: string;
}

interface NOCItem {
  id: number;
  auth: string;
  ref: string;
  desc: string;
  issue: string;
  exp: string;
  status: string;
}

const INITIAL_DRAWINGS: DrawingItem[] = [
  { id: 1, number: 'A-00-01', disc: 'Architectural (A)', title: 'Cover sheet, Drawing index & Location plan', rev: 'AFC', status: 'Approved (AFC/GFC)', ref: 'CECC-ARCH-01', date: '2026-01-10' },
  { id: 2, number: 'A-01-02', disc: 'Architectural (A)', title: 'Ground Floor Architectural General Arrangement', rev: 'AFC', status: 'Approved (AFC/GFC)', ref: 'CECC-ARCH-02', date: '2026-01-15' },
  { id: 3, number: 'S-00-01', disc: 'Structural (S)', title: 'Structural Drawing Index & General Notes', rev: 'AFC', status: 'Approved (AFC/GFC)', ref: 'CECC-STR-01', date: '2026-01-12' },
  { id: 4, number: 'S-01-05', disc: 'Structural (S)', title: 'Foundation Layout and Raft Reinforcement Details', rev: 'AFC', status: 'Approved (AFC/GFC)', ref: 'CECC-STR-05', date: '2026-02-01' },
  { id: 5, number: 'S-12-01', disc: 'Structural (S)', title: 'Level 12 Framing Plan, Beams and Slab Details', rev: 'Rev 0', status: 'Under Review (S2)', ref: 'CECC-STR-12', date: '2026-10-15' },
  { id: 6, number: 'P-01-01', disc: 'Plumbing (P)', title: 'Domestic Water Supply & Drainage Riser Layout', rev: 'Rev B', status: 'Under Review (S2)', ref: 'CECC-PLU-01', date: '2026-10-20' },
  { id: 7, number: 'M-01-01', disc: 'Mechanical/HVAC (M)', title: 'Chilled Water Pipe Routing & AHU Equipment Schedule', rev: 'AFC', status: 'Approved (AFC/GFC)', ref: 'CECC-HVAC-01', date: '2026-03-10' },
  { id: 8, number: 'E-01-01', disc: 'Electrical (E)', title: 'HT Single-Line Diagram & Substation Layout', rev: 'AFC', status: 'Approved (AFC/GFC)', ref: 'CECC-ELC-01', date: '2026-03-15' },
  { id: 9, number: 'F-01-01', disc: 'Fire & Life Safety (F)', title: 'Fire Pump Room Layout & Wet Riser Schematics', rev: 'AFC', status: 'Approved (AFC/GFC)', ref: 'CECC-FIRE-01', date: '2026-03-20' },
  { id: 10, number: 'L-01-01', disc: 'Landscape (L)', title: 'Landscape Master Plan, Hardscape & Irrigation Layout', rev: 'Rev 0', status: 'Under Review (S2)', ref: 'CECC-LND-01', date: '2026-10-22' },
  { id: 11, number: 'MEP-CC-01', disc: 'MEP Coordination', title: 'Basement Coordinated Ceiling & Clash-Free Layout', rev: 'AFC', status: 'Approved (AFC/GFC)', ref: 'CECC-MEP-01', date: '2026-04-05' },
  { id: 12, number: 'SD-RCC-01', disc: 'Shop Drawing (RCC)', title: 'Tower Crane Foundation & Dynamic Load Bearing Details', rev: 'AFC', status: 'Approved (AFC/GFC)', ref: 'CECC-SD-01', date: '2026-02-10' },
];

const INITIAL_SHOP_DRAWINGS: ShopDrawingItem[] = [
  { id: 1, code: 'SD-RCC-L12-01', elem: 'Level 12 Columns & Shear Walls', bbs: 'BBS-L12-COL-01', prep: 'Meluha Technical Team', rev: 'Checked & Verified', appr: 'Code A - Approved' },
  { id: 2, code: 'SD-RCC-L12-02', elem: 'Level 12 Slab Reinforcement & Beams', bbs: 'BBS-L12-SLAB-02', prep: 'Meluha Technical Team', rev: 'Checked & Verified', appr: 'Code B - Approved as Noted' },
  { id: 3, code: 'SD-MEP-BSMT-01', elem: 'Basement Drainage & Fire Sleeves', bbs: 'N/A', prep: 'MEP Engineering Team', rev: 'Checked & Verified', appr: 'Code A - Approved' },
];

const INITIAL_RFIS: RFIItem[] = [
  { id: 1, no: 'RFI-SHJ-STR-045', subj: 'Clarification on beam-column junction reinforcement congestion at Grid B-4', dwg: 'S-12-01 Rev 0', loc: 'Level 12 Slab Zone 2', date: '2026-11-05', status: 'Open' },
  { id: 2, no: 'RFI-SHJ-MEP-012', subj: 'Routing collision between chilled water pipe and structural drop beam at Axis 7', dwg: 'MEP-CC-01', loc: 'Basement Floor', date: '2026-10-28', status: 'Resolved' },
];

const INITIAL_SUBMITTALS: SubmittalItem[] = [
  { id: 1, ref: 'MAT-SUB-STR-012', desc: 'High Yield Steel Reinforcement Bars Grade B500B', brand: 'Emirates Steel (ESAB)', date: '2026-09-15', code: 'Code A - Approved' },
  { id: 2, ref: 'MAT-SUB-CON-025', desc: 'Ready Mix Concrete Grade C40/20 Waterproof', brand: 'Unibeton Ready Mix', date: '2026-09-20', code: 'Code A - Approved' },
  { id: 3, ref: 'MAT-SUB-MEP-008', desc: 'Chilled Water Isolation Valves PN25', brand: 'Victaulic / Crane', date: '2026-10-10', code: 'Code B - Approved as Noted' },
];

const INITIAL_NOCS: NOCItem[] = [
  { id: 1, auth: 'Sharjah Municipality', ref: 'SHJ-MUNI-NOC-2026-88', desc: 'Building Foundation & Piling Excavation NOC', issue: '2025-11-10', exp: '2026-11-10', status: 'Active' },
  { id: 2, auth: 'Sharjah Civil Defense', ref: 'SCD-APPR-2026-102', desc: 'Fire Protection & Life Safety System Drawing Approval', issue: '2026-02-15', exp: '2027-02-15', status: 'Active' },
  { id: 3, auth: 'SEWA (Electricity & Water)', ref: 'SEWA-NOC-2026-441', desc: 'Permanent Power & Substation Connection NOC', issue: '2026-03-01', exp: '2027-03-01', status: 'Active' },
];

export const EngineeringTechnicalWorkspace: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'drawings' | 'shop' | 'rfis' | 'submittals' | 'nocs' | 'settings'>('dashboard');
  const [drawings, setDrawings] = useState<DrawingItem[]>(INITIAL_DRAWINGS);
  const [shopDrawings, setShopDrawings] = useState<ShopDrawingItem[]>(INITIAL_SHOP_DRAWINGS);
  const [rfis, setRfis] = useState<RFIItem[]>(INITIAL_RFIS);
  const [submittals, setSubmittals] = useState<SubmittalItem[]>(INITIAL_SUBMITTALS);
  const [nocs, setNocs] = useState<NOCItem[]>(INITIAL_NOCS);

  // Modals
  const [isDwgModalOpen, setIsDwgModalOpen] = useState(false);
  const [isShopModalOpen, setIsShopModalOpen] = useState(false);
  const [isRfiModalOpen, setIsRfiModalOpen] = useState(false);
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [isNocModalOpen, setIsNocModalOpen] = useState(false);

  // Form states
  const [mDwgNo, setMDwgNo] = useState('');
  const [mDwgDisc, setMDwgDisc] = useState('Architectural (A)');
  const [mDwgTitle, setMDwgTitle] = useState('');
  const [mDwgRev, setMDwgRev] = useState('AFC');
  const [mDwgStatus, setMDwgStatus] = useState('Approved (AFC/GFC)');
  const [mDwgRef, setMDwgRef] = useState('CECC-REF-01');

  const [mShopCode, setMShopCode] = useState('');
  const [mShopElem, setMShopElem] = useState('');
  const [mShopBbs, setMShopBbs] = useState('');
  const [mShopPrep, setMShopPrep] = useState('Meluha Technical Team');
  const [mShopAppr, setMShopAppr] = useState('Code A - Approved');

  const [mRfiNo, setMRfiNo] = useState('');
  const [mRfiDwg, setMRfiDwg] = useState('');
  const [mRfiSubj, setMRfiSubj] = useState('');
  const [mRfiLoc, setMRfiLoc] = useState('');
  const [mRfiDate, setMRfiDate] = useState(new Date().toISOString().split('T')[0]);

  const [mSubRef, setMSubRef] = useState('');
  const [mSubBrand, setMSubBrand] = useState('');
  const [mSubDesc, setMSubDesc] = useState('');
  const [mSubCode, setMSubCode] = useState('Code A - Approved');

  const [mNocAuth, setMNocAuth] = useState('Sharjah Municipality');
  const [mNocRef, setMNocRef] = useState('');
  const [mNocDesc, setMNocDesc] = useState('');
  const [mNocExp, setMNocExp] = useState('2027-01-01');

  // Chart refs
  const discCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const discChartInstance = useRef<Chart | null>(null);

  const statusCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const statusChartInstance = useRef<Chart | null>(null);

  // Chart setup
  useEffect(() => {
    if (activeTab === 'dashboard') {
      if (discCanvasRef.current) {
        if (discChartInstance.current) discChartInstance.current.destroy();
        discChartInstance.current = new Chart(discCanvasRef.current, {
          type: 'bar',
          data: {
            labels: ['Arch (A)', 'Struct (S)', 'Plumb (P)', 'HVAC (M)', 'Elect (E)', 'Fire (F)', 'Landscape (L)', 'MEP Coord', 'Shop DWG'],
            datasets: [
              {
                label: 'Drawings by Package',
                data: [3, 4, 2, 2, 2, 1, 1, 1, 2],
                backgroundColor: '#27332F',
                borderRadius: 4,
              },
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

      if (statusCanvasRef.current) {
        if (statusChartInstance.current) statusChartInstance.current.destroy();
        const afcCount = drawings.filter((d) => d.status.includes('Approved')).length;
        const revCount = drawings.filter((d) => d.status.includes('Review')).length;
        statusChartInstance.current = new Chart(statusCanvasRef.current, {
          type: 'doughnut',
          data: {
            labels: ['Approved (AFC/GFC)', 'Under Review (S2)', 'Revision Required'],
            datasets: [
              {
                data: [afcCount, revCount, 2],
                backgroundColor: ['#43856B', '#C18A43', '#B85C50'],
                borderWidth: 2,
                borderColor: '#FFFFFF',
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom', labels: { font: { size: 10 }, color: '#27332F' } } },
            cutout: '68%',
          },
        });
      }
    }

    return () => {
      if (discChartInstance.current) {
        discChartInstance.current.destroy();
        discChartInstance.current = null;
      }
      if (statusChartInstance.current) {
        statusChartInstance.current.destroy();
        statusChartInstance.current = null;
      }
    };
  }, [activeTab, drawings]);

  const totalDwgs = drawings.length;
  const afcDwgs = drawings.filter((d) => d.status.includes('Approved')).length;
  const pendingDwgs = drawings.filter((d) => d.status.includes('Review')).length;
  const openRfis = rfis.filter((r) => r.status === 'Open').length;
  const pendSubs = submittals.filter((s) => s.code.includes('Pending')).length;

  return (
    <div className="space-y-6 text-[#27332F] pb-12">
      {/* 1. Header Banner */}
      <div className="bg-white rounded-2xl border border-[#E2D8CB] p-5 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#27332F] text-[#B69A70] flex items-center justify-center font-bold shadow-sm shrink-0">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#F2EDE5] text-[#826B52] border border-[#E2D8CB]">
                SHARJAH ENGINEERING & TECHNICAL • SUITE
              </span>
              <span className="text-xs text-[#77746D]">|</span>
              <span className="text-xs text-[#43856B] font-semibold">Master Drawing & Submittals Suite</span>
            </div>
            <h1 className="text-xl md:text-2xl font-extrabold text-[#27332F] tracking-tight mt-0.5">
              Engineering & Technical Department ERP
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsDwgModalOpen(true)}
            className="bg-[#27332F] hover:bg-[#1a2320] text-white text-xs font-bold px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow-sm transition"
          >
            <Plus className="w-3.5 h-3.5 text-[#B69A70]" /> Register Drawing
          </button>
        </div>
      </div>

      {/* 2. Submodule Tab Bar */}
      <div className="bg-white rounded-xl border border-[#E2D8CB] p-1.5 shadow-xs overflow-x-auto custom-scrollbar">
        <div className="flex items-center gap-1 min-w-max">
          {[
            { id: 'dashboard', name: '1. Eng. Dashboard', icon: BarChart3 },
            { id: 'drawings', name: '2. Master Drawing Register', icon: FolderTree },
            { id: 'shop', name: '3. Shop Drawings & Execution', icon: Ruler },
            { id: 'rfis', name: '4. Technical RFIs', icon: HelpCircle },
            { id: 'submittals', name: '5. Material Submittals', icon: Archive },
            { id: 'nocs', name: '6. Authority NOCs & Permits', icon: Stamp },
            { id: 'settings', name: '7. Project Standards', icon: Settings },
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

      {/* ================= TAB 1: EXECUTIVE DASHBOARD ================= */}
      {activeTab === 'dashboard' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
            <div className="bg-white p-4 rounded-xl shadow-xs border border-[#E2D8CB]">
              <span className="text-[10px] text-[#77746D] block font-bold uppercase tracking-wider">Total Drawings</span>
              <span className="text-xl font-extrabold text-[#27332F] block mt-1">{totalDwgs + 136}</span>
              <span className="text-[10px] text-[#77746D] block mt-0.5">Across All Disciplines</span>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-xs border border-[#E2D8CB]">
              <span className="text-[10px] text-[#77746D] block font-bold uppercase tracking-wider">Approved (AFC/GFC)</span>
              <span className="text-xl font-extrabold text-[#43856B] block mt-1">{afcDwgs + 104}</span>
              <span className="text-[10px] text-[#43856B] font-semibold block mt-0.5">Ready for Execution</span>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-xs border border-[#E2D8CB]">
              <span className="text-[10px] text-[#77746D] block font-bold uppercase tracking-wider">Pending Consultant</span>
              <span className="text-xl font-extrabold text-[#C18A43] block mt-1">{pendingDwgs + 22}</span>
              <span className="text-[10px] text-[#77746D] block mt-0.5">Under Review (S2)</span>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-xs border border-[#E2D8CB]">
              <span className="text-[10px] text-[#77746D] block font-bold uppercase tracking-wider">Open RFIs</span>
              <span className="text-xl font-extrabold text-[#66869A] block mt-1">{openRfis + 5}</span>
              <span className="text-[10px] text-[#77746D] block mt-0.5">Technical Queries</span>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-xs border border-[#E2D8CB]">
              <span className="text-[10px] text-[#77746D] block font-bold uppercase tracking-wider">Material Submittals</span>
              <span className="text-xl font-extrabold text-[#826B52] block mt-1">{submittals.length + 9}</span>
              <span className="text-[10px] text-[#77746D] block mt-0.5">Sample Approvals</span>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-xs border border-[#E2D8CB]">
              <span className="text-[10px] text-[#77746D] block font-bold uppercase tracking-wider">Sharjah Baladiya NOCs</span>
              <span className="text-xl font-extrabold text-[#43856B] block mt-1">100%</span>
              <span className="text-[10px] text-[#77746D] block mt-0.5">All Clear</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 bg-white p-5 rounded-xl shadow-xs border border-[#E2D8CB]">
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#27332F] mb-3 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#826B52]" /> Drawing Package Breakdown by Discipline
              </h3>
              <div className="h-64">
                <canvas ref={discCanvasRef} />
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-xs border border-[#E2D8CB]">
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#27332F] mb-3 flex items-center gap-2">
                <PieChart className="w-4 h-4 text-[#826B52]" /> Drawing Status Distribution
              </h3>
              <div className="h-64">
                <canvas ref={statusCanvasRef} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: MASTER DRAWINGS REGISTER ================= */}
      {activeTab === 'drawings' && (
        <div className="bg-white p-5 rounded-xl shadow-xs border border-[#E2D8CB] space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-wrap justify-between items-center gap-3 pb-2 border-b border-[#E2D8CB]">
            <div>
              <h2 className="text-base font-bold text-[#27332F]">2. Master Drawing & Revision Register (Real-Time)</h2>
              <p className="text-xs text-[#77746D]">
                Manage all Architectural, Structural, MEP, and Specialist packages with live version control.
              </p>
            </div>
            <button
              onClick={() => setIsDwgModalOpen(true)}
              className="bg-[#27332F] hover:bg-[#1a2320] text-white text-xs font-bold px-3.5 py-2 rounded-lg shadow-sm flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-[#B69A70]" /> Register Drawing / Revision
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#F5F0E8] text-[#77746D] font-bold uppercase border-b border-[#E2D8CB]">
                <tr>
                  <th className="p-3">Drawing Number</th>
                  <th className="p-3">Discipline</th>
                  <th className="p-3">Title / Description</th>
                  <th className="p-3">Revision</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Consultant Ref</th>
                  <th className="p-3">Date</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2D8CB] text-[#27332F]">
                {drawings.map((d, idx) => (
                  <tr key={d.id} className="hover:bg-[#F5F0E8]/50 transition">
                    <td className="p-3 font-mono font-bold text-[#826B52]">{d.number}</td>
                    <td className="p-3 font-semibold">{d.disc}</td>
                    <td className="p-3 font-medium">{d.title}</td>
                    <td className="p-3 font-mono font-bold text-[#66869A]">{d.rev}</td>
                    <td className="p-3">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                          d.status.includes('Approved')
                            ? 'bg-[#43856B]/15 text-[#43856B] border-[#43856B]/30'
                            : 'bg-[#C18A43]/15 text-[#C18A43] border-[#C18A43]/30'
                        }`}
                      >
                        {d.status}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-[#77746D]">{d.ref}</td>
                    <td className="p-3 text-[#77746D]">{d.date}</td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => setDrawings((prev) => prev.filter((_, i) => i !== idx))}
                        className="text-[#B85C50] hover:text-rose-700 font-semibold text-xs"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 3: SHOP DRAWINGS ================= */}
      {activeTab === 'shop' && (
        <div className="bg-white p-5 rounded-xl shadow-xs border border-[#E2D8CB] space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-wrap justify-between items-center gap-3 pb-2 border-b border-[#E2D8CB]">
            <div>
              <h2 className="text-base font-bold text-[#27332F]">3. Shop Drawings & RCC Execution Register</h2>
              <p className="text-xs text-[#77746D]">
                Rebar shop drawings, Bar Bending Schedules (BBS), and formwork layout tracking.
              </p>
            </div>
            <button
              onClick={() => setIsShopModalOpen(true)}
              className="bg-[#27332F] hover:bg-[#1a2320] text-white text-xs font-bold px-3.5 py-2 rounded-lg shadow-sm flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-[#B69A70]" /> Add Shop Drawing
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#F5F0E8] text-[#77746D] font-bold uppercase border-b border-[#E2D8CB]">
                <tr>
                  <th className="p-3">Shop DWG Code</th>
                  <th className="p-3">Element / Location</th>
                  <th className="p-3">BBS / Package</th>
                  <th className="p-3">Prepared By</th>
                  <th className="p-3">Internal Review</th>
                  <th className="p-3">Consultant Approval</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2D8CB] text-[#27332F]">
                {shopDrawings.map((s, idx) => (
                  <tr key={s.id} className="hover:bg-[#F5F0E8]/50 transition">
                    <td className="p-3 font-mono font-bold text-[#826B52]">{s.code}</td>
                    <td className="p-3 font-semibold">{s.elem}</td>
                    <td className="p-3 font-mono">{s.bbs}</td>
                    <td className="p-3 text-[#77746D]">{s.prep}</td>
                    <td className="p-3 font-semibold text-[#43856B]">{s.rev}</td>
                    <td className="p-3 font-bold text-[#43856B]">{s.appr}</td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => setShopDrawings((prev) => prev.filter((_, i) => i !== idx))}
                        className="text-[#B85C50] hover:text-rose-700 font-semibold"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 4: RFIs ================= */}
      {activeTab === 'rfis' && (
        <div className="bg-white p-5 rounded-xl shadow-xs border border-[#E2D8CB] space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-wrap justify-between items-center gap-3 pb-2 border-b border-[#E2D8CB]">
            <div>
              <h2 className="text-base font-bold text-[#27332F]">4. Technical RFI Register & Site Clarifications</h2>
              <p className="text-xs text-[#77746D]">Track technical queries, linked drawing references, and due dates.</p>
            </div>
            <button
              onClick={() => setIsRfiModalOpen(true)}
              className="bg-[#27332F] hover:bg-[#1a2320] text-white text-xs font-bold px-3.5 py-2 rounded-lg shadow-sm flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-[#B69A70]" /> Raise New RFI
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#F5F0E8] text-[#77746D] font-bold uppercase border-b border-[#E2D8CB]">
                <tr>
                  <th className="p-3">RFI #</th>
                  <th className="p-3">Subject / Query</th>
                  <th className="p-3">Drawing Ref</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Due Date</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2D8CB] text-[#27332F]">
                {rfis.map((r, idx) => (
                  <tr key={r.id} className="hover:bg-[#F5F0E8]/50 transition">
                    <td className="p-3 font-mono font-bold text-[#826B52]">{r.no}</td>
                    <td className="p-3 font-medium">{r.subj}</td>
                    <td className="p-3 font-mono text-[#77746D]">{r.dwg}</td>
                    <td className="p-3">{r.loc}</td>
                    <td className="p-3 text-[#77746D]">{r.date}</td>
                    <td className="p-3">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                          r.status === 'Open' ? 'bg-[#C18A43]/15 text-[#C18A43]' : 'bg-[#43856B]/15 text-[#43856B]'
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() =>
                          setRfis((prev) =>
                            prev.map((item, i) => (i === idx ? { ...item, status: 'Resolved' } : item))
                          )
                        }
                        className="text-[#43856B] hover:underline font-semibold mr-2"
                      >
                        Resolve
                      </button>
                      <button
                        onClick={() => setRfis((prev) => prev.filter((_, i) => i !== idx))}
                        className="text-[#B85C50] hover:text-rose-700 font-semibold"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 5: MATERIAL SUBMITTALS ================= */}
      {activeTab === 'submittals' && (
        <div className="bg-white p-5 rounded-xl shadow-xs border border-[#E2D8CB] space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-wrap justify-between items-center gap-3 pb-2 border-b border-[#E2D8CB]">
            <div>
              <h2 className="text-base font-bold text-[#27332F]">5. Material Submittals & Technical Approvals</h2>
              <p className="text-xs text-[#77746D]">Track product datasheets, material samples, and consultant codes.</p>
            </div>
            <button
              onClick={() => setIsSubModalOpen(true)}
              className="bg-[#27332F] hover:bg-[#1a2320] text-white text-xs font-bold px-3.5 py-2 rounded-lg shadow-sm flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-[#B69A70]" /> Add Submittal
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#F5F0E8] text-[#77746D] font-bold uppercase border-b border-[#E2D8CB]">
                <tr>
                  <th className="p-3">Submittal Ref</th>
                  <th className="p-3">Material Description</th>
                  <th className="p-3">Brand / Supplier</th>
                  <th className="p-3">Submitted Date</th>
                  <th className="p-3">Consultant Code</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2D8CB] text-[#27332F]">
                {submittals.map((s, idx) => (
                  <tr key={s.id} className="hover:bg-[#F5F0E8]/50 transition">
                    <td className="p-3 font-mono font-bold text-[#826B52]">{s.ref}</td>
                    <td className="p-3 font-medium">{s.desc}</td>
                    <td className="p-3 text-[#77746D]">{s.brand}</td>
                    <td className="p-3 text-[#77746D]">{s.date}</td>
                    <td className="p-3 font-bold text-[#43856B]">{s.code}</td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => setSubmittals((prev) => prev.filter((_, i) => i !== idx))}
                        className="text-[#B85C50] hover:text-rose-700 font-semibold"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 6: NOCs & PERMITS ================= */}
      {activeTab === 'nocs' && (
        <div className="bg-white p-5 rounded-xl shadow-xs border border-[#E2D8CB] space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-wrap justify-between items-center gap-3 pb-2 border-b border-[#E2D8CB]">
            <div>
              <h2 className="text-base font-bold text-[#27332F]">6. Sharjah Authority NOCs, Permits & Compliance</h2>
              <p className="text-xs text-[#77746D]">Track Sharjah Municipality, Civil Defense, SEWA, and RTA permits.</p>
            </div>
            <button
              onClick={() => setIsNocModalOpen(true)}
              className="bg-[#27332F] hover:bg-[#1a2320] text-white text-xs font-bold px-3.5 py-2 rounded-lg shadow-sm flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-[#B69A70]" /> Add Permit / NOC
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#F5F0E8] text-[#77746D] font-bold uppercase border-b border-[#E2D8CB]">
                <tr>
                  <th className="p-3">Authority</th>
                  <th className="p-3">Description</th>
                  <th className="p-3">Reference #</th>
                  <th className="p-3">Issue Date</th>
                  <th className="p-3">Expiry Date</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2D8CB] text-[#27332F]">
                {nocs.map((n, idx) => (
                  <tr key={n.id} className="hover:bg-[#F5F0E8]/50 transition">
                    <td className="p-3 font-bold text-[#27332F]">{n.auth}</td>
                    <td className="p-3">{n.desc}</td>
                    <td className="p-3 font-mono font-bold text-[#826B52]">{n.ref}</td>
                    <td className="p-3 text-[#77746D]">{n.issue}</td>
                    <td className="p-3 font-bold text-[#C18A43]">{n.exp}</td>
                    <td className="p-3">
                      <span className="bg-[#43856B]/15 text-[#43856B] px-2 py-0.5 rounded text-[10px] font-bold">
                        {n.status}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => setNocs((prev) => prev.filter((_, i) => i !== idx))}
                        className="text-[#B85C50] hover:text-rose-700 font-semibold"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 7: PROJECT SETTINGS ================= */}
      {activeTab === 'settings' && (
        <div className="bg-white p-5 rounded-xl shadow-xs border border-[#E2D8CB] space-y-4 animate-in fade-in duration-200">
          <div className="flex justify-between items-center pb-2 border-b border-[#E2D8CB]">
            <div>
              <h2 className="text-base font-bold text-[#27332F]">7. Sharjah Project Settings & Standards</h2>
              <p className="text-xs text-[#77746D]">Configure metric standards, consultants, and municipal codes.</p>
            </div>
            <span className="bg-[#43856B]/15 text-[#43856B] text-xs px-3 py-1 rounded-full font-bold">
              UAE / Sharjah Municipality Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-[#77746D] mb-1">Project Name</label>
              <input
                type="text"
                readOnly
                value="Aljada Residential Tower - Sharjah"
                className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2.5 font-bold text-[#27332F]"
              />
            </div>
            <div>
              <label className="block font-bold text-[#77746D] mb-1">Project Code</label>
              <input
                type="text"
                readOnly
                value="PRJ-SHJ-ALJADA"
                className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2.5 font-mono text-[#27332F]"
              />
            </div>
            <div>
              <label className="block font-bold text-[#77746D] mb-1">Currency & Unit System</label>
              <input
                type="text"
                readOnly
                value="AED (Dirhams) | Metric System"
                className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2.5 font-bold text-[#826B52]"
              />
            </div>
            <div>
              <label className="block font-bold text-[#77746D] mb-1">Supervising Consultant</label>
              <input
                type="text"
                readOnly
                value="CECC Engineering Consultants"
                className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2.5 font-semibold text-[#27332F]"
              />
            </div>
            <div>
              <label className="block font-bold text-[#77746D] mb-1">Main Contractor</label>
              <input
                type="text"
                readOnly
                value="Meluha Construction LLC"
                className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2.5 font-bold text-[#27332F]"
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal: New Drawing */}
      {isDwgModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-white border border-[#E2D8CB] rounded-2xl w-full max-w-lg p-5 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-[#E2D8CB] pb-2">
              <h3 className="font-bold text-sm text-[#27332F]">Register Drawing / Revision</h3>
              <button onClick={() => setIsDwgModalOpen(false)} className="text-[#77746D] hover:text-[#27332F]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setDrawings((prev) => [
                  {
                    id: Date.now(),
                    number: mDwgNo || 'A-L12-001',
                    disc: mDwgDisc,
                    title: mDwgTitle || 'Framing Details',
                    rev: mDwgRev,
                    status: mDwgStatus,
                    ref: mDwgRef,
                    date: new Date().toISOString().split('T')[0],
                  },
                  ...prev,
                ]);
                setIsDwgModalOpen(false);
              }}
              className="grid grid-cols-2 gap-3 text-xs"
            >
              <div>
                <label className="block font-bold text-[#77746D] mb-1">Drawing Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. S-L12-04"
                  value={mDwgNo}
                  onChange={(e) => setMDwgNo(e.target.value)}
                  className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2 font-mono"
                />
              </div>
              <div>
                <label className="block font-bold text-[#77746D] mb-1">Discipline</label>
                <select
                  value={mDwgDisc}
                  onChange={(e) => setMDwgDisc(e.target.value)}
                  className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2 font-semibold"
                >
                  <option value="Architectural (A)">Architectural (A)</option>
                  <option value="Structural (S)">Structural (S)</option>
                  <option value="Plumbing (P)">Plumbing (P)</option>
                  <option value="Mechanical/HVAC (M)">Mechanical/HVAC (M)</option>
                  <option value="Electrical (E)">Electrical (E)</option>
                  <option value="Fire & Life Safety (F)">Fire & Life Safety (F)</option>
                  <option value="MEP Coordination">MEP Coordination</option>
                  <option value="Shop Drawing (RCC)">Shop Drawing (RCC)</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block font-bold text-[#77746D] mb-1">Title / Description</label>
                <input
                  type="text"
                  required
                  placeholder="Level 12 Framing Details"
                  value={mDwgTitle}
                  onChange={(e) => setMDwgTitle(e.target.value)}
                  className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2"
                />
              </div>
              <div>
                <label className="block font-bold text-[#77746D] mb-1">Revision</label>
                <select
                  value={mDwgRev}
                  onChange={(e) => setMDwgRev(e.target.value)}
                  className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2 font-bold text-[#826B52]"
                >
                  <option value="AFC">AFC (Approved for Construction)</option>
                  <option value="GFC">GFC (Good for Construction)</option>
                  <option value="Rev 0">Rev 0 (For Approval)</option>
                  <option value="Rev B">Rev B</option>
                  <option value="As-Built">As-Built</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-[#77746D] mb-1">Status</label>
                <select
                  value={mDwgStatus}
                  onChange={(e) => setMDwgStatus(e.target.value)}
                  className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2 font-semibold"
                >
                  <option value="Approved (AFC/GFC)">Approved (AFC/GFC)</option>
                  <option value="Under Review (S2)">Under Review (S2)</option>
                  <option value="Revision Required">Revision Required</option>
                </select>
              </div>
              <div className="col-span-2 flex justify-end gap-2 pt-2 border-t border-[#E2D8CB]">
                <button
                  type="button"
                  onClick={() => setIsDwgModalOpen(false)}
                  className="px-3.5 py-1.5 bg-[#F5F0E8] text-[#27332F] rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#27332F] hover:bg-[#1a2320] text-white rounded-lg font-bold shadow-sm"
                >
                  Save Drawing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: RFI */}
      {isRfiModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-white border border-[#E2D8CB] rounded-2xl w-full max-w-lg p-5 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-[#E2D8CB] pb-2">
              <h3 className="font-bold text-sm text-[#27332F]">Raise Technical RFI</h3>
              <button onClick={() => setIsRfiModalOpen(false)} className="text-[#77746D] hover:text-[#27332F]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setRfis((prev) => [
                  {
                    id: Date.now(),
                    no: mRfiNo || `RFI-SHJ-${Math.floor(100 + Math.random() * 900)}`,
                    subj: mRfiSubj,
                    dwg: mRfiDwg || 'S-12-01',
                    loc: mRfiLoc || 'Level 12',
                    date: mRfiDate,
                    status: 'Open',
                  },
                  ...prev,
                ]);
                setIsRfiModalOpen(false);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-bold text-[#77746D] mb-1">RFI Number</label>
                <input
                  type="text"
                  required
                  placeholder="RFI-SHJ-STR-046"
                  value={mRfiNo}
                  onChange={(e) => setMRfiNo(e.target.value)}
                  className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2 font-mono"
                />
              </div>
              <div>
                <label className="block font-bold text-[#77746D] mb-1">Technical Subject / Query</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe technical query on drawing..."
                  value={mRfiSubj}
                  onChange={(e) => setMRfiSubj(e.target.value)}
                  className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-bold text-[#77746D] mb-1">Drawing Ref</label>
                  <input
                    type="text"
                    placeholder="S-12-01 Rev 0"
                    value={mRfiDwg}
                    onChange={(e) => setMRfiDwg(e.target.value)}
                    className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#77746D] mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="Level 12 Core"
                    value={mRfiLoc}
                    onChange={(e) => setMRfiLoc(e.target.value)}
                    className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-[#E2D8CB]">
                <button
                  type="button"
                  onClick={() => setIsRfiModalOpen(false)}
                  className="px-3.5 py-1.5 bg-[#F5F0E8] text-[#27332F] rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#27332F] hover:bg-[#1a2320] text-white rounded-lg font-bold shadow-sm"
                >
                  Submit RFI
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
