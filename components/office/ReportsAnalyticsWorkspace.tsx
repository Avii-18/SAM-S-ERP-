import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import {
  BarChart3,
  Printer,
  FileDown,
  TrendingUp,
  CheckCircle2,
  ShieldCheck,
  Building2,
  Calendar,
  DollarSign,
  AlertCircle,
  FileText,
  BadgeCheck,
  Briefcase,
  Layers,
  Scale,
} from 'lucide-react';

export const ReportsAnalyticsWorkspace: React.FC = () => {
  const {
    activeProject,
    boqItems,
    variations,
    ipcClaims,
    employees,
    materialRequisitions,
    wbsActivities,
  } = useERP();

  const [activeReportTab, setActiveReportTab] = useState<'audit' | 'claims' | 'variations' | 'compliance'>('audit');

  const projectWBS = wbsActivities.filter((a) => a.projectId === activeProject.id);
  const overallProg = projectWBS.reduce((s, a) => s + (a.progress * a.weight) / 100, 0).toFixed(1);

  const totalBOQ = boqItems.filter((b) => b.projectId === activeProject.id).reduce((s, b) => s + b.qty * b.rate, 0);
  const totalApprovedVO = variations
    .filter((v) => v.projectId === activeProject.id && v.status === 'Approved')
    .reduce((s, v) => s + v.approved, 0);
  const totalBilled = ipcClaims.filter((c) => c.projectId === activeProject.id).reduce((s, c) => s + c.gross, 0);
  const totalPaid = ipcClaims
    .filter((c) => c.projectId === activeProject.id && c.status === 'Paid')
    .reduce((s, c) => s + c.net, 0);
  const totalRetention = ipcClaims.filter((c) => c.projectId === activeProject.id).reduce((s, c) => s + c.retention, 0);

  const exportAuditCSV = () => {
    let csv = 'Metric,Value (AED),Notes\n';
    csv += `Approved Contract Baseline,${activeProject.contractBaselineAED},"FIDIC Red Book Lump Sum"\n`;
    csv += `Approved Variations,${totalApprovedVO},"Approved by Engineer / Employer"\n`;
    csv += `Revised Contract Value,${activeProject.contractBaselineAED + totalApprovedVO},"Baseline + Approved VO"\n`;
    csv += `Gross Certified to Date,${totalBilled},"Interim Payment Certificates (IPC)"\n`;
    csv += `Total 10% Retention Held,${totalRetention},"FIDIC Clause 14.3 Security"\n`;
    csv += `Net Certified Paid,${totalPaid},"Direct WPS & Corporate Wire"\n`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeProject.code}_Executive_Audit_Report.csv`;
    a.click();
  };

  return (
    <div className="space-y-6 text-[#27332F]">
      {/* Top Header Card */}
      <div className="bg-white rounded-xl border border-[#E2D8CB] p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-md bg-[#F2EDE5] text-[#826B52]">
              <BarChart3 className="w-5 h-5 text-[#826B52]" />
            </span>
            <h2 className="text-[22px] font-bold text-[#27332F] tracking-tight">
              Executive Financial & PMO Status Report
            </h2>
          </div>
          <p className="text-[13px] text-[#77746D] mt-1">
            Consolidated P&L, EVM outturn, certified claims, retention balances, and statutory UAE compliance.
          </p>
        </div>

        <div className="flex items-center gap-3 no-print">
          <button
            onClick={exportAuditCSV}
            className="h-10 px-4 rounded-[7px] bg-[#FFFFFF] border border-[#826B52] text-[#27332F] hover:bg-[#F2EDE5] text-[13px] font-medium transition flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <FileDown className="w-4 h-4 text-[#826B52]" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => window.print()}
            className="h-10 px-4 rounded-[7px] bg-[#27332F] hover:bg-[#34443e] text-white text-[13px] font-medium transition flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <Printer className="w-4 h-4 text-[#B69A70]" />
            <span>Print Executive Summary PDF</span>
          </button>
        </div>
      </div>

      {/* Report Sub-Tabs Navigation */}
      <div className="bg-[#F2EDE5] rounded-lg p-1.5 border border-[#E2D8CB] flex gap-2 overflow-x-auto text-[13px] no-print">
        {[
          { id: 'audit', label: 'Executive Summary & Audit', icon: ShieldCheck },
          { id: 'claims', label: 'FIDIC Claims & Retention Outturn', icon: DollarSign },
          { id: 'variations', label: 'Commercial BOQ & Variations', icon: Scale },
          { id: 'compliance', label: 'Statutory UAE Compliance (MoHRE / DCD)', icon: BadgeCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeReportTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveReportTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-md font-medium whitespace-nowrap transition cursor-pointer ${
                isActive
                  ? 'bg-[#27332F] text-white shadow-xs'
                  : 'text-[#77746D] hover:text-[#27332F] hover:bg-[#EAE3D6]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ================= Printable Executive Report Layout ================= */}
      <div className="bg-white rounded-xl border border-[#E2D8CB] p-6 lg:p-8 space-y-6 shadow-sm">
        {/* Header Block with UAE Gold Branding */}
        <div className="border-b border-[#E2D8CB] pb-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-[#826B52] uppercase tracking-wider">
                UAE CONSTRUCTION ENTERPRISE PMO AUDIT REPORT
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded bg-[#43856B]/10 text-[#43856B] border border-[#43856B]/20">
                <CheckCircle2 className="w-3 h-3" /> Official Status
              </span>
            </div>
            <h1 className="text-2xl font-bold text-[#27332F] mt-1">{activeProject.name}</h1>
            <p className="text-[13px] text-[#77746D] mt-0.5">
              Location: <span className="font-medium text-[#27332F]">{activeProject.location}</span> • Code:{' '}
              <span className="font-mono font-medium text-[#27332F]">{activeProject.code}</span> • Client:{' '}
              <span className="font-medium text-[#27332F]">{activeProject.client}</span>
            </p>
          </div>

          <div className="text-left md:text-right text-[12px] bg-[#F2EDE5] p-3 rounded-lg border border-[#E2D8CB]">
            <span className="text-[#77746D] block">Audit Snapshot Date</span>
            <span className="font-semibold text-[#27332F] block mt-0.5">
              {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
            </span>
            <span className="text-[11px] text-[#826B52] font-medium">Dubai Timezone (GST)</span>
          </div>
        </div>

        {/* UAE Statutory Compliance Status Ribbon */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-[#F2EDE5] border border-[#E2D8CB]">
            <div className="w-8 h-8 rounded-md bg-[#43856B]/15 text-[#43856B] flex items-center justify-center shrink-0">
              <BadgeCheck className="w-4 h-4" />
            </div>
            <div className="text-xs">
              <span className="font-semibold text-[#27332F] block">MoHRE WPS 100% Compliant</span>
              <span className="text-[11px] text-[#77746D]">Site workforce salary transfers verified</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-[#F2EDE5] border border-[#E2D8CB]">
            <div className="w-8 h-8 rounded-md bg-[#66869A]/15 text-[#66869A] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="text-xs">
              <span className="font-semibold text-[#27332F] block">Civil Defense (DCD) NOC</span>
              <span className="text-[11px] text-[#77746D]">Fire safety & evacuation permit valid</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-[#F2EDE5] border border-[#E2D8CB]">
            <div className="w-8 h-8 rounded-md bg-[#B69A70]/20 text-[#826B52] flex items-center justify-center shrink-0">
              <Building2 className="w-4 h-4" />
            </div>
            <div className="text-xs">
              <span className="font-semibold text-[#27332F] block">Municipality Building Permit</span>
              <span className="text-[11px] text-[#77746D]">Phase G+12 structural NOC approved</span>
            </div>
          </div>
        </div>

        {/* Key Scorecard Grid in Luxury Ivory */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-[#F2EDE5] rounded-lg border border-[#E2D8CB] space-y-1.5 shadow-xs">
            <span className="text-[#77746D] text-[11px] font-semibold uppercase tracking-wider block">
              Approved Contract Value
            </span>
            <div className="text-xl font-bold text-[#27332F] font-mono">
              AED {activeProject.contractBaselineAED.toLocaleString()}
            </div>
            <span className="text-[11px] text-[#77746D] block">FIDIC Red Book Lump Sum</span>
          </div>

          <div className="p-4 bg-[#F2EDE5] rounded-lg border border-[#E2D8CB] space-y-1.5 shadow-xs">
            <span className="text-[#77746D] text-[11px] font-semibold uppercase tracking-wider block">
              Revised Contract (+VO)
            </span>
            <div className="text-xl font-bold text-[#43856B] font-mono">
              AED {(activeProject.contractBaselineAED + totalApprovedVO).toLocaleString()}
            </div>
            <span className="text-[11px] text-[#43856B] font-medium block">
              +{((totalApprovedVO / (activeProject.contractBaselineAED || 1)) * 100).toFixed(1)}% approved variations
            </span>
          </div>

          <div className="p-4 bg-[#F2EDE5] rounded-lg border border-[#E2D8CB] space-y-1.5 shadow-xs">
            <span className="text-[#77746D] text-[11px] font-semibold uppercase tracking-wider block">
              Gross Billed to Date
            </span>
            <div className="text-xl font-bold text-[#66869A] font-mono">
              AED {totalBilled.toLocaleString()}
            </div>
            <span className="text-[11px] text-[#77746D] block">
              {((totalBilled / (activeProject.contractBaselineAED || 1)) * 100).toFixed(1)}% of total baseline
            </span>
          </div>

          <div className="p-4 bg-[#F2EDE5] rounded-lg border border-[#E2D8CB] space-y-1.5 shadow-xs">
            <span className="text-[#77746D] text-[11px] font-semibold uppercase tracking-wider block">
              Total 10% Retention Held
            </span>
            <div className="text-xl font-bold text-[#826B52] font-mono">
              AED {totalRetention.toLocaleString()}
            </div>
            <span className="text-[11px] text-[#826B52] font-medium block">
              Protected per FIDIC Clause 14.3
            </span>
          </div>
        </div>

        {/* Project Director Observations & Forecast */}
        <div className="space-y-2">
          <h4 className="font-semibold text-[#27332F] uppercase text-[12px] tracking-wider flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-[#826B52]" />
            <span>Project Director Observations & Forecast</span>
          </h4>
          <div className="p-4 bg-[#F2EDE5] rounded-lg border border-[#E2D8CB] text-[13px] text-[#27332F] leading-relaxed">
            Project execution is advancing in conformance with contractual baseline. Superstructure RCC framing achieved Floor 09 with zero reportable HSE lost-time incidents (LTI). Material wastage for Ready-Mix Concrete is maintained at 1.48% (within the 1.5% UAE norm). WPS salary transfers for the 215 site staff remain 100% compliant with MoHRE requirements.
          </div>
        </div>

        {/* Interim Payment Certificates (IPC) Claims Table */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-[#27332F] text-[14px]">
              Certified Payment Applications (IPC Registry)
            </h4>
            <span className="text-xs text-[#77746D]">{ipcClaims.length} Certified Claims</span>
          </div>

          <div className="overflow-x-auto rounded-lg border border-[#E2D8CB]">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-[#F2EDE5] text-[#77746D] font-medium border-b border-[#E2D8CB]">
                <tr>
                  <th className="py-2.5 px-3">Bill Ref</th>
                  <th className="py-2.5 px-3">Contractor / Sub</th>
                  <th className="py-2.5 px-3">Gross Claimed</th>
                  <th className="py-2.5 px-3">Retention (10%)</th>
                  <th className="py-2.5 px-3">VAT (5%)</th>
                  <th className="py-2.5 px-3">Net Certified</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2D8CB] bg-white">
                {ipcClaims.map((claim) => (
                  <tr key={claim.id} className="hover:bg-[#F9F6F0] transition">
                    <td className="py-2.5 px-3 font-mono font-medium text-[#27332F]">{claim.billNo}</td>
                    <td className="py-2.5 px-3 text-[#27332F]">{claim.contractor || 'Master Contractor'}</td>
                    <td className="py-2.5 px-3 font-mono text-[#27332F]">AED {claim.gross.toLocaleString()}</td>
                    <td className="py-2.5 px-3 font-mono text-[#826B52]">AED {claim.retention.toLocaleString()}</td>
                    <td className="py-2.5 px-3 font-mono text-[#77746D]">AED {claim.vat.toLocaleString()}</td>
                    <td className="py-2.5 px-3 font-mono font-semibold text-[#43856B]">AED {claim.net.toLocaleString()}</td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${
                          claim.status === 'Paid'
                            ? 'bg-[#43856B]/10 text-[#43856B]'
                            : claim.status === 'Certified'
                            ? 'bg-[#66869A]/10 text-[#66869A]'
                            : 'bg-[#C18A43]/10 text-[#C18A43]'
                        }`}
                      >
                        {claim.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Audit Sign-off Footer */}
        <div className="pt-4 border-t border-[#E2D8CB] grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-[#77746D]">
          <div>
            <span className="block font-medium text-[#27332F]">Prepared By</span>
            <span className="block text-[11px] mt-0.5">Ahmed Al Mansoori • Project Director</span>
          </div>
          <div>
            <span className="block font-medium text-[#27332F]">Reviewed By</span>
            <span className="block text-[11px] mt-0.5">Commercial QS & Audit Authority</span>
          </div>
          <div className="sm:text-right">
            <span className="block font-medium text-[#27332F]">Compliance Verification</span>
            <span className="block text-[11px] text-[#43856B] font-medium mt-0.5">UAE Federal Statutory Standards</span>
          </div>
        </div>
      </div>
    </div>
  );
};
