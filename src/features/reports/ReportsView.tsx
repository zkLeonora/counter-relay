'use client';

import React from 'react';
import { Product } from '@/lib/types';
import { useLanguage } from '@/lib/utils/i18n';

interface ReportsViewProps {
  products: Product[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({ products }) => {
  const { t } = useLanguage();
  const topProducts = [...products].sort((a, b) => b.sellingPrice - a.sellingPrice).slice(0, 5);

  const getCategoryLabel = (cat: string) => {
    switch(cat) {
      case 'All': return t('all');
      case 'Apparel': return t('apparel');
      case 'Footwear': return t('footwear');
      case 'Accessories': return t('accessories');
      case 'Bags': return t('bags');
      case 'Lifestyle': return t('lifestyle');
      default: return cat;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Executive Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
          <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">{t('grossRevenueMTD')}</span>
          <div className="text-2xl font-bold text-slate-900 font-mono mt-2">$342,890.00</div>
          <div className="text-xs text-emerald-700 font-mono mt-1">+18.4% {t('vsLastMonth')}</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
          <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">{t('grossProfitMargin')}</span>
          <div className="text-2xl font-bold text-slate-900 font-mono mt-2">68.4%</div>
          <div className="text-xs text-slate-500 mt-1">$234,536 {t('netMargin')}</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
          <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">{t('avgTransaction')}</span>
          <div className="text-2xl font-bold text-slate-900 font-mono mt-2">$134.10</div>
          <div className="text-xs text-slate-500 mt-1">2.4 {t('itemsPerBasket')}</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
          <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">{t('returnRate')}</span>
          <div className="text-2xl font-bold text-slate-900 font-mono mt-2">1.2%</div>
          <div className="text-xs text-emerald-700 font-mono mt-1">-0.4% {t('belowIndustryStandard')}</div>
        </div>
      </div>

      {/* Best Selling Products Ranking Table */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-semibold text-slate-900">{t('topProductsTitle')}</h2>
            <p className="text-xs text-slate-500 mt-0.5">{t('topProductsSubtext')}</p>
          </div>
          <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded">July 2026</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-mono uppercase tracking-wider text-slate-400">
                <th className="pb-3 font-medium">{t('rank')}</th>
                <th className="pb-3 font-medium">{t('productName')}</th>
                <th className="pb-3 font-medium">SKU</th>
                <th className="pb-3 font-medium">{t('category')}</th>
                <th className="pb-3 font-medium text-right">{t('sellingPrice')}</th>
                <th className="pb-3 font-medium text-right">{t('grossMargin')}</th>
                <th className="pb-3 font-medium text-right">{t('revenueContributed')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {topProducts.map((p, idx) => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 font-mono font-bold text-slate-900">
                    #{idx + 1}
                  </td>
                  <td className="py-3 font-semibold text-slate-900">
                    {p.name}
                  </td>
                  <td className="py-3 font-mono text-slate-500">
                    {p.sku}
                  </td>
                  <td className="py-3 text-slate-700">
                    {getCategoryLabel(p.category)}
                  </td>
                  <td className="py-3 text-right font-mono font-bold text-slate-900">
                    ${p.sellingPrice.toFixed(2)}
                  </td>
                  <td className="py-3 text-right font-mono text-emerald-700 font-semibold">
                    {p.marginPercent}%
                  </td>
                  <td className="py-3 text-right font-mono font-bold text-slate-900">
                    ${(p.sellingPrice * (45 - idx * 6)).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
