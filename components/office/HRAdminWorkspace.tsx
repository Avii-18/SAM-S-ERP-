import React, { useState, useEffect, useRef } from 'react';
import { useERP } from '../../context/ERPContext';
import { HREmployee, CampFacility, SiteAsset } from '../../types/erp';
import {
  UserCheck,
  UserPlus,
  IdCard,
  Banknote,
  Tent,
  Laptop,
  FolderTree,
  Plus,
  FileDown,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Calendar,
  Layers,
  Sparkles,
  Calculator,
} from 'lucide-react';
import Chart from 'chart.js/auto';

export const HRAdminWorkspace: React.FC = () => {
  const {
    activeProject,
    employees,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    camps,
    addCamp,
    assets,
    addAsset,
    activeSubPage,
    setActiveSubPage,
  } = useERP();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'recruitment' | 'visas' | 'wps' | 'welfare' | 'assets' | 'directory'>('dashboard');

  useEffect(() => {
    if (activeSubPage === 'hr-dashboard') setActiveTab('dashboard');
    else if (activeSubPage === 'hr-recruitment') setActiveTab('recruitment');
    else if (activeSubPage === 'hr-visas') setActiveTab('visas');
    else if (activeSubPage === 'hr-wps') setActiveTab('wps');
    else if (activeSubPage === 'hr-camp') setActiveTab('welfare');
    else if (activeSubPage === 'hr-assets') setActiveTab('assets');
  }, [activeSubPage]);

  // Candidates Pipeline State
  const [candidates, setCandidates] = useState([
    { id: 1, name: 'Amil Solanki', role: 'Project Manager Operations', dept: 'Project Engineering', qual: 'Indian (16 Yrs Exp)', salary: 22000, stage: 'Onboarded' },
    { id: 2, name: 'Tariq Mansoor', role: 'Sr. HSE Safety Officer', dept: 'HSE & Safety', qual: 'Pakistani (10 Yrs Exp)', salary: 14000, stage: 'MoHRE Approved' },
    { id: 3, name: 'Siddharth Rao', role: 'Sr. QA/QC Inspector', dept: 'QA/QC Inspection', qual: 'Indian (8 Yrs Exp)', salary: 12500, stage: 'Offer Issued' },
    { id: 4, name: 'Mahmoud Al-Sayed', role: 'Public Relations Officer (PRO)', dept: 'PRO & Site Admin', qual: 'Egyptian (12 Yrs Exp)', salary: 11000, stage: 'Onboarded' },
    { id: 5, name: 'Steel Fixer Batch (40 Tradesmen)', role: 'Structural Steel Fixers', dept: 'Site Masons & Steel Fixers', qual: 'Overseas Trade Certified', salary: 3200, stage: 'MoHRE Approved' }
  ]);

  // Modals
  const [showCandModal, setShowCandModal] = useState(false);
  const [cName, setCName] = useState('');
  const [cRole, setCRole] = useState('');
  const [cDept, setCDept] = useState('Project Engineering');
  const [cSalary, setCSalary] = useState<number>(12000);

  const [showVisaModal, setShowVisaModal] = useState(false);
  const [vName, setVName] = useState('');
  const [vPassport, setVPassport] = useState('');
  const [vEID, setVEID] = useState('');
  const [vExpDate, setVExpDate] = useState('2026-11-20');

  const [showAssetModal, setShowAssetModal] = useState(false);
  const [aCode, setACode] = useState('AST-006');
  const [aDesc, setADesc] = useState('');
  const [aCat, setACat] = useState<SiteAsset['category']>('IT & Laptops');
  const [aStaff, setAStaff] = useState('Amil Solanki');

  // Chart Refs
  const deptBarRef = useRef<HTMLCanvasElement | null>(null);
  const deptBarInstance = useRef<Chart | null>(null);

  const visaPieRef = useRef<HTMLCanvasElement | null>(null);
  const visaPieInstance = useRef<Chart | null>(null);

  // Calculations
  const today = new Date();
  let expiringVisasCount = 0;
  let expiredVisasCount = 0;

  employees.forEach((e) => {
    const exp = new Date(e.visaExpiry);
    const diff = Math.ceil((exp.getTime() - today.getTime()) / (1000 * 3600 * 24));
    if (diff <= 0) expiredVisasCount++;
    else if (diff <= 30) expiringVisasCount++;
  });

  const totalCampCap = camps.reduce((s, c) => s + c.capacity, 0);
  const totalCampOcc = camps.reduce((s, c) => s + c.occupancy, 0);
  const campOccupancyRate = totalCampCap > 0 ? Math.round((totalCampOcc / totalCampCap) * 100) : 82;

  // Chart Rendering
  useEffect(() => {
    if (activeTab !== 'dashboard') return;

    if (deptBarRef.current) {
      if (deptBarInstance.current) deptBarInstance.current.destroy();

      deptBarInstance.current = new Chart(deptBarRef.current, {
        type: 'bar',
        data: {
          labels: ['Engineering', 'HSE Safety', 'QA/QC', 'PRO Admin', 'Masons & Trade Gangs'],
          datasets: [
            { label: 'Current Onboarded Workforce', data: [14, 4, 8, 3, 186], backgroundColor: '#0d9488' },
            { label: 'MoHRE Parametric Benchmark', data: [14, 3, 9, 2, 215], backgroundColor: '#334155' },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { labels: { color: '#94a3b8', font: { size: 10 } } } },
          scales: {
            x: { ticks: { color: '#64748b', font: { size: 10 } }, grid: { display: false } },
            y: { ticks: { color: '#64748b', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.05)' } },
          },
        },
      });
    }

    if (visaPieRef.current) {
      if (visaPieInstance.current) visaPieInstance.current.destroy();

      visaPieInstance.current = new Chart(visaPieRef.current, {
        type: 'doughnut',
        data: {
          labels: ['Valid Visas & EID', 'Expiring < 30 Days', 'Expired Credentials'],
          datasets: [
            {
              data: [employees.length - expiringVisasCount - expiredVisasCount, expiringVisasCount, expiredVisasCount],
              backgroundColor: ['#059669', '#d97706', '#e11d48'],
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

    return () => {
      if (deptBarInstance.current) deptBarInstance.current.destroy();
      if (visaPieInstance.current) visaPieInstance.current.destroy();
    };
  }, [activeTab, employees, expiringVisasCount, expiredVisasCount]);

  const handleSaveCandidate = (e: React.FormEvent) => {
    e.preventDefault();
    setCandidates((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: cName,
        role: cRole,
        dept: cDept,
        qual: 'Overseas Trade Certified',
        salary: cSalary,
        stage: 'MoHRE Approved',
      },
    ]);
    setShowCandModal(false);
    setCName('');
    setCRole('');
  };

  const handleSaveVisa = (e: React.FormEvent) => {
    e.preventDefault();
    addEmployee({
      id: `EMP-${Date.now()}`,
      empCode: `AE-${Math.floor(1000 + Math.random() * 9000)}`,
      name: vName,
      designation: 'Site Operations Specialist',
      department: 'Site Execution',
      nationality: 'Indian',
      passportNo: vPassport,
      eidNumber: vEID,
      eidExpiry: vExpDate,
      visaType: 'Employment (Sharjah / Dubai)',
      visaExpiry: vExpDate,
      laborCardNo: `LC-${Math.floor(100000 + Math.random() * 900000)}`,
      laborCardExpiry: vExpDate,
      basicSalary: 6000,
      allowances: 3000,
      yearsOfService: 1.5,
      accruedEOSB: 9000,
      campBlock: "Saja'a Block A",
      status: 'Active',
    });
    setShowVisaModal(false);
    setVName('');
    setVPassport('');
    setVEID('');
  };

  const handleSaveAsset = (e: React.FormEvent) => {
    e.preventDefault();
    addAsset({
      id: `AST-${Date.now()}`,
      code: aCode,
      description: aDesc,
      category: aCat,
      assignedTo: aStaff,
      condition: 'Excellent',
      maintenanceDueDate: '2026-12-31',
      valueAED: 15000,
    });
    setShowAssetModal(false);
    setADesc('');
  };

  const exportSIFPayroll = () => {
    let sif = 'CIB,Employee Card,Agent Bank,Salary,Basic,Allowances,OT,Pay Month\n';
    employees.forEach((emp) => {
      const gross = emp.basicSalary + emp.allowances;
      sif += `SHJ_EST_101,${emp.laborCardNo},BANK_ENBD_01,${gross},${emp.basicSalary},${emp.allowances},0,10/2026\n`;
    });
    const blob = new Blob([sif], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeProject.code}_MoHRE_WPS_Payroll.sif`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Navigation Sub-Tabs */}
      <div className="glass-panel rounded-2xl border border-slate-800 p-1 flex overflow-x-auto text-xs no-print">
        {[
          { id: 'dashboard', name: '200+ Manpower Overview', icon: UserCheck },
          { id: 'recruitment', name: 'Recruitment & MoHRE Quotas', icon: UserPlus },
          { id: 'visas', name: 'Visas, EID & Passports Tracker', icon: IdCard },
          { id: 'wps', name: 'WPS Payroll & EOSB Gratuity', icon: Banknote },
          { id: 'welfare', name: "Saja'a Camp & Midday Break", icon: Tent },
          { id: 'assets', name: 'Site Office Assets & Vehicles', icon: Laptop },
          { id: 'directory', name: 'Virtual HR Tree', icon: FolderTree },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setActiveSubPage(`hr-${tab.id}`);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold whitespace-nowrap transition ${
                isActive
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* ================= TAB 1: 200+ MANPOWER OVERVIEW ================= */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Total Site Workforce</span>
              <div className="text-2xl font-black text-slate-100 font-mono">215</div>
              <span className="text-[10px] text-slate-500">Peak Scale: 250</span>
            </div>

            <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">MoHRE Quota Approved</span>
              <div className="text-2xl font-black text-teal-400 font-mono">250</div>
              <span className="text-[10px] text-teal-500">Approved Permits</span>
            </div>

            <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Visas Expiring (&lt;30d)</span>
              <div className="text-2xl font-black text-amber-400 font-mono">{expiringVisasCount}</div>
              <span className="text-[10px] text-amber-500 font-semibold">Priority Renewal</span>
            </div>

            <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Expired Credentials</span>
              <div className="text-2xl font-black text-rose-400 font-mono">{expiredVisasCount}</div>
              <span className="text-[10px] text-rose-500">Fine Risk: AED 50/day</span>
            </div>

            <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Saja&apos;a Camp Occupancy</span>
              <div className="text-2xl font-black text-blue-400 font-mono">{campOccupancyRate}%</div>
              <span className="text-[10px] text-slate-500">{totalCampOcc} / {totalCampCap} Beds</span>
            </div>

            <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">WPS SIF Compliance</span>
              <div className="text-2xl font-black text-emerald-400 font-mono">100%</div>
              <span className="text-[10px] text-emerald-500">MoHRE Compliant</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Workforce Trade Distribution vs MoHRE Parametric Benchmark (200+ Enterprise)
              </h3>
              <div className="h-64">
                <canvas ref={deptBarRef}></canvas>
              </div>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Residency Visas, Emirates ID & Passports Expiry Health
              </h3>
              <div className="h-64">
                <canvas ref={visaPieRef}></canvas>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: RECRUITMENT & MOHRE QUOTAS ================= */}
      {activeTab === 'recruitment' && (
        <div className="space-y-6">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-200 flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-teal-400" /> MoHRE Work Permits, Quotas & Talent Pipeline
                </h3>
                <p className="text-[11px] text-slate-400">
                  Track candidate requisitions, MoHRE quota approvals, offer letters and visa stamping.
                </p>
              </div>
              <button
                onClick={() => setShowCandModal(true)}
                className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition shadow"
              >
                <Plus className="w-3.5 h-3.5" /> Add Candidate
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 text-slate-400 uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Candidate Name</th>
                    <th className="p-3">Designation / Role</th>
                    <th className="p-3">MoHRE Category</th>
                    <th className="p-3">Nationality / Background</th>
                    <th className="p-3 text-right">Gross Pay</th>
                    <th className="p-3 text-center">Stage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {candidates.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-900/40">
                      <td className="p-3 font-bold text-slate-200">{c.name}</td>
                      <td className="p-3 text-slate-300">{c.role}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 font-semibold text-[10px]">
                          {c.dept}
                        </span>
                      </td>
                      <td className="p-3 text-slate-400">{c.qual}</td>
                      <td className="p-3 text-right font-mono font-bold text-emerald-400">
                        AED {c.salary.toLocaleString()}
                      </td>
                      <td className="p-3 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-800 text-teal-300 border border-slate-700">
                          {c.stage}
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

      {/* ================= TAB 3: VISAS, EID & GATE PASSES ================= */}
      {activeTab === 'visas' && (
        <div className="space-y-6">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-200 flex items-center gap-2">
                  <IdCard className="w-4 h-4 text-teal-400" /> Residency Visas, Emirates ID & Sharjah Gate Passes
                </h3>
                <p className="text-[11px] text-slate-400">Real-time expiry tracking with automated MoHRE fine risk prevention.</p>
              </div>
              <button
                onClick={() => setShowVisaModal(true)}
                className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition shadow"
              >
                <Plus className="w-3.5 h-3.5" /> Log Credential
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 text-slate-400 uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Employee Name</th>
                    <th className="p-3">Passport #</th>
                    <th className="p-3">Emirates ID (EID)</th>
                    <th className="p-3">Visa Expiry</th>
                    <th className="p-3 text-center">Days Left</th>
                    <th className="p-3 text-center">Status</th>
                    <th className="p-3 text-center no-print">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {employees.map((emp) => {
                    const exp = new Date(emp.visaExpiry);
                    const diff = Math.ceil((exp.getTime() - today.getTime()) / (1000 * 3600 * 24));
                    let badgeClass = 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
                    let statusLabel = 'Valid';

                    if (diff <= 0) {
                      badgeClass = 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
                      statusLabel = 'EXPIRED';
                    } else if (diff <= 30) {
                      badgeClass = 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
                      statusLabel = 'Expiring Soon';
                    }

                    return (
                      <tr key={emp.id} className="hover:bg-slate-900/40">
                        <td className="p-3 font-sans font-bold text-slate-200">
                          {emp.name}
                          <span className="block text-[10px] text-slate-500 font-mono">{emp.designation}</span>
                        </td>
                        <td className="p-3 text-slate-300">{emp.passportNo}</td>
                        <td className="p-3 text-slate-300">{emp.eidNumber}</td>
                        <td className="p-3 font-bold text-slate-200">{emp.visaExpiry}</td>
                        <td className={`p-3 text-center font-bold ${diff <= 0 ? 'text-rose-400' : diff <= 30 ? 'text-amber-400' : 'text-emerald-400'}`}>
                          {diff} Days
                        </td>
                        <td className="p-3 text-center font-sans">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${badgeClass}`}>
                            {statusLabel}
                          </span>
                        </td>
                        <td className="p-3 text-center no-print">
                          <button onClick={() => deleteEmployee(emp.id)} className="p-1 hover:text-rose-400 text-slate-500">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 4: WPS PAYROLL & EOSB GRATUITY ================= */}
      {activeTab === 'wps' && (
        <div className="space-y-6">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-200 flex items-center gap-2">
                  <Banknote className="w-4 h-4 text-teal-400" /> Wages Protection System (WPS) & EOSB Gratuity Engine
                </h3>
                <p className="text-[11px] text-slate-400">
                  MoHRE compliant SIF salary file generation & Federal Decree-Law No. 33 End of Service Gratuity calculations.
                </p>
              </div>
              <button
                onClick={exportSIFPayroll}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition"
              >
                <FileDown className="w-3.5 h-3.5" /> Export MoHRE SIF File
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 text-slate-400 uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Staff Name</th>
                    <th className="p-3">Labour Card #</th>
                    <th className="p-3 text-right">Basic Salary</th>
                    <th className="p-3 text-right">Allowances</th>
                    <th className="p-3 text-right">Gross Pay</th>
                    <th className="p-3 text-center">Service (Yrs)</th>
                    <th className="p-3 text-right">Accrued EOSB Gratuity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {employees.map((emp) => {
                    // Federal Law 33: 21 days basic salary for each of first 5 years, 30 days for subsequent years
                    const basicPerDay = emp.basicSalary / 30;
                    const years = emp.yearsOfService;
                    let eosb = 0;
                    if (years <= 5) eosb = basicPerDay * 21 * years;
                    else eosb = basicPerDay * 21 * 5 + basicPerDay * 30 * (years - 5);

                    return (
                      <tr key={emp.id} className="hover:bg-slate-900/40">
                        <td className="p-3 font-sans font-bold text-slate-200">{emp.name}</td>
                        <td className="p-3 text-slate-400">{emp.laborCardNo}</td>
                        <td className="p-3 text-right text-slate-200">AED {emp.basicSalary.toLocaleString()}</td>
                        <td className="p-3 text-right text-slate-400">AED {emp.allowances.toLocaleString()}</td>
                        <td className="p-3 text-right font-bold text-emerald-400">
                          AED {(emp.basicSalary + emp.allowances).toLocaleString()}
                        </td>
                        <td className="p-3 text-center text-slate-300">{emp.yearsOfService} Yrs</td>
                        <td className="p-3 text-right font-black text-indigo-400">
                          AED {Math.round(eosb).toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 5: SAJA'A CAMP & WELFARE ================= */}
      {activeTab === 'welfare' && (
        <div className="space-y-6">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4 text-xs">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <Tent className="w-4 h-4 text-teal-400" /> Saja&apos;a Labour Camp & Worker Welfare Facilities
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {camps.map((c) => (
                <div key={c.id} className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-200">{c.name}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
                      {c.sanitationAudit}
                    </span>
                  </div>
                  <div className="text-slate-400 font-mono">Location: {c.location}</div>
                  <div className="flex justify-between text-slate-300 font-mono pt-1 border-t border-slate-800">
                    <span>Capacity: {c.capacity} Beds</span>
                    <span className="text-teal-400 font-bold">Occupancy: {c.occupancy} Beds ({Math.round((c.occupancy / c.capacity) * 100)}%)</span>
                  </div>
                  <div className="text-[10px] text-slate-500">Transport: {c.transportAllocation}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 6: SITE ASSETS & FLEET ================= */}
      {activeTab === 'assets' && (
        <div className="space-y-6">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-200 flex items-center gap-2">
                  <Laptop className="w-4 h-4 text-teal-400" /> Site Office Assets, Vehicles & Surveying Gear
                </h3>
                <p className="text-[11px] text-slate-400">Track computers, Leica Total Stations, pickups, DG generators and radios.</p>
              </div>
              <button
                onClick={() => setShowAssetModal(true)}
                className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition shadow"
              >
                <Plus className="w-3.5 h-3.5" /> Register Asset
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 text-slate-400 uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Asset Code</th>
                    <th className="p-3 min-w-[200px]">Description</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Assigned User</th>
                    <th className="p-3">Condition</th>
                    <th className="p-3">Maintenance Due</th>
                    <th className="p-3 text-right">Value (AED)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {assets.map((a) => (
                    <tr key={a.id} className="hover:bg-slate-900/40">
                      <td className="p-3 font-bold text-teal-400">{a.code}</td>
                      <td className="p-3 font-sans text-slate-200 font-bold">{a.description}</td>
                      <td className="p-3 font-sans text-slate-400">{a.category}</td>
                      <td className="p-3 font-sans text-slate-300">{a.assignedTo}</td>
                      <td className="p-3 font-sans">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
                          {a.condition}
                        </span>
                      </td>
                      <td className="p-3 text-slate-400">{a.maintenanceDueDate}</td>
                      <td className="p-3 text-right font-bold text-slate-200">AED {a.valueAED.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 7: VIRTUAL HR DIRECTORY ================= */}
      {activeTab === 'directory' && (
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 font-mono text-xs space-y-3">
            <div className="flex items-center text-teal-400 font-bold text-sm">
              <FolderTree className="w-4 h-4 mr-2" /> 📁 [{activeProject.code}_HR_AND_LABOUR_COMPLIANCE]
            </div>
            <div className="ml-6 space-y-3 border-l-2 border-slate-800 pl-4 text-xs text-slate-300 font-sans">
              <div>
                <div className="font-bold text-slate-100 font-mono">📂 01_MoHRE_Quotas_and_WorkPermits</div>
                <div className="ml-6 text-slate-400 text-[11px] space-y-0.5 mt-1 font-mono">
                  <div>📄 Approved_Workforce_Quota_250.pdf</div>
                  <div>📄 Labour_Establishment_Card_Sharjah.pdf</div>
                </div>
              </div>
              <div>
                <div className="font-bold text-slate-100 font-mono">📂 02_WPS_SIF_Salary_Transfer_Files</div>
                <div className="ml-6 text-slate-400 text-[11px] space-y-0.5 mt-1 font-mono">
                  <div>📄 SIF_Transfer_Oct_2026.sif</div>
                  <div>📄 Bank_Compliance_Receipt_ENBD.pdf</div>
                </div>
              </div>
              <div>
                <div className="font-bold text-slate-100 font-mono">📂 03_Saja_Camp_and_MiddayBreak_Audits</div>
                <div className="ml-6 text-slate-400 text-[11px] space-y-0.5 mt-1 font-mono">
                  <div>📄 MoHRE_Summer_Midday_Break_Inspection_Log.pdf</div>
                  <div>📄 Camp_Sanitation_CivilDefence_NOC.pdf</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Candidate Modal */}
      {showCandModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="glass-panel rounded-2xl border border-slate-800 p-6 max-w-md w-full space-y-4 text-xs">
            <h3 className="font-bold text-sm text-slate-100">Add Candidate / Work Permit Demand</h3>
            <form onSubmit={handleSaveCandidate} className="space-y-3">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Candidate Name *</label>
                <input
                  type="text"
                  required
                  value={cName}
                  onChange={(e) => setCName(e.target.value)}
                  placeholder="e.g. Tariq Mansoor"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-bold mb-1">Designation *</label>
                <input
                  type="text"
                  required
                  value={cRole}
                  onChange={(e) => setCRole(e.target.value)}
                  placeholder="e.g. Senior Site Engineer"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Department</label>
                  <select
                    value={cDept}
                    onChange={(e) => setCDept(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 font-bold"
                  >
                    <option value="Project Engineering">Project Engineering</option>
                    <option value="HSE & Safety">HSE & Safety</option>
                    <option value="QA/QC Inspection">QA/QC Inspection</option>
                    <option value="PRO & Site Admin">PRO & Site Admin</option>
                    <option value="Site Trade Gangs">Site Trade Gangs</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Gross Salary (AED)</label>
                  <input
                    type="number"
                    value={cSalary}
                    onChange={(e) => setCSalary(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 font-mono font-bold text-emerald-400"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button type="button" onClick={() => setShowCandModal(false)} className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-1.5 bg-teal-600 text-white font-bold rounded-lg">
                  Save Candidate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Visa Modal */}
      {showVisaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="glass-panel rounded-2xl border border-slate-800 p-6 max-w-md w-full space-y-4 text-xs">
            <h3 className="font-bold text-sm text-slate-100">Log Residency Visa & Emirates ID</h3>
            <form onSubmit={handleSaveVisa} className="space-y-3">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Employee Name *</label>
                <input
                  type="text"
                  required
                  value={vName}
                  onChange={(e) => setVName(e.target.value)}
                  placeholder="e.g. Amil Solanki"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Passport Number</label>
                  <input
                    type="text"
                    required
                    value={vPassport}
                    onChange={(e) => setVPassport(e.target.value)}
                    placeholder="Z9876543"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Emirates ID (EID)</label>
                  <input
                    type="text"
                    required
                    value={vEID}
                    onChange={(e) => setVEID(e.target.value)}
                    placeholder="784-1985-1234567-1"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-400 font-bold mb-1">Visa Expiry Date</label>
                <input
                  type="date"
                  required
                  value={vExpDate}
                  onChange={(e) => setVExpDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 font-mono font-bold"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button type="button" onClick={() => setShowVisaModal(false)} className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-1.5 bg-teal-600 text-white font-bold rounded-lg">
                  Save Credential
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Asset Modal */}
      {showAssetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="glass-panel rounded-2xl border border-slate-800 p-6 max-w-md w-full space-y-4 text-xs">
            <h3 className="font-bold text-sm text-slate-100">Register Site Office Asset / Vehicle</h3>
            <form onSubmit={handleSaveAsset} className="space-y-3">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Asset Code</label>
                <input
                  type="text"
                  required
                  value={aCode}
                  onChange={(e) => setACode(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-bold mb-1">Description *</label>
                <input
                  type="text"
                  required
                  value={aDesc}
                  onChange={(e) => setADesc(e.target.value)}
                  placeholder="e.g. Leica Total Station TS07"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Category</label>
                  <select
                    value={aCat}
                    onChange={(e) => setACat(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 font-bold"
                  >
                    <option value="IT & Laptops">IT & Laptops</option>
                    <option value="Survey Equipment">Survey Equipment</option>
                    <option value="Site Pickups & DG Sets">Site Pickups & DG Sets</option>
                    <option value="Heavy Machinery">Heavy Machinery</option>
                    <option value="Safety & Radios">Safety & Radios</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Assigned Staff</label>
                  <input
                    type="text"
                    value={aStaff}
                    onChange={(e) => setAStaff(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button type="button" onClick={() => setShowAssetModal(false)} className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-1.5 bg-teal-600 text-white font-bold rounded-lg">
                  Register Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
