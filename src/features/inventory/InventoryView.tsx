'use client';

import React, { useState } from 'react';
import { InventoryMovement } from '@/lib/types';
import { useLanguage } from '@/lib/utils/i18n';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  RefreshCw, 
  Search,
  CheckCircle
} from 'lucide-react';

interface InventoryViewProps {
  movements: InventoryMovement[];
}

export const InventoryView: React.FC<InventoryViewProps> = ({ movements }) => {
  const { t } = useLanguage();
  const [filterType, setFilterType] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  const getMovementTypeLabel = (type: string) => {
    switch (type) {
      case 'all': return t('all');
      case 'sale': return t('sale');
      case 'restock': return t('restock');
      case 'adjustment': return t('adjustment');
      case 'return': return t('refund');
      default: return type;
    }
  };

  const filtered = movements.filter(m => {
    const matchesType = filterType === 'all' || m.type === filterType;
    const matchesSearch = m.productName.toLowerCase().includes(search.toLowerCase()) ||
                          m.sku.toLowerCase().includes(search.toLowerCase()) ||
                          m.referenceId.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Top Inventory Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
          <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">{t('totalStockValue')}</span>
          <div className="text-2xl font-bold text-slate-900 font-mono mt-2">$248,920.00</div>
          <div className="text-xs text-slate-500 mt-1">{t('valuedAtCost')}</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
          <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">{t('activeWarehouses')}</span>
          <div className="text-2xl font-bold text-slate-900 font-mono mt-2">3 {t('store')}</div>
          <div className="text-xs text-slate-500 mt-1">{t('sohoLocations')}</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">{t('inventoryAudit')}</span>
            <div className="text-sm font-bold text-emerald-700 mt-1 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4" />
              {t('cycleCountVerified')}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">{t('lastReconciled')}</div>
          </div>

          <button 
            onClick={() => alert('New Stock Adjustment record initiated')}
            className="px-3 py-1.5 bg-slate-900 text-white rounded text-xs font-medium hover:bg-slate-800"
          >
            {t('adjustStock')}
          </button>
        </div>
      </div>

      {/* Control Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div>
          <h2 className="text-base font-semibold text-slate-900">{t('stockLedgerTitle')}</h2>
          <p className="text-xs text-slate-500 mt-0.5">{t('stockLedgerSubtext')}</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search SKU or reference ID..."
              className="w-full bg-slate-50 border border-slate-200 rounded-md pl-9 pr-4 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>

          <div className="flex bg-slate-100 p-0.5 rounded-md text-xs font-medium">
            {(['all', 'sale', 'restock', 'adjustment', 'return'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1 rounded-sm capitalize transition-all ${
                  filterType === type 
                    ? 'bg-white text-slate-900 shadow-xs font-semibold' 
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {getMovementTypeLabel(type)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Movements Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-[11px] font-mono uppercase tracking-wider text-slate-400 bg-slate-50/50">
              <th className="py-3 px-4 font-medium">{t('timestamp')}</th>
              <th className="py-3 px-4 font-medium">{t('skuItem')}</th>
              <th className="py-3 px-4 font-medium">{t('movementEvent')}</th>
              <th className="py-3 px-4 font-medium text-center">{t('qtyChange')}</th>
              <th className="py-3 px-4 font-medium text-center">{t('remaining')}</th>
              <th className="py-3 px-4 font-medium">{t('binCode')}</th>
              <th className="py-3 px-4 font-medium">{t('operatorUser')}</th>
              <th className="py-3 px-4 font-medium text-right">{t('refId')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {filtered.map(mov => (
              <tr key={mov.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3 px-4 font-mono text-slate-500">
                  {mov.timestamp}
                </td>
                <td className="py-3 px-4">
                  <div className="font-semibold text-slate-900">{mov.productName}</div>
                  <div className="text-[11px] font-mono text-slate-400">{mov.sku}</div>
                </td>
                <td className="py-3 px-4">
                  <span className={`inline-flex items-center gap-1 text-[10px] font-mono uppercase px-2 py-0.5 rounded font-semibold border ${
                    mov.type === 'sale' ? 'bg-slate-100 text-slate-700 border-slate-200' :
                    mov.type === 'restock' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    mov.type === 'return' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                    'bg-slate-50 text-slate-600 border-slate-200'
                  }`}>
                    {mov.type === 'sale' && <ArrowUpRight className="w-3 h-3 text-slate-500" />}
                    {mov.type === 'restock' && <ArrowDownLeft className="w-3 h-3 text-emerald-600" />}
                    {mov.type === 'return' && <RefreshCw className="w-3 h-3 text-amber-600" />}
                    {getMovementTypeLabel(mov.type)}
                  </span>
                </td>
                <td className="py-3 px-4 text-center font-mono font-bold">
                  <span className={mov.quantityDelta > 0 ? 'text-emerald-700' : 'text-slate-900'}>
                    {mov.quantityDelta > 0 ? `+${mov.quantityDelta}` : mov.quantityDelta}
                  </span>
                </td>
                <td className="py-3 px-4 text-center font-mono text-slate-700 font-semibold">
                  {mov.remainingStock}
                </td>
                <td className="py-3 px-4 font-mono text-slate-600">
                  {mov.binLocation}
                </td>
                <td className="py-3 px-4 text-slate-700 font-medium">
                  {mov.operator}
                </td>
                <td className="py-3 px-4 text-right font-mono text-slate-500">
                  {mov.referenceId}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
