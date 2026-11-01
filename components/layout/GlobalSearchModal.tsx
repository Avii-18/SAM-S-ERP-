import React, { useState, useEffect } from 'react';
import { useERP } from '../../context/ERPContext';
import {
  Search,
  X,
  Building2,
  Receipt,
  ShoppingCart,
  Users2,
  CalendarDays,
  FileCode2,
  ArrowRight,
} from 'lucide-react';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const {
    projects,
    boqItems,
    purchaseOrders,
    employees,
    workOrders,
    crmOpportunities,
    engineeringDocs,
    setActiveDivision,
    setActiveOfficeSubmodule,
    setActiveSiteSubmodule,
    setActiveCRMSubmodule,
    setActiveProjectId,
    theme,
  } = useERP();

  const isLight = theme === 'light';

  const [query, setQuery] = useState('');

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  // Search results
  const filteredProjects = q
    ? projects.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.code.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          p.client.toLowerCase().includes(q)
      )
    : [];

  const filteredBOQ = q
    ? boqItems.filter(
        (b) =>
          b.description.toLowerCase().includes(q) ||
          b.discipline.toLowerCase().includes(q) ||
          b.drawingRef.toLowerCase().includes(q)
      )
    : [];

  const filteredPOs = q
    ? purchaseOrders.filter(
        (p) =>
          p.id.toLowerCase().includes(q) ||
          p.supplier.toLowerCase().includes(q) ||
          p.items.toLowerCase().includes(q)
      )
    : [];

  const filteredEmployees = q
    ? employees.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.designation.toLowerCase().includes(q) ||
          e.passportNo.toLowerCase().includes(q) ||
          e.eidNumber.toLowerCase().includes(q)
      )
    : [];

  const filteredWorkOrders = q
    ? workOrders.filter(
        (w) =>
          w.id.toLowerCase().includes(q) ||
          w.subcontractor.toLowerCase().includes(q) ||
          w.title.toLowerCase().includes(q)
      )
    : [];

  const filteredCRM = q
    ? crmOpportunities.filter(
        (c) =>
          c.projectName.toLowerCase().includes(q) ||
          c.clientName.toLowerCase().includes(q) ||
          c.contactPerson.toLowerCase().includes(q)
      )
    : [];

  const filteredDocs = q
    ? engineeringDocs.filter(
        (d) =>
          d.refNo.toLowerCase().includes(q) ||
          d.title.toLowerCase().includes(q) ||
          d.discipline.toLowerCase().includes(q)
      )
    : [];

  const totalResults =
    filteredProjects.length +
    filteredBOQ.length +
    filteredPOs.length +
    filteredEmployees.length +
    filteredWorkOrders.length +
    filteredCRM.length +
    filteredDocs.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-stone-950/60 backdrop-blur-md">
      <div
        className={`border rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[80vh] animate-in fade-in zoom-in-95 duration-150 ${
          isLight
            ? 'bg-white border-[#e8ded0] text-stone-900 shadow-[0_20px_60px_rgba(214,168,108,0.15)]'
            : 'bg-slate-900 border-slate-800 text-slate-100 shadow-2xl'
        }`}
      >
        {/* Search Input Bar */}
        <div
          className={`p-3.5 border-b flex items-center gap-3 ${
            isLight ? 'border-stone-100 bg-[#fbf9f6]' : 'border-slate-800 bg-slate-900'
          }`}
        >
          <Search className="w-4 h-4 text-[#dfa86c] shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search across all 4 ERP Divisions: Projects, BOQ items, POs, Workers, FIDIC WOs, CRM Leads, RFIs..."
            className={`w-full bg-transparent text-xs outline-none ${
              isLight
                ? 'text-stone-900 placeholder-stone-400'
                : 'text-slate-100 placeholder-slate-500'
            }`}
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-stone-400 hover:text-stone-700 dark:hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className={`text-[10px] px-2 py-0.5 rounded border ${
              isLight
                ? 'bg-stone-100 text-stone-600 border-stone-200'
                : 'bg-slate-800 text-slate-300 border-slate-700'
            }`}
          >
            Esc
          </button>
        </div>

        {/* Search Results Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {!q && (
            <div className="text-center py-8 text-slate-500">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-40 text-teal-400" />
              <p>Type keywords to search across PMO, Commercial, Procurement, Finance, HR, Site and CRM records.</p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {['Concrete', 'Rebar', 'Aljada', 'Al-Bahar', 'Amil Solanki', 'Arada', 'RFI'].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-2.5 py-1 bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-lg text-[11px] border border-slate-800"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {q && totalResults === 0 && (
            <div className="text-center py-10 text-slate-500">
              <p>No ERP records found matching &ldquo;<span className="text-slate-300">{query}</span>&rdquo;</p>
            </div>
          )}

          {/* Projects */}
          {filteredProjects.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-[10px] font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" />
                <span>Projects ({filteredProjects.length})</span>
              </div>
              {filteredProjects.map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    setActiveProjectId(p.id);
                    setActiveDivision('office');
                    setActiveOfficeSubmodule('pmo');
                    onClose();
                  }}
                  className="p-2.5 bg-slate-950/60 hover:bg-slate-800/80 rounded-xl border border-slate-800/60 cursor-pointer flex justify-between items-center transition"
                >
                  <div>
                    <div className="font-bold text-slate-200">{p.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {p.code} • {p.location} • Client: {p.client}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-teal-400 font-bold">{p.currency} {p.contractBaselineAED.toLocaleString()}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 ml-auto mt-1" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* BOQ Items */}
          {filteredBOQ.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                <Receipt className="w-3.5 h-3.5" />
                <span>BOQ Line Items ({filteredBOQ.length})</span>
              </div>
              {filteredBOQ.slice(0, 4).map((b) => (
                <div
                  key={b.id}
                  onClick={() => {
                    setActiveDivision('office');
                    setActiveOfficeSubmodule('commercial');
                    onClose();
                  }}
                  className="p-2.5 bg-slate-950/60 hover:bg-slate-800/80 rounded-xl border border-slate-800/60 cursor-pointer flex justify-between items-center transition"
                >
                  <div>
                    <div className="font-semibold text-slate-200">{b.description}</div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {b.discipline} • Drawing: {b.drawingRef}
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-slate-300">{b.qty.toLocaleString()} {b.unit}</span>
                    <span className="block font-bold text-indigo-400">@ AED {b.rate.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Purchase Orders */}
          {filteredPOs.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Purchase Orders ({filteredPOs.length})</span>
              </div>
              {filteredPOs.map((po) => (
                <div
                  key={po.id}
                  onClick={() => {
                    setActiveDivision('office');
                    setActiveOfficeSubmodule('procurement');
                    onClose();
                  }}
                  className="p-2.5 bg-slate-950/60 hover:bg-slate-800/80 rounded-xl border border-slate-800/60 cursor-pointer flex justify-between items-center transition"
                >
                  <div>
                    <div className="font-bold font-mono text-amber-400">{po.id} - {po.supplier}</div>
                    <div className="text-[11px] text-slate-300">{po.items}</div>
                  </div>
                  <div className="text-right font-mono">
                    <span className="font-bold text-emerald-400">AED {po.totalWithVat.toLocaleString()}</span>
                    <span className="text-[10px] text-slate-500 block">{po.deliveryStatus}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Workers & Staff */}
          {filteredEmployees.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Users2 className="w-3.5 h-3.5" />
                <span>Workforce & Staff ({filteredEmployees.length})</span>
              </div>
              {filteredEmployees.map((emp) => (
                <div
                  key={emp.id}
                  onClick={() => {
                    setActiveDivision('office');
                    setActiveOfficeSubmodule('hr');
                    onClose();
                  }}
                  className="p-2.5 bg-slate-950/60 hover:bg-slate-800/80 rounded-xl border border-slate-800/60 cursor-pointer flex justify-between items-center transition"
                >
                  <div>
                    <div className="font-bold text-slate-200">{emp.name} ({emp.empCode})</div>
                    <div className="text-[10px] text-slate-400">
                      {emp.designation} • Passport: {emp.passportNo} • EID: {emp.eidNumber}
                    </div>
                  </div>
                  <div className="text-right text-[11px]">
                    <span className="text-emerald-400 font-bold font-mono">AED {emp.basicSalary + emp.allowances}</span>
                    <span className="text-[10px] text-slate-500 block">Visa Exp: {emp.visaExpiry}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Subcontract Work Orders */}
          {filteredWorkOrders.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-[10px] font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                <CalendarDays className="w-3.5 h-3.5" />
                <span>FIDIC Work Orders ({filteredWorkOrders.length})</span>
              </div>
              {filteredWorkOrders.map((wo) => (
                <div
                  key={wo.id}
                  onClick={() => {
                    setActiveDivision('office');
                    setActiveOfficeSubmodule('finance');
                    onClose();
                  }}
                  className="p-2.5 bg-slate-950/60 hover:bg-slate-800/80 rounded-xl border border-slate-800/60 cursor-pointer flex justify-between items-center transition"
                >
                  <div>
                    <div className="font-bold text-purple-300">{wo.id} - {wo.subcontractor}</div>
                    <div className="text-[11px] text-slate-400">{wo.title}</div>
                  </div>
                  <div className="text-right font-mono font-bold text-slate-200">
                    AED {wo.orderValueAED.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* CRM Leads */}
          {filteredCRM.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-[10px] font-bold text-pink-400 uppercase tracking-wider flex items-center gap-1.5">
                <FileCode2 className="w-3.5 h-3.5" />
                <span>CRM Opportunities ({filteredCRM.length})</span>
              </div>
              {filteredCRM.map((c) => (
                <div
                  key={c.id}
                  onClick={() => {
                    setActiveDivision('crm');
                    setActiveCRMSubmodule('pipeline');
                    onClose();
                  }}
                  className="p-2.5 bg-slate-950/60 hover:bg-slate-800/80 rounded-xl border border-slate-800/60 cursor-pointer flex justify-between items-center transition"
                >
                  <div>
                    <div className="font-bold text-slate-200">{c.projectName} ({c.clientName})</div>
                    <div className="text-[10px] text-slate-400">Contact: {c.contactPerson} • {c.phone}</div>
                  </div>
                  <div className="text-right font-mono">
                    <span className="font-bold text-pink-400">AED {c.estimatedBudgetAED.toLocaleString()}</span>
                    <span className="text-[10px] text-slate-500 block">Stage: {c.stage}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
