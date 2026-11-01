import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import {
  Search,
  Bell,
  Sun,
  Moon,
  Menu,
  ChevronDown,
  Building,
  CheckCircle2,
  FolderKanban,
  FileText,
} from 'lucide-react';
import { ahmedAvatar } from '../../assets/images';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSearch, onOpenNotifications }) => {
  const {
    projects,
    activeProjectId,
    setActiveProjectId,
    theme,
    setTheme,
    setSidebarCollapsed,
    notifications,
  } = useERP();

  const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0];
  const unreadCount = 3; // matching the "3" badge in the image mockup

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <header
      className={`sticky top-0 z-40 px-3 sm:px-4 lg:px-5 py-2 flex items-center justify-between no-print transition-colors duration-200 ${
        theme === 'light'
          ? 'bg-white border-b border-stone-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)]'
          : 'bg-[#0b161e] border-b border-slate-800 text-slate-100'
      }`}
    >
      {/* Left: Mobile Toggle & Big Search Bar */}
      <div className="flex items-center gap-2.5 md:gap-3 flex-1 max-w-2xl">
        <button
          onClick={() => setSidebarCollapsed((prev) => !prev)}
          className={`p-1.5 rounded-lg transition ${
            theme === 'light'
              ? 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          title="Toggle Navigation Menu"
        >
          <Menu className="w-4 h-4" />
        </button>

        {/* Global Search Bar from image */}
        <div
          onClick={onOpenSearch}
          className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl cursor-pointer w-full max-w-md transition-all ${
            theme === 'light'
              ? 'bg-stone-100/90 text-stone-500 hover:bg-stone-200/70 border border-stone-200/60'
              : 'bg-slate-900/90 text-slate-400 hover:bg-slate-850 border border-slate-800'
          }`}
        >
          <Search className="w-3.5 h-3.5 text-stone-400 shrink-0" />
          <span className="text-[11.5px] font-normal truncate">
            Search projects, employees, or modules...
          </span>
          <kbd
            className={`hidden sm:inline-block ml-auto text-[9.5px] font-mono px-1.5 py-0.5 rounded ${
              theme === 'light'
                ? 'bg-stone-200/80 text-stone-600'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            Ctrl + K
          </kbd>
        </div>

        {/* Active Project Selector Pill (Compact & Elegant) */}
        <div className="relative hidden lg:block">
          <button
            onClick={() => setProjectDropdownOpen((prev) => !prev)}
            className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition border ${
              theme === 'light'
                ? 'bg-stone-50 border-stone-200/80 text-stone-700 hover:bg-stone-100'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850'
            }`}
          >
            <Building className="w-3 h-3 text-[#dfa86c]" />
            <span className="truncate max-w-[140px]">{activeProject?.name}</span>
            <ChevronDown className="w-3 h-3 text-stone-400" />
          </button>

          {projectDropdownOpen && (
            <div
              className={`absolute left-0 mt-2 w-64 rounded-xl shadow-xl border z-50 p-1.5 ${
                theme === 'light'
                  ? 'bg-white border-stone-200 text-stone-900'
                  : 'bg-slate-900 border-slate-800 text-slate-100'
              }`}
            >
              <div className="px-2 py-1 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                Select Active Site
              </div>
              {projects.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setActiveProjectId(p.id);
                    setProjectDropdownOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-2 rounded-lg text-xs transition flex items-center justify-between ${
                    p.id === activeProjectId
                      ? 'bg-[#dfa86c]/20 text-[#a36829] font-bold'
                      : 'hover:bg-stone-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="truncate">{p.name}</span>
                  <span className="text-[10px] font-mono text-stone-400">[{p.client}]</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Controls: Sun/Moon Toggle, Notification Bell (3), Profile */}
      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        {/* Sun / Moon Theme Toggle from mockup */}
        <button
          onClick={toggleTheme}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border transition-all ${
            theme === 'light'
              ? 'bg-stone-100 border-stone-200 hover:bg-stone-200/60'
              : 'bg-slate-900 border-slate-800 hover:bg-slate-800'
          }`}
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
          <div
            className={`p-1 rounded-full ${
              theme === 'light' ? 'bg-amber-400 text-stone-900' : 'text-stone-500'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
          </div>
          <div
            className={`p-1 rounded-full ${
              theme === 'dark' ? 'bg-slate-700 text-amber-300' : 'text-stone-400'
            }`}
          >
            <Moon className="w-3.5 h-3.5" />
          </div>
        </button>

        {/* Notification Bell with Badge "3" from mockup */}
        <button
          onClick={onOpenNotifications}
          className={`relative p-2 rounded-xl transition ${
            theme === 'light'
              ? 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white font-extrabold text-[10px] rounded-full flex items-center justify-center shadow-sm">
            {unreadCount}
          </span>
        </button>

        {/* Ahmed Al Mansoori Profile from mockup */}
        <div className="relative">
          <button
            onClick={() => setProfileDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2.5 p-1 rounded-xl transition group text-left"
          >
            {/* Emirati Executive Avatar Image */}
            <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-stone-200 group-hover:border-[#dfa86c] transition shrink-0 bg-stone-200">
              <img
                src={ahmedAvatar}
                alt="Ahmed Al Mansoori"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="hidden sm:block leading-tight">
              <div
                className={`text-xs font-bold ${
                  theme === 'light' ? 'text-stone-900' : 'text-white'
                }`}
              >
                Ahmed Al Mansoori
              </div>
              <div className="text-[10px] text-stone-500 font-medium">Admin</div>
            </div>
          </button>

          {profileDropdownOpen && (
            <div
              className={`absolute right-0 mt-2 w-56 rounded-xl shadow-xl border z-50 p-2 ${
                theme === 'light'
                  ? 'bg-white border-stone-200 text-stone-900'
                  : 'bg-slate-900 border-slate-800 text-slate-100'
              }`}
            >
              <div className="px-3 py-2 border-b border-stone-200/60 dark:border-slate-800">
                <div className="text-xs font-bold">Ahmed Al Mansoori</div>
                <div className="text-[11px] text-stone-500">ahmed.mansoori@samssolution.ae</div>
                <span className="inline-block mt-1 text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Executive Admin
                </span>
              </div>
              <div className="py-1">
                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    alert('Profile & SAM’S Solution ERP Credentials');
                  }}
                  className="w-full text-left px-3 py-1.5 rounded-lg text-xs hover:bg-stone-100 dark:hover:bg-slate-800 flex items-center gap-2"
                >
                  <FileText className="w-3.5 h-3.5 text-stone-400" />
                  Account Profile
                </button>
                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    alert('UAE MoHRE and Dubai Municipality Authorized');
                  }}
                  className="w-full text-left px-3 py-1.5 rounded-lg text-xs hover:bg-stone-100 dark:hover:bg-slate-800 flex items-center gap-2"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  Compliance Verification
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
