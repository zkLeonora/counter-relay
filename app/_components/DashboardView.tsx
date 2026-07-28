'use client';

import React, { useState } from 'react';
import { RestockItem, Order, SalesMetricPoint } from '@/lib/types';
import { useLanguage } from '@/lib/i18n';
import { 
  TrendingUp, 
  AlertTriangle, 
  ArrowUpRight, 
  CreditCard, 
  Smartphone, 
  Banknote, 
  ArrowRight
} from 'lucide-react';

interface DashboardViewProps {
  restockItems: RestockItem[];
  recentOrders: Order[];
  hourlyMetrics: SalesMetricPoint[];
  onNavigateToPOS: () => void;
  onNavigateToInventory: () => void;
  onSelectOrder: (order: Order) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  restockItems,
  recentOrders,
  onNavigateToPOS,
  onNavigateToInventory,
  onSelectOrder
}) => {
  const { t, language } = useLanguage();
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('day');
  const [restockFilter, setRestockFilter] = useState<'all' | 'critical' | 'warning'>('all');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const filteredRestock = restockItems.filter(item => {
    if (restockFilter === 'critical') return item.status === 'critical';
    if (restockFilter === 'warning') return item.status === 'warning';
    return true;
  });

  // Dynamic Chart Datasets & Axis Labels based on timeRange (Day / Week / Month)
  const getChartData = () => {
    if (timeRange === 'week') {
      const weekDaysEn = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const weekDaysId = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
      const labels = language === 'id' ? weekDaysId : weekDaysEn;
      const values = [12400, 15800, 14200, 18900, 28400, 24100, 19500]; // Peak Fri
      const pathPOS = "M 10 110 C 80 90, 150 100, 220 70 C 290 20, 360 40, 490 60";
      const pathOnline = "M 10 130 C 80 120, 150 110, 220 90 C 290 50, 360 70, 490 80";
      return { labels, values, pathPOS, pathOnline, peakIndex: 4, peakPrefix: language === 'id' ? 'Hari Puncak' : 'Peak Day' };
    }
    
    if (timeRange === 'month') {
      const monthsEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthsId = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
      const labels = language === 'id' ? monthsId : monthsEn;
      const values = [185000, 210000, 198000, 245000, 289000, 310000, 342890, 320000, 295000, 315000, 330000, 360000];
      const pathPOS = "M 10 120 C 50 110, 100 115, 150 90 C 200 70, 250 50, 300 30 C 350 40, 400 50, 490 10";
      const pathOnline = "M 10 135 C 50 125, 100 130, 150 110 C 200 95, 250 75, 300 55 C 350 65, 400 75, 490 30";
      return { labels, values, pathPOS, pathOnline, peakIndex: 6, peakPrefix: language === 'id' ? 'Bulan Puncak' : 'Peak Month' };
    }

    // Default: 'day' (Hourly)
    const labels = ['09:00', '11:00', '13:00', '15:00', '17:00', '19:00'];
    const values = [850, 2400, 4950, 9800, 14600, 18420];
    const pathPOS = "M 10 120 C 90 90, 170 60, 250 35 C 330 20, 410 15, 490 10";
    const pathOnline = "M 10 130 C 90 120, 170 100, 250 85 C 330 70, 410 50, 490 35";
    return { labels, values, pathPOS, pathOnline, peakIndex: 4, peakPrefix: language === 'id' ? 'Jam Puncak' : 'Peak Hour' };
  };

  const chartInfo = getChartData();
  const stepX = 480 / (chartInfo.labels.length - 1);
  const pointCoords = chartInfo.labels.map((lbl, idx) => ({
    x: 10 + idx * stepX,
    label: lbl,
    val: chartInfo.values[idx],
  }));

  const handleMouseMoveOnChart = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const relativeX = (mouseX / rect.width) * 500;
    
    let closestIdx = 0;
    let minDistance = Infinity;
    pointCoords.forEach((p, idx) => {
      const dist = Math.abs(p.x - relativeX);
      if (dist < minDistance) {
        minDistance = dist;
        closestIdx = idx;
      }
    });
    setHoveredIndex(closestIdx);
  };

  return (
    <div className="p-6 space-y-6">
      {/* ----------------- TOP ROW: 3 KPI METRIC CARDS ----------------- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Metric 1: Today's Revenue */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">{t('todaysRevenue')}</span>
            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-mono font-medium">
              <TrendingUp className="w-3 h-3" />
              <span>+14.2%</span>
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div>
              <div className="text-2xl font-bold text-slate-900 tabular-nums font-mono">$18,420.50</div>
              <div className="text-xs text-slate-500 mt-0.5">{t('vsYesterday')} $16,130.00</div>
            </div>
            {/* Smooth SVG sparkline micro graph */}
            <svg className="w-24 h-9 text-slate-900 overflow-visible" viewBox="0 0 100 30" fill="none">
              <path 
                d="M0 25 C 20 22, 30 18, 50 12 C 70 8, 80 15, 100 4" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
              />
            </svg>
          </div>
        </div>

        {/* Metric 2: Orders Today */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">{t('ordersToday')}</span>
            <span className="text-xs font-mono text-slate-500">Register 01 & 02</span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div>
              <div className="text-2xl font-bold text-slate-900 tabular-nums font-mono">142</div>
              <div className="text-xs text-slate-500 mt-0.5">{t('avgBasket')}: <span className="font-mono">$129.72</span></div>
            </div>
            {/* Sparkline */}
            <svg className="w-24 h-9 text-slate-900 overflow-visible" viewBox="0 0 100 30" fill="none">
              <path 
                d="M0 20 C 25 28, 40 10, 65 18 C 80 22, 90 8, 100 10" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
              />
            </svg>
          </div>
        </div>

        {/* Metric 3: Low Stock Alerts */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">{t('lowStockAction')}</span>
            <span className="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-mono rounded font-medium">
              {t('actionNeeded')}
            </span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div>
              <div className="text-2xl font-bold text-slate-900 tabular-nums font-mono">8 SKUs</div>
              <div className="text-xs text-amber-700 font-medium mt-0.5 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-amber-600" />
                2 {t('outOfStock')}
              </div>
            </div>
            <button 
              onClick={onNavigateToInventory}
              className="text-xs font-mono text-slate-900 hover:underline flex items-center gap-1 border-b border-slate-900 pb-0.5"
            >
              {t('restockAll')} <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* ----------------- MIDDLE ROW: 2 GRID CARDS ----------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Card (2/3 width): Sales Velocity Line Chart */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-lg p-6 flex flex-col justify-between shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-semibold text-slate-900">{t('todaySalesThroughput')}</h2>
              <p className="text-xs text-slate-500 mt-0.5">{t('salesSubtext')}</p>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex bg-slate-100 p-0.5 rounded-md text-xs font-medium">
                {(['day', 'week', 'month'] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => {
                      setTimeRange(range);
                      setHoveredIndex(null);
                    }}
                    className={`px-3 py-1 rounded-sm capitalize transition-all ${
                      timeRange === range 
                        ? 'bg-white text-slate-900 shadow-xs font-semibold' 
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {t(range)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Chart Graphic SVG */}
          <div className="py-6 relative">
            <div className="flex items-center justify-end gap-4 text-xs font-mono mb-2">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-slate-900 rounded" />
                <span className="text-slate-700">{t('posRegisters')} ($18,420)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-slate-300 rounded" />
                <span className="text-slate-400">{t('onlineStore')} ($6,150)</span>
              </div>
            </div>

            <div className="h-56 w-full relative flex items-end">
              {/* Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[10px] font-mono text-slate-300">
                <div className="border-b border-dashed border-slate-200 pb-0.5">$20k</div>
                <div className="border-b border-dashed border-slate-200 pb-0.5">$15k</div>
                <div className="border-b border-dashed border-slate-200 pb-0.5">$10k</div>
                <div className="border-b border-dashed border-slate-200 pb-0.5">$5k</div>
                <div className="border-b border-slate-200 pb-0.5">$0</div>
              </div>

              {/* Main SVG Curve */}
              <svg 
                className="w-full h-48 overflow-visible z-10 cursor-crosshair" 
                viewBox="0 0 500 150"
                onMouseMove={handleMouseMoveOnChart}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Secondary Online curve */}
                <path
                  d={chartInfo.pathOnline}
                  fill="none"
                  stroke="#cbd5e1"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
                {/* Primary POS curve */}
                <path
                  d={chartInfo.pathPOS}
                  fill="none"
                  stroke="#0f172a"
                  strokeWidth="2.5"
                />

                {/* Wide invisible hit area line for smooth mouse hover */}
                <path
                  d={chartInfo.pathPOS}
                  fill="none"
                  stroke="transparent"
                  strokeWidth="30"
                />

                {/* Vertical guide line on hover */}
                {hoveredIndex !== null && (
                  <line
                    x1={pointCoords[hoveredIndex].x}
                    y1="0"
                    x2={pointCoords[hoveredIndex].x}
                    y2="150"
                    stroke="#94a3b8"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />
                )}

                {/* Hover Tooltip Card (Appears ONLY when hovering over chart line) */}
                {hoveredIndex !== null && (
                  <foreignObject 
                    x={Math.max(10, Math.min(360, pointCoords[hoveredIndex].x - 65))} 
                    y="10"
                    width="145" 
                    height="50"
                    className="pointer-events-none transition-all duration-75"
                  >
                    <div className="bg-slate-900 text-white p-2 rounded shadow-lg text-[10px] font-mono border border-slate-700">
                      <div className="text-slate-400">
                        {hoveredIndex === chartInfo.peakIndex ? `${chartInfo.peakPrefix}: ` : ''}{pointCoords[hoveredIndex].label}
                      </div>
                      <div className="font-bold text-white text-xs">
                        ${pointCoords[hoveredIndex].val.toLocaleString()} {t('posSales')}
                      </div>
                    </div>
                  </foreignObject>
                )}
              </svg>
            </div>

            {/* Dynamic X-Axis labels */}
            <div className="flex justify-between text-xs font-mono text-slate-400 pt-2 border-t border-slate-200">
              {chartInfo.labels.map((label) => (
                <span key={label}>{label}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Card (1/3 width): Live Recent Transactions Breakdown */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base font-semibold text-slate-900">{t('recentOrders')}</h2>
            <button 
              onClick={onNavigateToPOS}
              className="text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1"
            >
              {t('openPOS')} <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="py-3 space-y-3.5 flex-1 overflow-y-auto max-h-[260px]">
            {recentOrders.slice(0, 4).map(order => (
              <div 
                key={order.id} 
                onClick={() => onSelectOrder(order)}
                className="flex items-center justify-between p-2.5 rounded border border-slate-100 hover:border-slate-300 hover:bg-slate-50/80 cursor-pointer transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-slate-100 text-slate-700 flex items-center justify-center font-mono text-xs">
                    {order.paymentMethod === 'apple_pay' ? <Smartphone className="w-4 h-4" /> :
                     order.paymentMethod === 'cash' ? <Banknote className="w-4 h-4" /> :
                     <CreditCard className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-900">{order.customerName}</div>
                    <div className="text-[10px] font-mono text-slate-500">{order.receiptNumber} • {order.items.length} items</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-mono font-bold text-slate-900">${order.total.toFixed(2)}</div>
                  <span className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded font-medium ${
                    order.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    order.paymentStatus === 'refunded' ? 'bg-slate-100 text-slate-600 border border-slate-200' :
                    'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {t(order.paymentStatus === 'paid' ? 'paid' : order.paymentStatus === 'refunded' ? 'refunded' : 'paid')}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Payment Channel Stats */}
          <div className="pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2 bg-slate-50 rounded">
              <div className="text-[10px] text-slate-500 uppercase font-mono">{t('card')}</div>
              <div className="font-mono font-bold text-slate-900 mt-0.5">68%</div>
            </div>
            <div className="p-2 bg-slate-50 rounded">
              <div className="text-[10px] text-slate-500 uppercase font-mono">{t('applePay')}</div>
              <div className="font-mono font-bold text-slate-900 mt-0.5">24%</div>
            </div>
            <div className="p-2 bg-slate-50 rounded">
              <div className="text-[10px] text-slate-500 uppercase font-mono">{t('cash')}</div>
              <div className="font-mono font-bold text-slate-900 mt-0.5">8%</div>
            </div>
          </div>
        </div>
      </div>

      {/* ----------------- BOTTOM ROW: PRODUCTS TO RESTOCK TABLE ----------------- */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-semibold text-slate-900">{t('productsToRestock')}</h2>
            <p className="text-xs text-slate-500 mt-0.5">{t('restockSubtext')}</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex bg-slate-100 p-0.5 rounded-md text-xs font-medium">
              {(['all', 'critical', 'warning'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setRestockFilter(filter)}
                  className={`px-3 py-1 rounded-sm capitalize transition-all ${
                    restockFilter === filter 
                      ? 'bg-white text-slate-900 shadow-xs font-semibold' 
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            <button 
              onClick={onNavigateToInventory}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-medium transition-colors"
            >
              {t('manageInventory')}
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-mono uppercase tracking-wider text-slate-400">
                <th className="pb-3 font-medium">{t('productItem')}</th>
                <th className="pb-3 font-medium">{t('supplier')}</th>
                <th className="pb-3 font-medium">{t('binCode')}</th>
                <th className="pb-3 font-medium text-center">{t('stockLevel')}</th>
                <th className="pb-3 font-medium text-right">{t('unitCost')}</th>
                <th className="pb-3 font-medium text-right">{t('orderQty')}</th>
                <th className="pb-3 font-medium text-center">{t('status')}</th>
                <th className="pb-3 font-medium text-right">{t('action')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredRestock.map(item => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded bg-slate-100 border border-slate-200 flex items-center justify-center font-mono text-[10px] text-slate-500 shrink-0">
                        {item.sku.slice(-3)}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">{item.name}</div>
                        <div className="text-[11px] font-mono text-slate-500">{item.sku}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    <div className="text-slate-800 font-medium">{item.supplier}</div>
                    <div className="text-[11px] font-mono text-slate-400">{item.supplierEmail}</div>
                  </td>
                  <td className="py-3 pr-4">
                    <span className="font-mono text-xs px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-slate-700">
                      {item.binLocation}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-center">
                    <div className="font-mono font-bold text-slate-900">{item.currentStock} / {item.reorderPoint}</div>
                    <div className="w-16 h-1.5 bg-slate-100 rounded-full mx-auto mt-1 overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          item.currentStock <= 3 ? 'bg-red-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${Math.min(100, (item.currentStock / item.reorderPoint) * 100)}%` }}
                      />
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-right font-mono text-slate-900">
                    ${item.costPerUnit.toFixed(2)}
                  </td>
                  <td className="py-3 pr-4 text-right font-mono font-semibold text-slate-900">
                    +{item.suggestedQty}
                  </td>
                  <td className="py-3 pr-4 text-center">
                    <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-semibold border ${
                      item.status === 'critical' ? 'bg-red-50 text-red-700 border-red-200' :
                      item.status === 'warning' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                      'bg-slate-100 text-slate-700 border-slate-200'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button 
                      onClick={() => alert(`Created Purchase Order PO-2026-${Math.floor(1000 + Math.random() * 9000)} for ${item.supplier}`)}
                      className="px-2.5 py-1 bg-white border border-slate-300 hover:border-slate-900 hover:bg-slate-900 hover:text-white rounded text-[11px] font-medium transition-all"
                    >
                      {t('issuePO')}
                    </button>
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
