import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { Wrench, Plus, CheckCircle2, AlertTriangle, Truck, Laptop } from 'lucide-react';

export const AssetManagementWorkspace: React.FC = () => {
  const { assets, addAsset } = useERP();
  const [filterCat, setFilterCat] = useState('ALL');

  const filteredAssets = filterCat === 'ALL' ? assets : assets.filter((a) => a.category === filterCat);
  const totalValue = assets.reduce((s, a) => s + a.valueAED, 0);

  return (
    <div className="space-y-6">
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4 text-xs">
        <div className="flex flex-wrap justify-between items-center gap-3 border-b border-slate-800 pb-3">
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <Wrench className="w-4 h-4 text-teal-400" /> Plant, Heavy Machinery, Surveying Equipment & Office Assets
            </h3>
            <p className="text-[11px] text-slate-400">
              Tower cranes, concrete boom pumps, surveying total stations, site vehicles, and maintenance schedules.
            </p>
          </div>
          <div className="text-right font-mono">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Total Capital Asset Value</span>
            <span className="text-base font-black text-emerald-400 block">AED {totalValue.toLocaleString()}</span>
          </div>
        </div>

        {/* Filter categories */}
        <div className="flex flex-wrap gap-2">
          {['ALL', 'Heavy Machinery', 'Survey Equipment', 'Site Pickups & DG Sets', 'IT & Laptops'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCat(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                filterCat === cat
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Assets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAssets.map((asset) => (
            <div key={asset.id} className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-mono text-teal-400 font-bold">{asset.code}</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
                  {asset.condition}
                </span>
              </div>
              <h4 className="font-bold text-slate-200 text-sm">{asset.description}</h4>
              <p className="text-[11px] text-slate-400">Category: {asset.category}</p>
              <div className="flex justify-between items-center text-[11px] pt-2 border-t border-slate-800 font-mono">
                <span className="text-slate-500">Maint Due: {asset.maintenanceDueDate}</span>
                <span className="font-bold text-slate-100">AED {asset.valueAED.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
