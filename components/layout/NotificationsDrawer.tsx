import React from 'react';
import { useERP } from '../../context/ERPContext';
import {
  Bell,
  X,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
  CheckCheck,
} from 'lucide-react';

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({ isOpen, onClose }) => {
  const { notifications, dismissNotification, markAllNotificationsRead, theme } = useERP();
  const isLight = theme === 'light';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-stone-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`border-l w-full max-w-md h-full flex flex-col shadow-2xl transition-all ${
          isLight
            ? 'bg-white border-[#e8ded0] text-stone-900 shadow-2xl'
            : 'bg-slate-900 border-slate-800 text-slate-100 shadow-2xl'
        }`}
      >
        {/* Header */}
        <div
          className={`p-3.5 border-b flex items-center justify-between ${
            isLight ? 'border-stone-100 bg-[#fbf9f6]' : 'border-slate-800 bg-slate-900'
          }`}
        >
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#dfa86c]" />
            <h3 className="font-bold text-xs sm:text-sm">UAE Regulatory Alerts</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={markAllNotificationsRead}
              className="text-[11px] text-[#dfa86c] font-semibold hover:underline flex items-center gap-1"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark all read</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 hover:bg-stone-100 dark:hover:bg-slate-800 text-stone-400 hover:text-stone-700 dark:hover:text-white rounded-lg transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
          {notifications.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-emerald-500/40" />
              <p>No active compliance warnings or alerts.</p>
            </div>
          ) : (
            notifications.map((n) => {
              let Icon = Info;
              let borderCol = 'border-slate-800 bg-slate-950/60';
              let iconCol = 'text-blue-400';

              if (n.type === 'alert') {
                Icon = AlertCircle;
                borderCol = 'border-rose-500/30 bg-rose-500/5';
                iconCol = 'text-rose-400';
              } else if (n.type === 'warning') {
                Icon = AlertTriangle;
                borderCol = 'border-amber-500/30 bg-amber-500/5';
                iconCol = 'text-amber-400';
              } else if (n.type === 'success') {
                Icon = CheckCircle2;
                borderCol = 'border-emerald-500/30 bg-emerald-500/5';
                iconCol = 'text-emerald-400';
              }

              return (
                <div
                  key={n.id}
                  className={`p-3.5 rounded-xl border ${borderCol} space-y-1.5 transition relative group`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 font-bold text-slate-200">
                      <Icon className={`w-4 h-4 shrink-0 ${iconCol}`} />
                      <span>{n.title}</span>
                    </div>
                    <button
                      onClick={() => dismissNotification(n.id)}
                      className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-slate-300 transition"
                      title="Dismiss"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed pl-6">{n.message}</p>
                  <div className="flex justify-between items-center pl-6 text-[10px] text-slate-500 pt-1">
                    <span className="uppercase font-semibold tracking-wider text-teal-400">
                      {n.division} division
                    </span>
                    <span>{n.timestamp}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/60 text-[10px] text-slate-400 text-center">
          Monitoring Sharjah & Dubai Municipality, Civil Defence, and MoHRE labor regulations in real time.
        </div>
      </div>
    </div>
  );
};
