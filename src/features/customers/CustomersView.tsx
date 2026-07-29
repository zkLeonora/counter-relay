'use client';

import React, { useState } from 'react';
import { Customer } from '@/lib/types';
import { useLanguage } from '@/lib/utils/i18n';
import { 
  Search, 
  UserPlus, 
  Phone, 
  Mail
} from 'lucide-react';

interface CustomersViewProps {
  customers: Customer[];
}

export const CustomersView: React.FC<CustomersViewProps> = ({ customers }) => {
  const { t } = useLanguage();
  const [search, setSearch] = useState<string>('');
  const [tierFilter, setTierFilter] = useState<string>('All');

  const tiers = ['All', 'VIP', 'Gold', 'Silver', 'Standard'];

  const filtered = customers.filter(c => {
    const matchesTier = tierFilter === 'All' || c.tier === tierFilter;
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
                          c.phone.includes(search) ||
                          c.email.toLowerCase().includes(search.toLowerCase());
    return matchesTier && matchesSearch;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header Controls */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div>
          <h2 className="text-base font-semibold text-slate-900">{t('crmTitle')}</h2>
          <p className="text-xs text-slate-500 mt-0.5">{t('crmSubtext')}</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('searchCustomerPlaceholder')}
              className="w-full bg-slate-50 border border-slate-200 rounded-md pl-9 pr-4 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>

          <div className="flex bg-slate-100 p-0.5 rounded-md text-xs font-medium">
            {tiers.map(tItem => (
              <button
                key={tItem}
                onClick={() => setTierFilter(tItem)}
                className={`px-3 py-1 rounded-sm capitalize transition-all ${
                  tierFilter === tItem 
                    ? 'bg-white text-slate-900 shadow-xs font-semibold' 
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {tItem === 'All' ? t('all') : tItem}
              </button>
            ))}
          </div>

          <button 
            onClick={() => alert('New Customer Registration modal')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded text-xs font-medium hover:bg-slate-800 transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5" />
            {t('addCustomer')}
          </button>
        </div>
      </div>

      {/* Customer Directory Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-[11px] font-mono uppercase tracking-wider text-slate-400 bg-slate-50/50">
              <th className="py-3 px-4 font-medium">{t('customerName')}</th>
              <th className="py-3 px-4 font-medium">{t('contact')}</th>
              <th className="py-3 px-4 font-medium text-center">{t('loyaltyTier')}</th>
              <th className="py-3 px-4 font-medium text-center">{t('points')}</th>
              <th className="py-3 px-4 font-medium text-center">{t('ordersCount')}</th>
              <th className="py-3 px-4 font-medium text-right">{t('lifetimeValue')}</th>
              <th className="py-3 px-4 font-medium text-right">{t('lastStoreVisit')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {filtered.map(cust => (
              <tr key={cust.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3.5 px-4 font-semibold text-slate-900">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-mono font-bold text-xs">
                      {cust.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div>{cust.name}</div>
                      <div className="text-[10px] font-mono text-slate-400">ID: {cust.id}</div>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-slate-600">
                  <div className="flex items-center gap-1">
                    <Mail className="w-3 h-3 text-slate-400" />
                    <span>{cust.email}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400 mt-0.5">
                    <Phone className="w-3 h-3 text-slate-400" />
                    <span>{cust.phone}</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-center">
                  <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-semibold border ${
                    cust.tier === 'VIP' ? 'bg-amber-100 text-amber-900 border-amber-300' :
                    cust.tier === 'Gold' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                    cust.tier === 'Silver' ? 'bg-slate-100 text-slate-800 border-slate-300' :
                    'bg-slate-50 text-slate-600 border-slate-200'
                  }`}>
                    {cust.tier}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-900">
                  {cust.loyaltyPoints.toLocaleString()} pts
                </td>
                <td className="py-3.5 px-4 text-center font-mono text-slate-700 font-medium">
                  {cust.totalOrders}
                </td>
                <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                  ${cust.totalSpend.toFixed(2)}
                </td>
                <td className="py-3.5 px-4 text-right font-mono text-slate-500">
                  {cust.lastVisit}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
