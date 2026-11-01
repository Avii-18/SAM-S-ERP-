import React, { useState, useEffect } from 'react';
import { useERP } from '../../context/ERPContext';
import {
  CalendarDays,
  HardHat,
  TrendingUp,
  Clock,
  Layers,
  ArrowRight,
  MoreHorizontal,
  Plus,
  BarChart2,
  Users,
  Sparkles,
  Zap,
  CheckCircle,
  FileText,
  Bell,
  Building,
  Check,
  X,
  ChevronRight,
} from 'lucide-react';
import {
  dubaiSkylineHero,
  siteOverviewCrane,
  marinaTowerThumb,
  businessBayThumb,
  jvcResidentialThumb,
} from '../../assets/images';
import { DubaiSkylineIllustration } from '../common/DubaiSkylineIllustration';

export const OfficeDashboard: React.FC = () => {
  const {
    projects,
    activeProjectId,
    setActiveProjectId,
    setActiveDivision,
    setActiveOfficeSubmodule,
    setActiveSiteSubmodule,
    setActiveAISubmodule,
    theme,
    addProject,
  } = useERP();

  const [timeRange, setTimeRange] = useState<'3months' | '6months' | '1year'>('6months');
  const [createProjectModalOpen, setCreateProjectModalOpen] = useState(false);

  // Real-time live date, day of week, month, year, and clock ticking
  const [currentDateTime, setCurrentDateTime] = useState<Date>(new Date());

  useEffect(() => {
    // Update live clock every second
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDayOfWeek = currentDateTime.toLocaleDateString('en-US', { weekday: 'long' });
  const formattedFullDate = currentDateTime.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const formattedTime = currentDateTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const [selectedTask, setSelectedTask] = useState<{
    id: string;
    title: string;
    time: string;
    priority: 'High' | 'Medium' | 'Low';
    completed: boolean;
    desc?: string;
  } | null>(null);

  // New Project Form State
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectClient, setNewProjectClient] = useState('');
  const [newProjectLocation, setNewProjectLocation] = useState('Dubai Marina');
  const [newProjectBaseline, setNewProjectBaseline] = useState('45,000,000');

  // Tasks list matching the image
  const [tasks, setTasks] = useState([
    {
      id: 'task-1',
      priority: 'High' as const,
      title: 'Approve Procurement Request',
      time: 'Today, 10:00 AM',
      completed: false,
      desc: 'Purchase order for 85 MT High-Yield Grade 500B Deformed Steel Rebar requires Director authorization.',
    },
    {
      id: 'task-2',
      priority: 'Medium' as const,
      title: 'Site Inspection - Downtown Project',
      time: 'Today, 02:00 PM',
      completed: false,
      desc: 'Dubai Municipality structural inspection for Level 18 suspended slab casting & post-tension tendons.',
    },
    {
      id: 'task-3',
      priority: 'Low' as const,
      title: 'Update Project Timeline',
      time: 'Tomorrow, 09:00 AM',
      completed: false,
      desc: 'Sync Primavera P6 schedule baseline with PMO S-Curve EVM progress indices.',
    },
  ]);

  // Recent Projects List matching the image table
  const recentProjects = [
    {
      id: 'PRJ-DXB-MARINA-01',
      name: 'Dubai Marina Tower',
      client: 'EMAAR',
      location: 'Dubai Marina',
      startDate: 'Jan 15, 2025',
      endDate: 'Dec 30, 2025',
      status: 'On Track',
      progress: 78,
      thumb: marinaTowerThumb,
    },
    {
      id: 'PRJ-DXB-BB-02',
      name: 'Business Bay Complex',
      client: 'Damac',
      location: 'Business Bay',
      startDate: 'Feb 01, 2025',
      endDate: 'Nov 30, 2025',
      status: 'At Risk',
      progress: 65,
      thumb: businessBayThumb,
    },
    {
      id: 'PRJ-DXB-JVC-03',
      name: 'JVC Residential',
      client: 'Nakheel',
      location: 'JVC',
      startDate: 'Mar 01, 2025',
      endDate: 'Dec 15, 2025',
      status: 'On Track',
      progress: 82,
      thumb: jvcResidentialThumb,
    },
  ];

  const handleCreateProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    const newId = `PRJ-DXB-${Date.now().toString().slice(-4)}`;
    addProject({
      id: newId,
      code: `PRJ-${Math.floor(10 + Math.random() * 90)}`,
      name: newProjectName,
      location: `${newProjectLocation}, Dubai, UAE`,
      emirate: 'Dubai',
      client: newProjectClient || 'Dubai Properties PJSC',
      consultant: 'Dar Al-Handasah Consultants',
      type: 'High-Rise Commercial & Residential (3B+G+38)',
      areaSqFt: 450000,
      areaSqM: 41806,
      floors: 39,
      basements: 3,
      startDate: '2025-05-01',
      targetFinishDate: '2027-04-30',
      durationMonths: 24,
      currentMonth: 1,
      contractBaselineAED: parseFloat(newProjectBaseline.replace(/,/g, '')) || 45000000,
      actualCostAED: 0,
      certifiedWorkAED: 0,
      paidAED: 0,
      retentionAED: 0,
      status: 'In Progress',
      scheduleMode: 'PRIMAVERA',
      contractType: 'FIDIC Red Book Lump Sum',
      currency: 'AED',
    });
    setActiveProjectId(newId);
    setCreateProjectModalOpen(false);
    setNewProjectName('');
    setNewProjectClient('');
  };

  const isLight = theme === 'light';

  return (
    <div className="space-y-4 pb-4">
      {/* 1. HERO BANNER: Dubai Skyline with Burj Khalifa and Welcome Message - Compact */}
      <div
        className="relative overflow-hidden rounded-xl shadow-sm border border-stone-200/50 dark:border-slate-800 min-h-[160px] sm:min-h-[175px] flex flex-col justify-end p-4 sm:p-6 bg-cover bg-center"
        style={{
          backgroundImage: `url(${dubaiSkylineHero})`,
          backgroundPosition: 'center 40%',
        }}
      >
        {/* Rich dark contrast overlay so white text stands out with maximum legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/80 via-stone-950/50 to-stone-950/20" />

        <div className="relative z-10 max-w-xl">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] leading-tight">
            Welcome back, Ahmed!
          </h1>
          <p className="text-xs sm:text-[13px] font-medium mt-1 text-white/95 drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)]">
            Build a smarter, stronger Dubai together.
          </p>

          <div
            className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/65 backdrop-blur-md border border-white/30 shadow-md text-[12px] font-medium"
            style={{ color: '#FFFFFF' }}
          >
            <CalendarDays className="w-3.5 h-3.5 text-[#B69A70] shrink-0" />
            <span className="font-semibold" style={{ color: '#FFFFFF' }}>
              {formattedFullDate}
            </span>
            <span className="text-white/40">|</span>
            <span className="font-mono text-white/95" style={{ color: '#FFFFFF' }}>
              {formattedTime}
            </span>
            <span className="text-white/40">|</span>
            <span className="font-medium text-[#F2EDE5]" style={{ color: '#F2EDE5' }}>
              Dubai, UAE
            </span>
          </div>
        </div>
      </div>

      {/* 2. STAT / KPI SUMMARY CARDS (4 across) - Compact & High-Density */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Card 1: Active Projects */}
        <div
          className={`relative overflow-hidden rounded-xl p-3.5 sm:p-4 border transition-all hover:shadow-sm ${
            isLight
              ? 'bg-white border-stone-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)]'
              : 'bg-[#0f1d26] border-slate-800 shadow-sm text-white'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-[#faeede] text-[#935a26] flex items-center justify-center shrink-0">
                <Building className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl sm:text-2xl font-extrabold tracking-tight">24</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200/60 inline-flex items-center">
                    ↑ 12%
                  </span>
                </div>
                <div className="text-[11px] font-medium text-stone-500 dark:text-slate-400">
                  Active Projects
                </div>
              </div>
            </div>
          </div>
          {/* Subtle amber bottom curve wave */}
          <div className="absolute -bottom-2 left-0 right-0 h-6 opacity-35 pointer-events-none">
            <svg viewBox="0 0 300 40" className="w-full h-full" preserveAspectRatio="none">
              <path
                d="M0 25 C80 10, 160 38, 300 20 L300 40 L0 40 Z"
                fill="#dfa86c"
                fillOpacity="0.35"
              />
            </svg>
          </div>
        </div>

        {/* Card 2: Total Workforce */}
        <div
          className={`relative overflow-hidden rounded-xl p-3.5 sm:p-4 border transition-all hover:shadow-sm ${
            isLight
              ? 'bg-white border-stone-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)]'
              : 'bg-[#0f1d26] border-slate-800 shadow-sm text-white'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-[#e7f7f0] text-[#0e704a] flex items-center justify-center shrink-0">
                <HardHat className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl sm:text-2xl font-extrabold tracking-tight">486</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200/60 inline-flex items-center">
                    ↑ 8%
                  </span>
                </div>
                <div className="text-[11px] font-medium text-stone-500 dark:text-slate-400">
                  Total Workforce
                </div>
              </div>
            </div>
          </div>
          {/* Subtle green bottom curve wave */}
          <div className="absolute -bottom-2 left-0 right-0 h-6 opacity-35 pointer-events-none">
            <svg viewBox="0 0 300 40" className="w-full h-full" preserveAspectRatio="none">
              <path
                d="M0 30 C90 12, 180 35, 300 18 L300 40 L0 40 Z"
                fill="#10b981"
                fillOpacity="0.3"
              />
            </svg>
          </div>
        </div>

        {/* Card 3: Pending Approvals */}
        <div
          className={`relative overflow-hidden rounded-xl p-3.5 sm:p-4 border transition-all hover:shadow-sm ${
            isLight
              ? 'bg-white border-stone-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)]'
              : 'bg-[#0f1d26] border-slate-800 shadow-sm text-white'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-[#feeeea] text-[#dc4c38] flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl sm:text-2xl font-extrabold tracking-tight">18</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-rose-50 text-rose-600 border border-rose-200/60 inline-flex items-center">
                    ↓ 5%
                  </span>
                </div>
                <div className="text-[11px] font-medium text-stone-500 dark:text-slate-400">
                  Pending Approvals
                </div>
              </div>
            </div>
          </div>
          {/* Subtle coral bottom curve wave */}
          <div className="absolute -bottom-2 left-0 right-0 h-6 opacity-30 pointer-events-none">
            <svg viewBox="0 0 300 40" className="w-full h-full" preserveAspectRatio="none">
              <path
                d="M0 20 C100 35, 200 15, 300 28 L300 40 L0 40 Z"
                fill="#f43f5e"
                fillOpacity="0.25"
              />
            </svg>
          </div>
        </div>

        {/* Card 4: Project Progress */}
        <div
          className={`relative overflow-hidden rounded-xl p-3.5 sm:p-4 border transition-all hover:shadow-sm ${
            isLight
              ? 'bg-white border-stone-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)]'
              : 'bg-[#0f1d26] border-slate-800 shadow-sm text-white'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-[#eaf4fd] text-[#1d70b8] flex items-center justify-center shrink-0">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl sm:text-2xl font-extrabold tracking-tight">76%</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-sky-50 text-sky-600 border border-sky-200/60 inline-flex items-center">
                    ↑ 6%
                  </span>
                </div>
                <div className="text-[11px] font-medium text-stone-500 dark:text-slate-400">
                  Project Progress
                </div>
              </div>
            </div>
          </div>
          {/* Subtle blue bottom curve wave */}
          <div className="absolute -bottom-2 left-0 right-0 h-6 opacity-30 pointer-events-none">
            <svg viewBox="0 0 300 40" className="w-full h-full" preserveAspectRatio="none">
              <path
                d="M0 25 C100 12, 190 32, 300 18 L300 40 L0 40 Z"
                fill="#0284c7"
                fillOpacity="0.25"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* 3. MIDDLE ROW: Project Overview (Chart), Site Overview, Upcoming Tasks - Compact */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        {/* Panel 1: Project Overview (6 cols) */}
        <div
          className={`lg:col-span-6 rounded-xl p-4 border ${
            isLight
              ? 'bg-white border-stone-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)]'
              : 'bg-[#0f1d26] border-slate-800 text-white'
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-[#dfa86c]" />
              <h2 className="text-xs sm:text-sm font-bold tracking-tight">Project Overview</h2>
            </div>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className={`text-[11px] px-2 py-0.5 rounded-md border outline-none cursor-pointer ${
                isLight
                  ? 'bg-stone-50 border-stone-200 text-stone-700'
                  : 'bg-slate-900 border-slate-700 text-slate-300'
              }`}
            >
              <option value="3months">Last 3 Months</option>
              <option value="6months">Last 6 Months</option>
              <option value="1year">Last 1 Year</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center pt-3">
            {/* Left Donut Chart */}
            <div className="md:col-span-5 flex flex-col items-center justify-center">
              <div className="relative w-32 h-32">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  {/* Background Circle */}
                  <circle cx="50" cy="50" r="38" stroke="#e5e7eb" strokeWidth="11" fill="none" />
                  {/* Delayed Segment: 10% (Red) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    stroke="#ef4444"
                    strokeWidth="11"
                    strokeDasharray="238.76"
                    strokeDashoffset="214.88"
                    fill="none"
                  />
                  {/* At Risk Segment: 14% (Amber) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    stroke="#f59e0b"
                    strokeWidth="11"
                    strokeDasharray="238.76"
                    strokeDashoffset="181.45"
                    fill="none"
                  />
                  {/* On Track Segment: 76% (Dark Emerald) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    stroke="#0b4d42"
                    strokeWidth="11"
                    strokeDasharray="238.76"
                    strokeDashoffset="57.3"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
                {/* Center Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-lg font-black tracking-tight text-stone-900 dark:text-white">
                    76%
                  </span>
                  <span className="text-[9px] font-semibold text-stone-500 uppercase tracking-wider">
                    On Track
                  </span>
                </div>
              </div>

              {/* Legend with exact metrics from mockup */}
              <div className="flex items-center gap-3 mt-2 text-[11px]">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#0b4d42]" />
                  <span className="text-stone-700 dark:text-slate-300 font-medium">On Track</span>
                  <span className="font-bold text-stone-900 dark:text-white">76%</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#f59e0b]" />
                  <span className="text-stone-700 dark:text-slate-300 font-medium">At Risk</span>
                  <span className="font-bold text-stone-900 dark:text-white">14%</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#ef4444]" />
                  <span className="text-stone-700 dark:text-slate-300 font-medium">Delayed</span>
                  <span className="font-bold text-stone-900 dark:text-white">10%</span>
                </div>
              </div>
            </div>

            {/* Right Trend Curve Area Chart */}
            <div className="md:col-span-7 h-40 relative flex flex-col justify-end">
              <svg viewBox="0 0 280 140" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="trendGreenGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0b4d42" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#0b4d42" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Y-Axis Grid Lines */}
                <line x1="25" y1="20" x2="270" y2="20" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="2,2" />
                <line x1="25" y1="50" x2="270" y2="50" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="2,2" />
                <line x1="25" y1="80" x2="270" y2="80" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="2,2" />
                <line x1="25" y1="110" x2="270" y2="110" stroke="#e2e8f0" strokeWidth="1" />

                {/* Y-Axis Labels */}
                <text x="5" y="24" fontSize="9" fill="#94a3b8" fontFamily="sans-serif">100</text>
                <text x="8" y="54" fontSize="9" fill="#94a3b8" fontFamily="sans-serif">75</text>
                <text x="8" y="84" fontSize="9" fill="#94a3b8" fontFamily="sans-serif">50</text>
                <text x="8" y="114" fontSize="9" fill="#94a3b8" fontFamily="sans-serif">25</text>
                <text x="12" y="130" fontSize="9" fill="#94a3b8" fontFamily="sans-serif">0</text>

                {/* Smooth Area Curve: Nov 22, Dec 47, Jan 49, Feb 61, Mar 58, Apr 76 */}
                <path
                  d="M40 105 Q65 72, 85 70 T130 68 T175 52 T220 56 T260 35 L260 110 L40 110 Z"
                  fill="url(#trendGreenGrad)"
                />
                <path
                  d="M40 105 Q65 72, 85 70 T130 68 T175 52 T220 56 T260 35"
                  fill="none"
                  stroke="#0b4d42"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* Dots along trend */}
                <circle cx="40" cy="105" r="3" fill="#0b4d42" />
                <circle cx="85" cy="70" r="3" fill="#0b4d42" />
                <circle cx="130" cy="68" r="3" fill="#0b4d42" />
                <circle cx="175" cy="52" r="3" fill="#0b4d42" />
                <circle cx="220" cy="56" r="3" fill="#0b4d42" />
                <circle cx="260" cy="35" r="4" fill="#0b4d42" stroke="#ffffff" strokeWidth="1.5" />

                {/* Peak 76% Pill Tag at Apr */}
                <rect x="242" y="15" width="36" height="16" rx="4" fill="#0b4d42" />
                <text x="260" y="26" fontSize="9" fontWeight="bold" fill="#ffffff" textAnchor="middle">
                  76%
                </text>

                {/* X-Axis Month Labels */}
                <text x="40" y="128" fontSize="9" fill="#64748b" textAnchor="middle">Nov</text>
                <text x="85" y="128" fontSize="9" fill="#64748b" textAnchor="middle">Dec</text>
                <text x="130" y="128" fontSize="9" fill="#64748b" textAnchor="middle">Jan</text>
                <text x="175" y="128" fontSize="9" fill="#64748b" textAnchor="middle">Feb</text>
                <text x="220" y="128" fontSize="9" fill="#64748b" textAnchor="middle">Mar</text>
                <text x="260" y="128" fontSize="9" fill="#64748b" textAnchor="middle">Apr</text>
              </svg>
            </div>
          </div>
        </div>

        {/* Panel 2: Site Overview (3 cols) - Compact */}
        <div
          className="lg:col-span-3 rounded-xl p-4 relative overflow-hidden flex flex-col justify-between shadow-sm"
          style={{
            backgroundColor: '#092923',
            backgroundImage: 'linear-gradient(175deg, #0a3029 0%, #08241f 100%)',
          }}
        >
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <HardHat className="w-3.5 h-3.5 text-[#dfa86c]" />
              <h2 className="text-xs sm:text-sm font-bold text-white tracking-tight">Site Overview</h2>
            </div>

            {/* Construction building photo container */}
            <div className="relative rounded-lg overflow-hidden h-28 border border-[#144238] shadow-inner mb-3 group">
              <img
                src={siteOverviewCrane}
                alt="Active Construction Site"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-2 text-white">
              <div>
                <div className="text-xl font-black text-white">12</div>
                <div className="text-[10px] text-emerald-200/80">Active Sites</div>
              </div>
              <div>
                <div className="text-xl font-black text-white">3</div>
                <div className="text-[10px] text-emerald-200/80">Upcoming Sites</div>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-[#143e35]">
            <button
              onClick={() => {
                setActiveDivision('site');
                setActiveSiteSubmodule('site-operations');
              }}
              className="w-full py-1.5 px-2.5 rounded-lg bg-[#dfa86c] text-stone-900 font-bold text-[11px] hover:bg-[#cf985c] transition flex items-center justify-center gap-1 shadow-sm"
            >
              <span>View Sites</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Panel 3: Upcoming Tasks (3 cols) - Compact */}
        <div
          className={`lg:col-span-3 rounded-xl p-4 border flex flex-col justify-between ${
            isLight
              ? 'bg-white border-stone-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)]'
              : 'bg-[#0f1d26] border-slate-800 text-white'
          }`}
        >
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-slate-800 mb-3">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-[#dfa86c]" />
                <h2 className="text-sm font-bold tracking-tight">Upcoming Tasks</h2>
              </div>
              <button
                onClick={() => {
                  setActiveDivision('office');
                  setActiveOfficeSubmodule('pmo');
                }}
                className="text-[11px] font-bold text-[#dfa86c] hover:underline flex items-center gap-0.5"
              >
                <span>View All</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            {/* Tasks list matching image mockup */}
            <div className="space-y-3">
              {tasks.map((task) => {
                let badgeColor = 'text-emerald-600 bg-emerald-50 border-emerald-200';
                let dotColor = 'bg-emerald-500';
                if (task.priority === 'High') {
                  badgeColor = 'text-rose-600 bg-rose-50 border-rose-200';
                  dotColor = 'bg-rose-500';
                } else if (task.priority === 'Medium') {
                  badgeColor = 'text-amber-600 bg-amber-50 border-amber-200';
                  dotColor = 'bg-amber-500';
                }

                return (
                  <div
                    key={task.id}
                    onClick={() => setSelectedTask(task)}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between group ${
                      isLight
                        ? 'hover:bg-stone-50 border-stone-100'
                        : 'hover:bg-slate-850 border-slate-800'
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className={`w-2 h-2 rounded-full ${dotColor}`} />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                          {task.priority}
                        </span>
                      </div>
                      <div className="text-xs font-bold truncate group-hover:text-[#dfa86c] transition">
                        {task.title}
                      </div>
                      <div className="text-[10px] text-stone-400 font-medium">{task.time}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-stone-700 shrink-0" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 4. LOWER ROW: Recent Projects Table & Recent Activity - Compact */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        {/* Recent Projects Table (8 cols) */}
        <div
          className={`lg:col-span-8 rounded-xl p-4 border overflow-hidden ${
            isLight
              ? 'bg-white border-stone-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)]'
              : 'bg-[#0f1d26] border-slate-800 text-white'
          }`}
        >
          <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-stone-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-[#dfa86c]" />
              <h2 className="text-xs sm:text-sm font-bold tracking-tight">Recent Projects</h2>
            </div>
            <button
              onClick={() => {
                setActiveDivision('office');
                setActiveOfficeSubmodule('pmo');
              }}
              className="text-[10.5px] font-bold text-[#dfa86c] hover:underline flex items-center gap-0.5"
            >
              <span>View All Projects</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px]">
              <thead>
                <tr className="text-stone-400 font-semibold border-b border-stone-100 dark:border-slate-800 text-[10.5px]">
                  <th className="py-2 pl-1 pr-2.5">Project Name</th>
                  <th className="py-2 px-2.5">Client</th>
                  <th className="py-2 px-2.5">Location</th>
                  <th className="py-2 px-2.5">Start Date</th>
                  <th className="py-2 px-2.5">End Date</th>
                  <th className="py-2 px-2.5">Status</th>
                  <th className="py-2 px-2.5">Progress</th>
                  <th className="py-2 pl-2.5 pr-1 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-slate-800">
                {recentProjects.map((p) => {
                  const isOnTrack = p.status === 'On Track';
                  return (
                    <tr
                      key={p.id}
                      onClick={() => setActiveProjectId(p.id)}
                      className={`hover:bg-stone-50 dark:hover:bg-slate-850/60 transition cursor-pointer ${
                        p.id === activeProjectId ? 'bg-[#dfa86c]/5' : ''
                      }`}
                    >
                      {/* Name with thumbnail image */}
                      <td className="py-2 pl-1 pr-2.5 flex items-center gap-2 font-bold">
                        <div className="w-7 h-7 rounded-md overflow-hidden shrink-0 border border-stone-200">
                          <img src={p.thumb} alt={p.name} className="w-full h-full object-cover" />
                        </div>
                        <span className="truncate max-w-[140px]">{p.name}</span>
                      </td>

                      {/* Client */}
                      <td className="py-2 px-2.5 font-medium text-stone-600 dark:text-slate-300">
                        {p.client}
                      </td>

                      {/* Location */}
                      <td className="py-2 px-2.5 text-stone-500 dark:text-slate-400">
                        {p.location}
                      </td>

                      {/* Dates */}
                      <td className="py-2 px-2.5 text-stone-500 font-mono text-[10.5px]">
                        {p.startDate}
                      </td>
                      <td className="py-2 px-2.5 text-stone-500 font-mono text-[10.5px]">
                        {p.endDate}
                      </td>

                      {/* Status badge */}
                      <td className="py-2 px-2.5">
                        <span
                          className={`inline-block px-1.5 py-0.2 rounded-full text-[9.5px] font-bold ${
                            isOnTrack
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>

                      {/* Progress bar */}
                      <td className="py-2 px-2.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-stone-900 dark:text-white text-[10.5px]">
                            {p.progress}%
                          </span>
                          <div className="w-14 h-1.5 rounded-full bg-stone-100 dark:bg-slate-700 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                isOnTrack ? 'bg-[#0b4d42]' : 'bg-[#f59e0b]'
                              }`}
                              style={{ width: `${p.progress}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Action */}
                      <td className="py-2 pl-2.5 pr-1 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            alert(`Project Options: [${p.name}]\nClient: ${p.client}\nProgress: ${p.progress}%`);
                          }}
                          className="p-1 rounded text-stone-400 hover:text-stone-700 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-slate-800 transition"
                        >
                          <MoreHorizontal className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity (4 cols) - Compact */}
        <div
          className={`lg:col-span-4 rounded-xl p-4 border flex flex-col justify-between ${
            isLight
              ? 'bg-white border-stone-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)]'
              : 'bg-[#0f1d26] border-slate-800 text-white'
          }`}
        >
          <div>
            <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-stone-100 dark:border-slate-800">
              <div className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-[#dfa86c]" />
                <h2 className="text-xs sm:text-sm font-bold tracking-tight">Recent Activity</h2>
              </div>
              <button
                onClick={() => alert('Viewing complete audit activity stream')}
                className="text-[10.5px] font-bold text-[#dfa86c] hover:underline flex items-center gap-0.5"
              >
                <span>View All</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2.5">
              {/* Activity 1 */}
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[11.5px] font-semibold leading-tight text-stone-900 dark:text-white">
                    Project updated: Dubai Marina Tower
                  </div>
                  <div className="text-[9.5px] text-stone-400 mt-0.5">2 minutes ago</div>
                </div>
              </div>

              {/* Activity 2 */}
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                  <FileText className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[11.5px] font-semibold leading-tight text-stone-900 dark:text-white">
                    New RFQ received from EMAAR
                  </div>
                  <div className="text-[9.5px] text-stone-400 mt-0.5">5 minutes ago</div>
                </div>
              </div>

              {/* Activity 3 */}
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <Bell className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[11.5px] font-semibold leading-tight text-stone-900 dark:text-white">
                    Site inspection scheduled
                  </div>
                  <div className="text-[9.5px] text-stone-400 mt-0.5">10 minutes ago</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. BOTTOM ACTION & FOOTER BAR with Golden Dubai Skyline - Compact */}
      <div
        className={`rounded-xl p-3 sm:p-3.5 border flex flex-col md:flex-row items-center justify-between gap-3 shadow-sm ${
          isLight
            ? 'bg-[#f6eee3] border-[#e8ded0] text-stone-900'
            : 'bg-[#12222a] border-slate-800 text-slate-100'
        }`}
      >
        {/* Action Buttons from image */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* + Create Project Golden Button */}
          <button
            onClick={() => setCreateProjectModalOpen(true)}
            className="px-3.5 py-1.5 rounded-lg bg-[#dfa86c] text-stone-950 font-bold text-[11.5px] hover:bg-[#cf9758] transition flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Project</span>
          </button>

          <button
            onClick={() => {
              setActiveDivision('office');
              setActiveOfficeSubmodule('reports');
            }}
            className={`px-3 py-1.5 rounded-lg border text-[11px] font-semibold transition flex items-center gap-1.5 ${
              isLight
                ? 'bg-white border-stone-200 text-stone-800 hover:bg-stone-50'
                : 'bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800'
            }`}
          >
            <BarChart2 className="w-3 h-3 text-stone-500" />
            <span>View Reports</span>
          </button>

          <button
            onClick={() => {
              setActiveDivision('office');
              setActiveOfficeSubmodule('hr');
            }}
            className={`px-3 py-1.5 rounded-lg border text-[11px] font-semibold transition flex items-center gap-1.5 ${
              isLight
                ? 'bg-white border-stone-200 text-stone-800 hover:bg-stone-50'
                : 'bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Users className="w-3 h-3 text-stone-500" />
            <span>Manage Team</span>
          </button>

          <button
            onClick={() => {
              setActiveDivision('ai');
              setActiveAISubmodule('ai-dashboard');
            }}
            className={`px-3 py-1.5 rounded-lg border text-[11px] font-semibold transition flex items-center gap-1.5 ${
              isLight
                ? 'bg-white border-stone-200 text-stone-800 hover:bg-stone-50'
                : 'bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-3 h-3 text-[#dfa86c]" />
            <span>AI Assistant</span>
          </button>
        </div>

        {/* Right side: Golden Dubai Skyline Art & "Building a Better Tomorrow in Dubai" */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <div className="hidden sm:block opacity-85">
            <DubaiSkylineIllustration className="h-8 w-36 text-[#dfa86c]" color="#dfa86c" />
          </div>

          <div className="border-l border-[#dfa86c]/40 pl-3 text-left leading-tight">
            <div className="text-[11px] font-extrabold text-[#99652a] dark:text-[#dfa86c] tracking-tight">
              Building a Better Tomorrow
            </div>
            <div className="text-[10px] text-stone-500 dark:text-slate-400 font-medium">
              in Dubai
            </div>
          </div>
        </div>
      </div>

      {/* CREATE PROJECT MODAL - Redesigned per Theme References */}
      {createProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm animate-fade-in">
          <div
            className={`w-full max-w-lg rounded-2xl p-6 border shadow-2xl transition-all ${
              isLight
                ? 'bg-white border-[#e8ded0] text-stone-900 shadow-[0_20px_60px_rgba(214,168,108,0.15)]'
                : 'bg-[#0e1a22] border-slate-800 text-white shadow-2xl'
            }`}
          >
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-stone-100 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#faeede] to-[#f4dfc7] border border-[#dfa86c]/40 text-[#935a26] flex items-center justify-center shrink-0 shadow-sm">
                  <Building className="w-5 h-5 text-[#a36829]" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base tracking-tight leading-tight">
                    Create New UAE Project
                  </h3>
                  <p className="text-[11px] text-stone-500 dark:text-slate-400 mt-0.5 font-medium">
                    Authorize Dubai Municipality / UAE site baseline & controls
                  </p>
                </div>
              </div>

              <button
                onClick={() => setCreateProjectModalOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 dark:hover:bg-slate-800 dark:hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProjectSubmit} className="space-y-4">
              {/* Project Name */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-stone-800 dark:text-slate-200">
                    Project Name
                  </label>
                  <span className="text-[10px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.2 rounded border border-amber-200/60 dark:border-amber-800/40">
                    Required
                  </span>
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. Palm Jumeirah Ultra Waterfront Towers"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-medium border outline-none transition ${
                    isLight
                      ? 'bg-[#fbf9f6] border-stone-200/90 text-stone-900 placeholder:text-stone-400 focus:bg-white focus:border-[#dfa86c] focus:ring-2 focus:ring-[#dfa86c]/20'
                      : 'bg-[#13232c] border-slate-700 text-white placeholder:text-slate-500 focus:border-[#dfa86c] focus:ring-2 focus:ring-[#dfa86c]/20'
                  }`}
                />
              </div>

              {/* Client & Location in 2 Columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-stone-800 dark:text-slate-200 mb-1.5">
                    Client / Developer
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="EMAAR / Damac / Nakheel"
                    value={newProjectClient}
                    onChange={(e) => setNewProjectClient(e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-medium border outline-none transition ${
                      isLight
                        ? 'bg-[#fbf9f6] border-stone-200/90 text-stone-900 placeholder:text-stone-400 focus:bg-white focus:border-[#dfa86c] focus:ring-2 focus:ring-[#dfa86c]/20'
                        : 'bg-[#13232c] border-slate-700 text-white placeholder:text-slate-500 focus:border-[#dfa86c] focus:ring-2 focus:ring-[#dfa86c]/20'
                    }`}
                  />
                  {/* Quick Client Selectors */}
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {['EMAAR', 'Damac', 'Nakheel', 'Arada'].map((dev) => (
                      <button
                        type="button"
                        key={dev}
                        onClick={() => setNewProjectClient(dev)}
                        className={`text-[10px] px-1.5 py-0.5 rounded font-medium transition ${
                          newProjectClient === dev
                            ? 'bg-[#dfa86c] text-stone-950 font-bold'
                            : 'bg-stone-100 hover:bg-stone-200/70 text-stone-600 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        {dev}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 dark:text-slate-200 mb-1.5">
                    Location / Emirate
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Dubai Marina / Business Bay"
                    value={newProjectLocation}
                    onChange={(e) => setNewProjectLocation(e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-medium border outline-none transition ${
                      isLight
                        ? 'bg-[#fbf9f6] border-stone-200/90 text-stone-900 placeholder:text-stone-400 focus:bg-white focus:border-[#dfa86c] focus:ring-2 focus:ring-[#dfa86c]/20'
                        : 'bg-[#13232c] border-slate-700 text-white placeholder:text-slate-500 focus:border-[#dfa86c] focus:ring-2 focus:ring-[#dfa86c]/20'
                    }`}
                  />
                  {/* Quick Location Selectors */}
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {['Dubai Marina', 'Business Bay', 'JVC', 'Downtown'].map((loc) => (
                      <button
                        type="button"
                        key={loc}
                        onClick={() => setNewProjectLocation(loc)}
                        className={`text-[10px] px-1.5 py-0.5 rounded font-medium transition ${
                          newProjectLocation === loc
                            ? 'bg-[#dfa86c] text-stone-950 font-bold'
                            : 'bg-stone-100 hover:bg-stone-200/70 text-stone-600 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        {loc}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Contract Baseline (AED) with Currency Addon */}
              <div>
                <label className="block text-xs font-bold text-stone-800 dark:text-slate-200 mb-1.5">
                  Contract Baseline (AED)
                </label>
                <div className="relative flex items-center">
                  <div
                    className={`absolute left-2.5 px-2 py-1 rounded-md text-[11px] font-bold font-mono border ${
                      isLight
                        ? 'bg-[#faeede] text-[#935a26] border-[#dfa86c]/40'
                        : 'bg-slate-800 text-[#dfa86c] border-slate-700'
                    }`}
                  >
                    AED
                  </div>
                  <input
                    type="text"
                    required
                    value={newProjectBaseline}
                    onChange={(e) => setNewProjectBaseline(e.target.value)}
                    className={`w-full pl-16 pr-3.5 py-2.5 rounded-xl text-xs font-mono font-bold border outline-none transition ${
                      isLight
                        ? 'bg-[#fbf9f6] border-stone-200/90 text-stone-900 focus:bg-white focus:border-[#dfa86c] focus:ring-2 focus:ring-[#dfa86c]/20'
                        : 'bg-[#13232c] border-slate-700 text-white focus:border-[#dfa86c] focus:ring-2 focus:ring-[#dfa86c]/20'
                    }`}
                  />
                </div>
              </div>

              {/* Footer Actions */}
              <div className="pt-3 border-t border-stone-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setCreateProjectModalOpen(false)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold border transition ${
                    isLight
                      ? 'border-stone-300 text-stone-700 hover:bg-stone-100'
                      : 'border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#dfa86c] to-[#d49a5b] text-stone-950 font-bold text-xs hover:from-[#d89f64] hover:to-[#c88f51] shadow-md shadow-amber-900/15 flex items-center gap-1.5 transition active:scale-[0.98]"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Create & Launch Site</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TASK DETAIL MODAL - Redesigned per Theme References */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm animate-fade-in">
          <div
            className={`w-full max-w-md rounded-2xl p-6 border shadow-2xl transition-all ${
              isLight
                ? 'bg-white border-[#e8ded0] text-stone-900 shadow-[0_20px_60px_rgba(214,168,108,0.15)]'
                : 'bg-[#0e1a22] border-slate-800 text-white shadow-2xl'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-slate-800 mb-3.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#935a26] bg-[#faeede] px-2 py-0.5 rounded border border-[#dfa86c]/30">
                Task Details • Priority: {selectedTask.priority}
              </span>
              <button
                onClick={() => setSelectedTask(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <h4 className="font-bold text-sm sm:text-base mb-1.5 text-stone-900 dark:text-white leading-tight">
              {selectedTask.title}
            </h4>
            <div className="text-[11px] text-stone-500 font-medium mb-3 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#dfa86c]" />
              <span>{selectedTask.time}</span>
            </div>
            <div className="p-3 rounded-xl bg-stone-50 dark:bg-slate-800/60 border border-stone-200/70 dark:border-slate-700 text-xs text-stone-700 dark:text-slate-300 leading-relaxed mb-4">
              {selectedTask.desc}
            </div>
            <div className="flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setSelectedTask(null)}
                className="px-4 py-1.5 rounded-xl text-xs font-semibold border border-stone-300 text-stone-700 hover:bg-stone-100 transition"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setTasks((prev) =>
                    prev.map((t) => (t.id === selectedTask.id ? { ...t, completed: true } : t))
                  );
                  setSelectedTask(null);
                }}
                className="px-4 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition flex items-center gap-1.5 shadow-sm"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Mark as Resolved</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
