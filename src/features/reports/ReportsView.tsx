'use client';

import React, { useState, useTransition } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Download, 
  Users, 
  Package, 
  CreditCard, 
  Award, 
  Calendar, 
  Loader2, 
  PieChart, 
  Percent,
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';
import { DateRangeFilter, FullReportData } from './types';
import { fetchReportsAction } from './actions';

interface ReportsViewProps {
  initialReport: FullReportData;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  initialReport,
}) => {
  const [report, setReport] = useState<FullReportData>(initialReport);
  const [activeFilter, setActiveFilter] = useState<DateRangeFilter>('7days');
  const [isPending, startTransition] = useTransition();

  const handleFilterChange = (filter: DateRangeFilter) => {
    setActiveFilter(filter);
    startTransition(async () => {
      const res = await fetchReportsAction(filter);
      if (res.success && res.data) {
        setReport(res.data);
      }
    });
  };

  const handleExportCSV = () => {
    const rows = [
      ['Report Date Range', activeFilter.toUpperCase()],
      ['Gross Revenue ($)', report.summary.grossRevenue.toFixed(2)],
      ['Net Revenue ($)', report.summary.netRevenue.toFixed(2)],
      ['Orders Count', report.summary.ordersCount.toString()],
      ['Average Basket ($)', report.summary.averageBasket.toFixed(2)],
      ['Total Tax Collected ($)', report.summary.totalTax.toFixed(2)],
      ['Total Discounts ($)', report.summary.totalDiscount.toFixed(2)],
      ['Total Inventory Cost ($)', report.inventoryAnalytics.totalStockValueCost.toFixed(2)],
      ['Total Inventory Retail ($)', report.inventoryAnalytics.totalStockValueRetail.toFixed(2)],
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CounterRelay_Report_${activeFilter}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const potentialProfitMargin = 
    report.inventoryAnalytics.totalStockValueRetail > 0
      ? ((report.inventoryAnalytics.totalStockValueRetail - report.inventoryAnalytics.totalStockValueCost) / report.inventoryAnalytics.totalStockValueRetail) * 100
      : 0;

  return (
    <div className="p-6 space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center shadow-xs">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">Executive Reports & Analytics</h1>
            <p className="text-xs text-slate-500">Business performance metrics, profitability & sales insights</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Time Range Filter Buttons */}
          <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs font-medium">
            {(
              [
                { id: 'today', label: 'Today' },
                { id: 'yesterday', label: 'Yesterday' },
                { id: '7days', label: 'Last 7D' },
                { id: '30days', label: 'Last 30D' },
                { id: 'all', label: 'All Time' },
              ] as const
            ).map((item) => (
              <button
                key={item.id}
                onClick={() => handleFilterChange(item.id)}
                className={`px-3 py-1 rounded-md transition-all ${
                  activeFilter === item.id
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
        </div>
      </div>

      {isPending && (
        <div className="flex items-center justify-center p-4 bg-white border border-slate-200 rounded-xl text-xs text-slate-500 gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-slate-900" />
          <span>Refreshing financial analytics...</span>
        </div>
      )}

      {/* Section 1: Sales Performance Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-mono uppercase tracking-wider">
            <span>Gross Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-slate-900">
            ${report.summary.grossRevenue.toFixed(2)}
          </div>
          <div className="mt-1 text-[11px] text-slate-500 font-mono">
            Net: <span className="font-semibold text-emerald-700">${report.summary.netRevenue.toFixed(2)}</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-mono uppercase tracking-wider">
            <span>Total Orders</span>
            <ShoppingBag className="w-4 h-4 text-slate-700" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-slate-900">
            {report.summary.ordersCount} Orders
          </div>
          <div className="mt-1 text-[11px] text-slate-500 font-mono">
            Avg Basket: <span className="font-semibold text-slate-900">${report.summary.averageBasket.toFixed(2)}</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-mono uppercase tracking-wider">
            <span>Tax Collected (10%)</span>
            <Percent className="w-4 h-4 text-slate-600" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-slate-900">
            ${report.summary.totalTax.toFixed(2)}
          </div>
          <div className="mt-1 text-[11px] text-slate-500 font-mono">
            Discounts: <span className="font-semibold text-amber-700">-${report.summary.totalDiscount.toFixed(2)}</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-mono uppercase tracking-wider">
            <span>Stock Retail Value</span>
            <Package className="w-4 h-4 text-purple-600" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-purple-800">
            ${report.inventoryAnalytics.totalStockValueRetail.toFixed(2)}
          </div>
          <div className="mt-1 text-[11px] text-slate-500 font-mono">
            Profit Margin: <span className="font-semibold text-purple-700">{potentialProfitMargin.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* Section 2: Top Products & Payment Channels Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Selling Products Table */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <h2 className="font-semibold text-slate-900 text-sm">Top Performing Products & Profitability</h2>
            </div>
            <span className="text-xs font-mono text-slate-500">Sorted by Sales Revenue</span>
          </div>

          {report.topProducts.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">No product sales recorded in this period.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-[11px] font-mono uppercase tracking-wider text-slate-400">
                    <th className="pb-2 font-medium">Product Item</th>
                    <th className="pb-2 font-medium text-center">Qty Sold</th>
                    <th className="pb-2 font-medium text-right">Revenue</th>
                    <th className="pb-2 font-medium text-right">Estimated Profit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {report.topProducts.map((p) => (
                    <tr key={p.productId} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 pr-3">
                        <div className="font-semibold text-slate-900">{p.name}</div>
                        <div className="text-[10px] font-mono text-slate-400">{p.sku}</div>
                      </td>
                      <td className="py-3 pr-3 text-center font-mono font-semibold text-slate-800">
                        {p.quantitySold} units
                      </td>
                      <td className="py-3 pr-3 text-right font-mono font-bold text-slate-900">
                        ${p.totalRevenue.toFixed(2)}
                      </td>
                      <td className="py-3 text-right font-mono font-bold text-emerald-700">
                        +${p.totalProfit.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Payment Channel Analytics */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-slate-900" />
              <h2 className="font-semibold text-slate-900 text-sm">Payment Methods</h2>
            </div>
            <PieChart className="w-4 h-4 text-slate-400" />
          </div>

          <div className="space-y-3.5">
            {report.paymentAnalytics.map((pm) => (
              <div key={pm.method} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-semibold text-slate-900 uppercase">{pm.method}</span>
                  <span className="font-bold text-slate-900">${pm.totalAmount.toFixed(2)}</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-slate-900"
                    style={{ width: `${Math.min(100, pm.percentage)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>{pm.count} transactions</span>
                  <span>{pm.percentage.toFixed(1)}% of total</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section 3: Customer CRM & Inventory Valuation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customer Loyalty CRM Analytics */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-900" />
              <h2 className="font-semibold text-slate-900 text-sm">Customer CRM Insights</h2>
            </div>
            <Award className="w-4 h-4 text-amber-500" />
          </div>

          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="text-[10px] font-mono text-slate-500 uppercase">Total Members</div>
              <div className="text-xl font-bold font-mono text-slate-900 mt-0.5">
                {report.customerAnalytics.totalCustomers}
              </div>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="text-[10px] font-mono text-slate-500 uppercase">VIP / Gold Members</div>
              <div className="text-xl font-bold font-mono text-amber-700 mt-0.5">
                {report.customerAnalytics.vipCustomersCount}
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-1 text-xs">
            <div className="text-[11px] font-mono font-semibold uppercase text-slate-400 mb-1">
              Top Customer Lifetime Value:
            </div>
            {report.customerAnalytics.topSpendingCustomers.slice(0, 3).map((cust) => (
              <div key={cust.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-slate-900 text-white flex items-center justify-center font-bold text-[10px] font-mono">
                    {cust.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">{cust.name}</div>
                    <div className="text-[10px] font-mono text-slate-400">{cust.tier} Member • {cust.totalOrders} Orders</div>
                  </div>
                </div>
                <div className="font-bold font-mono text-emerald-700">${cust.totalSpend.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Inventory Asset Valuation */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-purple-700" />
              <h2 className="font-semibold text-slate-900 text-sm">Inventory Valuation & Assets</h2>
            </div>
            <span className="text-xs font-mono text-purple-700 font-semibold">
              {report.inventoryAnalytics.totalStockUnits} Total Units
            </span>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
              <span className="text-slate-600">Total Purchase Cost Valuation:</span>
              <span className="font-bold text-slate-900">${report.inventoryAnalytics.totalStockValueCost.toFixed(2)}</span>
            </div>

            <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg flex items-center justify-between">
              <span className="text-purple-900 font-semibold">Total Retail Market Value:</span>
              <span className="font-bold text-purple-800 text-sm">${report.inventoryAnalytics.totalStockValueRetail.toFixed(2)}</span>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between">
              <span className="text-emerald-900 font-semibold">Projected Gross Margin ($):</span>
              <span className="font-bold text-emerald-800 text-sm">
                +${Math.max(0, report.inventoryAnalytics.totalStockValueRetail - report.inventoryAnalytics.totalStockValueCost).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
