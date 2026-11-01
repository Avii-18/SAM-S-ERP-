import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { Store, Plus, CheckCircle2, ShieldCheck, Search, Star } from 'lucide-react';

export const VendorSupplierWorkspace: React.FC = () => {
  const [vendors, setVendors] = useState([
    {
      id: 'VND-001',
      name: 'Sharjah National Concrete Co. WLL',
      trade: 'Ready-Mix Concrete Supplier',
      trn: '100293847500003',
      license: 'SHJ-LIC-88291',
      city: 'Sharjah',
      ibanStatus: 'Verified (Emirates NBD)',
      rating: 4.8,
      status: 'Approved & Pre-qualified',
    },
    {
      id: 'VND-002',
      name: 'Emirates Steel Arkan PJSC',
      trade: 'Reinforcement Steel & Structural Sections',
      trn: '100982310100003',
      license: 'AD-IND-44120',
      city: 'Abu Dhabi / Dubai',
      ibanStatus: 'Verified (First Abu Dhabi Bank)',
      rating: 4.9,
      status: 'Approved & Pre-qualified',
    },
    {
      id: 'VND-003',
      name: 'Al-Bahar Structural Subcontracting LLC',
      trade: 'Civil & Post-Tensioned Structure Subcontractor',
      trn: '100382910400003',
      license: 'SHJ-LIC-44120',
      city: 'Sharjah',
      ibanStatus: 'Verified (Mashreq Bank)',
      rating: 4.7,
      status: 'Active Works',
    },
    {
      id: 'VND-004',
      name: 'National Waterproofing Industries LLC',
      trade: 'Basement Membrane & Liquid Tanking',
      trn: '100492817300003',
      license: 'DXB-COMM-99120',
      city: 'Dubai',
      ibanStatus: 'Verified (Dubai Islamic Bank)',
      rating: 4.6,
      status: 'Approved & Pre-qualified',
    },
  ]);

  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [vName, setVName] = useState('');
  const [vTrade, setVTrade] = useState('Building Materials Supplier');
  const [vTRN, setVTRN] = useState('');
  const [vLic, setVLic] = useState('');
  const [vCity, setVCity] = useState('Sharjah');

  const filtered = vendors.filter(
    (v) =>
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.trade.toLowerCase().includes(search.toLowerCase()) ||
      v.trn.includes(search)
  );

  const handleAddVendor = (e: React.FormEvent) => {
    e.preventDefault();
    setVendors((prev) => [
      ...prev,
      {
        id: `VND-00${prev.length + 1}`,
        name: vName,
        trade: vTrade,
        trn: vTRN || '100000000000003',
        license: vLic || 'SHJ-LIC-99000',
        city: vCity,
        ibanStatus: 'Verified',
        rating: 4.5,
        status: 'Approved & Pre-qualified',
      },
    ]);
    setShowAddModal(false);
    setVName('');
    setVTRN('');
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4 text-xs">
        <div className="flex flex-wrap justify-between items-center gap-3 border-b border-slate-800 pb-3">
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <Store className="w-4 h-4 text-amber-400" /> UAE Vendor, Supplier & Subcontractor Master (TRN Registry)
            </h3>
            <p className="text-[11px] text-slate-400">
              Central pre-qualification database with 15-digit Federal Tax Authority TRNs, Trade Licenses & Bank IBAN audits.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search vendor name, TRN, trade..."
                className="pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 text-xs outline-none"
              />
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow"
            >
              <Plus className="w-3.5 h-3.5" /> Register Vendor
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900 text-slate-400 uppercase text-[10px]">
              <tr>
                <th className="p-3">Vendor Trade Name</th>
                <th className="p-3">Trade Category</th>
                <th className="p-3">15-Digit UAE TRN</th>
                <th className="p-3">Trade License</th>
                <th className="p-3">Bank IBAN Status</th>
                <th className="p-3 text-center">Score</th>
                <th className="p-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filtered.map((v) => (
                <tr key={v.id} className="hover:bg-slate-900/40">
                  <td className="p-3 font-sans font-bold text-slate-200">
                    {v.name}
                    <span className="block text-[10px] text-slate-500 font-mono">{v.city}, UAE</span>
                  </td>
                  <td className="p-3 font-sans text-slate-300">{v.trade}</td>
                  <td className="p-3 text-emerald-400 font-bold">{v.trn}</td>
                  <td className="p-3 text-slate-400">{v.license}</td>
                  <td className="p-3 font-sans">
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> {v.ibanStatus}
                    </span>
                  </td>
                  <td className="p-3 text-center font-bold text-amber-400">
                    <Star className="w-3 h-3 inline mr-1 fill-amber-400" />
                    {v.rating}
                  </td>
                  <td className="p-3 text-center font-sans">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {v.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="glass-panel rounded-2xl border border-slate-800 p-6 max-w-md w-full space-y-4 text-xs">
            <h3 className="font-bold text-sm text-slate-100">Register UAE Vendor / Supplier</h3>
            <form onSubmit={handleAddVendor} className="space-y-3">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Company Trade Name *</label>
                <input
                  type="text"
                  required
                  value={vName}
                  onChange={(e) => setVName(e.target.value)}
                  placeholder="e.g. Al-Futtaim Building Materials LLC"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">15-Digit UAE TRN *</label>
                  <input
                    type="text"
                    required
                    maxLength={15}
                    value={vTRN}
                    onChange={(e) => setVTRN(e.target.value)}
                    placeholder="100293847500003"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Trade License Ref</label>
                  <input
                    type="text"
                    required
                    value={vLic}
                    onChange={(e) => setVLic(e.target.value)}
                    placeholder="SHJ-LIC-88910"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-400 font-bold mb-1">Trade Category</label>
                <input
                  type="text"
                  required
                  value={vTrade}
                  onChange={(e) => setVTrade(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-1.5 bg-amber-600 text-white font-bold rounded-lg">
                  Register Vendor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
