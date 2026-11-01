import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { FolderTree, FileText, Download, Upload, CheckCircle2, Search, ExternalLink } from 'lucide-react';

export const DocumentManagementWorkspace: React.FC = () => {
  const { activeProject } = useERP();
  const [selectedFolder, setSelectedFolder] = useState('permits');

  const folders = [
    {
      id: 'permits',
      name: '01 Statutory Authority NOCs & Building Permits',
      files: [
        { name: 'Sharjah_Municipality_Building_Permit_Approved.pdf', size: '4.8 MB', date: '2026-02-10', by: 'PRO Dept', status: 'Official Approval' },
        { name: 'Sharjah_Civil_Defence_Fire_Safety_NOC.pdf', size: '2.1 MB', date: '2026-02-15', by: 'HSE Dept', status: 'Approved' },
        { name: 'SEWA_Permanent_Substation_Design_Approval.pdf', size: '3.4 MB', date: '2026-03-01', by: 'MEP Dept', status: 'Approved' },
        { name: 'Etisalat_Telecom_NOC_Infrastucture.pdf', size: '1.2 MB', date: '2026-03-05', by: 'ELV Dept', status: 'Approved' },
      ],
    },
    {
      id: 'contract',
      name: '02 Contract Baseline & Tender Packages',
      files: [
        { name: 'FIDIC_Red_Book_1999_Main_Agreement_Signed.pdf', size: '12.5 MB', date: '2026-01-20', by: 'Contracts Director', status: 'Signed & Executed' },
        { name: 'Master_BOQ_Priced_Schedule_Rev02.xlsx', size: '8.4 MB', date: '2026-01-25', by: 'Chief QS', status: 'Priced Baseline' },
        { name: 'Advance_Payment_Guarantee_ENBD_Bank.pdf', size: '1.8 MB', date: '2026-01-28', by: 'Finance Dept', status: 'Active Bond' },
      ],
    },
    {
      id: 'drawings',
      name: '03 IFC & Approved Shop Drawings Register',
      files: [
        { name: 'STR-DWG-L08-PT_Slab_Tendon_Profile_Rev03.dwg', size: '24.1 MB', date: '2026-10-12', by: 'Engineering Lead', status: 'IFC Approved' },
        { name: 'MEP-DWG-Basement_Chilled_Water_Piping_Rev02.dwg', size: '18.2 MB', date: '2026-09-30', by: 'MEP Lead', status: 'Approved with Comments' },
        { name: 'ARC-DWG-Facade_Curtain_Wall_Detail_Rev01.dwg', size: '16.5 MB', date: '2026-10-05', by: 'Facade Consultant', status: 'Approved' },
      ],
    },
    {
      id: 'lab',
      name: '04 Independent QA/QC Test Reports',
      files: [
        { name: 'Concrete_Cube_28Day_Compressive_Batch_044.pdf', size: '1.4 MB', date: '2026-10-27', by: 'Independent Testing Lab', status: 'Passed (52.4 MPa)' },
        { name: 'Rebar_Tensile_Yield_Elongation_Report_20mm.pdf', size: '1.1 MB', date: '2026-10-28', by: 'Sharjah Municipal Lab', status: 'Certified BS 4449' },
      ],
    },
  ];

  const current = folders.find((f) => f.id === selectedFolder) || folders[0];

  return (
    <div className="space-y-6">
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4 text-xs">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <FolderTree className="w-4 h-4 text-teal-400" /> Enterprise Document Management (DMS) & Project Archive
            </h3>
            <p className="text-[11px] text-slate-400">
              Centralized drawing register, Municipality approvals, consultant submittals, and QA lab certificates.
            </p>
          </div>
          <button
            onClick={() => alert('Document upload modal is ready for file attachment.')}
            className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow"
          >
            <Upload className="w-3.5 h-3.5" /> Upload Document
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Folders List */}
          <div className="space-y-1 bg-slate-900/60 p-2 rounded-xl border border-slate-800">
            <span className="text-[10px] font-bold text-slate-500 uppercase px-2 py-1 block">Project Folders</span>
            {folders.map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedFolder(f.id)}
                className={`w-full text-left p-2.5 rounded-lg text-xs font-medium transition flex items-center gap-2 truncate ${
                  selectedFolder === f.id
                    ? 'bg-teal-500/20 text-teal-300 font-bold border border-teal-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <FolderTree className="w-4 h-4 shrink-0 text-amber-400" />
                <span className="truncate">{f.name}</span>
              </button>
            ))}
          </div>

          {/* Files List */}
          <div className="md:col-span-3 space-y-2 bg-slate-900/40 p-4 rounded-xl border border-slate-800">
            <h4 className="font-bold text-slate-200 border-b border-slate-800 pb-2 flex items-center justify-between">
              <span>{current.name}</span>
              <span className="text-slate-500 font-mono text-[11px]">{current.files.length} Files</span>
            </h4>

            <div className="space-y-2 pt-1">
              {current.files.map((file, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 flex flex-wrap justify-between items-center gap-2 hover:bg-slate-900 transition"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileText className="w-4 h-4 text-teal-400 shrink-0" />
                    <div className="min-w-0">
                      <div className="font-bold text-slate-200 text-xs truncate">{file.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {file.size} • Uploaded {file.date} by {file.by}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold text-[10px]">
                      {file.status}
                    </span>
                    <button
                      onClick={() => alert(`Downloading ${file.name}...`)}
                      className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition"
                      title="Download"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
