import React, { useState, useEffect, useRef } from 'react';
import { useERP } from '../../context/ERPContext';
import {
  HardHat,
  Sliders,
  CalendarDays,
  ListCheck,
  ClipboardList,
  Truck,
  Boxes,
  Ruler,
  Network,
  FolderTree,
  Plus,
  Download,
  Upload,
  Printer,
  AlertTriangle,
  Building,
  MapPin,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  X,
  FileSpreadsheet,
  FileCode2,
  FileText,
  ShieldCheck,
  Zap,
  Check,
  ChevronRight,
  Sun,
  Flame,
} from 'lucide-react';
import Chart from 'chart.js/auto';

// Interfaces matching Sharjah Site Operations ERP Suite
interface LookaheadItem {
  id: number;
  actCode: string;
  wbs: string;
  desc: string;
  dwg: string;
  boq: string;
  dates: string;
  qty: string;
}

interface ReadinessItem {
  id: number;
  actCode: string;
  desc: string;
  checkCount: string;
  status: 'READY' | 'BLOCKED';
  blocker: string;
  notes: string;
}

interface DPREntry {
  id: number;
  date: string;
  act: string;
  trades: string;
  hrs: string;
  qty: string;
  sup: string;
  delay: string;
}

interface EquipmentItem {
  id: number;
  code: string;
  desc: string;
  loc: string;
  hrs: number;
  downtime: number;
  fuel: number;
  status: 'Active / Operational' | 'Breakdown / Repair' | 'Idle / Standby';
}

interface MaterialItem {
  id: number;
  desc: string;
  cat: string;
  req: string;
  rec: string;
  con: string;
  waste: number;
  qa: 'Accepted / Cube Passed' | 'Testing Pending' | 'Rejected';
}

interface MeasurementItem {
  id: number;
  refNo: string;
  boq: string;
  desc: string;
  loc: string;
  qty: number;
  rate: number;
  total: number;
  status: 'Handed Over to QS (IPC #14)' | 'Pending QA/QC Signature' | 'Draft / Site Verification';
}

interface SiteProjectData {
  id: string;
  name: string;
  code: string;
  location: string;
  currency: string;
  bua: number;
  peakLabour: number;
  shifts: string;
  lookahead: LookaheadItem[];
  readiness: ReadinessItem[];
  dpr: DPREntry[];
  equipment: EquipmentItem[];
  materials: MaterialItem[];
  measurements: MeasurementItem[];
}

const INITIAL_SITE_PROJECTS: SiteProjectData[] = [
  {
    id: 'site-proj-shj-200',
    name: 'Aljada Residential Tower - Block C',
    code: 'PRJ-SHJ-200',
    location: 'Aljada, Sharjah, UAE',
    currency: 'AED',
    bua: 350000,
    peakLabour: 220,
    shifts: '6_DAYS_DAY_NIGHT',
    lookahead: [
      { id: 101, actCode: 'W42-ACT-108', wbs: 'L12 Zone A Core', desc: 'Level 12 Slab Concrete Pour 2', dwg: 'DWG-SHJ-STR-L12-04', boq: 'BOQ-3.02', dates: '28 Oct - 30 Oct 2026', qty: '420 m³' },
      { id: 102, actCode: 'W42-ACT-109', wbs: 'L12 Zone B Slab', desc: 'Level 12 Slab Formwork & Rebar Fixing', dwg: 'DWG-SHJ-STR-L12-05', boq: 'BOQ-3.01', dates: '01 Nov - 05 Nov 2026', qty: '580 m²' },
      { id: 103, actCode: 'W42-ACT-110', wbs: 'L11 MEP Shafts', desc: 'Plumbing Riser Pipe Installation', dwg: 'DWG-SHJ-MEP-L11-02', boq: 'BOQ-5.12', dates: '02 Nov - 06 Nov 2026', qty: '120 m' },
    ],
    readiness: [
      { id: 1, actCode: 'W42-ACT-108', desc: 'L12 Slab Concrete Pour 2', checkCount: '6/6', status: 'READY', blocker: 'None', notes: 'All IFC drawings, rebar, ready-mix booked, RFI clear.' },
      { id: 2, actCode: 'W42-ACT-109', desc: 'L12 Zone B Formwork & Rebar', checkCount: '4/6', status: 'BLOCKED', blocker: 'Missing IFC Drawings', notes: 'Awaiting Consultant Rev B architectural clearance.' },
      { id: 3, actCode: 'W42-ACT-110', desc: 'L11 MEP Shaft Riser Piping', checkCount: '3/6', status: 'BLOCKED', blocker: 'Material Shortages', notes: '3-inch uPVC riser pipes pending delivery from supplier.' },
    ],
    dpr: [
      { id: 1, date: '2026-10-30', act: 'L12 Slab Concrete Pour 2', trades: '18 Masons, 24 Fixers, 12 Labourers', hrs: '10 Hrs (Day)', qty: '420 m³', sup: 'Eng. Rajesh V.', delay: 'Pump pipeline clogged 20 mins - Cleared' },
      { id: 2, date: '2026-10-29', act: 'L12 Slab Rebar Inspection', trades: '30 Steel Fixers, 4 Foremen', hrs: '10 Hrs (Day)', qty: '38 Ton Rebar', sup: 'Eng. Tariq M.', delay: 'None' },
    ],
    equipment: [
      { id: 1, code: 'EQ-TC-01', desc: 'Liebherr 12 Ton Tower Crane', loc: 'Core Zone A', hrs: 9.5, downtime: 0.5, fuel: 180, status: 'Active / Operational' },
      { id: 2, code: 'EQ-CP-02', desc: 'Putzmeister Concrete Pump', loc: 'Ground Yard', hrs: 6.0, downtime: 0.0, fuel: 140, status: 'Active / Operational' },
      { id: 3, code: 'EQ-TS-04', desc: 'Leica Total Station TS07', loc: 'L12 Survey Grid', hrs: 8.0, downtime: 0.0, fuel: 0, status: 'Active / Operational' },
    ],
    materials: [
      { id: 1, desc: 'Ready-Mix Concrete C50/60', cat: 'Concrete & Aggregates', req: '450 m³', rec: '420 m³', con: '420 m³', waste: 0.8, qa: 'Accepted / Cube Passed' },
      { id: 2, desc: 'High Yield Steel Rebar T16-T32', cat: 'Steel Rebar', req: '50 MT', rec: '50 MT', con: '38 MT', waste: 1.1, qa: 'Accepted / Cube Passed' },
    ],
    measurements: [
      { id: 1, refNo: 'JMR-SHJ-1042', boq: 'BOQ-3.02', desc: 'L12 Concrete Slab Pour 2', loc: 'L12 Zone A Core', qty: 420, rate: 450, total: 189000, status: 'Handed Over to QS (IPC #14)' },
      { id: 2, refNo: 'JMR-SHJ-1041', boq: 'BOQ-3.01', desc: 'L11 Concrete Slab Structural', loc: 'L11 Complete', qty: 950, rate: 450, total: 427500, status: 'Handed Over to QS (IPC #14)' },
    ],
  },
];

export const SiteOperationsWorkspace: React.FC = () => {
  // Navigation active tab
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'setup' | 'lookahead' | 'readiness' | 'dpr' | 'equipment' | 'materials' | 'measurements' | 'crossdept' | 'folders'
  >('dashboard');

  const [siteProjects, setSiteProjects] = useState<SiteProjectData[]>(() => {
    const saved = localStorage.getItem('sharjah_site_erp_state_2026');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse site projects storage', e);
      }
    }
    return INITIAL_SITE_PROJECTS;
  });

  const [currentProjectId, setCurrentProjectId] = useState<string>('site-proj-shj-200');

  const activeProject = siteProjects.find((p) => p.id === currentProjectId) || siteProjects[0];

  // Save state helper
  const saveProjectsState = (updated: SiteProjectData[]) => {
    setSiteProjects(updated);
    localStorage.setItem('sharjah_site_erp_state_2026', JSON.stringify(updated));
  };

  // Modals state
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [isLookaheadModalOpen, setIsLookaheadModalOpen] = useState(false);
  const [isDPRModalOpen, setIsDPRModalOpen] = useState(false);
  const [isEquipmentModalOpen, setIsEquipmentModalOpen] = useState(false);
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
  const [isMeasurementModalOpen, setIsMeasurementModalOpen] = useState(false);
  const [crossDeptToast, setCrossDeptToast] = useState<string | null>(null);

  // Form states
  const [newProjName, setNewProjName] = useState('');
  const [newProjBua, setNewProjBua] = useState(300000);
  const [newProjPeak, setNewProjPeak] = useState(200);

  const [actCode, setActCode] = useState('');
  const [actWbs, setActWbs] = useState('');
  const [actDesc, setActDesc] = useState('');
  const [actDwg, setActDwg] = useState('');
  const [actBoq, setActBoq] = useState('');
  const [actDates, setActDates] = useState('');
  const [actQty, setActQty] = useState('');

  const [dprDate, setDprDate] = useState(new Date().toISOString().split('T')[0]);
  const [dprAct, setDprAct] = useState('');
  const [dprTrades, setDprTrades] = useState('');
  const [dprHrs, setDprHrs] = useState('10 Hrs (Day)');
  const [dprQty, setDprQty] = useState('');
  const [dprSup, setDprSup] = useState('Eng. Rajesh V.');
  const [dprDelay, setDprDelay] = useState('None');

  const [eqCode, setEqCode] = useState('');
  const [eqDesc, setEqDesc] = useState('');
  const [eqLoc, setEqLoc] = useState('');
  const [eqHrs, setEqHrs] = useState(9.5);
  const [eqDowntime, setEqDowntime] = useState(0);
  const [eqFuel, setEqFuel] = useState(150);
  const [eqStatus, setEqStatus] = useState<EquipmentItem['status']>('Active / Operational');

  const [matDesc, setMatDesc] = useState('');
  const [matCat, setMatCat] = useState('Concrete & Aggregates');
  const [matReq, setMatReq] = useState('');
  const [matRec, setMatRec] = useState('');
  const [matCon, setMatCon] = useState('');
  const [matWaste, setMatWaste] = useState(1.0);
  const [matQa, setMatQa] = useState<MaterialItem['qa']>('Accepted / Cube Passed');

  const [jmrRef, setJmrRef] = useState('');
  const [jmrBoq, setJmrBoq] = useState('');
  const [jmrDesc, setJmrDesc] = useState('');
  const [jmrLoc, setJmrLoc] = useState('');
  const [jmrQty, setJmrQty] = useState(400);
  const [jmrRate, setJmrRate] = useState(450);
  const [jmrStatus, setJmrStatus] = useState<MeasurementItem['status']>('Handed Over to QS (IPC #14)');

  // Settings form states
  const [cfgName, setCfgName] = useState(activeProject.name);
  const [cfgCode, setCfgCode] = useState(activeProject.code);
  const [cfgLocation, setCfgLocation] = useState(activeProject.location);
  const [cfgBua, setCfgBua] = useState(activeProject.bua);
  const [cfgPeakLabour, setCfgPeakLabour] = useState(activeProject.peakLabour);
  const [cfgShifts, setCfgShifts] = useState(activeProject.shifts || '6_DAYS_DAY_NIGHT');

  useEffect(() => {
    setCfgName(activeProject.name);
    setCfgCode(activeProject.code);
    setCfgLocation(activeProject.location);
    setCfgBua(activeProject.bua);
    setCfgPeakLabour(activeProject.peakLabour);
    setCfgShifts(activeProject.shifts || '6_DAYS_DAY_NIGHT');
  }, [currentProjectId]);

  // Chart Canvas Refs
  const scurveCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const scurveChartInstance = useRef<Chart | null>(null);

  const readinessCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const readinessChartInstance = useRef<Chart | null>(null);

  // Initialize and update charts
  useEffect(() => {
    if (activeTab === 'dashboard') {
      // 1. S-Curve Chart
      if (scurveCanvasRef.current) {
        if (scurveChartInstance.current) scurveChartInstance.current.destroy();

        scurveChartInstance.current = new Chart(scurveCanvasRef.current, {
          type: 'line',
          data: {
            labels: ['Week 38', 'Week 39', 'Week 40', 'Week 41', 'Week 42 (Current)'],
            datasets: [
              {
                label: 'Planned Target S-Curve (%)',
                data: [65, 70, 75, 80, 85],
                borderColor: '#B69A70',
                borderDash: [5, 5],
                backgroundColor: 'transparent',
                borderWidth: 2,
              },
              {
                label: 'Actual Physical Progress (%)',
                data: [64, 69, 74, 79, 82.5],
                borderColor: '#27332F',
                backgroundColor: 'rgba(39, 51, 47, 0.08)',
                fill: true,
                borderWidth: 3,
                tension: 0.3,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'top',
                labels: { font: { size: 11, family: 'Inter' }, color: '#27332F' },
              },
            },
            scales: {
              y: {
                min: 50,
                max: 100,
                ticks: { callback: (val) => `${val}%`, color: '#77746D' },
                grid: { color: 'rgba(226, 216, 203, 0.6)' },
              },
              x: {
                ticks: { color: '#77746D' },
                grid: { display: false },
              },
            },
          },
        });
      }

      // 2. Readiness Breakdown Donut
      if (readinessCanvasRef.current) {
        if (readinessChartInstance.current) readinessChartInstance.current.destroy();

        const readyCount = activeProject.readiness.filter((r) => r.status === 'READY').length;
        const dwgBlocked = activeProject.readiness.filter((r) => r.blocker === 'Missing IFC Drawings').length;
        const matBlocked = activeProject.readiness.filter(
          (r) => r.blocker === 'Material Shortages' || r.blocker === 'Pending Inspection'
        ).length;

        readinessChartInstance.current = new Chart(readinessCanvasRef.current, {
          type: 'doughnut',
          data: {
            labels: ['Ready for Execution', 'Blocked (Missing Drawings)', 'Blocked (Material / Tests)'],
            datasets: [
              {
                data: [readyCount || 1, dwgBlocked || 0, matBlocked || 0],
                backgroundColor: ['#43856B', '#B85C50', '#C18A43'],
                borderWidth: 2,
                borderColor: '#FFFFFF',
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom',
                labels: { font: { size: 10, family: 'Inter' }, color: '#27332F' },
              },
            },
            cutout: '68%',
          },
        });
      }
    }

    return () => {
      if (scurveChartInstance.current) {
        scurveChartInstance.current.destroy();
        scurveChartInstance.current = null;
      }
      if (readinessChartInstance.current) {
        readinessChartInstance.current.destroy();
        readinessChartInstance.current = null;
      }
    };
  }, [activeTab, activeProject]);

  // KPIs
  const blockedCount = activeProject.readiness.filter((r) => r.status === 'BLOCKED').length;
  const totalVerifiedAED = activeProject.measurements.reduce((sum, j) => sum + j.total, 0);

  // Readiness toggle
  const handleToggleReadiness = (idx: number) => {
    const updated = [...siteProjects];
    const proj = updated.find((p) => p.id === currentProjectId);
    if (!proj) return;
    const r = proj.readiness[idx];
    if (r.status === 'READY') {
      r.status = 'BLOCKED';
      r.blocker = 'Missing IFC Drawings';
    } else {
      r.status = 'READY';
      r.blocker = 'None';
    }
    saveProjectsState(updated);
  };

  const handleUpdateReadinessBlocker = (idx: number, blockerVal: string) => {
    const updated = [...siteProjects];
    const proj = updated.find((p) => p.id === currentProjectId);
    if (!proj) return;
    proj.readiness[idx].blocker = blockerVal;
    proj.readiness[idx].status = blockerVal === 'None' ? 'READY' : 'BLOCKED';
    saveProjectsState(updated);
  };

  const handleUpdateReadinessNotes = (idx: number, notesVal: string) => {
    const updated = [...siteProjects];
    const proj = updated.find((p) => p.id === currentProjectId);
    if (!proj) return;
    proj.readiness[idx].notes = notesVal;
    saveProjectsState(updated);
  };

  // Add Lookahead
  const handleSaveLookahead = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = [...siteProjects];
    const proj = updated.find((p) => p.id === currentProjectId);
    if (!proj) return;
    proj.lookahead.push({
      id: Date.now(),
      actCode: actCode || `W42-ACT-${Math.floor(100 + Math.random() * 900)}`,
      wbs: actWbs || 'L12 Zone C',
      desc: actDesc || 'Construction Activity',
      dwg: actDwg || 'DWG-SHJ-STR-100',
      boq: actBoq || 'BOQ-3.00',
      dates: actDates || '01 Nov - 05 Nov 2026',
      qty: actQty || '100 m²',
    });
    saveProjectsState(updated);
    setIsLookaheadModalOpen(false);
  };

  // Add DPR
  const handleSaveDPR = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = [...siteProjects];
    const proj = updated.find((p) => p.id === currentProjectId);
    if (!proj) return;
    proj.dpr.unshift({
      id: Date.now(),
      date: dprDate,
      act: dprAct || 'Site Concreting',
      trades: dprTrades || '12 Masons, 18 Fixers',
      hrs: dprHrs,
      qty: dprQty || '100 m³',
      sup: dprSup,
      delay: dprDelay,
    });
    saveProjectsState(updated);
    setIsDPRModalOpen(false);
  };

  // Add Equipment
  const handleSaveEquipment = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = [...siteProjects];
    const proj = updated.find((p) => p.id === currentProjectId);
    if (!proj) return;
    proj.equipment.push({
      id: Date.now(),
      code: eqCode || `EQ-${Math.floor(10 + Math.random() * 90)}`,
      desc: eqDesc || 'Site Plant',
      loc: eqLoc || 'Core Sector',
      hrs: Number(eqHrs),
      downtime: Number(eqDowntime),
      fuel: Number(eqFuel),
      status: eqStatus,
    });
    saveProjectsState(updated);
    setIsEquipmentModalOpen(false);
  };

  // Add Material
  const handleSaveMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = [...siteProjects];
    const proj = updated.find((p) => p.id === currentProjectId);
    if (!proj) return;
    proj.materials.push({
      id: Date.now(),
      desc: matDesc || 'Ready-mix batch',
      cat: matCat,
      req: matReq || '100 m³',
      rec: matRec || '100 m³',
      con: matCon || '100 m³',
      waste: Number(matWaste),
      qa: matQa,
    });
    saveProjectsState(updated);
    setIsMaterialModalOpen(false);
  };

  // Add JMR
  const handleSaveMeasurement = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = [...siteProjects];
    const proj = updated.find((p) => p.id === currentProjectId);
    if (!proj) return;
    const q = Number(jmrQty);
    const r = Number(jmrRate);
    proj.measurements.push({
      id: Date.now(),
      refNo: jmrRef || `JMR-SHJ-${Math.floor(1000 + Math.random() * 9000)}`,
      boq: jmrBoq || 'BOQ-3.02',
      desc: jmrDesc || 'Structural Concrete Work',
      loc: jmrLoc || 'Level 12 Zone A',
      qty: q,
      rate: r,
      total: q * r,
      status: jmrStatus,
    });
    saveProjectsState(updated);
    setIsMeasurementModalOpen(false);
  };

  // CSV Export helpers
  const exportDPRCSV = () => {
    let csv = 'DPR Date,Activity,Trades Deployed,Hours,Qty Executed,Supervisor,Delay Reason\n';
    activeProject.dpr.forEach((d) => {
      csv += `"${d.date}","${d.act}","${d.trades}","${d.hrs}","${d.qty}","${d.sup}","${d.delay}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `${activeProject.code}_DPR_Export.csv`);
    a.click();
  };

  const exportMeasurementCSV = () => {
    let csv = 'JMR Ref,BOQ Ref,Description,Location,Accepted Qty,Unit Rate AED,Total Value AED,Status\n';
    activeProject.measurements.forEach((j) => {
      csv += `"${j.refNo}","${j.boq}","${j.desc}","${j.loc}",${j.qty},${j.rate},${j.total},"${j.status}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `${activeProject.code}_Measurement_Sheets_JMR.csv`);
    a.click();
  };

  // Export JSON Backup
  const exportBackupJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(siteProjects, null, 2));
    const a = document.createElement('a');
    a.setAttribute('href', dataStr);
    a.setAttribute('download', 'Sharjah_Site_Operations_ERP_Backup.json');
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const importBackupJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed)) {
            saveProjectsState(parsed);
            setCurrentProjectId(parsed[0].id);
            setCrossDeptToast('Site ERP backup successfully restored!');
          }
        } catch (err) {
          alert('Invalid backup JSON format.');
        }
      };
      reader.readAsText(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-6 text-[#27332F] pb-12">
      {/* 1. TOP HEADER BAR (Warm Sandstone + Luxury Corporate Theme) */}
      <div className="bg-white rounded-2xl border border-[#E2D8CB] p-5 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#27332F] text-[#B69A70] flex items-center justify-center font-bold shadow-sm shrink-0">
            <HardHat className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#F2EDE5] text-[#826B52] border border-[#E2D8CB]">
                SHARJAH SITE OPERATIONS • SUITE
              </span>
              <span className="text-xs text-[#77746D]">|</span>
              <span className="text-xs text-[#43856B] font-semibold flex items-center gap-1">
                <Sun className="w-3.5 h-3.5" /> MoHRE Midday Break Compliant
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-extrabold text-[#27332F] tracking-tight mt-0.5">
              Sharjah Construction Site Execution ERP
            </h1>
          </div>
        </div>

        {/* Project Selector & Tools */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Active Site Selector */}
          <div className="flex items-center gap-2 bg-[#F5F0E8] border border-[#E2D8CB] px-3 py-1.5 rounded-lg text-xs font-medium">
            <Building className="w-3.5 h-3.5 text-[#826B52]" />
            <select
              value={currentProjectId}
              onChange={(e) => setCurrentProjectId(e.target.value)}
              aria-label="Active Site Project"
              className="bg-transparent text-[#27332F] font-bold focus:outline-none cursor-pointer"
            >
              {siteProjects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.code})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setIsNewProjectModalOpen(true)}
            className="bg-[#27332F] hover:bg-[#1a2320] text-white text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1.5 shadow-sm transition"
          >
            <Plus className="w-3.5 h-3.5 text-[#B69A70]" /> New Site
          </button>

          {/* Backup Data Buttons */}
          <div className="flex items-center gap-1 pl-1 border-l border-[#E2D8CB]">
            <button
              onClick={exportBackupJSON}
              title="Export Backup JSON"
              className="p-2 rounded-lg bg-[#F5F0E8] hover:bg-[#F2EDE5] border border-[#E2D8CB] text-[#27332F] text-xs transition"
            >
              <Download className="w-3.5 h-3.5 text-[#826B52]" />
            </button>
            <label
              title="Import Backup JSON"
              className="p-2 rounded-lg bg-[#F5F0E8] hover:bg-[#F2EDE5] border border-[#E2D8CB] text-[#27332F] text-xs cursor-pointer transition"
            >
              <Upload className="w-3.5 h-3.5 text-[#826B52]" />
              <input type="file" accept=".json" onChange={importBackupJSON} className="hidden" />
            </label>
          </div>
        </div>
      </div>

      {/* 2. SUBMODULE NAVIGATION STRIP (All 10 Tabs from user HTML) */}
      <div className="bg-white rounded-xl border border-[#E2D8CB] p-1.5 shadow-xs overflow-x-auto custom-scrollbar">
        <div className="flex items-center gap-1 min-w-max">
          {[
            { id: 'dashboard', name: '1. Site Dashboard', icon: TrendingUp },
            { id: 'setup', name: '2. Project Settings', icon: Sliders },
            { id: 'lookahead', name: '3. Look-Ahead Plan', icon: CalendarDays },
            { id: 'readiness', name: '4. Readiness Register', icon: ListCheck },
            { id: 'dpr', name: '5. DPR & Labour', icon: ClipboardList },
            { id: 'equipment', name: '6. Equipment & Fuel Log', icon: Truck },
            { id: 'materials', name: '7. Materials & Requisitions', icon: Boxes },
            { id: 'measurements', name: '8. Work Measurement (JMR)', icon: Ruler },
            { id: 'crossdept', name: '9. Cross-Dept Triggers', icon: Network },
            { id: 'folders', name: '10. Virtual Directory', icon: FolderTree },
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

      {/* Toast Notification for Triggers */}
      {crossDeptToast && (
        <div className="bg-[#27332F] text-white p-3 rounded-xl border border-[#B69A70]/40 flex justify-between items-center text-xs animate-in fade-in duration-200 shadow-md">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#B69A70]" />
            <span>{crossDeptToast}</span>
          </div>
          <button onClick={() => setCrossDeptToast(null)} className="text-stone-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* =========================================================================
          TAB 1: EXECUTIVE SITE OPERATIONS DASHBOARD
          ========================================================================= */}
      {activeTab === 'dashboard' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          {/* Alert Banner for Blocked Activities */}
          {blockedCount > 0 && (
            <div className="bg-[#C18A43]/10 border-l-4 border-[#C18A43] p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shadow-xs">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-[#C18A43] shrink-0" />
                <div>
                  <h4 className="font-bold text-xs text-[#C18A43]">
                    Attention: {blockedCount} Site Readiness Blockers Detected
                  </h4>
                  <p className="text-xs text-[#77746D] mt-0.5">
                    Activities are blocked due to missing IFC drawings, pending RFI inspections, or material shortages.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('readiness')}
                className="bg-[#C18A43] hover:bg-[#a77332] text-white text-xs font-bold px-3 py-1.5 rounded-lg transition shadow-xs shrink-0"
              >
                Resolve Blockers →
              </button>
            </div>
          )}

          {/* Operational KPI Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
            <div className="bg-white p-4 rounded-xl shadow-xs border border-[#E2D8CB]">
              <span className="text-[10px] text-[#77746D] block font-bold uppercase tracking-wider">Planned vs Actual</span>
              <span className="text-xl font-extrabold text-[#27332F] block mt-1">82.5%</span>
              <span className="text-[10px] text-[#43856B] font-semibold block mt-0.5">+1.2% Variance</span>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-xs border border-[#E2D8CB]">
              <span className="text-[10px] text-[#77746D] block font-bold uppercase tracking-wider">Blocked Activities</span>
              <span className="text-xl font-extrabold text-[#B85C50] block mt-1">{blockedCount}</span>
              <span className="text-[10px] text-[#77746D] block mt-0.5">Missing Drawings / Stock</span>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-xs border border-[#E2D8CB]">
              <span className="text-[10px] text-[#77746D] block font-bold uppercase tracking-wider">Labour Productivity</span>
              <span className="text-xl font-extrabold text-[#27332F] block mt-1">94.2%</span>
              <span className="text-[10px] text-[#77746D] block mt-0.5">1,820 Man-Hours Active</span>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-xs border border-[#E2D8CB]">
              <span className="text-[10px] text-[#77746D] block font-bold uppercase tracking-wider">Equipment Downtime</span>
              <span className="text-xl font-extrabold text-[#C18A43] block mt-1">2.5 Hrs</span>
              <span className="text-[10px] text-[#77746D] block mt-0.5">Crane TC-01 Breakdown</span>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-xs border border-[#E2D8CB]">
              <span className="text-[10px] text-[#77746D] block font-bold uppercase tracking-wider">Overdue RFIs / NCRs</span>
              <span className="text-xl font-extrabold text-[#66869A] block mt-1">4</span>
              <span className="text-[10px] text-[#77746D] block mt-0.5">Consultant Review Due</span>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-xs border border-[#E2D8CB]">
              <span className="text-[10px] text-[#77746D] block font-bold uppercase tracking-wider">Verified Quantities</span>
              <span className="text-xl font-extrabold text-[#43856B] block mt-1">
                AED {(totalVerifiedAED / 1000000).toFixed(2)}M
              </span>
              <span className="text-[10px] text-[#77746D] block mt-0.5">Ready for QS Billing</span>
            </div>
          </div>

          {/* Real-Time Visualizations: S-Curve & Readiness Pie */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* S-Curve (2 Cols) */}
            <div className="lg:col-span-2 bg-white p-5 rounded-xl shadow-xs border border-[#E2D8CB]">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-xs uppercase tracking-wider text-[#27332F] flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#826B52]" /> Weekly Physical Progress (Planned vs Actual S-Curve)
                </h3>
                <span className="text-[10px] bg-[#F5F0E8] text-[#826B52] border border-[#E2D8CB] px-2 py-0.5 rounded font-bold">
                  {activeProject.name}
                </span>
              </div>
              <div className="h-64">
                <canvas ref={scurveCanvasRef} />
              </div>
            </div>

            {/* Readiness Breakdown Donut (1 Col) */}
            <div className="bg-white p-5 rounded-xl shadow-xs border border-[#E2D8CB]">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-xs uppercase tracking-wider text-[#27332F] flex items-center gap-2">
                  <ListCheck className="w-4 h-4 text-[#826B52]" /> Activity Readiness Status
                </h3>
                <span className="text-[10px] bg-[#F5F0E8] text-[#77746D] px-2 py-0.5 rounded font-semibold">Live</span>
              </div>
              <div className="h-64">
                <canvas ref={readinessCanvasRef} />
              </div>
            </div>
          </div>

          {/* End-to-End Activity Cycle Workflow Tracker */}
          <div className="bg-white p-5 rounded-xl shadow-xs border border-[#E2D8CB] space-y-3">
            <div className="flex justify-between items-center border-b border-[#E2D8CB] pb-2">
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#27332F] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#43856B]" /> Live Single Complete Activity Execution Tracker (7-Stage Cycle)
              </h3>
              <span className="text-[10px] bg-[#B69A70]/15 text-[#826B52] border border-[#B69A70]/30 font-bold px-2.5 py-0.5 rounded">
                Active Cycle Focus: L12-SLAB-CONCRETE
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5 text-center text-xs">
              <div className="bg-[#43856B]/10 border border-[#43856B]/30 p-2.5 rounded-lg">
                <span className="text-[10px] text-[#43856B] font-bold block">1. Approved Drawing</span>
                <p className="font-mono text-[11px] text-[#27332F] font-bold mt-1">DWG-SHJ-STR-L12-04 (Rev B)</p>
                <span className="bg-[#43856B] text-white text-[9px] px-1.5 py-0.5 rounded mt-1 inline-block font-bold">
                  APPROVED
                </span>
              </div>

              <div className="bg-[#43856B]/10 border border-[#43856B]/30 p-2.5 rounded-lg">
                <span className="text-[10px] text-[#43856B] font-bold block">2. Look-Ahead Plan</span>
                <p className="font-mono text-[11px] text-[#27332F] font-bold mt-1">W42-ACT-108 Slab Concreting</p>
                <span className="bg-[#43856B] text-white text-[9px] px-1.5 py-0.5 rounded mt-1 inline-block font-bold">
                  SCHEDULED
                </span>
              </div>

              <div className="bg-[#43856B]/10 border border-[#43856B]/30 p-2.5 rounded-lg">
                <span className="text-[10px] text-[#43856B] font-bold block">3. Readiness Check</span>
                <p className="font-mono text-[11px] text-[#27332F] font-bold mt-1">Checklist 6/6 Clear</p>
                <span className="bg-[#43856B] text-white text-[9px] px-1.5 py-0.5 rounded mt-1 inline-block font-bold">
                  READY
                </span>
              </div>

              <div className="bg-[#43856B]/10 border border-[#43856B]/30 p-2.5 rounded-lg">
                <span className="text-[10px] text-[#43856B] font-bold block">4. Daily Execution</span>
                <p className="font-mono text-[11px] text-[#27332F] font-bold mt-1">DPR-2026-10-30</p>
                <span className="bg-[#43856B] text-white text-[9px] px-1.5 py-0.5 rounded mt-1 inline-block font-bold">
                  COMPLETED
                </span>
              </div>

              <div className="bg-[#43856B]/10 border border-[#43856B]/30 p-2.5 rounded-lg">
                <span className="text-[10px] text-[#43856B] font-bold block">5. RFI Inspection</span>
                <p className="font-mono text-[11px] text-[#27332F] font-bold mt-1">RFI-SHJ-QAQC-0412</p>
                <span className="bg-[#43856B] text-white text-[9px] px-1.5 py-0.5 rounded mt-1 inline-block font-bold">
                  VERIFIED
                </span>
              </div>

              <div className="bg-[#43856B]/10 border border-[#43856B]/30 p-2.5 rounded-lg">
                <span className="text-[10px] text-[#43856B] font-bold block">6. Measured Qty</span>
                <p className="font-mono text-[11px] text-[#27332F] font-bold mt-1">420 m³ Concrete C50</p>
                <span className="bg-[#43856B] text-white text-[9px] px-1.5 py-0.5 rounded mt-1 inline-block font-bold">
                  ACCEPTED
                </span>
              </div>

              <div className="bg-[#27332F]/10 border border-[#27332F]/30 p-2.5 rounded-lg">
                <span className="text-[10px] text-[#27332F] font-bold block">7. Billing Handover</span>
                <p className="font-mono text-[11px] text-[#27332F] font-bold mt-1">IPC #14 / BOQ-3.02</p>
                <span className="bg-[#27332F] text-white text-[9px] px-1.5 py-0.5 rounded mt-1 inline-block font-bold">
                  SUBMITTED
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: PROJECT SETTINGS & MASTER DATA
          ========================================================================= */}
      {activeTab === 'setup' && (
        <div className="bg-white p-5 rounded-xl shadow-xs border border-[#E2D8CB] space-y-4 animate-in fade-in duration-200">
          <div className="flex justify-between items-center pb-2 border-b border-[#E2D8CB]">
            <div>
              <h2 className="text-base font-bold text-[#27332F]">2. Sharjah Site Configuration & Master Data Register</h2>
              <p className="text-xs text-[#77746D]">
                Configure UAE/Sharjah location settings, working shift arrangements, WBS hierarchy, and approval levels.
              </p>
            </div>
            <button
              onClick={() => {
                const updated = [...siteProjects];
                const proj = updated.find((p) => p.id === currentProjectId);
                if (proj) {
                  proj.name = cfgName;
                  proj.code = cfgCode;
                  proj.location = cfgLocation;
                  proj.bua = Number(cfgBua);
                  proj.peakLabour = Number(cfgPeakLabour);
                  proj.shifts = cfgShifts;
                  saveProjectsState(updated);
                  setCrossDeptToast('Sharjah Site Configuration Saved Successfully!');
                }
              }}
              className="bg-[#27332F] hover:bg-[#1a2320] text-white text-xs font-bold px-3.5 py-2 rounded-lg shadow-sm flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5 text-[#B69A70]" /> Save Configuration
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-[#77746D] mb-1">Project Name</label>
              <input
                type="text"
                value={cfgName}
                onChange={(e) => setCfgName(e.target.value)}
                className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2.5 text-[#27332F] font-semibold"
              />
            </div>
            <div>
              <label className="block font-bold text-[#77746D] mb-1">Project Ref Code</label>
              <input
                type="text"
                value={cfgCode}
                onChange={(e) => setCfgCode(e.target.value)}
                className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2.5 font-mono text-[#27332F]"
              />
            </div>
            <div>
              <label className="block font-bold text-[#77746D] mb-1">Location / Emirate</label>
              <input
                type="text"
                value={cfgLocation}
                onChange={(e) => setCfgLocation(e.target.value)}
                className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2.5 text-[#27332F]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#77746D] mb-1">Currency Code & Units</label>
              <input
                type="text"
                readOnly
                value="AED (UAE Dirham) | Metric (m, m², m³, MT)"
                className="w-full bg-[#F2EDE5] border border-[#E2D8CB] rounded-lg p-2.5 font-bold text-[#826B52]"
              />
            </div>
            <div>
              <label className="block font-bold text-[#77746D] mb-1">Timezone</label>
              <input
                type="text"
                readOnly
                value="Asia/Dubai (GST +04:00)"
                className="w-full bg-[#F2EDE5] border border-[#E2D8CB] rounded-lg p-2.5 text-[#27332F]"
              />
            </div>
            <div>
              <label className="block font-bold text-[#77746D] mb-1">Working Days & Shift</label>
              <select
                value={cfgShifts}
                onChange={(e) => setCfgShifts(e.target.value)}
                className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2.5 font-semibold text-[#27332F]"
              >
                <option value="6_DAYS_DAY_NIGHT">Mon-Sat (6 Days) - 2 Shifts (Day 07:00-17:00 / Night 19:00-05:00)</option>
                <option value="6_DAYS_SINGLE">Mon-Sat (6 Days) - Single Shift (07:00-17:00)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-[#77746D] mb-1">MoHRE Summer Midday Break Allowance</label>
              <input
                type="text"
                readOnly
                value="Mandatory Outdoor Work Rest: 12:30 PM - 03:00 PM (15 June - 15 Sept)"
                className="w-full bg-[#C18A43]/10 border border-[#C18A43]/30 rounded-lg p-2.5 text-[#C18A43] font-bold"
              />
            </div>
            <div>
              <label className="block font-bold text-[#77746D] mb-1">Built-Up Area (BUA sq. ft.)</label>
              <input
                type="number"
                value={cfgBua}
                onChange={(e) => setCfgBua(Number(e.target.value))}
                className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2.5 font-bold text-[#27332F]"
              />
            </div>
            <div>
              <label className="block font-bold text-[#77746D] mb-1">Peak Workforce Scale</label>
              <input
                type="number"
                value={cfgPeakLabour}
                onChange={(e) => setCfgPeakLabour(Number(e.target.value))}
                className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2.5 font-bold text-[#43856B]"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-[#E2D8CB] grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <h4 className="font-bold text-[#27332F] mb-2 flex items-center gap-1.5">
                <Network className="w-4 h-4 text-[#826B52]" /> WBS Site Hierarchy Structure
              </h4>
              <div className="bg-[#F5F0E8] p-3.5 rounded-xl border border-[#E2D8CB] font-mono text-[11px] space-y-1 text-[#27332F]">
                <div>Company: Sharjah General Contracting LLC</div>
                <div className="ml-3">└── Project: {activeProject.name} ({activeProject.code})</div>
                <div className="ml-6">└── Building/Block: Block C (Podium + 32 Floors)</div>
                <div className="ml-9">└── Floor: Level 12 Superstructure</div>
                <div className="ml-12">└── Zone: Zone A (Tower Core & Slab East)</div>
                <div className="ml-15">└── Work Area: L12-ZONE-A-SLAB</div>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-[#27332F] mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#826B52]" /> Operations Approval Workflow Hierarchy
              </h4>
              <div className="bg-[#F5F0E8] p-3.5 rounded-xl border border-[#E2D8CB] text-[11px] space-y-2">
                <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-[#E2D8CB]">
                  <span>Level 1: <strong>Site Engineer</strong> (DPR Logging & Daily Requests)</span>
                  <span className="bg-[#F2EDE5] text-[#826B52] text-[10px] px-2 py-0.5 rounded font-bold">INSPECTOR</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-[#E2D8CB]">
                  <span>Level 2: <strong>Construction Manager</strong> (Readiness Verification & JMR Signoff)</span>
                  <span className="bg-[#C18A43]/15 text-[#C18A43] text-[10px] px-2 py-0.5 rounded font-bold">REVIEWER</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-[#E2D8CB]">
                  <span>Level 3: <strong>Project Manager / Director</strong> (Commercial & Billing Handover)</span>
                  <span className="bg-[#43856B]/15 text-[#43856B] text-[10px] px-2 py-0.5 rounded font-bold">APPROVER</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: 3-WEEK LOOK-AHEAD CONSTRUCTION PLAN
          ========================================================================= */}
      {activeTab === 'lookahead' && (
        <div className="bg-white p-5 rounded-xl shadow-xs border border-[#E2D8CB] space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-wrap justify-between items-center gap-3 pb-2 border-b border-[#E2D8CB]">
            <div>
              <h2 className="text-base font-bold text-[#27332F]">3. 3-Week Look-Ahead Construction Plan</h2>
              <p className="text-xs text-[#77746D]">
                Map activities to WBS, BOQ codes, target dates, and IFC drawing references.
              </p>
            </div>
            <button
              onClick={() => setIsLookaheadModalOpen(true)}
              className="bg-[#27332F] hover:bg-[#1a2320] text-white text-xs font-bold px-3.5 py-2 rounded-lg shadow-sm flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-[#B69A70]" /> Add Look-Ahead Activity
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#F5F0E8] text-[#77746D] font-bold uppercase border-b border-[#E2D8CB]">
                <tr>
                  <th className="p-3">Activity Code</th>
                  <th className="p-3">WBS Work Area</th>
                  <th className="p-3">Activity Description</th>
                  <th className="p-3">Approved Drawing Ref</th>
                  <th className="p-3">BOQ Ref</th>
                  <th className="p-3">Target Start / End</th>
                  <th className="p-3">Target Quantity</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2D8CB] text-[#27332F]">
                {activeProject.lookahead.map((l, idx) => (
                  <tr key={l.id} className="hover:bg-[#F5F0E8]/50 transition">
                    <td className="p-3 font-mono font-bold text-[#826B52]">{l.actCode}</td>
                    <td className="p-3 font-semibold">{l.wbs}</td>
                    <td className="p-3 font-bold text-[#27332F]">{l.desc}</td>
                    <td className="p-3 font-mono text-[#77746D]">{l.dwg}</td>
                    <td className="p-3 font-mono text-[#66869A] font-bold">{l.boq}</td>
                    <td className="p-3 text-[#77746D]">{l.dates}</td>
                    <td className="p-3 font-extrabold text-[#27332F]">{l.qty}</td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => {
                          const updated = [...siteProjects];
                          const proj = updated.find((p) => p.id === currentProjectId);
                          if (proj) {
                            proj.lookahead.splice(idx, 1);
                            saveProjectsState(updated);
                          }
                        }}
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

      {/* =========================================================================
          TAB 4: READINESS REGISTER & CONSTRAINT LOG
          ========================================================================= */}
      {activeTab === 'readiness' && (
        <div className="bg-white p-5 rounded-xl shadow-xs border border-[#E2D8CB] space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-wrap justify-between items-center gap-3 pb-2 border-b border-[#E2D8CB]">
            <div>
              <h2 className="text-base font-bold text-[#27332F]">
                4. Activity Readiness Check Register & Constraint Log
              </h2>
              <p className="text-xs text-[#77746D]">
                6-Point Readiness Check: IFC Drawings, Materials, Site Access, Labour, Equipment, Permits/NOCs.
              </p>
            </div>
            <span className="text-xs font-bold bg-[#C18A43]/15 text-[#C18A43] px-3 py-1 rounded-full border border-[#C18A43]/30">
              Live Blocker Detection Active
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#F5F0E8] text-[#77746D] font-bold uppercase border-b border-[#E2D8CB]">
                <tr>
                  <th className="p-3">Activity Code</th>
                  <th className="p-3">Description</th>
                  <th className="p-3 text-center">6-Point Check</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Primary Blocker Category</th>
                  <th className="p-3">Constraint Explanation & Owner</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2D8CB] text-[#27332F]">
                {activeProject.readiness.map((r, idx) => {
                  const isBlocked = r.status === 'BLOCKED';
                  return (
                    <tr key={r.id} className={`hover:bg-[#F5F0E8]/50 transition ${isBlocked ? 'bg-[#B85C50]/5' : ''}`}>
                      <td className="p-3 font-mono font-bold text-[#826B52]">{r.actCode}</td>
                      <td className="p-3 font-bold text-[#27332F]">{r.desc}</td>
                      <td className="p-3 text-center font-bold font-mono">{r.checkCount}</td>
                      <td className="p-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            isBlocked
                              ? 'bg-[#B85C50]/15 text-[#B85C50] border-[#B85C50]/30'
                              : 'bg-[#43856B]/15 text-[#43856B] border-[#43856B]/30'
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td className="p-3">
                        <select
                          value={r.blocker}
                          onChange={(e) => handleUpdateReadinessBlocker(idx, e.target.value)}
                          className={`border rounded-lg px-2 py-1 text-xs font-semibold ${
                            isBlocked
                              ? 'text-[#B85C50] border-[#B85C50]/40 bg-white'
                              : 'text-[#27332F] border-[#E2D8CB] bg-white'
                          }`}
                        >
                          <option value="None">None (All Ready)</option>
                          <option value="Missing IFC Drawings">Missing IFC Drawings</option>
                          <option value="Material Shortages">Material Shortages</option>
                          <option value="Pending Inspection">Pending Inspection</option>
                          <option value="Access Restrictions">Access Restrictions</option>
                          <option value="Unresolved Safety Requirement">Unresolved Safety Requirement</option>
                        </select>
                      </td>
                      <td className="p-3">
                        <input
                          type="text"
                          value={r.notes}
                          onChange={(e) => handleUpdateReadinessNotes(idx, e.target.value)}
                          className="border border-[#E2D8CB] rounded-lg px-2.5 py-1 text-xs w-full bg-white text-[#27332F]"
                        />
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => handleToggleReadiness(idx)}
                          className="text-xs bg-[#27332F] hover:bg-[#1a2320] text-white px-2.5 py-1 rounded-md font-semibold transition shadow-xs"
                        >
                          Toggle Ready
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

      {/* =========================================================================
          TAB 5: DAILY PROGRESS REPORT (DPR) & LABOUR
          ========================================================================= */}
      {activeTab === 'dpr' && (
        <div className="bg-white p-5 rounded-xl shadow-xs border border-[#E2D8CB] space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-wrap justify-between items-center gap-3 pb-2 border-b border-[#E2D8CB]">
            <div>
              <h2 className="text-base font-bold text-[#27332F]">5. Daily Progress Report (DPR) & Labour Deployment Log</h2>
              <p className="text-xs text-[#77746D]">
                Track daily executed quantities, trade-wise attendance (200+ scale), shifts, and delay reasons.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsDPRModalOpen(true)}
                className="bg-[#27332F] hover:bg-[#1a2320] text-white text-xs font-bold px-3.5 py-2 rounded-lg shadow-sm flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5 text-[#B69A70]" /> Log Today&apos;s DPR
              </button>
              <button
                onClick={exportDPRCSV}
                className="bg-[#F5F0E8] hover:bg-[#F2EDE5] text-[#27332F] border border-[#E2D8CB] text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5 text-[#826B52]" /> Export DPR CSV
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#F5F0E8] text-[#77746D] font-bold uppercase border-b border-[#E2D8CB]">
                <tr>
                  <th className="p-3">DPR Date</th>
                  <th className="p-3">Activity / Area</th>
                  <th className="p-3">Trade Deployment</th>
                  <th className="p-3">Work Hours</th>
                  <th className="p-3">Qty Executed</th>
                  <th className="p-3">Site Supervisor</th>
                  <th className="p-3">Delay / Bottleneck</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2D8CB] text-[#27332F]">
                {activeProject.dpr.map((d, idx) => (
                  <tr key={d.id} className="hover:bg-[#F5F0E8]/50 transition">
                    <td className="p-3 font-mono font-bold text-[#826B52]">{d.date}</td>
                    <td className="p-3 font-bold text-[#27332F]">{d.act}</td>
                    <td className="p-3 text-[#77746D]">{d.trades}</td>
                    <td className="p-3 text-[#77746D]">{d.hrs}</td>
                    <td className="p-3 font-extrabold text-[#43856B]">{d.qty}</td>
                    <td className="p-3 font-semibold">{d.sup}</td>
                    <td className="p-3 text-[#B85C50] font-medium">{d.delay}</td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => {
                          const updated = [...siteProjects];
                          const proj = updated.find((p) => p.id === currentProjectId);
                          if (proj) {
                            proj.dpr.splice(idx, 1);
                            saveProjectsState(updated);
                          }
                        }}
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

      {/* =========================================================================
          TAB 6: EQUIPMENT & FUEL LOG
          ========================================================================= */}
      {activeTab === 'equipment' && (
        <div className="bg-white p-5 rounded-xl shadow-xs border border-[#E2D8CB] space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-wrap justify-between items-center gap-3 pb-2 border-b border-[#E2D8CB]">
            <div>
              <h2 className="text-base font-bold text-[#27332F]">
                6. Site Equipment, Machinery & Fuel Consumption Register
              </h2>
              <p className="text-xs text-[#77746D]">
                Monitor tower cranes, concrete pumps, total stations, operating hours, downtime, and diesel fuel.
              </p>
            </div>
            <button
              onClick={() => setIsEquipmentModalOpen(true)}
              className="bg-[#27332F] hover:bg-[#1a2320] text-white text-xs font-bold px-3.5 py-2 rounded-lg shadow-sm flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-[#B69A70]" /> Register Machinery Log
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#F5F0E8] text-[#77746D] font-bold uppercase border-b border-[#E2D8CB]">
                <tr>
                  <th className="p-3">Equipment Code</th>
                  <th className="p-3">Machinery Description</th>
                  <th className="p-3">Operating Location</th>
                  <th className="p-3">Operated Hours</th>
                  <th className="p-3">Downtime (Hrs)</th>
                  <th className="p-3">Diesel Consumed (L)</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2D8CB] text-[#27332F]">
                {activeProject.equipment.map((e, idx) => (
                  <tr key={e.id} className="hover:bg-[#F5F0E8]/50 transition">
                    <td className="p-3 font-mono font-bold text-[#826B52]">{e.code}</td>
                    <td className="p-3 font-bold text-[#27332F]">{e.desc}</td>
                    <td className="p-3">{e.loc}</td>
                    <td className="p-3 font-bold">{e.hrs} Hrs</td>
                    <td className="p-3 font-bold text-[#B85C50]">{e.downtime} Hrs</td>
                    <td className="p-3 font-bold text-[#C18A43]">{e.fuel} L</td>
                    <td className="p-3">
                      <select
                        value={e.status}
                        onChange={(ev) => {
                          const updated = [...siteProjects];
                          const proj = updated.find((p) => p.id === currentProjectId);
                          if (proj) {
                            proj.equipment[idx].status = ev.target.value as EquipmentItem['status'];
                            saveProjectsState(updated);
                          }
                        }}
                        className="border border-[#E2D8CB] rounded-lg px-2 py-1 text-xs font-semibold bg-white"
                      >
                        <option value="Active / Operational">Active / Operational</option>
                        <option value="Breakdown / Repair">Breakdown / Repair</option>
                        <option value="Idle / Standby">Idle / Standby</option>
                      </select>
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => {
                          const updated = [...siteProjects];
                          const proj = updated.find((p) => p.id === currentProjectId);
                          if (proj) {
                            proj.equipment.splice(idx, 1);
                            saveProjectsState(updated);
                          }
                        }}
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

      {/* =========================================================================
          TAB 7: MATERIALS & REQUISITIONS
          ========================================================================= */}
      {activeTab === 'materials' && (
        <div className="bg-white p-5 rounded-xl shadow-xs border border-[#E2D8CB] space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-wrap justify-between items-center gap-3 pb-2 border-b border-[#E2D8CB]">
            <div>
              <h2 className="text-base font-bold text-[#27332F]">
                7. Site Materials Coordination, Requisitions & Wastage Reconciliation
              </h2>
              <p className="text-xs text-[#77746D]">
                Track ready-mix concrete, steel rebar, blockwork, site requisitions, stock on hand, and wastage %.
              </p>
            </div>
            <button
              onClick={() => setIsMaterialModalOpen(true)}
              className="bg-[#27332F] hover:bg-[#1a2320] text-white text-xs font-bold px-3.5 py-2 rounded-lg shadow-sm flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-[#B69A70]" /> Add Material Requisition
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#F5F0E8] text-[#77746D] font-bold uppercase border-b border-[#E2D8CB]">
                <tr>
                  <th className="p-3">Material Description</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Requested Qty</th>
                  <th className="p-3">Site Stock Received</th>
                  <th className="p-3">Consumed Qty</th>
                  <th className="p-3">Wastage %</th>
                  <th className="p-3">QA/QC Batch Inspection</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2D8CB] text-[#27332F]">
                {activeProject.materials.map((m, idx) => (
                  <tr key={m.id} className="hover:bg-[#F5F0E8]/50 transition">
                    <td className="p-3 font-bold text-[#27332F]">{m.desc}</td>
                    <td className="p-3 text-[#77746D]">{m.cat}</td>
                    <td className="p-3 font-bold">{m.req}</td>
                    <td className="p-3 font-bold text-[#43856B]">{m.rec}</td>
                    <td className="p-3 font-bold">{m.con}</td>
                    <td className="p-3 font-bold text-[#C18A43]">{m.waste}%</td>
                    <td className="p-3">
                      <select
                        value={m.qa}
                        onChange={(ev) => {
                          const updated = [...siteProjects];
                          const proj = updated.find((p) => p.id === currentProjectId);
                          if (proj) {
                            proj.materials[idx].qa = ev.target.value as MaterialItem['qa'];
                            saveProjectsState(updated);
                          }
                        }}
                        className="border border-[#E2D8CB] rounded-lg px-2 py-1 text-xs font-semibold bg-white"
                      >
                        <option value="Accepted / Cube Passed">Accepted / Cube Passed</option>
                        <option value="Testing Pending">Testing Pending</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => {
                          const updated = [...siteProjects];
                          const proj = updated.find((p) => p.id === currentProjectId);
                          if (proj) {
                            proj.materials.splice(idx, 1);
                            saveProjectsState(updated);
                          }
                        }}
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

      {/* =========================================================================
          TAB 8: WORK MEASUREMENT & BILLING HANDOVER
          ========================================================================= */}
      {activeTab === 'measurements' && (
        <div className="bg-white p-5 rounded-xl shadow-xs border border-[#E2D8CB] space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-wrap justify-between items-center gap-3 pb-2 border-b border-[#E2D8CB]">
            <div>
              <h2 className="text-base font-bold text-[#27332F]">
                8. Location-Wise Work Measurement Sheet (JMR) & QS Billing Handover
              </h2>
              <p className="text-xs text-[#77746D]">
                Joint Measurement Records (JMR) verified by QA/QC and handed over to Quantity Surveying for monthly Interim Payment Certificates (IPC).
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMeasurementModalOpen(true)}
                className="bg-[#27332F] hover:bg-[#1a2320] text-white text-xs font-bold px-3.5 py-2 rounded-lg shadow-sm flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5 text-[#B69A70]" /> Add JMR Measurement
              </button>
              <button
                onClick={exportMeasurementCSV}
                className="bg-[#F5F0E8] hover:bg-[#F2EDE5] text-[#27332F] border border-[#E2D8CB] text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5 text-[#826B52]" /> Export JMR CSV
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#F5F0E8] text-[#77746D] font-bold uppercase border-b border-[#E2D8CB]">
                <tr>
                  <th className="p-3">JMR Ref #</th>
                  <th className="p-3">BOQ Item Code</th>
                  <th className="p-3">Work Description</th>
                  <th className="p-3">Location / Zone</th>
                  <th className="p-3">Accepted Qty</th>
                  <th className="p-3">Unit Rate (AED)</th>
                  <th className="p-3">Total Value (AED)</th>
                  <th className="p-3">QS Handover Status</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2D8CB] text-[#27332F]">
                {activeProject.measurements.map((j, idx) => (
                  <tr key={j.id} className="hover:bg-[#F5F0E8]/50 transition">
                    <td className="p-3 font-mono font-bold text-[#826B52]">{j.refNo}</td>
                    <td className="p-3 font-mono font-bold text-[#66869A]">{j.boq}</td>
                    <td className="p-3 font-bold text-[#27332F]">{j.desc}</td>
                    <td className="p-3">{j.loc}</td>
                    <td className="p-3 font-bold">{j.qty}</td>
                    <td className="p-3 font-bold text-[#826B52]">AED {j.rate}</td>
                    <td className="p-3 font-extrabold text-[#43856B]">AED {j.total.toLocaleString()}</td>
                    <td className="p-3">
                      <select
                        value={j.status}
                        onChange={(ev) => {
                          const updated = [...siteProjects];
                          const proj = updated.find((p) => p.id === currentProjectId);
                          if (proj) {
                            proj.measurements[idx].status = ev.target.value as MeasurementItem['status'];
                            saveProjectsState(updated);
                          }
                        }}
                        className="border border-[#E2D8CB] rounded-lg px-2 py-1 text-xs font-semibold bg-white"
                      >
                        <option value="Handed Over to QS (IPC #14)">Handed Over to QS (IPC #14)</option>
                        <option value="Pending QA/QC Signature">Pending QA/QC Signature</option>
                        <option value="Draft / Site Verification">Draft / Site Verification</option>
                      </select>
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => {
                          const updated = [...siteProjects];
                          const proj = updated.find((p) => p.id === currentProjectId);
                          if (proj) {
                            proj.measurements.splice(idx, 1);
                            saveProjectsState(updated);
                          }
                        }}
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

      {/* =========================================================================
          TAB 9: CROSS-DEPARTMENTAL COLLABORATION TRIGGERS
          ========================================================================= */}
      {activeTab === 'crossdept' && (
        <div className="bg-white p-5 rounded-xl shadow-xs border border-[#E2D8CB] space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-wrap justify-between items-center gap-3 pb-2 border-b border-[#E2D8CB]">
            <div>
              <h2 className="text-base font-bold text-[#27332F]">
                9. Cross-Departmental Collaboration Interface & Triggers
              </h2>
              <p className="text-xs text-[#77746D]">
                Real-time touchpoints between Site Operations, Engineering, QA/QC, HSE, and QS/Finance.
              </p>
            </div>
            <button
              onClick={() => {
                setCrossDeptToast(
                  '⚡ Cross-Dept Synced: 1. Engineering Rev B released; 2. QA/QC RFI-0412 verified; 3. QS IPC #14 updated with JMR-1042.'
                );
              }}
              className="bg-[#27332F] hover:bg-[#1a2320] text-white text-xs font-bold px-3.5 py-2 rounded-lg shadow-sm flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 text-[#B69A70]" /> Simulate Cross-Dept Notification
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="border border-[#E2D8CB] rounded-xl p-4 bg-[#F5F0E8] space-y-3">
              <h4 className="font-bold text-[#27332F] border-b border-[#E2D8CB] pb-2 flex items-center gap-2">
                <FileCode2 className="w-4 h-4 text-[#66869A]" /> 1. Site Operations ↔ Engineering
              </h4>
              <div className="p-3 bg-white rounded-lg border border-[#E2D8CB] flex justify-between items-center">
                <div>
                  <span className="font-bold text-[#27332F] block">New Revision Released: DWG-SHJ-STR-L12-04 (Rev B)</span>
                  <span className="text-[#77746D] text-[11px]">Core Reinforcement change at Zone A</span>
                </div>
                <span className="bg-[#66869A]/15 text-[#66869A] text-[10px] px-2 py-0.5 rounded font-bold">INFO SYNCED</span>
              </div>
            </div>

            <div className="border border-[#E2D8CB] rounded-xl p-4 bg-[#F5F0E8] space-y-3">
              <h4 className="font-bold text-[#27332F] border-b border-[#E2D8CB] pb-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#43856B]" /> 2. Site Operations ↔ QA/QC Inspection
              </h4>
              <div className="p-3 bg-white rounded-lg border border-[#E2D8CB] flex justify-between items-center">
                <div>
                  <span className="font-bold text-[#27332F] block">RFI Requested: RFI-SHJ-QAQC-0412</span>
                  <span className="text-[#77746D] text-[11px]">L12 Pour 2 Concrete Pre-pour Inspection</span>
                </div>
                <span className="bg-[#43856B]/15 text-[#43856B] text-[10px] px-2 py-0.5 rounded font-bold">VERIFIED</span>
              </div>
            </div>

            <div className="border border-[#E2D8CB] rounded-xl p-4 bg-[#F5F0E8] space-y-3">
              <h4 className="font-bold text-[#27332F] border-b border-[#E2D8CB] pb-2 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#C18A43]" /> 3. Site Operations ↔ HSE Safety Controls
              </h4>
              <div className="p-3 bg-white rounded-lg border border-[#E2D8CB] flex justify-between items-center">
                <div>
                  <span className="font-bold text-[#27332F] block">Hot Work Permit Granted: PERMIT-HW-992</span>
                  <span className="text-[#77746D] text-[11px]">Slab Edge Welding Zone B (Fire Watch Active)</span>
                </div>
                <span className="bg-[#43856B]/15 text-[#43856B] text-[10px] px-2 py-0.5 rounded font-bold">PERMIT ACTIVE</span>
              </div>
            </div>

            <div className="border border-[#E2D8CB] rounded-xl p-4 bg-[#F5F0E8] space-y-3">
              <h4 className="font-bold text-[#27332F] border-b border-[#E2D8CB] pb-2 flex items-center gap-2">
                <Ruler className="w-4 h-4 text-[#826B52]" /> 4. Site Operations ↔ QS & Commercial
              </h4>
              <div className="p-3 bg-white rounded-lg border border-[#E2D8CB] flex justify-between items-center">
                <div>
                  <span className="font-bold text-[#27332F] block">Quantity Verified: JMR-SHJ-1042</span>
                  <span className="text-[#77746D] text-[11px]">420 m³ Concrete Accepted → Transferred to IPC #14</span>
                </div>
                <span className="bg-[#826B52]/15 text-[#826B52] text-[10px] px-2 py-0.5 rounded font-bold">BILLING HANDOVER</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 10: VIRTUAL SITE DOCUMENT & FOLDER DIRECTORY
          ========================================================================= */}
      {activeTab === 'folders' && (
        <div className="bg-white p-5 rounded-xl shadow-xs border border-[#E2D8CB] space-y-4 animate-in fade-in duration-200">
          <div className="flex justify-between items-center pb-2 border-b border-[#E2D8CB]">
            <div>
              <h2 className="text-base font-bold text-[#27332F]">10. Virtual Site Operations Project Directory Tree</h2>
              <p className="text-xs text-[#77746D]">
                Directory structure for <span className="font-bold text-[#826B52]">{activeProject.name}</span> following lifecycle:
                Draft → Submitted → Under Review → Approved / Returned → Closed.
              </p>
            </div>
            <button
              onClick={() => window.print()}
              className="bg-[#27332F] hover:bg-[#1a2320] text-white text-xs px-3.5 py-2 rounded-lg font-bold shadow-sm flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5 text-[#B69A70]" /> Print Site Operations Report
            </button>
          </div>

          <div className="bg-[#F5F0E8] p-4 rounded-xl border border-[#E2D8CB] font-mono text-xs space-y-2 text-[#27332F]">
            <div className="flex items-center font-bold text-sm text-[#27332F]">
              <FolderTree className="w-4 h-4 text-[#826B52] mr-2" /> 📁 [{activeProject.name.replace(/[^a-zA-Z0-9]/g, '_')}]
            </div>

            <div className="ml-5 space-y-3 border-l-2 border-[#E2D8CB] pl-3 text-xs font-sans">
              <div>
                <div className="font-bold text-[#27332F] flex items-center gap-1.5 font-mono">
                  📂 01_Lookahead_Plans_and_Schedules
                </div>
                <div className="ml-5 text-[#77746D] space-y-0.5 mt-0.5 font-mono text-[11px]">
                  <div>📄 3_Week_Lookahead_Plan_W42.pdf [APPROVED]</div>
                  <div>📄 Master_Construction_Baseline_Rev3.mpp [APPROVED]</div>
                </div>
              </div>

              <div>
                <div className="font-bold text-[#27332F] flex items-center gap-1.5 font-mono">
                  📂 02_Readiness_and_Constraints
                </div>
                <div className="ml-5 text-[#77746D] space-y-0.5 mt-0.5 font-mono text-[11px]">
                  <div>📄 Activity_Readiness_Checklist_Register.csv [ACTIVE]</div>
                  <div>📄 Site_Blocker_and_Constraint_Log.pdf [UNDER REVIEW]</div>
                </div>
              </div>

              <div>
                <div className="font-bold text-[#27332F] flex items-center gap-1.5 font-mono">
                  📂 03_Daily_Progress_Reports_DPR
                </div>
                <div className="ml-5 text-[#77746D] space-y-0.5 mt-0.5 font-mono text-[11px]">
                  <div>📄 Daily_Progress_Report_2026-10-30.pdf [APPROVED]</div>
                  <div>📄 Labour_Trade_Deployment_Log.csv [APPROVED]</div>
                </div>
              </div>

              <div>
                <div className="font-bold text-[#27332F] flex items-center gap-1.5 font-mono">
                  📂 04_Equipment_and_Machinery
                </div>
                <div className="ml-5 text-[#77746D] space-y-0.5 mt-0.5 font-mono text-[11px]">
                  <div>📄 Tower_Crane_TC01_Maintenance_Log.pdf [CLOSED]</div>
                  <div>📄 Equipment_Fuel_Consumption_Register.csv [APPROVED]</div>
                </div>
              </div>

              <div>
                <div className="font-bold text-[#27332F] flex items-center gap-1.5 font-mono">
                  📂 05_Measurements_and_Billing_Handover
                </div>
                <div className="ml-5 text-[#77746D] space-y-0.5 mt-0.5 font-mono text-[11px]">
                  <div>📄 Joint_Measurement_Record_JMR_1042.pdf [APPROVED]</div>
                  <div>📄 Quantity_Surveyor_Billing_Handover_Sheet.csv [SUBMITTED]</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODALS
          ========================================================================= */}
      {/* 1. Modal: New Site Project */}
      {isNewProjectModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-white border border-[#E2D8CB] rounded-2xl w-full max-w-md p-5 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-[#E2D8CB] pb-2">
              <h3 className="font-bold text-sm text-[#27332F]">Create New Sharjah Construction Site</h3>
              <button onClick={() => setIsNewProjectModalOpen(false)} className="text-[#77746D] hover:text-[#27332F]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const newProj: SiteProjectData = {
                  id: `site-proj-${Date.now()}`,
                  name: newProjName || 'Muwaileh Commercial Tower',
                  code: `PRJ-SHJ-${Math.floor(100 + Math.random() * 900)}`,
                  location: 'Sharjah, UAE',
                  currency: 'AED',
                  bua: Number(newProjBua),
                  peakLabour: Number(newProjPeak),
                  shifts: '6_DAYS_DAY_NIGHT',
                  lookahead: [],
                  readiness: [],
                  dpr: [],
                  equipment: [],
                  materials: [],
                  measurements: [],
                };
                const updated = [newProj, ...siteProjects];
                saveProjectsState(updated);
                setCurrentProjectId(newProj.id);
                setIsNewProjectModalOpen(false);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-bold text-[#77746D] mb-1">Project Name</label>
                <input
                  type="text"
                  required
                  value={newProjName}
                  onChange={(e) => setNewProjName(e.target.value)}
                  placeholder="e.g. Muwaileh Commercial Tower"
                  className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2.5 text-[#27332F]"
                />
              </div>
              <div>
                <label className="block font-bold text-[#77746D] mb-1">Built-Up Area (BUA sq. ft.)</label>
                <input
                  type="number"
                  value={newProjBua}
                  onChange={(e) => setNewProjBua(Number(e.target.value))}
                  className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2.5 text-[#27332F]"
                />
              </div>
              <div>
                <label className="block font-bold text-[#77746D] mb-1">Peak Manpower Scale</label>
                <input
                  type="number"
                  value={newProjPeak}
                  onChange={(e) => setNewProjPeak(Number(e.target.value))}
                  className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2.5 text-[#43856B] font-bold"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-[#E2D8CB]">
                <button
                  type="button"
                  onClick={() => setIsNewProjectModalOpen(false)}
                  className="px-3.5 py-1.5 bg-[#F5F0E8] text-[#27332F] rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#27332F] hover:bg-[#1a2320] text-white rounded-lg font-bold shadow-sm"
                >
                  Create Site
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Modal: Add Lookahead Activity */}
      {isLookaheadModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-white border border-[#E2D8CB] rounded-2xl w-full max-w-lg p-5 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-[#E2D8CB] pb-2">
              <h3 className="font-bold text-sm text-[#27332F]">Add Look-Ahead Activity</h3>
              <button onClick={() => setIsLookaheadModalOpen(false)} className="text-[#77746D] hover:text-[#27332F]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveLookahead} className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-[#77746D] mb-1">Activity Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. W42-ACT-109"
                  value={actCode}
                  onChange={(e) => setActCode(e.target.value)}
                  className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2 font-mono"
                />
              </div>
              <div>
                <label className="block font-bold text-[#77746D] mb-1">WBS Location</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. L12 Zone B"
                  value={actWbs}
                  onChange={(e) => setActWbs(e.target.value)}
                  className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2"
                />
              </div>
              <div className="col-span-2">
                <label className="block font-bold text-[#77746D] mb-1">Activity Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Column Steel & Formwork Level 12"
                  value={actDesc}
                  onChange={(e) => setActDesc(e.target.value)}
                  className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2"
                />
              </div>
              <div>
                <label className="block font-bold text-[#77746D] mb-1">Approved Drawing Ref</label>
                <input
                  type="text"
                  required
                  placeholder="DWG-SHJ-STR-L12-05"
                  value={actDwg}
                  onChange={(e) => setActDwg(e.target.value)}
                  className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2 font-mono"
                />
              </div>
              <div>
                <label className="block font-bold text-[#77746D] mb-1">BOQ Item Ref</label>
                <input
                  type="text"
                  required
                  placeholder="BOQ-3.02"
                  value={actBoq}
                  onChange={(e) => setActBoq(e.target.value)}
                  className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2 font-mono text-[#66869A]"
                />
              </div>
              <div>
                <label className="block font-bold text-[#77746D] mb-1">Target Dates</label>
                <input
                  type="text"
                  placeholder="01 Nov - 05 Nov 2026"
                  value={actDates}
                  onChange={(e) => setActDates(e.target.value)}
                  className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2"
                />
              </div>
              <div>
                <label className="block font-bold text-[#77746D] mb-1">Target Quantity</label>
                <input
                  type="text"
                  placeholder="280 m²"
                  value={actQty}
                  onChange={(e) => setActQty(e.target.value)}
                  className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2 font-bold"
                />
              </div>
              <div className="col-span-2 flex justify-end gap-2 pt-2 border-t border-[#E2D8CB]">
                <button
                  type="button"
                  onClick={() => setIsLookaheadModalOpen(false)}
                  className="px-3.5 py-1.5 bg-[#F5F0E8] text-[#27332F] rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#27332F] hover:bg-[#1a2320] text-white rounded-lg font-bold shadow-sm"
                >
                  Save Activity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Modal: Add DPR */}
      {isDPRModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-white border border-[#E2D8CB] rounded-2xl w-full max-w-lg p-5 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-[#E2D8CB] pb-2">
              <h3 className="font-bold text-sm text-[#27332F]">Log Daily Progress Report (DPR)</h3>
              <button onClick={() => setIsDPRModalOpen(false)} className="text-[#77746D] hover:text-[#27332F]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveDPR} className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-[#77746D] mb-1">DPR Date</label>
                <input
                  type="date"
                  required
                  value={dprDate}
                  onChange={(e) => setDprDate(e.target.value)}
                  className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2 font-bold"
                />
              </div>
              <div>
                <label className="block font-bold text-[#77746D] mb-1">Activity / Area</label>
                <input
                  type="text"
                  required
                  placeholder="L12 Slab Concrete Pour 2"
                  value={dprAct}
                  onChange={(e) => setDprAct(e.target.value)}
                  className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2"
                />
              </div>
              <div>
                <label className="block font-bold text-[#77746D] mb-1">Trade Deployment</label>
                <input
                  type="text"
                  required
                  placeholder="12 Masons, 18 Fixers"
                  value={dprTrades}
                  onChange={(e) => setDprTrades(e.target.value)}
                  className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2"
                />
              </div>
              <div>
                <label className="block font-bold text-[#77746D] mb-1">Worked Hours</label>
                <input
                  type="text"
                  placeholder="10 Hrs (Shift 1)"
                  value={dprHrs}
                  onChange={(e) => setDprHrs(e.target.value)}
                  className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2"
                />
              </div>
              <div>
                <label className="block font-bold text-[#77746D] mb-1">Quantity Executed Today</label>
                <input
                  type="text"
                  placeholder="420 m³"
                  value={dprQty}
                  onChange={(e) => setDprQty(e.target.value)}
                  className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2 font-bold text-[#43856B]"
                />
              </div>
              <div>
                <label className="block font-bold text-[#77746D] mb-1">Site Supervisor Name</label>
                <input
                  type="text"
                  value={dprSup}
                  onChange={(e) => setDprSup(e.target.value)}
                  className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2"
                />
              </div>
              <div className="col-span-2">
                <label className="block font-bold text-[#77746D] mb-1">Delays / Remarks / Bottlenecks</label>
                <input
                  type="text"
                  placeholder="None / Pump line clogged 20 mins"
                  value={dprDelay}
                  onChange={(e) => setDprDelay(e.target.value)}
                  className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2 text-[#B85C50]"
                />
              </div>
              <div className="col-span-2 flex justify-end gap-2 pt-2 border-t border-[#E2D8CB]">
                <button
                  type="button"
                  onClick={() => setIsDPRModalOpen(false)}
                  className="px-3.5 py-1.5 bg-[#F5F0E8] text-[#27332F] rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#27332F] hover:bg-[#1a2320] text-white rounded-lg font-bold shadow-sm"
                >
                  Save DPR Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Modal: Add Equipment */}
      {isEquipmentModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-white border border-[#E2D8CB] rounded-2xl w-full max-w-lg p-5 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-[#E2D8CB] pb-2">
              <h3 className="font-bold text-sm text-[#27332F]">Register Machinery / Equipment Log</h3>
              <button onClick={() => setIsEquipmentModalOpen(false)} className="text-[#77746D] hover:text-[#27332F]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveEquipment} className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-[#77746D] mb-1">Equipment Code</label>
                <input
                  type="text"
                  required
                  placeholder="EQ-TC-01"
                  value={eqCode}
                  onChange={(e) => setEqCode(e.target.value)}
                  className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2 font-mono"
                />
              </div>
              <div>
                <label className="block font-bold text-[#77746D] mb-1">Description</label>
                <input
                  type="text"
                  required
                  placeholder="Liebherr 12 Ton Tower Crane"
                  value={eqDesc}
                  onChange={(e) => setEqDesc(e.target.value)}
                  className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2"
                />
              </div>
              <div>
                <label className="block font-bold text-[#77746D] mb-1">Location</label>
                <input
                  type="text"
                  placeholder="Core Zone A"
                  value={eqLoc}
                  onChange={(e) => setEqLoc(e.target.value)}
                  className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2"
                />
              </div>
              <div>
                <label className="block font-bold text-[#77746D] mb-1">Operated Hours</label>
                <input
                  type="number"
                  step="0.5"
                  value={eqHrs}
                  onChange={(e) => setEqHrs(Number(e.target.value))}
                  className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2 font-bold"
                />
              </div>
              <div>
                <label className="block font-bold text-[#77746D] mb-1">Downtime (Hrs)</label>
                <input
                  type="number"
                  step="0.5"
                  value={eqDowntime}
                  onChange={(e) => setEqDowntime(Number(e.target.value))}
                  className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2 font-bold text-[#B85C50]"
                />
              </div>
              <div>
                <label className="block font-bold text-[#77746D] mb-1">Diesel Consumed (L)</label>
                <input
                  type="number"
                  value={eqFuel}
                  onChange={(e) => setEqFuel(Number(e.target.value))}
                  className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2 font-bold text-[#C18A43]"
                />
              </div>
              <div className="col-span-2">
                <label className="block font-bold text-[#77746D] mb-1">Operational Status</label>
                <select
                  value={eqStatus}
                  onChange={(e) => setEqStatus(e.target.value as EquipmentItem['status'])}
                  className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2 font-semibold text-[#27332F]"
                >
                  <option value="Active / Operational">Active / Operational</option>
                  <option value="Breakdown / Repair">Breakdown / Repair</option>
                  <option value="Idle / Standby">Idle / Standby</option>
                </select>
              </div>
              <div className="col-span-2 flex justify-end gap-2 pt-2 border-t border-[#E2D8CB]">
                <button
                  type="button"
                  onClick={() => setIsEquipmentModalOpen(false)}
                  className="px-3.5 py-1.5 bg-[#F5F0E8] text-[#27332F] rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#27332F] hover:bg-[#1a2320] text-white rounded-lg font-bold shadow-sm"
                >
                  Save Equipment Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Modal: Add Material */}
      {isMaterialModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-white border border-[#E2D8CB] rounded-2xl w-full max-w-lg p-5 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-[#E2D8CB] pb-2">
              <h3 className="font-bold text-sm text-[#27332F]">Add Material Requisition</h3>
              <button onClick={() => setIsMaterialModalOpen(false)} className="text-[#77746D] hover:text-[#27332F]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveMaterial} className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-[#77746D] mb-1">Material Description</label>
                <input
                  type="text"
                  required
                  placeholder="Ready-Mix Concrete C50/60"
                  value={matDesc}
                  onChange={(e) => setMatDesc(e.target.value)}
                  className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2"
                />
              </div>
              <div>
                <label className="block font-bold text-[#77746D] mb-1">Category</label>
                <select
                  value={matCat}
                  onChange={(e) => setMatCat(e.target.value)}
                  className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2 font-semibold"
                >
                  <option value="Concrete & Aggregates">Concrete & Aggregates</option>
                  <option value="Steel Rebar">Steel Rebar</option>
                  <option value="Blockwork & Mortar">Blockwork & Mortar</option>
                  <option value="MEP Piping & Fittings">MEP Piping & Fittings</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-[#77746D] mb-1">Requested Qty</label>
                <input
                  type="text"
                  placeholder="450 m³"
                  value={matReq}
                  onChange={(e) => setMatReq(e.target.value)}
                  className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2 font-bold"
                />
              </div>
              <div>
                <label className="block font-bold text-[#77746D] mb-1">Site Stock Received</label>
                <input
                  type="text"
                  placeholder="420 m³"
                  value={matRec}
                  onChange={(e) => setMatRec(e.target.value)}
                  className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2 font-bold text-[#43856B]"
                />
              </div>
              <div>
                <label className="block font-bold text-[#77746D] mb-1">Consumed Qty</label>
                <input
                  type="text"
                  placeholder="420 m³"
                  value={matCon}
                  onChange={(e) => setMatCon(e.target.value)}
                  className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2 font-bold"
                />
              </div>
              <div>
                <label className="block font-bold text-[#77746D] mb-1">Wastage %</label>
                <input
                  type="number"
                  step="0.1"
                  value={matWaste}
                  onChange={(e) => setMatWaste(Number(e.target.value))}
                  className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2 font-bold text-[#C18A43]"
                />
              </div>
              <div className="col-span-2">
                <label className="block font-bold text-[#77746D] mb-1">QA/QC Batch Inspection</label>
                <select
                  value={matQa}
                  onChange={(e) => setMatQa(e.target.value as MaterialItem['qa'])}
                  className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2 font-semibold"
                >
                  <option value="Accepted / Cube Passed">Accepted / Cube Passed</option>
                  <option value="Testing Pending">Testing Pending</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
              <div className="col-span-2 flex justify-end gap-2 pt-2 border-t border-[#E2D8CB]">
                <button
                  type="button"
                  onClick={() => setIsMaterialModalOpen(false)}
                  className="px-3.5 py-1.5 bg-[#F5F0E8] text-[#27332F] rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#27332F] hover:bg-[#1a2320] text-white rounded-lg font-bold shadow-sm"
                >
                  Save Requisition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Modal: Add Measurement (JMR) */}
      {isMeasurementModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-white border border-[#E2D8CB] rounded-2xl w-full max-w-lg p-5 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-[#E2D8CB] pb-2">
              <h3 className="font-bold text-sm text-[#27332F]">Add Joint Measurement Record (JMR)</h3>
              <button onClick={() => setIsMeasurementModalOpen(false)} className="text-[#77746D] hover:text-[#27332F]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveMeasurement} className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-[#77746D] mb-1">JMR Reference #</label>
                <input
                  type="text"
                  required
                  placeholder="JMR-SHJ-1043"
                  value={jmrRef}
                  onChange={(e) => setJmrRef(e.target.value)}
                  className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2 font-mono"
                />
              </div>
              <div>
                <label className="block font-bold text-[#77746D] mb-1">BOQ Item Code</label>
                <input
                  type="text"
                  required
                  placeholder="BOQ-3.02"
                  value={jmrBoq}
                  onChange={(e) => setJmrBoq(e.target.value)}
                  className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2 font-mono text-[#66869A]"
                />
              </div>
              <div className="col-span-2">
                <label className="block font-bold text-[#77746D] mb-1">Work Description</label>
                <input
                  type="text"
                  required
                  placeholder="Level 12 Core Wall Concrete Pour"
                  value={jmrDesc}
                  onChange={(e) => setJmrDesc(e.target.value)}
                  className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2"
                />
              </div>
              <div>
                <label className="block font-bold text-[#77746D] mb-1">Location / Zone</label>
                <input
                  type="text"
                  placeholder="L12 Zone A Core"
                  value={jmrLoc}
                  onChange={(e) => setJmrLoc(e.target.value)}
                  className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2"
                />
              </div>
              <div>
                <label className="block font-bold text-[#77746D] mb-1">Accepted Qty</label>
                <input
                  type="number"
                  value={jmrQty}
                  onChange={(e) => setJmrQty(Number(e.target.value))}
                  className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2 font-bold"
                />
              </div>
              <div>
                <label className="block font-bold text-[#77746D] mb-1">Unit Rate (AED)</label>
                <input
                  type="number"
                  value={jmrRate}
                  onChange={(e) => setJmrRate(Number(e.target.value))}
                  className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2 font-bold text-[#826B52]"
                />
              </div>
              <div>
                <label className="block font-bold text-[#77746D] mb-1">Total Value (AED)</label>
                <input
                  type="text"
                  readOnly
                  value={`AED ${(jmrQty * jmrRate).toLocaleString()}`}
                  className="w-full bg-[#F2EDE5] border border-[#E2D8CB] rounded-lg p-2 font-extrabold text-[#43856B]"
                />
              </div>
              <div className="col-span-2">
                <label className="block font-bold text-[#77746D] mb-1">QS Handover Status</label>
                <select
                  value={jmrStatus}
                  onChange={(e) => setJmrStatus(e.target.value as MeasurementItem['status'])}
                  className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2 font-semibold"
                >
                  <option value="Handed Over to QS (IPC #14)">Handed Over to QS (IPC #14)</option>
                  <option value="Pending QA/QC Signature">Pending QA/QC Signature</option>
                  <option value="Draft / Site Verification">Draft / Site Verification</option>
                </select>
              </div>
              <div className="col-span-2 flex justify-end gap-2 pt-2 border-t border-[#E2D8CB]">
                <button
                  type="button"
                  onClick={() => setIsMeasurementModalOpen(false)}
                  className="px-3.5 py-1.5 bg-[#F5F0E8] text-[#27332F] rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#27332F] hover:bg-[#1a2320] text-white rounded-lg font-bold shadow-sm"
                >
                  Save Measurement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
