import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldAlert,
  FolderCog,
  FolderGit2,
  FolderCheck,
  FolderOpen,
  FolderTree,
  Printer,
  Sun,
  Activity,
  Plus,
  Download,
  Upload,
  AlertTriangle,
  UserCheck,
  Users,
  PieChart,
  BarChart3,
  Scale,
  CheckCircle2,
  X,
  FileSpreadsheet,
} from 'lucide-react';
import Chart from 'chart.js/auto';

interface HIRAItem {
  id: string;
  zone: string;
  hazard: string;
  sev: number;
  like: number;
  ptw: string;
  ctrl: string;
}

interface InductionItem {
  badge: string;
  name: string;
  trade: string;
  medical: string;
  date: string;
}

interface TBTItem {
  date: string;
  topic: string;
  officer: string;
  count: number;
}

interface IncidentItem {
  id: string;
  date: string;
  sev: string;
  desc: string;
  rca: string;
  capa: string;
  status: string;
}

interface NOCItem {
  name: string;
  auth: string;
  ref: string;
  issue: string;
  exp: string;
  status: string;
}

export const HSEWorkspace: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'config' | 'hira' | 'induction' | 'incidents' | 'env' | 'transmittal'>('dashboard');

  // State
  const [projectName, setProjectName] = useState('Aljada Residential Tower');
  const [projectLoc, setProjectLoc] = useState('Muwaileh, Sharjah (SM)');
  const [manpower, setManpower] = useState(650);
  const [durationMonths, setDurationMonths] = useState(24);
  const [contractCostAED, setContractCostAED] = useState(180);

  const [hiraList, setHiraList] = useState<HIRAItem[]>([
    { id: 'SHJ-HIRA-01', zone: 'Tower A - Floor 12 Shear Wall', hazard: 'Work at height edge fall risk', sev: 4, like: 3, ptw: 'Height Work PTW', ctrl: 'Double lanyard safety harness & perimeter catch nets' },
    { id: 'SHJ-HIRA-02', zone: 'Basement 2 Excavation', hazard: 'Trench excavation collapse risk', sev: 4, like: 2, ptw: 'Excavation PTW', ctrl: 'Trench shoring and 1m clearance barrier' },
    { id: 'SHJ-HIRA-03', zone: 'Substation Site Yard', hazard: 'Hot work cutting & welding fire risk', sev: 3, like: 3, ptw: 'SCD Hot Work PTW', ctrl: 'Fire extinguisher, fire blanket & trained fire watch' },
  ]);

  const [inductions, setInductions] = useState<InductionItem[]>([
    { badge: 'SHJ-1001', name: 'Tariq Mahmoud', trade: 'Steel Fixer / Barbender', medical: 'Fit & Acclimatized (7-Day)', date: '2026-03-10' },
    { badge: 'SHJ-1002', name: 'Suresh Kumar', trade: 'Scaffolder', medical: 'Fit & Acclimatized (7-Day)', date: '2026-03-11' },
    { badge: 'SHJ-1003', name: 'Mohammad Ali', trade: 'Electrician', medical: 'Fit & Acclimatized (7-Day)', date: '2026-03-12' },
  ]);

  const [tbts, setTbts] = useState<TBTItem[]>([
    { date: '2026-10-28', topic: 'MoHRE Midday Break & Heat Hydration', officer: 'Tariq S. (HSE Manager)', count: 52 },
    { date: '2026-10-29', topic: 'Sharjah Civil Defense Hot Work Safety', officer: 'R. Mehta (HSE Officer)', count: 68 },
  ]);

  const [incidents, setIncidents] = useState<IncidentItem[]>([
    { id: 'INC-01', date: '2026-08-15', sev: 'Near Miss', desc: 'Formwork bracket dropped from 6th floor scaffold deck', rca: 'Inadequate toe-boards on platform', capa: 'Installed perimeter catch nets', status: 'Closed' },
    { id: 'INC-02', date: '2026-09-04', sev: 'First Aid', desc: 'Minor scratch during steel binding', rca: 'Worn-out cut resistant gloves', capa: 'Re-issued heavy duty leather gloves', status: 'Closed' },
  ]);

  const [nocs] = useState<NOCItem[]>([
    { name: 'Sharjah Municipality Building Permit', auth: 'Sharjah Municipality', ref: 'SHJ-BLD-2026-88', issue: '2025-11-10', exp: '2026-11-10', status: 'Active' },
    { name: 'Sharjah Civil Defense (SCD) Fire Approval', auth: 'Sharjah Civil Defense', ref: 'SCD-APPR-2026-102', issue: '2026-02-15', exp: '2027-02-15', status: 'Active' },
    { name: 'SEWA Permanent Substation NOC', auth: 'SEWA', ref: 'SEWA-NOC-2026-441', issue: '2026-03-01', exp: '2027-03-01', status: 'Active' },
  ]);

  // Modals
  const [isHiraModalOpen, setIsHiraModalOpen] = useState(false);
  const [isIndModalOpen, setIsIndModalOpen] = useState(false);
  const [isTbtModalOpen, setIsTbtModalOpen] = useState(false);
  const [isIncModalOpen, setIsIncModalOpen] = useState(false);

  // Form states
  const [hiraZone, setHiraZone] = useState('');
  const [hiraHazard, setHiraHazard] = useState('');
  const [hiraSev, setHiraSev] = useState(3);
  const [hiraLike, setHiraLike] = useState(3);
  const [hiraPtw, setHiraPtw] = useState('Height Work PTW');
  const [hiraCtrl, setHiraCtrl] = useState('');

  const [indName, setIndName] = useState('');
  const [indBadge, setIndBadge] = useState('');
  const [indTrade, setIndTrade] = useState('Steel Fixer / Barbender');
  const [indMed, setIndMed] = useState('Fit & Acclimatized (7-Day)');

  const [tbtTopic, setTbtTopic] = useState('MoHRE Midday Break & Heat Hydration');
  const [tbtOfficer, setTbtOfficer] = useState('Tariq S. (HSE Manager)');
  const [tbtCount, setTbtCount] = useState(45);

  const [incSev, setIncSev] = useState('Near Miss');
  const [incDesc, setIncDesc] = useState('');
  const [incRca, setIncRca] = useState('');
  const [incCapa, setIncCapa] = useState('');
  const [incStatus, setIncStatus] = useState('Closed');

  // Chart refs
  const incChartCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const incChartInstance = useRef<Chart | null>(null);

  const indChartCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const indChartInstance = useRef<Chart | null>(null);

  // Parametrics calculations
  const officersNeeded = Math.max(1, Math.ceil(manpower / 500));
  const totalSafeHours = manpower * 26 * 8 * durationMonths * 0.45;
  const ltiCount = incidents.filter((i) => i.sev.includes('LTI') || i.sev.includes('Fatal')).length;
  const ltifr = totalSafeHours > 0 ? ((ltiCount * 1000000) / totalSafeHours).toFixed(2) : '0.00';
  const activePTWCount = hiraList.filter((h) => h.sev * h.like >= 12).length;
  const pendingCapaCount = incidents.filter((i) => i.status !== 'Closed').length;

  useEffect(() => {
    if (activeTab === 'dashboard') {
      if (incChartCanvasRef.current) {
        if (incChartInstance.current) incChartInstance.current.destroy();
        incChartInstance.current = new Chart(incChartCanvasRef.current, {
          type: 'doughnut',
          data: {
            labels: ['Near Miss', 'First Aid', 'Medical Treatment', 'LTI / Fatal'],
            datasets: [
              {
                data: [4, 2, 1, 0],
                backgroundColor: ['#66869A', '#B69A70', '#C18A43', '#B85C50'],
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

      if (indChartCanvasRef.current) {
        if (indChartInstance.current) indChartInstance.current.destroy();
        indChartInstance.current = new Chart(indChartCanvasRef.current, {
          type: 'bar',
          data: {
            labels: ['Month 1', 'Month 2', 'Month 3', 'Month 4', 'Current Month'],
            datasets: [
              { label: 'Target Workforce', data: [200, 350, 500, 600, manpower], backgroundColor: '#E2D8CB' },
              { label: 'Inducted Workers', data: [180, 320, 480, 580, manpower - 20], backgroundColor: '#43856B' },
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
    }

    return () => {
      if (incChartInstance.current) {
        incChartInstance.current.destroy();
        incChartInstance.current = null;
      }
      if (indChartInstance.current) {
        indChartInstance.current.destroy();
        indChartInstance.current = null;
      }
    };
  }, [activeTab, manpower]);

  return (
    <div className="space-y-6 text-[#27332F] pb-12">
      {/* 1. Header Banner */}
      <div className="bg-white rounded-2xl border border-[#E2D8CB] p-5 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#27332F] text-[#B69A70] flex items-center justify-center font-bold shadow-sm shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#F2EDE5] text-[#826B52] border border-[#E2D8CB]">
                SHARJAH HSE & STATUTORY SAFETY • SUITE
              </span>
              <span className="text-xs text-[#77746D]">|</span>
              <span className="text-xs text-[#43856B] font-semibold">UAE Cabinet Res 33/2022 & MoHRE Regulated</span>
            </div>
            <h1 className="text-xl md:text-2xl font-extrabold text-[#27332F] tracking-tight mt-0.5">
              Sharjah Site Health, Safety & Environment (HSE) Portal
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('transmittal')}
            className="bg-[#27332F] hover:bg-[#1a2320] text-white text-xs font-bold px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow-sm transition"
          >
            <Printer className="w-3.5 h-3.5 text-[#B69A70]" /> HSE Audit Transmittal
          </button>
        </div>
      </div>

      {/* 2. Submodule Tab Bar */}
      <div className="bg-white rounded-xl border border-[#E2D8CB] p-1.5 shadow-xs overflow-x-auto custom-scrollbar">
        <div className="flex items-center gap-1 min-w-max">
          {[
            { id: 'dashboard', name: 'Executive Dashboard', icon: Activity },
            { id: 'config', name: '01_Project_Config', icon: FolderCog },
            { id: 'hira', name: '02_HIRA_PTW_HeatStress', icon: FolderGit2 },
            { id: 'induction', name: '03_Inductions_TBT_Welfare', icon: FolderCheck },
            { id: 'incidents', name: '04_Incidents_MoHRE_Logs', icon: FolderOpen },
            { id: 'env', name: '05_Muni_SCD_SEWA_NOCs', icon: FolderTree },
            { id: 'transmittal', name: 'Transmittal_Print_Export', icon: Printer },
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
                <span>/{tab.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= TAB: DASHBOARD ================= */}
      {activeTab === 'dashboard' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          {/* MoHRE Midday Break Alert Box */}
          <div className="bg-[#C18A43]/10 border-l-4 border-[#C18A43] rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            <div className="flex items-center gap-3">
              <Sun className="w-5 h-5 text-[#C18A43] shrink-0 animate-pulse" />
              <div>
                <h4 className="font-bold text-xs text-[#C18A43]">
                  MoHRE Summer Midday Work Ban Alert (12:30 PM - 3:00 PM)
                </h4>
                <p className="text-xs text-[#77746D] mt-0.5">
                  Mandatory outdoor work suspension under Ministerial Resolution No. 44 of 2022. Cold water & shaded rest areas required.
                </p>
              </div>
            </div>
            <span className="px-3 py-1 bg-[#C18A43]/20 border border-[#C18A43]/40 text-[#C18A43] font-bold text-xs rounded-full shrink-0">
              Rule Active (15 Jun - 15 Sep)
            </span>
          </div>

          {/* 5 KPI Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
            <div className="bg-white p-4 rounded-xl shadow-xs border border-[#E2D8CB]">
              <span className="text-[10px] text-[#77746D] block font-bold uppercase tracking-wider">Safe Man-Hours</span>
              <span className="text-xl font-extrabold text-[#43856B] block mt-1">
                {Math.round(totalSafeHours).toLocaleString()}
              </span>
              <span className="text-[10px] text-[#43856B] font-semibold block mt-0.5">Zero LTI Target</span>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-xs border border-[#E2D8CB]">
              <span className="text-[10px] text-[#77746D] block font-bold uppercase tracking-wider">LTIFR Score</span>
              <span className="text-xl font-extrabold text-[#27332F] block mt-1">{ltifr}</span>
              <span className="text-[10px] text-[#77746D] block mt-0.5">Per 1 Million Hours</span>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-xs border border-[#E2D8CB]">
              <span className="text-[10px] text-[#77746D] block font-bold uppercase tracking-wider">Active PTWs</span>
              <span className="text-xl font-extrabold text-[#826B52] block mt-1">{activePTWCount + 2}</span>
              <span className="text-[10px] text-[#77746D] block mt-0.5">SCD & Height Approved</span>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-xs border border-[#E2D8CB]">
              <span className="text-[10px] text-[#77746D] block font-bold uppercase tracking-wider">Pending CAPAs</span>
              <span className="text-xl font-extrabold text-[#B85C50] block mt-1">{pendingCapaCount}</span>
              <span className="text-[10px] text-[#77746D] block mt-0.5">Open Inspection Items</span>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-xs border border-[#E2D8CB] col-span-2 sm:col-span-1">
              <span className="text-[10px] text-[#77746D] block font-bold uppercase tracking-wider">Induction Rate</span>
              <span className="text-xl font-extrabold text-[#43856B] block mt-1">97%</span>
              <span className="text-[10px] text-[#77746D] block mt-0.5">Emirates ID Verified</span>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="bg-white p-5 rounded-xl shadow-xs border border-[#E2D8CB]">
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#27332F] mb-3 flex items-center gap-2">
                <PieChart className="w-4 h-4 text-[#826B52]" /> Incident Severity Breakdown (MoHRE Standards)
              </h3>
              <div className="h-64">
                <canvas ref={incChartCanvasRef} />
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-xs border border-[#E2D8CB]">
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#27332F] mb-3 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#826B52]" /> Worker Safety Inductions (Target vs Actual)
              </h3>
              <div className="h-64">
                <canvas ref={indChartCanvasRef} />
              </div>
            </div>
          </div>

          {/* Statutory Compliance Matrix */}
          <div className="bg-white p-5 rounded-xl shadow-xs border border-[#E2D8CB] space-y-3">
            <h3 className="font-bold text-sm text-[#27332F] flex items-center gap-2">
              <Scale className="w-4 h-4 text-[#826B52]" /> Mandatory Sharjah Statutory Compliance Matrix
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
              <div className="p-3 bg-[#F5F0E8] rounded-xl border border-[#E2D8CB] flex justify-between items-center">
                <div>
                  <p className="font-bold text-[#27332F]">Safety Officer Staffing</p>
                  <p className="text-[11px] text-[#77746D]">Cabinet Res 33/2022: 1 per 500 workers</p>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#43856B]/15 text-[#43856B] font-bold text-[10px]">
                  {officersNeeded} Officer(s)
                </span>
              </div>

              <div className="p-3 bg-[#F5F0E8] rounded-xl border border-[#E2D8CB] flex justify-between items-center">
                <div>
                  <p className="font-bold text-[#27332F]">Sharjah Baladiya Permit</p>
                  <p className="text-[11px] text-[#77746D]">Permit No: SHJ-BLD-2026-88</p>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#43856B]/15 text-[#43856B] font-bold text-[10px]">Active</span>
              </div>

              <div className="p-3 bg-[#F5F0E8] rounded-xl border border-[#E2D8CB] flex justify-between items-center">
                <div>
                  <p className="font-bold text-[#27332F]">Civil Defense (SCD) Approval</p>
                  <p className="text-[11px] text-[#77746D]">Fire Safety Clearances</p>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#43856B]/15 text-[#43856B] font-bold text-[10px]">Approved</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB: CONFIG ================= */}
      {activeTab === 'config' && (
        <div className="bg-white p-5 rounded-xl shadow-xs border border-[#E2D8CB] space-y-4 animate-in fade-in duration-200">
          <h2 className="text-base font-bold text-[#27332F]">/01_Sharjah_Project_Config</h2>
          <p className="text-xs text-[#77746D]">
            Project setup & automatic HSE resource estimation under UAE Cabinet Resolution No. 33 of 2022.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-[#77746D] mb-1">Project Name</label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2.5 font-bold text-[#27332F]"
              />
            </div>
            <div>
              <label className="block font-bold text-[#77746D] mb-1">Peak Workforce (Workers)</label>
              <input
                type="number"
                value={manpower}
                onChange={(e) => setManpower(Number(e.target.value))}
                className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2.5 font-bold text-[#43856B]"
              />
            </div>
            <div>
              <label className="block font-bold text-[#77746D] mb-1">Contract Value (AED Millions)</label>
              <input
                type="number"
                value={contractCostAED}
                onChange={(e) => setContractCostAED(Number(e.target.value))}
                className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2.5 font-bold text-[#826B52]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-[#E2D8CB] text-xs">
            <div className="p-3 bg-[#F5F0E8] rounded-xl border border-[#E2D8CB]">
              <span className="text-[#77746D] block">Statutory Safety Officers:</span>
              <span className="text-xl font-extrabold text-[#27332F]">{officersNeeded} Officer(s)</span>
              <p className="text-[10px] text-[#77746D] mt-1">Cabinet Res 33/2022</p>
            </div>
            <div className="p-3 bg-[#F5F0E8] rounded-xl border border-[#E2D8CB]">
              <span className="text-[#77746D] block">Target Safe Man-Hours:</span>
              <span className="text-xl font-extrabold text-[#43856B]">{Math.round(totalSafeHours).toLocaleString()}</span>
              <p className="text-[10px] text-[#77746D] mt-1">26 Days x 8h x {durationMonths} Mo</p>
            </div>
            <div className="p-3 bg-[#F5F0E8] rounded-xl border border-[#E2D8CB]">
              <span className="text-[#77746D] block">Mandatory HSE Budget (1.2%):</span>
              <span className="text-xl font-extrabold text-[#826B52]">AED {(contractCostAED * 0.012).toFixed(2)}M</span>
              <p className="text-[10px] text-[#77746D] mt-1">PPE, Welfare, Training</p>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB: HIRA & PTW ================= */}
      {activeTab === 'hira' && (
        <div className="bg-white p-5 rounded-xl shadow-xs border border-[#E2D8CB] space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-wrap justify-between items-center gap-3 pb-2 border-b border-[#E2D8CB]">
            <div>
              <h2 className="text-base font-bold text-[#27332F]">/02_HIRA_PTW_HeatStress_Logs</h2>
              <p className="text-xs text-[#77746D]">
                Hazard Identification, Digital PTW Matrix & Thermal Work Limit (TWL) Heat Monitoring.
              </p>
            </div>
            <button
              onClick={() => setIsHiraModalOpen(true)}
              className="bg-[#27332F] hover:bg-[#1a2320] text-white text-xs font-bold px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5 text-[#B69A70]" /> Add HIRA / PTW Entry
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#F5F0E8] text-[#77746D] font-bold uppercase border-b border-[#E2D8CB]">
                <tr>
                  <th className="p-3">Ref ID</th>
                  <th className="p-3">Activity Zone</th>
                  <th className="p-3">Identified Hazard</th>
                  <th className="p-3">Risk (S x L)</th>
                  <th className="p-3">Risk Level</th>
                  <th className="p-3">PTW Type</th>
                  <th className="p-3">Control Measures</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2D8CB] text-[#27332F]">
                {hiraList.map((h, idx) => {
                  const score = h.sev * h.like;
                  return (
                    <tr key={h.id} className="hover:bg-[#F5F0E8]/50 transition">
                      <td className="p-3 font-mono font-bold text-[#826B52]">{h.id}</td>
                      <td className="p-3 font-semibold">{h.zone}</td>
                      <td className="p-3">{h.hazard}</td>
                      <td className="p-3 font-bold">{h.sev} x {h.like} = {score}</td>
                      <td className="p-3">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                            score >= 12
                              ? 'bg-[#B85C50]/15 text-[#B85C50] border-[#B85C50]/30'
                              : 'bg-[#C18A43]/15 text-[#C18A43] border-[#C18A43]/30'
                          }`}
                        >
                          {score >= 12 ? 'High Risk' : 'Medium Risk'}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="bg-[#F5F0E8] border border-[#E2D8CB] px-2 py-0.5 rounded font-mono font-semibold text-[#826B52]">
                          {h.ptw}
                        </span>
                      </td>
                      <td className="p-3 text-[#77746D]">{h.ctrl}</td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => setHiraList((prev) => prev.filter((_, i) => i !== idx))}
                          className="text-[#B85C50] hover:text-rose-700 font-semibold"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB: INDUCTION & TBT ================= */}
      {activeTab === 'induction' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 animate-in fade-in duration-200">
          <div className="bg-white p-5 rounded-xl shadow-xs border border-[#E2D8CB] space-y-4">
            <div className="flex justify-between items-center border-b border-[#E2D8CB] pb-2">
              <h3 className="font-bold text-sm text-[#27332F]">Worker Safety Induction Register</h3>
              <button
                onClick={() => setIsIndModalOpen(true)}
                className="bg-[#27332F] hover:bg-[#1a2320] text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-sm"
              >
                <Plus className="w-3 h-3 text-[#B69A70]" /> Register Worker
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-[#F5F0E8] text-[#77746D] font-bold uppercase border-b border-[#E2D8CB]">
                  <tr>
                    <th className="p-2.5">Badge #</th>
                    <th className="p-2.5">Worker Name</th>
                    <th className="p-2.5">Trade</th>
                    <th className="p-2.5">Medical / Heat Fit</th>
                    <th className="p-2.5">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2D8CB] text-[#27332F]">
                  {inductions.map((ind) => (
                    <tr key={ind.badge} className="hover:bg-[#F5F0E8]/50">
                      <td className="p-2.5 font-mono font-bold text-[#826B52]">{ind.badge}</td>
                      <td className="p-2.5 font-bold">{ind.name}</td>
                      <td className="p-2.5">{ind.trade}</td>
                      <td className="p-2.5">
                        <span className="bg-[#43856B]/15 text-[#43856B] px-2 py-0.5 rounded font-bold text-[10px]">
                          {ind.medical}
                        </span>
                      </td>
                      <td className="p-2.5 text-[#77746D]">{ind.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-xs border border-[#E2D8CB] space-y-4">
            <div className="flex justify-between items-center border-b border-[#E2D8CB] pb-2">
              <h3 className="font-bold text-sm text-[#27332F]">Daily Toolbox Talk (TBT) Log</h3>
              <button
                onClick={() => setIsTbtModalOpen(true)}
                className="bg-[#27332F] hover:bg-[#1a2320] text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-sm"
              >
                <Plus className="w-3 h-3 text-[#B69A70]" /> Log TBT
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-[#F5F0E8] text-[#77746D] font-bold uppercase border-b border-[#E2D8CB]">
                  <tr>
                    <th className="p-2.5">Date</th>
                    <th className="p-2.5">Topic</th>
                    <th className="p-2.5">Conducting Officer</th>
                    <th className="p-2.5 text-right">Attendees</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2D8CB] text-[#27332F]">
                  {tbts.map((t, idx) => (
                    <tr key={idx} className="hover:bg-[#F5F0E8]/50">
                      <td className="p-2.5 font-mono text-[#77746D]">{t.date}</td>
                      <td className="p-2.5 font-bold text-[#27332F]">{t.topic}</td>
                      <td className="p-2.5">{t.officer}</td>
                      <td className="p-2.5 text-right font-extrabold text-[#43856B]">{t.count} Workers</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB: INCIDENTS ================= */}
      {activeTab === 'incidents' && (
        <div className="bg-white p-5 rounded-xl shadow-xs border border-[#E2D8CB] space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-wrap justify-between items-center gap-3 pb-2 border-b border-[#E2D8CB]">
            <div>
              <h2 className="text-base font-bold text-[#27332F]">/04_Incidents_MoHRE_Logs</h2>
              <p className="text-xs text-[#77746D]">
                Accident investigation, RCA & mandatory 24-hr MoHRE incident notifications.
              </p>
            </div>
            <button
              onClick={() => setIsIncModalOpen(true)}
              className="bg-[#B85C50] hover:bg-rose-700 text-white text-xs font-bold px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow-sm"
            >
              <AlertTriangle className="w-3.5 h-3.5" /> Report Incident
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#F5F0E8] text-[#77746D] font-bold uppercase border-b border-[#E2D8CB]">
                <tr>
                  <th className="p-3">ID</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Severity</th>
                  <th className="p-3">Description</th>
                  <th className="p-3">Root Cause</th>
                  <th className="p-3">CAPA Action</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2D8CB] text-[#27332F]">
                {incidents.map((inc, idx) => (
                  <tr key={inc.id} className="hover:bg-[#F5F0E8]/50 transition">
                    <td className="p-3 font-mono font-bold text-[#826B52]">{inc.id}</td>
                    <td className="p-3 font-mono text-[#77746D]">{inc.date}</td>
                    <td className="p-3">
                      <span className="bg-[#B85C50]/15 text-[#B85C50] px-2 py-0.5 rounded font-bold text-[10px]">
                        {inc.sev}
                      </span>
                    </td>
                    <td className="p-3 font-medium text-[#27332F]">{inc.desc}</td>
                    <td className="p-3 text-[#77746D]">{inc.rca}</td>
                    <td className="p-3 text-[#77746D]">{inc.capa}</td>
                    <td className="p-3 font-bold text-[#43856B]">{inc.status}</td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => setIncidents((prev) => prev.filter((_, i) => i !== idx))}
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

      {/* ================= TAB: ENV & NOCS ================= */}
      {activeTab === 'env' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl border border-[#E2D8CB] shadow-xs space-y-1">
              <span className="text-xs font-bold text-[#77746D]">Ambient Noise Monitoring</span>
              <div className="text-2xl font-extrabold text-[#27332F]">64.2 dB(A)</div>
              <p className="text-[10px] text-[#43856B] font-semibold">Below 70 dB(A) Daytime Limit</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-[#E2D8CB] shadow-xs space-y-1">
              <span className="text-xs font-bold text-[#77746D]">Dust Misting Sprinklers</span>
              <div className="text-2xl font-extrabold text-[#43856B]">6 Units Active</div>
              <p className="text-[10px] text-[#77746D]">Perimeter & Wheel Wash Bays</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-[#E2D8CB] shadow-xs space-y-1">
              <span className="text-xs font-bold text-[#77746D]">Bee'ah C&D Waste Disposed</span>
              <div className="text-2xl font-extrabold text-[#826B52]">280 MT</div>
              <p className="text-[10px] text-[#77746D]">Approved Sharjah Recycling Facility</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-xs border border-[#E2D8CB] space-y-3">
            <h3 className="font-bold text-sm text-[#27332F]">Sharjah Statutory NOCs & Permits</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-[#F5F0E8] text-[#77746D] font-bold uppercase border-b border-[#E2D8CB]">
                  <tr>
                    <th className="p-3">Permit Description</th>
                    <th className="p-3">Authority</th>
                    <th className="p-3">Reference No.</th>
                    <th className="p-3">Issue Date</th>
                    <th className="p-3">Expiry Date</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2D8CB] text-[#27332F]">
                  {nocs.map((n, idx) => (
                    <tr key={idx} className="hover:bg-[#F5F0E8]/50">
                      <td className="p-3 font-bold">{n.name}</td>
                      <td className="p-3 text-[#77746D]">{n.auth}</td>
                      <td className="p-3 font-mono font-bold text-[#826B52]">{n.ref}</td>
                      <td className="p-3 text-[#77746D]">{n.issue}</td>
                      <td className="p-3 font-semibold text-[#C18A43]">{n.exp}</td>
                      <td className="p-3">
                        <span className="bg-[#43856B]/15 text-[#43856B] px-2 py-0.5 rounded font-bold text-[10px]">
                          {n.status}
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

      {/* ================= TAB: TRANSMITTAL ================= */}
      {activeTab === 'transmittal' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex justify-end no-print">
            <button
              onClick={() => window.print()}
              className="bg-[#27332F] hover:bg-[#1a2320] text-white font-bold text-xs px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="w-3.5 h-3.5 text-[#B69A70]" /> Print Transmittal Document
            </button>
          </div>

          <div className="bg-white p-6 rounded-2xl border-2 border-[#27332F] space-y-5 text-xs max-w-4xl mx-auto shadow-sm">
            <div className="flex justify-between items-start border-b-2 border-[#27332F] pb-3">
              <div>
                <h1 className="text-base font-extrabold uppercase text-[#27332F]">
                  Sharjah Site HSE Management & Statutory Transmittal
                </h1>
                <p className="text-[11px] text-[#826B52] font-semibold mt-0.5">
                  Conforming to UAE Cabinet Resolution No. 33 of 2022 & Sharjah Municipality Regulations
                </p>
              </div>
              <div className="text-right font-mono text-[11px]">
                <p>Date: {new Date().toLocaleDateString('en-GB')}</p>
                <p className="font-bold text-[#826B52]">Ref: SHJ-HSE-TR-2026-001</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-[#F5F0E8] p-3.5 rounded-xl border border-[#E2D8CB]">
              <div><span className="text-[#77746D] block">Project</span><strong>{projectName}</strong></div>
              <div><span className="text-[#77746D] block">Location</span><strong>{projectLoc}</strong></div>
              <div><span className="text-[#77746D] block">Workforce</span><strong>{manpower} Workers</strong></div>
              <div><span className="text-[#77746D] block">Safety Staffing</span><strong>{officersNeeded} Officer(s)</strong></div>
            </div>

            <table className="w-full text-left text-xs border border-[#E2D8CB]">
              <thead className="bg-[#27332F] text-white">
                <tr>
                  <th className="p-2.5">KPI Indicator</th>
                  <th className="p-2.5">Current Value</th>
                  <th className="p-2.5">UAE Standard</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2D8CB]">
                <tr>
                  <td className="p-2.5 font-medium">Accumulated Safe Man-Hours</td>
                  <td className="p-2.5 font-bold text-[#43856B]">{Math.round(totalSafeHours).toLocaleString()}</td>
                  <td className="p-2.5 text-[#77746D]">Zero LTI Target</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-medium">Lost Time Injury Frequency Rate (LTIFR)</td>
                  <td className="p-2.5 font-bold text-[#27332F]">{ltifr}</td>
                  <td className="p-2.5 text-[#77746D]">&lt; 0.50 per 1M hours</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-medium">Active High Risk Permits (PTW)</td>
                  <td className="p-2.5 font-bold text-[#826B52]">{activePTWCount + 2}</td>
                  <td className="p-2.5 text-[#77746D]">SCD & Third-Party Cleared</td>
                </tr>
              </tbody>
            </table>

            <div className="pt-6 grid grid-cols-2 gap-8 text-center border-t-2 border-[#27332F]">
              <div>
                <p className="font-bold text-[#27332F]">Prepared By: HSE Manager</p>
                <p className="text-[10px] text-[#77746D] mt-1">Signature & Stamp</p>
              </div>
              <div>
                <p className="font-bold text-[#27332F]">Approved By: Project Director</p>
                <p className="text-[10px] text-[#77746D] mt-1">Signature & Stamp</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: HIRA */}
      {isHiraModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-white border border-[#E2D8CB] rounded-2xl w-full max-w-md p-5 space-y-4 shadow-2xl text-xs">
            <div className="flex justify-between items-center border-b border-[#E2D8CB] pb-2">
              <h3 className="font-bold text-sm text-[#27332F]">Add HIRA / PTW Entry</h3>
              <button onClick={() => setIsHiraModalOpen(false)} className="text-[#77746D] hover:text-[#27332F]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setHiraList((prev) => [
                  {
                    id: `SHJ-HIRA-${Math.floor(10 + Math.random() * 90)}`,
                    zone: hiraZone || 'Tower A Zone',
                    hazard: hiraHazard || 'General Hazard',
                    sev: Number(hiraSev),
                    like: Number(hiraLike),
                    ptw: hiraPtw,
                    ctrl: hiraCtrl || 'Standard Controls',
                  },
                  ...prev,
                ]);
                setIsHiraModalOpen(false);
              }}
              className="space-y-3"
            >
              <div>
                <label className="block font-bold text-[#77746D] mb-1">Activity Zone</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tower A - Floor 12"
                  value={hiraZone}
                  onChange={(e) => setHiraZone(e.target.value)}
                  className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2"
                />
              </div>
              <div>
                <label className="block font-bold text-[#77746D] mb-1">Identified Hazard</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Work at height edge fall risk"
                  value={hiraHazard}
                  onChange={(e) => setHiraHazard(e.target.value)}
                  className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-bold text-[#77746D] mb-1">Severity (1-5)</label>
                  <select
                    value={hiraSev}
                    onChange={(e) => setHiraSev(Number(e.target.value))}
                    className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2 font-bold"
                  >
                    <option value="1">1 - Minor</option>
                    <option value="2">2 - Low</option>
                    <option value="3">3 - Moderate</option>
                    <option value="4">4 - High</option>
                    <option value="5">5 - Critical</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-[#77746D] mb-1">Likelihood (1-5)</label>
                  <select
                    value={hiraLike}
                    onChange={(e) => setHiraLike(Number(e.target.value))}
                    className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2 font-bold"
                  >
                    <option value="1">1 - Rare</option>
                    <option value="2">2 - Unlikely</option>
                    <option value="3">3 - Possible</option>
                    <option value="4">4 - Likely</option>
                    <option value="5">5 - Almost Certain</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-bold text-[#77746D] mb-1">PTW Type</label>
                <select
                  value={hiraPtw}
                  onChange={(e) => setHiraPtw(e.target.value)}
                  className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2 font-semibold"
                >
                  <option value="Height Work PTW">Height Work PTW</option>
                  <option value="SCD Hot Work PTW">SCD Hot Work PTW</option>
                  <option value="Excavation PTW">Excavation PTW</option>
                  <option value="Electrical Isolation PTW">Electrical Isolation PTW</option>
                  <option value="Confined Space PTW">Confined Space PTW</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-[#77746D] mb-1">Control Measure</label>
                <input
                  type="text"
                  placeholder="Double lanyard safety harness"
                  value={hiraCtrl}
                  onChange={(e) => setHiraCtrl(e.target.value)}
                  className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-[#E2D8CB]">
                <button
                  type="button"
                  onClick={() => setIsHiraModalOpen(false)}
                  className="px-3.5 py-1.5 bg-[#F5F0E8] text-[#27332F] rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#27332F] hover:bg-[#1a2320] text-white rounded-lg font-bold shadow-sm"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
