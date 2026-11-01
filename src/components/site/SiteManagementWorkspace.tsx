import React, { useState, useEffect, useRef } from 'react';
import { useERP } from '../../context/ERPContext';
import {
  HardHat,
  LayoutDashboard,
  ClipboardList,
  FileCode2,
  CheckCircle2,
  ShieldAlert,
  FileClock,
  Users2,
  Truck,
  ShoppingCart,
  DollarSign,
  SearchCheck,
  Briefcase,
  Plus,
  AlertTriangle,
  Sun,
  Flame,
  Check,
  X,
  FileText,
  Printer,
  BarChart3,
  PieChart,
  Droplets,
  Wind,
  Layers,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Compass,
} from 'lucide-react';
import { SiteSubmodule } from '../../types/erp';
import Chart from 'chart.js/auto';
import { SiteOperationsWorkspace } from './SiteOperationsWorkspace';
import { EngineeringTechnicalWorkspace } from './EngineeringTechnicalWorkspace';
import { QAQCWorkspace } from './QAQCWorkspace';
import { HSEWorkspace } from './HSEWorkspace';

export const SiteManagementWorkspace: React.FC = () => {
  const {
    activeProject,
    activeSiteSubmodule,
    setActiveSiteSubmodule,
    dprLogs,
    addDPRLog,
    qaqcItems,
    addQAQCItem,
    hseItems,
    addHSEItem,
    engineeringDocs,
    addEngineeringDoc,
  } = useERP();

  // Chart view toggles on Site Dashboard
  const [barChartMode, setBarChartMode] = useState<'manpower' | 'concrete'>('manpower');
  const [pieChartMode, setPieChartMode] = useState<'qaqc' | 'subcontractors'>('qaqc');

  // Chart Canvas Refs
  const barChartCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const barChartInstanceRef = useRef<Chart | null>(null);

  const pieChartCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const pieChartInstanceRef = useRef<Chart | null>(null);

  // DPR Modal & Form state
  const [showDPRModal, setShowDPRModal] = useState(false);
  const [dprActivities, setDprActivities] = useState('Core wall shuttering inspection; Level 09 slab PT cables stressed; MEP ductwork 1st fix.');
  const [dprDirectManpower, setDprDirectManpower] = useState<number>(48);
  const [dprSubManpower, setDprSubManpower] = useState<number>(154);
  const [dprEquipment, setDprEquipment] = useState('Tower Crane Potain 12T, Boom Pump 42m, Generator 250kVA');
  const [dprWeather, setDprWeather] = useState<'Clear (34°C)' | 'Hot (41°C) - Midday Break Active'>('Clear (34°C)');

  // QA/QC Modal
  const [showQAModal, setShowQAModal] = useState(false);
  const [qaRef, setQaRef] = useState('');
  const [qaType, setQaType] = useState<'WIR (Work Inspection Request)' | 'MIR (Material Inspection Request)' | 'NCR'>('WIR (Work Inspection Request)');
  const [qaLoc, setQaLoc] = useState('');
  const [qaDesc, setQaDesc] = useState('');

  // HSE PTW Modal
  const [showHSEModal, setShowHSEModal] = useState(false);
  const [hseTitle, setHseTitle] = useState('');
  const [hseType, setHseType] = useState<'PTW (Permit to Work)' | 'Toolbox Talk' | 'Safety Audit' | 'Near Miss / Incident'>('PTW (Permit to Work)');
  const [hseLoc, setHseLoc] = useState('');
  const [hseRisk, setHseRisk] = useState<'Low' | 'Medium' | 'High'>('Medium');

  // Engineering RFI Modal
  const [showRFIModal, setShowRFIModal] = useState(false);
  const [rfiRef, setRfiRef] = useState('');
  const [rfiTitle, setRfiTitle] = useState('');
  const [rfiDisc, setRfiDisc] = useState<'Structural' | 'Architectural' | 'MEP' | 'Façade'>('Structural');

  const pDPR = dprLogs.filter((d) => d.projectId === activeProject.id);
  const pQA = qaqcItems.filter((q) => q.projectId === activeProject.id);
  const pHSE = hseItems.filter((h) => h.projectId === activeProject.id);
  const pDocs = engineeringDocs.filter((e) => e.projectId === activeProject.id);

  // Trade workforce dataset for Bar Graph
  const tradeManpowerData = [
    { trade: 'Mivan Formwork', direct: 10, sub: 32 },
    { trade: 'Rebar Steel Fixers', direct: 8, sub: 30 },
    { trade: 'Concrete & Pouring', direct: 6, sub: 14 },
    { trade: 'Blockwork Masons', direct: 4, sub: 20 },
    { trade: 'Scaffolders & Riggers', direct: 4, sub: 14 },
    { trade: 'MEP Technicians', direct: 6, sub: 22 },
    { trade: 'Crane & Plant Operators', direct: 4, sub: 6 },
    { trade: 'Logistics & Helpers', direct: 6, sub: 16 },
  ];

  // Weekly Concrete Pouring dataset for Bar Graph
  const weeklyConcreteData = [
    { day: 'Mon', planned: 120, actual: 125 },
    { day: 'Tue', planned: 150, actual: 148 },
    { day: 'Wed', planned: 180, actual: 185 },
    { day: 'Thu', planned: 200, actual: 195 },
    { day: 'Fri', planned: 60, actual: 65 },
    { day: 'Sat', planned: 140, actual: 142 },
  ];

  // Render Bar Graph & Pie Chart on Site Dashboard
  useEffect(() => {
    if (activeSiteSubmodule !== 'site-dashboard') return;

    // 1. Bar Graph Initialization
    if (barChartCanvasRef.current) {
      if (barChartInstanceRef.current) {
        barChartInstanceRef.current.destroy();
      }

      if (barChartMode === 'manpower') {
        barChartInstanceRef.current = new Chart(barChartCanvasRef.current, {
          type: 'bar',
          data: {
            labels: tradeManpowerData.map((d) => d.trade),
            datasets: [
              {
                label: 'Main Contractor Direct (48 Men)',
                data: tradeManpowerData.map((d) => d.direct),
                backgroundColor: '#0d9488', // teal-600
                borderRadius: 4,
              },
              {
                label: 'Subcontractors Workforce (154 Men)',
                data: tradeManpowerData.map((d) => d.sub),
                backgroundColor: '#d97706', // amber-600
                borderRadius: 4,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                labels: { color: '#94a3b8', font: { size: 10, weight: 'bold' } },
              },
            },
            scales: {
              x: {
                stacked: true,
                ticks: { color: '#94a3b8', font: { size: 9 } },
                grid: { display: false },
              },
              y: {
                stacked: true,
                ticks: { color: '#94a3b8', font: { size: 10 } },
                grid: { color: 'rgba(255, 255, 255, 0.05)' },
              },
            },
          },
        });
      } else {
        // Concrete Weekly Pour Bar Chart
        barChartInstanceRef.current = new Chart(barChartCanvasRef.current, {
          type: 'bar',
          data: {
            labels: weeklyConcreteData.map((d) => d.day),
            datasets: [
              {
                label: 'Planned Concrete (m³)',
                data: weeklyConcreteData.map((d) => d.planned),
                backgroundColor: '#3b82f6', // blue-500
                borderRadius: 4,
              },
              {
                label: 'Actual Concrete Poured (m³)',
                data: weeklyConcreteData.map((d) => d.actual),
                backgroundColor: '#10b981', // emerald-500
                borderRadius: 4,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                labels: { color: '#94a3b8', font: { size: 10, weight: 'bold' } },
              },
            },
            scales: {
              x: {
                ticks: { color: '#94a3b8', font: { size: 10 } },
                grid: { display: false },
              },
              y: {
                ticks: { color: '#94a3b8', font: { size: 10 } },
                grid: { color: 'rgba(255, 255, 255, 0.05)' },
              },
            },
          },
        });
      }
    }

    // 2. Pie / Doughnut Chart Initialization
    if (pieChartCanvasRef.current) {
      if (pieChartInstanceRef.current) {
        pieChartInstanceRef.current.destroy();
      }

      if (pieChartMode === 'qaqc') {
        pieChartInstanceRef.current = new Chart(pieChartCanvasRef.current, {
          type: 'doughnut',
          data: {
            labels: ['Approved WIR (18)', 'Approved w/ Comments (4)', 'Under PMC Review (3)', 'Revise & Resubmit (1)', 'Open NCR (1)'],
            datasets: [
              {
                data: [18, 4, 3, 1, 1],
                backgroundColor: ['#10b981', '#06b6d4', '#f59e0b', '#8b5cf6', '#e11d48'],
                borderWidth: 2,
                borderColor: '#0f172a',
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'right',
                labels: { color: '#94a3b8', font: { size: 10 } },
              },
            },
          },
        });
      } else {
        // Subcontractor Workforce Share Pie Chart
        pieChartInstanceRef.current = new Chart(pieChartCanvasRef.current, {
          type: 'doughnut',
          data: {
            labels: [
              'Al-Bahar Structural (42%)',
              'Gulf Mechanical MEP (22%)',
              'Al-Madar Façade Glazing (14%)',
              'Main Contractor Direct (16%)',
              'Testing & Specialists (6%)',
            ],
            datasets: [
              {
                data: [85, 44, 28, 33, 12],
                backgroundColor: ['#d97706', '#3b82f6', '#ec4899', '#0d9488', '#a855f7'],
                borderWidth: 2,
                borderColor: '#0f172a',
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'right',
                labels: { color: '#94a3b8', font: { size: 10 } },
              },
            },
          },
        });
      }
    }

    return () => {
      if (barChartInstanceRef.current) barChartInstanceRef.current.destroy();
      if (pieChartInstanceRef.current) pieChartInstanceRef.current.destroy();
    };
  }, [activeSiteSubmodule, barChartMode, pieChartMode, activeProject]);

  const handleSaveDPR = (e: React.FormEvent) => {
    e.preventDefault();
    addDPRLog({
      id: `DPR-${new Date().toISOString().split('T')[0]}`,
      projectId: activeProject.id,
      date: new Date().toISOString().split('T')[0],
      shift: 'Day',
      weather: dprWeather,
      manpowerDirect: dprDirectManpower,
      manpowerSubcontractor: dprSubManpower,
      majorActivities: dprActivities.split(';').map((s) => s.trim()),
      equipmentOperating: dprEquipment.split(',').map((s) => s.trim()),
      materialConsumed: ['52 m³ Concrete C40/50', '9.4 MT Rebar 20mm', '1,400 Blocks'],
      delaysOrBottlenecks: 'None. Floor cycle maintained.',
      supervisorSignature: 'Rajesh Kumar (Foreman) & Amil Solanki (PM)',
      approvedByPM: true,
    });
    setShowDPRModal(false);
  };

  const handleSaveQA = (e: React.FormEvent) => {
    e.preventDefault();
    addQAQCItem({
      id: `QA-${Date.now()}`,
      projectId: activeProject.id,
      refNo: qaRef || `WIR-STR-${Math.floor(100 + Math.random() * 900)}`,
      type: qaType,
      location: qaLoc,
      description: qaDesc,
      consultantStatus: 'Approved',
      inspectionDate: new Date().toISOString().split('T')[0],
    });
    setShowQAModal(false);
    setQaRef('');
    setQaLoc('');
    setQaDesc('');
  };

  const handleSaveHSE = (e: React.FormEvent) => {
    e.preventDefault();
    addHSEItem({
      id: `HSE-${Date.now()}`,
      projectId: activeProject.id,
      type: hseType,
      title: hseTitle,
      location: hseLoc,
      riskLevel: hseRisk,
      status: 'Active / Permitted',
      assignedOfficer: 'Tariq Mansoor (HSE Officer)',
      date: new Date().toISOString().split('T')[0],
    });
    setShowHSEModal(false);
    setHseTitle('');
    setHseLoc('');
  };

  const handleSaveRFI = (e: React.FormEvent) => {
    e.preventDefault();
    addEngineeringDoc({
      id: `ENG-${Date.now()}`,
      projectId: activeProject.id,
      type: 'RFI',
      refNo: rfiRef || `RFI-ENG-${Math.floor(100 + Math.random() * 900)}`,
      title: rfiTitle,
      discipline: rfiDisc,
      revision: 'Rev 00',
      status: 'Under Review',
      submissionDate: new Date().toISOString().split('T')[0],
    });
    setShowRFIModal(false);
    setRfiRef('');
    setRfiTitle('');
  };

  return (
    <div className="space-y-6 text-[#27332F]">
      {/* Site Header Banner */}
      <div className="bg-white rounded-xl border border-[#E2D8CB] p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#F2EDE5] text-[#826B52] border border-[#E2D8CB]">
              DIVISION 2 • SITE MANAGEMENT
            </span>
            <span className="text-xs text-[#77746D]">|</span>
            <span className="text-xs text-[#43856B] font-semibold flex items-center gap-1">
              <Sun className="w-3.5 h-3.5" /> Site Active (202 Men on Site)
            </span>
          </div>
          <h2 className="text-[22px] font-bold text-[#27332F] mt-1.5 tracking-tight">
            Site Execution & Construction Operations Command
          </h2>
          <p className="text-[13px] text-[#77746D] max-w-2xl mt-0.5">
            Live site daily progress reports, QA/QC inspection requests (WIR/MIR), MoHRE midday break HSE permits, and heavy plant tracking.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowDPRModal(true)}
            className="h-10 px-4 rounded-[7px] bg-[#27332F] hover:bg-[#34443e] text-white text-[13px] font-medium transition flex items-center gap-2 shadow-sm cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4 text-[#B69A70]" /> Submit Today&apos;s DPR
          </button>
        </div>
      </div>

      {/* ================= SUBMODULE 1: SITE OPERATIONS (SHARJAH SUITE) ================= */}
      {(activeSiteSubmodule === 'site-operations' || activeSiteSubmodule === 'site-dashboard') && (
        <SiteOperationsWorkspace />
      )}

      {/* ================= SUBMODULE 2: DAILY PROGRESS REPORTS (DPR) ================= */}
      {activeSiteSubmodule === 'dpr' && (
        <div className="space-y-6">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-200 flex items-center gap-2">
                  <FileClock className="w-4 h-4 text-amber-400" /> Daily Progress Reports (DPR Archive)
                </h3>
                <p className="text-[11px] text-slate-400">Formal contractor daily logs, shift manpower, and machinery utilization logs.</p>
              </div>
              <button
                onClick={() => setShowDPRModal(true)}
                className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition shadow"
              >
                <Plus className="w-3.5 h-3.5" /> Log New DPR
              </button>
            </div>

            <div className="space-y-4">
              {pDPR.map((dpr) => (
                <div key={dpr.id} className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-3 text-xs">
                  <div className="flex flex-wrap justify-between items-center gap-2 border-b border-slate-800 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-amber-400 text-sm">{dpr.id}</span>
                      <span className="text-slate-400 font-mono">• {dpr.date}</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-bold text-[10px]">
                        Direct: {dpr.manpowerDirect}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 font-bold text-[10px]">
                        Sub: {dpr.manpowerSubcontractor}
                      </span>
                      <span className="text-emerald-400 font-bold text-[10px]">Total: {dpr.manpowerDirect + dpr.manpowerSubcontractor} Men</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Activities Executed Today</span>
                    <ul className="list-disc pl-4 space-y-1 text-slate-200">
                      {dpr.majorActivities.map((a, i) => (
                        <li key={i}>{a}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] pt-1 border-t border-slate-800">
                    <div>
                      <span className="text-slate-500 block">Equipment Deployed:</span>
                      <span className="text-slate-300 font-mono">{dpr.equipmentOperating.join(', ')}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Signoff & Verification:</span>
                      <span className="text-emerald-400 font-semibold">{dpr.supervisorSignature}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= SUBMODULE 3: ENGINEERING & DRAWINGS ================= */}
      {activeSiteSubmodule === 'engineering' && (
        <EngineeringTechnicalWorkspace />
      )}

      {/* ================= SUBMODULE 4: QUALITY CONTROL (QA/QC) ================= */}
      {activeSiteSubmodule === 'qaqc' && (
        <QAQCWorkspace />
      )}

      {/* ================= SUBMODULE 5: HSE & MIDDAY BREAK ================= */}
      {activeSiteSubmodule === 'hse' && (
        <HSEWorkspace />
      )}

      {/* ================= SUBMODULE 6: MACHINERY & TOWER CRANES ================= */}
      {activeSiteSubmodule === 'equipment' && (
        <div className="space-y-6">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4 text-xs">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <Truck className="w-4 h-4 text-amber-400" /> Site Plant, Heavy Machinery & Tower Crane Log
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1">
                <span className="font-bold text-amber-400">Tower Crane #1 (Potain 12T)</span>
                <p className="text-slate-300">55m Jib operating at 92% capacity for reinforcement lifting.</p>
                <span className="text-[10px] text-emerald-400 font-mono font-bold block pt-1">Third-party test certified</span>
              </div>
              <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1">
                <span className="font-bold text-blue-400">Concrete Boom Pump (42m)</span>
                <p className="text-slate-300">Deployed for core wall pour (Grade C40/50 SRC).</p>
                <span className="text-[10px] text-emerald-400 font-mono font-bold block pt-1">Active on Level 09</span>
              </div>
              <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1">
                <span className="font-bold text-teal-400">CAT 250 kVA Standby Generator</span>
                <p className="text-slate-300">Continuous power for tower crane and welding sets.</p>
                <span className="text-[10px] text-emerald-400 font-mono font-bold block pt-1">Fuel: 85% full</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= SUBMODULE 7: AUTHORITY INSPECTIONS ================= */}
      {activeSiteSubmodule === 'inspections' && (
        <div className="space-y-6">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4 text-xs">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <SearchCheck className="w-4 h-4 text-amber-400" /> Municipality & Civil Defence Inspection Gates
            </h3>
            <div className="space-y-3">
              {[
                { auth: 'Sharjah Municipality', inspect: 'Level 08 Slab Post-Tensioning Stressing & Grouting Inspection', date: '2026-10-24', status: 'Passed / Certificate Issued' },
                { auth: 'Civil Defence', inspect: 'Fire Stopping & Shaft Penetration Barrier Inspection', date: '2026-10-18', status: 'Passed with Minor Remarks' },
                { auth: 'SEWA (Electricity & Water)', inspect: 'Permanent Substation Transformer Room Boundary Inspection', date: '2026-10-28', status: 'Pending SEWA Inspector Visit' },
              ].map((ins, i) => (
                <div key={i} className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-amber-400">{ins.auth}</span>
                    <div className="font-semibold text-slate-200 mt-0.5">{ins.inspect}</div>
                    <div className="text-[10px] text-slate-400 font-mono">Inspection Date: {ins.date}</div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold text-[10px]">
                    {ins.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= SUBMODULE 8: SUBCONTRACTORS ================= */}
      {activeSiteSubmodule === 'subcontractors' && (
        <div className="space-y-6">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4 text-xs">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-amber-400" /> On-Site Subcontractor Trade Performance Tracking
            </h3>
            <div className="space-y-3">
              {[
                { name: 'Al-Bahar Structural LLC', trade: 'Civil, Mivan Formwork & PT Slabs', progress: '94% On-Schedule', workers: '85 Men', rating: '4.8 / 5.0' },
                { name: 'Gulf Mechanical & Electrical Co. WLL', trade: 'HVAC Chilled Water & Fire Protection', progress: '90% On-Schedule', workers: '44 Men', rating: '4.7 / 5.0' },
                { name: 'Al-Madar Aluminium & Glass Industries', trade: 'Double Glazed Curtain Wall Façade', progress: '88% On-Schedule', workers: '25 Men', rating: '4.6 / 5.0' },
              ].map((sub, i) => (
                <div key={i} className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 flex flex-wrap justify-between items-center gap-2">
                  <div>
                    <span className="font-bold text-slate-200 text-sm">{sub.name}</span>
                    <p className="text-slate-400">{sub.trade}</p>
                    <span className="text-[10px] text-emerald-400 font-mono font-bold">{sub.progress}</span>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-amber-400 font-bold block">{sub.workers}</span>
                    <span className="text-[10px] text-slate-500">Quality: {sub.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* DPR Modal */}
      {showDPRModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="glass-panel rounded-2xl border border-slate-800 p-6 max-w-lg w-full space-y-4 text-xs">
            <h3 className="font-bold text-sm text-slate-100">Log Daily Progress Report (DPR)</h3>
            <form onSubmit={handleSaveDPR} className="space-y-3">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Executed Activities *</label>
                <textarea
                  required
                  rows={3}
                  value={dprActivities}
                  onChange={(e) => setDprActivities(e.target.value)}
                  placeholder="List activities separated by semicolons..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200"
                ></textarea>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Direct Manpower</label>
                  <input
                    type="number"
                    value={dprDirectManpower}
                    onChange={(e) => setDprDirectManpower(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Subcontractor Manpower</label>
                  <input
                    type="number"
                    value={dprSubManpower}
                    onChange={(e) => setDprSubManpower(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 font-mono font-bold"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-400 font-bold mb-1">Equipment Deployed</label>
                <input
                  type="text"
                  value={dprEquipment}
                  onChange={(e) => setDprEquipment(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button type="button" onClick={() => setShowDPRModal(false)} className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-1.5 bg-amber-600 text-white font-bold rounded-lg">
                  Save Daily Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QA Modal */}
      {showQAModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="glass-panel rounded-2xl border border-slate-800 p-6 max-w-md w-full space-y-4 text-xs">
            <h3 className="font-bold text-sm text-slate-100">Raise Inspection Request (WIR/MIR)</h3>
            <form onSubmit={handleSaveQA} className="space-y-3">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Inspection Type</label>
                <select
                  value={qaType}
                  onChange={(e) => setQaType(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 font-bold"
                >
                  <option value="WIR (Work Inspection Request)">WIR (Work Inspection Request)</option>
                  <option value="MIR (Material Inspection Request)">MIR (Material Inspection Request)</option>
                  <option value="NCR">NCR (Non-Conformance Report)</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-400 font-bold mb-1">Location / Grid Lines *</label>
                <input
                  type="text"
                  required
                  value={qaLoc}
                  onChange={(e) => setQaLoc(e.target.value)}
                  placeholder="e.g. Tower A - Level 09 Shear Wall Grid C-3"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-bold mb-1">Description *</label>
                <input
                  type="text"
                  required
                  value={qaDesc}
                  onChange={(e) => setQaDesc(e.target.value)}
                  placeholder="e.g. Pre-pour rebar inspection & formwork alignment"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button type="button" onClick={() => setShowQAModal(false)} className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-1.5 bg-emerald-600 text-white font-bold rounded-lg">
                  Submit Inspection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* HSE Modal */}
      {showHSEModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="glass-panel rounded-2xl border border-slate-800 p-6 max-w-md w-full space-y-4 text-xs">
            <h3 className="font-bold text-sm text-slate-100">Issue Permit to Work (PTW)</h3>
            <form onSubmit={handleSaveHSE} className="space-y-3">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Permit Title *</label>
                <input
                  type="text"
                  required
                  value={hseTitle}
                  onChange={(e) => setHseTitle(e.target.value)}
                  placeholder="e.g. Hot Works Welding on Façade Anchors"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Location</label>
                  <input
                    type="text"
                    required
                    value={hseLoc}
                    onChange={(e) => setHseLoc(e.target.value)}
                    placeholder="Tower A Level 08"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Risk Level</label>
                  <select
                    value={hseRisk}
                    onChange={(e) => setHseRisk(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 font-bold"
                  >
                    <option value="Low">Low Risk</option>
                    <option value="Medium">Medium Risk</option>
                    <option value="High">High Risk</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button type="button" onClick={() => setShowHSEModal(false)} className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-1.5 bg-amber-600 text-white font-bold rounded-lg">
                  Issue Permit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RFI Modal */}
      {showRFIModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="glass-panel rounded-2xl border border-slate-800 p-6 max-w-md w-full space-y-4 text-xs">
            <h3 className="font-bold text-sm text-slate-100">Submit Engineering RFI</h3>
            <form onSubmit={handleSaveRFI} className="space-y-3">
              <div>
                <label className="block text-slate-400 font-bold mb-1">RFI Title *</label>
                <input
                  type="text"
                  required
                  value={rfiTitle}
                  onChange={(e) => setRfiTitle(e.target.value)}
                  placeholder="e.g. Clarification regarding MEP chilled water sleeve openings"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-bold mb-1">Discipline</label>
                <select
                  value={rfiDisc}
                  onChange={(e) => setRfiDisc(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 font-bold"
                >
                  <option value="Structural">Structural</option>
                  <option value="Architectural">Architectural</option>
                  <option value="MEP">MEP</option>
                  <option value="Façade">Façade</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button type="button" onClick={() => setShowRFIModal(false)} className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-1.5 bg-blue-600 text-white font-bold rounded-lg">
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
