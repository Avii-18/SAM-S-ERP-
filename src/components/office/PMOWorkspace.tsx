import React, { useState, useEffect, useRef } from 'react';
import { useERP } from '../../context/ERPContext';
import { WBSActivity, ContractMilestone } from '../../types/erp';
import {
  CalendarDays,
  Kanban,
  Flag,
  Calculator,
  Sliders,
  Plus,
  FileDown,
  Wand2,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Printer,
  FileText,
} from 'lucide-react';
import Chart from 'chart.js/auto';

export const PMOWorkspace: React.FC = () => {
  const {
    activeProject,
    updateProject,
    wbsActivities,
    addWBSActivity,
    updateWBSActivity,
    deleteWBSActivity,
    milestones,
    addMilestone,
    updateMilestone,
    deleteMilestone,
    activeSubPage,
    setActiveSubPage,
  } = useERP();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'gantt' | 'milestones' | 'coeff' | 'config'>('dashboard');

  // Sync with activeSubPage from sidebar if set
  useEffect(() => {
    if (activeSubPage === 'pmo-dashboard') setActiveTab('dashboard');
    else if (activeSubPage === 'pmo-wbs') setActiveTab('gantt');
    else if (activeSubPage === 'pmo-milestones') setActiveTab('milestones');
    else if (activeSubPage === 'pmo-coeff') setActiveTab('coeff');
    else if (activeSubPage === 'pmo-config') setActiveTab('config');
  }, [activeSubPage]);

  // Project activities & milestones
  const items = wbsActivities.filter((a) => a.projectId === activeProject.id);
  const projMilestones = milestones.filter((m) => m.projectId === activeProject.id);

  // Form states
  const [editingActivity, setEditingActivity] = useState<WBSActivity | null>(null);
  const [newWbs, setNewWbs] = useState('');
  const [newName, setNewName] = useState('');
  const [newStart, setNewStart] = useState<number>(1);
  const [newFinish, setNewFinish] = useState<number>(3);
  const [newWeight, setNewWeight] = useState<number>(10);
  const [newProgress, setNewProgress] = useState<number>(0);
  const [newPred, setNewPred] = useState('-');

  // Milestone modal state
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<ContractMilestone | null>(null);
  const [msName, setMsName] = useState('');
  const [msTarget, setMsTarget] = useState<number>(6);
  const [msActual, setMsActual] = useState<number>(6);
  const [msStatus, setMsStatus] = useState<ContractMilestone['status']>('On-Track');

  // Chart ref
  const chartCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  // EVM Calculations
  let actualCumulative = 0;
  let totalWeight = 0;
  items.forEach((i) => {
    actualCumulative += (i.progress * i.weight) / 100;
    totalWeight += i.weight;
  });

  let plannedCumulative = 0;
  items.forEach((i) => {
    if (activeProject.currentMonth >= i.finishMonth) {
      plannedCumulative += i.weight;
    } else if (activeProject.currentMonth > i.startMonth) {
      const dur = i.finishMonth - i.startMonth;
      const elapsed = activeProject.currentMonth - i.startMonth;
      plannedCumulative += i.weight * (elapsed / dur);
    }
  });

  const spi = plannedCumulative > 0 ? (actualCumulative / plannedCumulative).toFixed(2) : '1.00';
  const cpi = activeProject.actualCostAED > 0
    ? (((activeProject.contractBaselineAED * actualCumulative) / 100) / activeProject.actualCostAED).toFixed(2)
    : '1.02';

  const plannedMonths = activeProject.durationMonths || 24;

  // Render S-Curve chart
  useEffect(() => {
    if (activeTab !== 'dashboard') return;
    if (!chartCanvasRef.current) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const labels: string[] = [];
    const plannedData: number[] = [];
    const actualData: number[] = [];

    for (let m = 1; m <= plannedMonths; m++) {
      labels.push(`Month ${m}`);

      let pAcc = 0;
      items.forEach((i) => {
        if (m >= i.finishMonth) {
          pAcc += i.weight;
        } else if (m > i.startMonth) {
          const dur = i.finishMonth - i.startMonth;
          pAcc += i.weight * ((m - i.startMonth) / dur);
        }
      });
      plannedData.push(Math.min(100, Math.round(pAcc)));

      if (m <= activeProject.currentMonth) {
        let aAcc = 0;
        items.forEach((i) => {
          if (m >= i.finishMonth) {
            aAcc += (i.progress * i.weight) / 100;
          } else if (m >= i.startMonth) {
            aAcc += (i.progress * i.weight) / 100;
          }
        });
        actualData.push(Math.min(100, Math.round(aAcc)));
      }
    }

    chartInstanceRef.current = new Chart(chartCanvasRef.current, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Planned Baseline S-Curve (%)',
            data: plannedData,
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.08)',
            fill: true,
            tension: 0.35,
            borderWidth: 2.5,
          },
          {
            label: 'Earned Progress S-Curve (%)',
            data: actualData,
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.12)',
            fill: true,
            tension: 0.3,
            borderWidth: 3,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: { color: '#94a3b8', font: { size: 11, weight: 'bold' } },
          },
        },
        scales: {
          x: {
            ticks: { color: '#64748b', font: { size: 10 } },
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
          },
          y: {
            max: 100,
            min: 0,
            ticks: { color: '#64748b', font: { size: 10 } },
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
          },
        },
      },
    });

    return () => {
      if (chartInstanceRef.current) chartInstanceRef.current.destroy();
    };
  }, [activeTab, items, activeProject]);

  const handleSaveActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingActivity) {
      updateWBSActivity(editingActivity.id, {
        wbs: newWbs,
        name: newName,
        startMonth: newStart,
        finishMonth: newFinish,
        weight: newWeight,
        progress: newProgress,
        predecessor: newPred,
      });
      setEditingActivity(null);
    } else {
      addWBSActivity({
        id: Date.now(),
        projectId: activeProject.id,
        wbs: newWbs || `${items.length + 1}.0`,
        name: newName,
        startMonth: newStart,
        finishMonth: newFinish,
        weight: newWeight,
        progress: newProgress,
        predecessor: newPred,
      });
    }
    setNewWbs('');
    setNewName('');
    setNewStart(1);
    setNewFinish(3);
    setNewWeight(10);
    setNewProgress(0);
    setNewPred('-');
  };

  const handleEditActivity = (item: WBSActivity) => {
    setEditingActivity(item);
    setNewWbs(item.wbs);
    setNewName(item.name);
    setNewStart(item.startMonth);
    setNewFinish(item.finishMonth);
    setNewWeight(item.weight);
    setNewProgress(item.progress);
    setNewPred(item.predecessor);
  };

  const handleSaveMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMilestone) {
      updateMilestone(editingMilestone.id, {
        name: msName,
        targetMonth: msTarget,
        actualMonth: msActual,
        status: msStatus,
      });
      setEditingMilestone(null);
    } else {
      addMilestone({
        id: Date.now(),
        projectId: activeProject.id,
        name: msName,
        targetMonth: msTarget,
        actualMonth: msActual,
        status: msStatus,
      });
    }
    setShowMilestoneModal(false);
    setMsName('');
    setMsTarget(6);
    setMsActual(6);
  };

  const exportScheduleCSV = () => {
    let csv = 'WBS,Activity Name,Start Month,Finish Month,Weight %,Progress %\n';
    items.forEach((i) => {
      csv += `"${i.wbs}","${i.name}",${i.startMonth},${i.finishMonth},${i.weight},${i.progress}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeProject.code}_PMO_Schedule_WBS.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Workspace Header Tabs */}
      <div className="glass-panel rounded-2xl border border-slate-800 p-1 flex overflow-x-auto text-xs no-print">
        {[
          { id: 'dashboard', name: 'Executive PMO Dashboard', icon: CalendarDays },
          { id: 'gantt', name: 'WBS Schedule & Gantt', icon: CalendarDays },
          { id: 'milestones', name: 'Milestones & Watchlist', icon: Flag },
          { id: 'coeff', name: 'UAE Planning Coefficients', icon: Calculator },
          { id: 'config', name: 'Project Controls Setup', icon: Sliders },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setActiveSubPage(`pmo-${tab.id}`);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold whitespace-nowrap transition ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* ================= TAB 1: EXECUTIVE PMO DASHBOARD ================= */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Historical Coefficient Banner */}
          {activeProject.scheduleMode === 'BENCHMARK' && (
            <div className="p-4 bg-amber-500/10 border-l-4 border-amber-500 rounded-r-xl border border-amber-500/20 text-xs">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <Clock className="w-4 h-4" />
                <span>UAE COEFFICIENT BENCHMARK SCHEDULE APPLIED</span>
              </div>
              <p className="text-[11px] text-amber-200/80 mt-0.5">
                Benchmark schedule derived from UAE parametric coefficients: BUA {activeProject.areaSqM.toLocaleString()} m², {activeProject.floors} floors, {activeProject.basements} basement, climate factor & 6 days/week working calendar.
              </p>
            </div>
          )}

          {/* Key EVM Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Schedule Performance (SPI)</span>
              <div className="text-2xl font-black text-emerald-400 font-mono">{spi}</div>
              <span className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> On Schedule
              </span>
            </div>

            <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Overall Progress (%)</span>
              <div className="text-2xl font-black text-blue-400 font-mono">{actualCumulative.toFixed(1)}%</div>
              <span className="text-[10px] text-slate-500">Target: {plannedCumulative.toFixed(1)}%</span>
            </div>

            <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Critical Variance</span>
              <div className="text-2xl font-black text-slate-100 font-mono">0 Days</div>
              <span className="text-[10px] text-slate-500">Vs Approved Baseline</span>
            </div>

            <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Milestones Complete</span>
              <div className="text-2xl font-black text-indigo-400 font-mono">
                {projMilestones.filter((m) => m.status === 'Completed').length} / {projMilestones.length}
              </div>
              <span className="text-[10px] text-indigo-400">Critical Authority Gates</span>
            </div>

            <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Cost Performance (CPI)</span>
              <div className="text-2xl font-black text-teal-400 font-mono">{cpi}</div>
              <span className="text-[10px] text-emerald-400">Within Budget</span>
            </div>
          </div>

          {/* S-Curve Chart */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex flex-wrap justify-between items-center gap-2 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-blue-400" />
                  Baseline Earned Value S-Curve (Cumulative %)
                </h3>
                <p className="text-[11px] text-slate-400">
                  Earned Value S-Curve comparing Early Baseline S-Curve against Actual Progress Trend.
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="flex items-center gap-1.5 text-blue-400">
                  <span className="w-3 h-3 rounded-full bg-blue-500 inline-block"></span> Planned S-Curve
                </span>
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span> Actual Earned
                </span>
              </div>
            </div>

            <div className="h-72 w-full">
              <canvas ref={chartCanvasRef}></canvas>
            </div>
          </div>

          {/* Executive PMO Observation */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Executive PMO Status Observation & Authority Path
            </h4>
            <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed space-y-2">
              <p>
                <strong className="text-white">{activeProject.name}</strong> is currently at Month {activeProject.currentMonth} of {activeProject.durationMonths} Months.
                Cumulative physical progress stands at <strong className="text-emerald-400">{actualCumulative.toFixed(1)}%</strong> against early baseline <strong className="text-blue-400">{plannedCumulative.toFixed(1)}%</strong> (SPI {spi}).
              </p>
              <p className="text-slate-400">
                Critical path activities in Superstructure RCC framing (WBS 5.0) are proceeding at an average 4-day cycle using Mivan formwork panels. Statutory authority checkpoints (Sharjah Municipality inspection, Civil Defence fire barrier NOC, SEWA permanent energisation) form the critical statutory gating mechanism.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: WBS SCHEDULE & GANTT ================= */}
      {activeTab === 'gantt' && (
        <div className="space-y-6">
          {/* Add / Edit Activity Form */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4 no-print">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-400" />
                {editingActivity ? 'Edit WBS Activity' : 'Add Activity to WBS Schedule'}
              </h3>
              {editingActivity && (
                <button
                  onClick={() => setEditingActivity(null)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            <form onSubmit={handleSaveActivity} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">WBS Code *</label>
                <input
                  type="text"
                  required
                  value={newWbs}
                  onChange={(e) => setNewWbs(e.target.value)}
                  placeholder="5.1"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 font-mono text-slate-200"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-400 font-bold mb-1">Activity Name *</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Core Wall Concrete Pouring"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Start Month</label>
                <input
                  type="number"
                  min={1}
                  required
                  value={newStart}
                  onChange={(e) => setNewStart(parseInt(e.target.value) || 1)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 font-mono text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Finish Month</label>
                <input
                  type="number"
                  min={1}
                  required
                  value={newFinish}
                  onChange={(e) => setNewFinish(parseInt(e.target.value) || 2)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 font-mono text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Weight %</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={newWeight}
                  onChange={(e) => setNewWeight(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 font-mono text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Progress %</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  required
                  value={newProgress}
                  onChange={(e) => setNewProgress(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 font-mono text-emerald-400 font-bold"
                />
              </div>

              <div className="lg:col-span-6">
                <label className="block text-slate-400 font-bold mb-1">Predecessors WBS</label>
                <input
                  type="text"
                  value={newPred}
                  onChange={(e) => setNewPred(e.target.value)}
                  placeholder="e.g. 4.0, 3.0"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 font-mono text-slate-300"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition"
                >
                  {editingActivity ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>

          {/* WBS Table with Visual Gantt */}
          <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/60 no-print">
              <span className="font-bold text-xs uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-blue-400" /> WBS Schedule & Visual Timeline
              </span>
              <button
                onClick={exportScheduleCSV}
                className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <FileDown className="w-3.5 h-3.5" /> Export Schedule CSV
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 text-slate-400 uppercase text-[10px]">
                  <tr>
                    <th className="p-3 w-16">WBS</th>
                    <th className="p-3 min-w-[200px]">Activity Description</th>
                    <th className="p-3 text-center w-16">Start</th>
                    <th className="p-3 text-center w-16">Finish</th>
                    <th className="p-3 text-right w-20">Weight</th>
                    <th className="p-3 text-right w-20">Prog %</th>
                    <th className="p-3 w-72">Gantt Visual Timeline</th>
                    <th className="p-3 text-center w-20 no-print">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {items.map((item) => {
                    const totalM = activeProject.durationMonths || 24;
                    const leftPct = ((item.startMonth - 1) / totalM) * 100;
                    const widthPct = Math.max(5, ((item.finishMonth - item.startMonth) / totalM) * 100);

                    return (
                      <tr key={item.id} className="hover:bg-slate-900/40">
                        <td className="p-3 font-mono font-bold text-blue-400">{item.wbs}</td>
                        <td className="p-3">
                          <div className="font-bold text-slate-200">{item.name}</div>
                          {item.critical ? (
                            <span className="text-[9px] bg-rose-500/20 text-rose-300 px-1.5 py-0.2 rounded font-mono font-bold">
                              CRITICAL PATH
                            </span>
                          ) : null}
                        </td>
                        <td className="p-3 text-center font-mono text-slate-400">M{item.startMonth}</td>
                        <td className="p-3 text-center font-mono text-slate-400">M{item.finishMonth}</td>
                        <td className="p-3 text-right font-mono font-bold text-slate-200">{item.weight}%</td>
                        <td className="p-3 text-right font-mono font-bold text-emerald-400">{item.progress}%</td>
                        <td className="p-3">
                          <div className="w-full bg-slate-900 h-3.5 rounded-full relative overflow-hidden border border-slate-800">
                            <div
                              className="absolute top-0 bottom-0 bg-blue-600 rounded-full"
                              style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                            >
                              <div
                                className="bg-emerald-400 h-full rounded-full"
                                style={{ width: `${item.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 text-center no-print space-x-1">
                          <button
                            onClick={() => handleEditActivity(item)}
                            className="p-1 hover:text-blue-400 text-slate-400"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteWBSActivity(item.id)}
                            className="p-1 hover:text-rose-400 text-slate-400"
                            title="Delete"
                          >
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

      {/* ================= TAB 3: MILESTONES & WATCHLIST ================= */}
      {activeTab === 'milestones' && (
        <div className="space-y-6">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                  <Flag className="w-4 h-4 text-blue-400" /> Contractual Milestones & Statutory Authority Gates
                </h3>
                <p className="text-[11px] text-slate-400">
                  Track key Sharjah / Dubai Municipality, Civil Defence, and SEWA completion gates against target baseline.
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingMilestone(null);
                  setMsName('');
                  setMsTarget(activeProject.currentMonth);
                  setMsActual(activeProject.currentMonth);
                  setShowMilestoneModal(true);
                }}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition shadow"
              >
                <Plus className="w-3.5 h-3.5" /> Add Milestone
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 text-slate-400 uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Milestone Event</th>
                    <th className="p-3 text-center w-28">Target Baseline</th>
                    <th className="p-3 text-center w-28">Actual / Forecast</th>
                    <th className="p-3 text-center w-28">Variance</th>
                    <th className="p-3 text-center w-28">Status</th>
                    <th className="p-3 text-center w-20 no-print">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {projMilestones.map((m) => {
                    const variance = m.actualMonth - m.targetMonth;
                    let badgeClass = 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
                    if (m.status === 'At-Risk') badgeClass = 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
                    if (m.status === 'Delayed') badgeClass = 'bg-rose-500/10 text-rose-400 border border-rose-500/20';

                    return (
                      <tr key={m.id} className="hover:bg-slate-900/40">
                        <td className="p-3">
                          <div className="font-bold text-slate-200">{m.name}</div>
                          {m.notes && <div className="text-[10px] text-slate-500">{m.notes}</div>}
                        </td>
                        <td className="p-3 text-center font-mono text-slate-400">Month {m.targetMonth}</td>
                        <td className="p-3 text-center font-mono font-bold text-blue-400">Month {m.actualMonth}</td>
                        <td className="p-3 text-center font-mono font-bold">
                          {variance > 0 ? (
                            <span className="text-rose-400">+{variance} Mo</span>
                          ) : (
                            <span className="text-emerald-400">On Time</span>
                          )}
                        </td>
                        <td className="p-3 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${badgeClass}`}>
                            {m.status}
                          </span>
                        </td>
                        <td className="p-3 text-center no-print space-x-1">
                          <button
                            onClick={() => {
                              setEditingMilestone(m);
                              setMsName(m.name);
                              setMsTarget(m.targetMonth);
                              setMsActual(m.actualMonth);
                              setMsStatus(m.status);
                              setShowMilestoneModal(true);
                            }}
                            className="p-1 hover:text-blue-400 text-slate-400"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteMilestone(m.id)}
                            className="p-1 hover:text-rose-400 text-slate-400"
                          >
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

      {/* ================= TAB 4: UAE PLANNING COEFFICIENTS ================= */}
      {activeTab === 'coeff' && (
        <div className="space-y-6">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4 text-xs">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-blue-400" /> UAE Historical Planning Coefficients Library
            </h3>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Duration calculation formula:
              <code className="text-amber-300 font-mono ml-1">
                Duration (months) = (Base + Floors×perFloor + Basements×perBasement + BUA(000 m²)×perK) × Emirate × Climate × Grade × (6 ÷ work-days) + Permit
              </code>
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1">
                <span className="font-bold text-slate-200">Emirate Location Multipliers</span>
                <p className="text-[10px] text-slate-400">Sharjah: 1.00 (Permit 2.0 mo) • Dubai: 1.02 (Permit 2.5 mo) • Abu Dhabi: 1.03 (Permit 3.0 mo)</p>
              </div>

              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1">
                <span className="font-bold text-slate-200">Climate & Ramadan Loss Factors</span>
                <p className="text-[10px] text-slate-400">Midday break season (15 June - 15 Sept): 8% summer loss • Ramadan: 15% monthly loss</p>
              </div>

              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1">
                <span className="font-bold text-slate-200">Finish Grade Factors</span>
                <p className="text-[10px] text-slate-400">Standard: 1.00 • Premium: 1.10 • Luxury Waterfront: 1.20</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 5: CONTROLS CONFIGURATION ================= */}
      {activeTab === 'config' && (
        <div className="space-y-6">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-400" /> PMO Project Controls Baseline Configuration
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <label className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl cursor-pointer hover:border-blue-500 transition flex items-start gap-3">
                <input
                  type="radio"
                  name="scheduleMode"
                  value="PRIMAVERA"
                  checked={activeProject.scheduleMode === 'PRIMAVERA'}
                  onChange={() => updateProject(activeProject.id, { scheduleMode: 'PRIMAVERA' })}
                  className="mt-1"
                />
                <div>
                  <span className="font-bold text-slate-200 block">Primavera P6 / MS Project Mode</span>
                  <span className="text-[11px] text-slate-500">
                    Schedule derived from manual WBS activities, float analysis, and contractor&apos;s contractual baseline.
                  </span>
                </div>
              </label>

              <label className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl cursor-pointer hover:border-blue-500 transition flex items-start gap-3">
                <input
                  type="radio"
                  name="scheduleMode"
                  value="BENCHMARK"
                  checked={activeProject.scheduleMode === 'BENCHMARK'}
                  onChange={() => updateProject(activeProject.id, { scheduleMode: 'BENCHMARK' })}
                  className="mt-1"
                />
                <div>
                  <span className="font-bold text-slate-200 block">Historical Co-efficient Benchmark Mode</span>
                  <span className="text-[11px] text-slate-500">
                    Auto-generate S-curve baseline and milestones using UAE building planning coefficients.
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Milestone Modal */}
      {showMilestoneModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="glass-panel rounded-2xl border border-slate-800 p-6 max-w-md w-full space-y-4">
            <h3 className="font-bold text-sm text-slate-100">
              {editingMilestone ? 'Edit Contract Milestone' : 'Add Contract Milestone'}
            </h3>
            <form onSubmit={handleSaveMilestone} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Milestone Description *</label>
                <input
                  type="text"
                  required
                  value={msName}
                  onChange={(e) => setMsName(e.target.value)}
                  placeholder="e.g. Structure Top-Out (Level 21)"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Target Month</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={msTarget}
                    onChange={(e) => setMsTarget(parseInt(e.target.value) || 1)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Actual / Forecast</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={msActual}
                    onChange={(e) => setMsActual(parseInt(e.target.value) || 1)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 font-mono text-blue-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Status</label>
                <select
                  value={msStatus}
                  onChange={(e) => setMsStatus(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 font-bold"
                >
                  <option value="On-Track">On-Track</option>
                  <option value="At-Risk">At-Risk</option>
                  <option value="Delayed">Delayed</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowMilestoneModal(false)}
                  className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 text-white font-bold rounded-lg"
                >
                  Save Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
