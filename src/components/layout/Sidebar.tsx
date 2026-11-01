import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import {
  PrimaryDivision,
  OfficeSubmodule,
  SiteSubmodule,
  CRMSubmodule,
  AISubmodule,
} from '../../types/erp';
import {
  Home,
  Briefcase,
  HardHat,
  Users2,
  Sparkles,
  ChevronDown,
  ChevronRight,
  Settings,
  HelpCircle,
  LogOut,
} from 'lucide-react';
import { DubaiSkylineIllustration } from '../common/DubaiSkylineIllustration';

interface TreeItem {
  id: string;
  name: string;
  division: PrimaryDivision;
  submoduleId: string;
}

export const Sidebar: React.FC = () => {
  const {
    activeDivision,
    setActiveDivision,
    activeOfficeSubmodule,
    setActiveOfficeSubmodule,
    activeSiteSubmodule,
    setActiveSiteSubmodule,
    activeCRMSubmodule,
    setActiveCRMSubmodule,
    activeAISubmodule,
    setActiveAISubmodule,
    setActiveSubPage,
    sidebarCollapsed,
  } = useERP();

  // Collapsible category state
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    office: true,
    site: true,
    crm: true,
    ai: true,
  });

  const toggleSection = (key: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isDashboardActive = activeDivision === 'office' && activeOfficeSubmodule === 'dashboard';

  // Navigation Items matching the image structure
  const officeItems: TreeItem[] = [
    { id: 'hr', name: 'HR & Payroll', division: 'office', submoduleId: 'hr' },
    { id: 'procurement', name: 'Procurement', division: 'office', submoduleId: 'procurement' },
    { id: 'finance', name: 'Finance & Accounts', division: 'office', submoduleId: 'finance' },
    { id: 'pmo', name: 'Project Management', division: 'office', submoduleId: 'pmo' },
    { id: 'commercial', name: 'Estimation & QS', division: 'office', submoduleId: 'commercial' },
    { id: 'contracts', name: 'Contracts & FIDIC', division: 'office', submoduleId: 'contracts' },
    { id: 'vendors', name: 'Vendor Directory', division: 'office', submoduleId: 'vendors' },
    { id: 'documents', name: 'Document Management', division: 'office', submoduleId: 'documents' },
    { id: 'assets', name: 'Plant & Assets', division: 'office', submoduleId: 'assets' },
    { id: 'reports', name: 'Executive P&L', division: 'office', submoduleId: 'reports' },
  ];

  const siteItems: TreeItem[] = [
    { id: 'site-operations', name: 'Site Operations', division: 'site', submoduleId: 'site-operations' },
    { id: 'hse', name: 'Health & Safety', division: 'site', submoduleId: 'hse' },
    { id: 'equipment', name: 'Equipment', division: 'site', submoduleId: 'equipment' },
    { id: 'qaqc', name: 'QA/QC Inspections', division: 'site', submoduleId: 'qaqc' },
    { id: 'dpr', name: 'Daily Progress Log', division: 'site', submoduleId: 'dpr' },
    { id: 'engineering', name: 'Engineering Submittals', division: 'site', submoduleId: 'engineering' },
  ];

  const crmItems: TreeItem[] = [
    { id: 'dashboard', name: 'CRM Executive Hub', division: 'crm', submoduleId: 'crm-dashboard' },
    { id: 'leads', name: 'Leads & Enquiries', division: 'crm', submoduleId: 'leads' },
    { id: 'followups', name: 'Follow-ups & Tasks', division: 'crm', submoduleId: 'followups' },
    { id: 'inventory', name: 'Unit Inventory Grid', division: 'crm', submoduleId: 'inventory' },
    { id: 'quotations', name: 'Cost Sheets & Quotes', division: 'crm', submoduleId: 'quotations' },
    { id: 'bookings', name: 'Bookings & SPA Contracts', division: 'crm', submoduleId: 'bookings' },
    { id: 'customers', name: 'Customers 360° (EID)', division: 'crm', submoduleId: 'customers' },
    { id: 'collections', name: 'Collections & Demands (AED)', division: 'crm', submoduleId: 'collections' },
    { id: 'handover', name: 'Baladiya & Key Handover', division: 'crm', submoduleId: 'handover' },
    { id: 'service', name: 'Maintenance & Snags', division: 'crm', submoduleId: 'service' },
    { id: 'reports', name: 'Sharjah MIS & Reports', division: 'crm', submoduleId: 'reports' },
  ];

  const aiItems: TreeItem[] = [
    { id: 'ai-dashboard', name: 'Smart Analytics', division: 'ai', submoduleId: 'ai-dashboard' },
    { id: 'risk-analyzer', name: 'Predictive Insights', division: 'ai', submoduleId: 'risk-analyzer' },
    { id: 'erp-assistant', name: 'AI Assistant', division: 'ai', submoduleId: 'erp-assistant' },
    { id: 'contract-analyzer', name: 'FIDIC Risk Audit', division: 'ai', submoduleId: 'contract-analyzer' },
  ];

  const handleItemClick = (item: TreeItem) => {
    setActiveDivision(item.division);
    if (item.division === 'office') {
      setActiveOfficeSubmodule(item.submoduleId as OfficeSubmodule);
    } else if (item.division === 'site') {
      setActiveSiteSubmodule(item.submoduleId as SiteSubmodule);
    } else if (item.division === 'crm') {
      setActiveCRMSubmodule(item.submoduleId as CRMSubmodule);
    } else if (item.division === 'ai') {
      setActiveAISubmodule(item.submoduleId as AISubmodule);
    }
    setActiveSubPage('overview');
  };

  const handleDashboardClick = () => {
    setActiveDivision('office');
    setActiveOfficeSubmodule('dashboard');
    setActiveSubPage('overview');
  };

  // Bottom quick notification modal/toast state (replaces window.alert per guidelines)
  const [activeModalInfo, setActiveModalInfo] = useState<{
    title: string;
    description: string;
    icon: 'settings' | 'help' | 'logout';
  } | null>(null);

  return (
    <aside
      className={`relative z-30 flex flex-col shrink-0 select-none no-print transition-all duration-300 border-r border-[#143d34] ${
        sidebarCollapsed ? 'w-16' : 'w-56 lg:w-60'
      }`}
      style={{
        backgroundColor: '#092823',
        backgroundImage: 'linear-gradient(180deg, #0a2d27 0%, #08241f 50%, #061f1a 100%)',
      }}
    >
      {/* Brand & Logo Header - Compact Size with smooth hover effect */}
      <div className="p-3 border-b border-[#143e35] flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0 group cursor-pointer" onClick={handleDashboardClick}>
          {/* Golden Skyscraper Logo Emblem with animated hover border */}
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#f3caa1]/20 via-[#dfa86c]/30 to-[#a36e32]/20 border border-[#dfa86c]/40 group-hover:border-[#dfa86c] group-hover:scale-105 group-hover:shadow-[0_0_12px_rgba(223,168,108,0.35)] transition-all duration-300 flex items-center justify-center shrink-0 shadow-inner">
            <svg viewBox="0 0 40 40" className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" fill="none">
              <path
                d="M10 32V18L15 13V32"
                stroke="#dfa86c"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16 32V8L24 6V32"
                stroke="#dfa86c"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M25 32V14L30 18V32"
                stroke="#dfa86c"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <line x1="6" y1="32" x2="34" y2="32" stroke="#dfa86c" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>

          {!sidebarCollapsed && (
            <div className="min-w-0 leading-tight">
              <h1 className="text-sm font-extrabold tracking-tight text-white group-hover:text-[#dfa86c] transition-colors duration-200 leading-none truncate">
                SAM'S Solution
              </h1>
              <p className="text-[10px] font-medium tracking-wide text-[#dfa86c] leading-none mt-1">
                Construction ERP
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Main Navigation Menu - Reduced Padding & Element Size with Animated Hover & Border */}
      <div className="flex-1 overflow-y-auto px-2.5 py-3 space-y-2 custom-scrollbar">
        {/* 1. Dashboard Pill */}
        <div>
          <button
            onClick={handleDashboardClick}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg font-bold border transition-all duration-200 group relative ${
              isDashboardActive
                ? 'bg-gradient-to-r from-[#dfa86c] to-[#d69b5c] text-stone-900 border-[#f3caa1]/40 shadow-sm'
                : 'border-transparent text-emerald-100/90 hover:border-[#dfa86c]/70 hover:bg-[#0f3d34] hover:text-white hover:translate-x-1 hover:shadow-[0_0_12px_rgba(223,168,108,0.22)]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Home
                className={`w-3.5 h-3.5 transition-transform duration-200 group-hover:scale-110 ${
                  isDashboardActive ? 'text-stone-900' : 'text-emerald-300 group-hover:text-[#dfa86c]'
                }`}
              />
              {!sidebarCollapsed && (
                <span className="text-[11.5px] tracking-wide">Dashboard</span>
              )}
            </div>

            {!sidebarCollapsed && (
              <ChevronRight
                className={`w-3.5 h-3.5 transition-all duration-200 group-hover:translate-x-0.5 ${
                  isDashboardActive
                    ? 'text-stone-900'
                    : 'text-emerald-400/50 group-hover:text-[#dfa86c]'
                }`}
              />
            )}
          </button>
        </div>

        {/* 2. Office Management Section */}
        <div className="space-y-0.5">
          <button
            onClick={() => {
              toggleSection('office');
              if (activeDivision !== 'office' || isDashboardActive) {
                setActiveDivision('office');
                setActiveOfficeSubmodule('hr');
              }
            }}
            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-emerald-100/90 hover:text-white border border-transparent hover:border-[#dfa86c]/60 hover:bg-[#0e3b33] hover:translate-x-1 hover:shadow-[0_0_10px_rgba(223,168,108,0.2)] transition-all duration-200 group cursor-pointer"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Briefcase className="w-3.5 h-3.5 text-emerald-300 group-hover:text-[#dfa86c] group-hover:scale-110 transition-all duration-200 shrink-0" />
              {!sidebarCollapsed && (
                <span className="text-[11.5px] font-semibold truncate group-hover:text-white transition-colors">
                  Office Management
                </span>
              )}
            </div>
            {!sidebarCollapsed && (
              <ChevronDown
                className={`w-3 h-3 text-emerald-400/70 group-hover:text-[#dfa86c] transition-all duration-200 ${
                  openSections.office ? 'rotate-0' : '-rotate-90'
                }`}
              />
            )}
          </button>

          {!sidebarCollapsed && openSections.office && (
            <div className="relative pl-5 ml-3 border-l border-emerald-700/50 space-y-0.5 py-0.5">
              {officeItems.map((item) => {
                const isActive =
                  activeDivision === 'office' && activeOfficeSubmodule === item.submoduleId;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    className={`w-full flex items-center text-left py-1 px-2 rounded-md text-[11px] border transition-all duration-200 relative group cursor-pointer ${
                      isActive
                        ? 'text-[#dfa86c] font-bold bg-[#0d3830] border-[#dfa86c]/70 shadow-[0_0_8px_rgba(223,168,108,0.2)]'
                        : 'border-transparent text-emerald-100/70 hover:text-white hover:border-[#dfa86c]/60 hover:bg-[#0d3830] hover:translate-x-1 hover:shadow-[0_0_8px_rgba(223,168,108,0.18)]'
                    }`}
                  >
                    <span
                      className={`absolute -left-5 top-1/2 -mt-px h-px transition-all duration-200 ${
                        isActive
                          ? 'w-4.5 bg-[#dfa86c]'
                          : 'w-3.5 bg-emerald-700/50 group-hover:bg-[#dfa86c] group-hover:w-4.5'
                      }`}
                    />
                    <span className="truncate group-hover:text-white transition-colors">{item.name}</span>
                    {isActive && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#dfa86c] shadow-[0_0_6px_#dfa86c]" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 3. Site Management Section */}
        <div className="space-y-0.5">
          <button
            onClick={() => {
              toggleSection('site');
              if (activeDivision !== 'site') {
                setActiveDivision('site');
                setActiveSiteSubmodule('site-operations');
              }
            }}
            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-emerald-100/90 hover:text-white border border-transparent hover:border-[#dfa86c]/60 hover:bg-[#0e3b33] hover:translate-x-1 hover:shadow-[0_0_10px_rgba(223,168,108,0.2)] transition-all duration-200 group cursor-pointer"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <HardHat className="w-3.5 h-3.5 text-emerald-300 group-hover:text-[#dfa86c] group-hover:scale-110 transition-all duration-200 shrink-0" />
              {!sidebarCollapsed && (
                <span className="text-[11.5px] font-semibold truncate group-hover:text-white transition-colors">
                  Site Management
                </span>
              )}
            </div>
            {!sidebarCollapsed && (
              <ChevronDown
                className={`w-3 h-3 text-emerald-400/70 group-hover:text-[#dfa86c] transition-all duration-200 ${
                  openSections.site ? 'rotate-0' : '-rotate-90'
                }`}
              />
            )}
          </button>

          {!sidebarCollapsed && openSections.site && (
            <div className="relative pl-5 ml-3 border-l border-emerald-700/50 space-y-0.5 py-0.5">
              {siteItems.map((item) => {
                const isActive =
                  activeDivision === 'site' && activeSiteSubmodule === item.submoduleId;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    className={`w-full flex items-center text-left py-1 px-2 rounded-md text-[11px] border transition-all duration-200 relative group cursor-pointer ${
                      isActive
                        ? 'text-[#dfa86c] font-bold bg-[#0d3830] border-[#dfa86c]/70 shadow-[0_0_8px_rgba(223,168,108,0.2)]'
                        : 'border-transparent text-emerald-100/70 hover:text-white hover:border-[#dfa86c]/60 hover:bg-[#0d3830] hover:translate-x-1 hover:shadow-[0_0_8px_rgba(223,168,108,0.18)]'
                    }`}
                  >
                    <span
                      className={`absolute -left-5 top-1/2 -mt-px h-px transition-all duration-200 ${
                        isActive
                          ? 'w-4.5 bg-[#dfa86c]'
                          : 'w-3.5 bg-emerald-700/50 group-hover:bg-[#dfa86c] group-hover:w-4.5'
                      }`}
                    />
                    <span className="truncate group-hover:text-white transition-colors">{item.name}</span>
                    {isActive && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#dfa86c] shadow-[0_0_6px_#dfa86c]" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 4. CRM Section */}
        <div className="space-y-0.5">
          <button
            onClick={() => {
              toggleSection('crm');
              if (activeDivision !== 'crm') {
                setActiveDivision('crm');
                setActiveCRMSubmodule('clients');
              }
            }}
            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-emerald-100/90 hover:text-white border border-transparent hover:border-[#dfa86c]/60 hover:bg-[#0e3b33] hover:translate-x-1 hover:shadow-[0_0_10px_rgba(223,168,108,0.2)] transition-all duration-200 group cursor-pointer"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Users2 className="w-3.5 h-3.5 text-emerald-300 group-hover:text-[#dfa86c] group-hover:scale-110 transition-all duration-200 shrink-0" />
              {!sidebarCollapsed && (
                <span className="text-[11.5px] font-semibold truncate group-hover:text-white transition-colors">
                  CRM
                </span>
              )}
            </div>
            {!sidebarCollapsed && (
              <ChevronDown
                className={`w-3 h-3 text-emerald-400/70 group-hover:text-[#dfa86c] transition-all duration-200 ${
                  openSections.crm ? 'rotate-0' : '-rotate-90'
                }`}
              />
            )}
          </button>

          {!sidebarCollapsed && openSections.crm && (
            <div className="relative pl-5 ml-3 border-l border-emerald-700/50 space-y-0.5 py-0.5">
              {crmItems.map((item) => {
                const isActive =
                  activeDivision === 'crm' && activeCRMSubmodule === item.submoduleId;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    className={`w-full flex items-center text-left py-1 px-2 rounded-md text-[11px] border transition-all duration-200 relative group cursor-pointer ${
                      isActive
                        ? 'text-[#dfa86c] font-bold bg-[#0d3830] border-[#dfa86c]/70 shadow-[0_0_8px_rgba(223,168,108,0.2)]'
                        : 'border-transparent text-emerald-100/70 hover:text-white hover:border-[#dfa86c]/60 hover:bg-[#0d3830] hover:translate-x-1 hover:shadow-[0_0_8px_rgba(223,168,108,0.18)]'
                    }`}
                  >
                    <span
                      className={`absolute -left-5 top-1/2 -mt-px h-px transition-all duration-200 ${
                        isActive
                          ? 'w-4.5 bg-[#dfa86c]'
                          : 'w-3.5 bg-emerald-700/50 group-hover:bg-[#dfa86c] group-hover:w-4.5'
                      }`}
                    />
                    <span className="truncate group-hover:text-white transition-colors">{item.name}</span>
                    {isActive && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#dfa86c] shadow-[0_0_6px_#dfa86c]" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 5. AI Tools Section */}
        <div className="space-y-0.5">
          <button
            onClick={() => {
              toggleSection('ai');
              if (activeDivision !== 'ai') {
                setActiveDivision('ai');
                setActiveAISubmodule('ai-dashboard');
              }
            }}
            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-emerald-100/90 hover:text-white border border-transparent hover:border-[#dfa86c]/60 hover:bg-[#0e3b33] hover:translate-x-1 hover:shadow-[0_0_10px_rgba(223,168,108,0.2)] transition-all duration-200 group cursor-pointer"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Sparkles className="w-3.5 h-3.5 text-emerald-300 group-hover:text-[#dfa86c] group-hover:scale-110 transition-all duration-200 shrink-0" />
              {!sidebarCollapsed && (
                <span className="text-[11.5px] font-semibold truncate group-hover:text-white transition-colors">
                  AI Tools
                </span>
              )}
            </div>
            {!sidebarCollapsed && (
              <ChevronDown
                className={`w-3 h-3 text-emerald-400/70 group-hover:text-[#dfa86c] transition-all duration-200 ${
                  openSections.ai ? 'rotate-0' : '-rotate-90'
                }`}
              />
            )}
          </button>

          {!sidebarCollapsed && openSections.ai && (
            <div className="relative pl-5 ml-3 border-l border-emerald-700/50 space-y-0.5 py-0.5">
              {aiItems.map((item) => {
                const isActive =
                  activeDivision === 'ai' && activeAISubmodule === item.submoduleId;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    className={`w-full flex items-center text-left py-1 px-2 rounded-md text-[11px] border transition-all duration-200 relative group cursor-pointer ${
                      isActive
                        ? 'text-[#dfa86c] font-bold bg-[#0d3830] border-[#dfa86c]/70 shadow-[0_0_8px_rgba(223,168,108,0.2)]'
                        : 'border-transparent text-emerald-100/70 hover:text-white hover:border-[#dfa86c]/60 hover:bg-[#0d3830] hover:translate-x-1 hover:shadow-[0_0_8px_rgba(223,168,108,0.18)]'
                    }`}
                  >
                    <span
                      className={`absolute -left-5 top-1/2 -mt-px h-px transition-all duration-200 ${
                        isActive
                          ? 'w-4.5 bg-[#dfa86c]'
                          : 'w-3.5 bg-emerald-700/50 group-hover:bg-[#dfa86c] group-hover:w-4.5'
                      }`}
                    />
                    <span className="truncate group-hover:text-white transition-colors">{item.name}</span>
                    {isActive && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#dfa86c] shadow-[0_0_6px_#dfa86c]" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section: Settings, Help & Support, Logout, and Golden Dubai Skyline with Animated Hover & Border */}
      <div className="pt-2 pb-2 px-2.5 border-t border-[#143e35] relative overflow-hidden bg-[#061f1a]">
        <div className="space-y-1 relative z-10">
          <button
            onClick={() =>
              setActiveModalInfo({
                title: 'ERP Settings & UAE Compliance',
                description: 'Configure UAE Tax Registration Number (TRN), VAT 5% filing schedules, MoHRE WPS electronic wage keys, and FIDIC standard clause sets.',
                icon: 'settings',
              })
            }
            className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-[11.5px] font-normal text-emerald-300/90 hover:text-white border border-transparent hover:border-[#dfa86c]/60 hover:bg-[#0e3b33] hover:translate-x-1 hover:shadow-[0_0_10px_rgba(223,168,108,0.2)] transition-all duration-200 group cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5 text-emerald-400 group-hover:text-[#dfa86c] group-hover:scale-110 group-hover:rotate-45 transition-all duration-200 shrink-0 stroke-[1.6]" />
            {!sidebarCollapsed && <span className="group-hover:text-white transition-colors">Settings</span>}
          </button>

          <button
            onClick={() =>
              setActiveModalInfo({
                title: 'Help & Enterprise PMO Support',
                description: 'Direct hotline to Dubai, Sharjah & Abu Dhabi Municipalities e-portal integrations, FIDIC Red Book Claim Guidelines, and 24/7 PMO Enterprise Desk.',
                icon: 'help',
              })
            }
            className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-[11.5px] font-normal text-emerald-300/90 hover:text-white border border-transparent hover:border-[#dfa86c]/60 hover:bg-[#0e3b33] hover:translate-x-1 hover:shadow-[0_0_10px_rgba(223,168,108,0.2)] transition-all duration-200 group cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-emerald-400 group-hover:text-[#dfa86c] group-hover:scale-110 transition-all duration-200 shrink-0 stroke-[1.6]" />
            {!sidebarCollapsed && <span className="group-hover:text-white transition-colors">Help & Support</span>}
          </button>

          <button
            onClick={() =>
              setActiveModalInfo({
                title: 'Active Session Confirmation',
                description: 'You are currently authenticated as Ahmed Al Mansoori (Project Director / Admin). All recent site logs and EVM audit changes have been securely saved.',
                icon: 'logout',
              })
            }
            className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-[11.5px] font-normal text-emerald-300/90 hover:text-rose-300 border border-transparent hover:border-rose-400/50 hover:bg-[#0e3b33] hover:translate-x-1 hover:shadow-[0_0_10px_rgba(244,63,94,0.2)] transition-all duration-200 group cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 text-emerald-400 group-hover:text-rose-400 group-hover:scale-110 transition-all duration-200 shrink-0 stroke-[1.6]" />
            {!sidebarCollapsed && <span className="group-hover:text-rose-300 transition-colors">Logout</span>}
          </button>
        </div>

        {/* Golden Dubai Skyline Illustration positioned seamlessly across bottom */}
        {!sidebarCollapsed && (
          <div className="mt-1 pt-0.5 flex justify-end opacity-75 pointer-events-none">
            <DubaiSkylineIllustration className="h-8 w-44 text-[#dfa86c]" color="#dfa86c" />
          </div>
        )}
      </div>

      {/* In-app Info / Settings / Support Dialog */}
      {activeModalInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-[#0d2e27] border border-[#dfa86c]/40 rounded-xl shadow-2xl p-5 text-white space-y-4">
            <div className="flex items-center justify-between border-b border-[#143e35] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#dfa86c]/20 border border-[#dfa86c]/40 flex items-center justify-center text-[#dfa86c]">
                  {activeModalInfo.icon === 'settings' && <Settings className="w-4 h-4" />}
                  {activeModalInfo.icon === 'help' && <HelpCircle className="w-4 h-4" />}
                  {activeModalInfo.icon === 'logout' && <LogOut className="w-4 h-4" />}
                </div>
                <h3 className="font-bold text-sm tracking-wide text-white">{activeModalInfo.title}</h3>
              </div>
              <button
                onClick={() => setActiveModalInfo(null)}
                className="text-stone-400 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-emerald-100/80 leading-relaxed">{activeModalInfo.description}</p>
            <div className="flex justify-end gap-2 pt-2 border-t border-[#143e35]">
              <button
                onClick={() => setActiveModalInfo(null)}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-[#dfa86c] text-stone-900 hover:bg-[#e4b37d] transition-colors shadow-sm"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
