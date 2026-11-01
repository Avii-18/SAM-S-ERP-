import React from 'react';
import { useERP } from '../../context/ERPContext';
import { ChevronRight, Home, Building2, HardHat, Users2, Sparkles } from 'lucide-react';
import { PrimaryDivision } from '../../types/erp';

export const Breadcrumbs: React.FC = () => {
  const {
    activeDivision,
    setActiveDivision,
    activeOfficeSubmodule,
    activeSiteSubmodule,
    activeCRMSubmodule,
    activeAISubmodule,
    activeSubPage,
    activeProject,
  } = useERP();

  const getDivisionIcon = (div: PrimaryDivision) => {
    switch (div) {
      case 'office':
        return <Building2 className="w-3.5 h-3.5 text-blue-400" />;
      case 'site':
        return <HardHat className="w-3.5 h-3.5 text-amber-400" />;
      case 'crm':
        return <Users2 className="w-3.5 h-3.5 text-pink-400" />;
      case 'ai':
        return <Sparkles className="w-3.5 h-3.5 text-teal-400" />;
    }
  };

  const divisionName =
    activeDivision === 'office'
      ? 'Office Management'
      : activeDivision === 'site'
      ? 'Site Management'
      : activeDivision === 'crm'
      ? 'CRM'
      : 'AI Tools & Intelligence';

  let currentSubmodule = '';
  if (activeDivision === 'office') currentSubmodule = activeOfficeSubmodule.toUpperCase();
  if (activeDivision === 'site') currentSubmodule = activeSiteSubmodule.toUpperCase();
  if (activeDivision === 'crm') currentSubmodule = activeCRMSubmodule.toUpperCase();
  if (activeDivision === 'ai') currentSubmodule = activeAISubmodule.toUpperCase();

  const isDashboard = activeDivision === 'office' && activeOfficeSubmodule === 'dashboard';
  const { theme } = useERP();
  const isLight = theme === 'light';

  // If on main dashboard, hide breadcrumbs to keep clean panoramic view like mockup
  if (isDashboard) {
    return null;
  }

  return (
    <div
      className={`flex items-center justify-between py-2 px-4 lg:px-6 border-b text-xs no-print transition-colors ${
        isLight
          ? 'bg-white/80 border-stone-200/80 text-stone-600'
          : 'bg-slate-900/60 border-slate-800 text-slate-400'
      }`}
    >
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className={`flex items-center gap-1 ${isLight ? 'text-stone-400' : 'text-slate-500'}`}>
          <Home className="w-3 h-3" />
          <span>SAM'S Solution</span>
        </span>
        <ChevronRight className={`w-3 h-3 ${isLight ? 'text-stone-300' : 'text-slate-600'}`} />

        <button
          onClick={() => setActiveDivision(activeDivision)}
          className={`flex items-center gap-1 font-semibold transition ${
            isLight ? 'text-stone-700 hover:text-stone-950' : 'text-slate-300 hover:text-white'
          }`}
        >
          {getDivisionIcon(activeDivision)}
          <span>{divisionName}</span>
        </button>
        <ChevronRight className={`w-3 h-3 ${isLight ? 'text-stone-300' : 'text-slate-600'}`} />

        <span
          className={`font-bold font-mono text-[11px] px-2 py-0.5 rounded border ${
            isLight
              ? 'bg-[#faeede] text-[#935a26] border-[#dfa86c]/40'
              : 'bg-slate-800 text-teal-400 border-slate-700'
          }`}
        >
          {currentSubmodule}
        </span>

        {activeSubPage && activeSubPage !== 'overview' && (
          <>
            <ChevronRight className={`w-3 h-3 ${isLight ? 'text-stone-300' : 'text-slate-600'}`} />
            <span
              className={`font-medium capitalize ${
                isLight ? 'text-stone-700' : 'text-slate-300'
              }`}
            >
              {activeSubPage.replace('-', ' ')}
            </span>
          </>
        )}
      </div>

      <div className="hidden lg:flex items-center gap-2 text-[11px] text-slate-400 shrink-0">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
        <span className="truncate max-w-[200px]">Site: <strong className="text-slate-200">{activeProject.name}</strong></span>
        <span className="text-slate-600">|</span>
        <span className="font-mono text-teal-400 font-bold shrink-0">{activeProject.currency} {activeProject.contractBaselineAED.toLocaleString()}</span>
      </div>
    </div>
  );
};
