'use client';

import React, { useState } from 'react';
import { Order } from '@/lib/types';
import { useLanguage } from '@/lib/utils/i18n';
import { 
  Search, 
  Smartphone, 
  CreditCard, 
  Banknote, 
  X,
  Printer,
  RotateCcw
} from 'lucide-react';

interface OrdersViewProps {
  orders: Order[];
  onSelectOrder?: (order: Order) => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({ orders }) => {
  const { t } = useLanguage();
  const [filterStatus, setFilterStatus] = useState<'all' | 'paid' | 'refunded'>('all');
  const [search, setSearch] = useState<string>('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter(ord => {
    const matchesStatus = filterStatus === 'all' || ord.paymentStatus === filterStatus;
    const matchesSearch = ord.receiptNumber.toLowerCase().includes(search.toLowerCase()) ||
                          ord.customerName.toLowerCase().includes(search.toLowerCase()) ||
                          ord.id.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header Controls */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div>
          <h2 className="text-base font-semibold text-slate-900">{t('ordersLedgerTitle')}</h2>
          <p className="text-xs text-slate-500 mt-0.5">{t('ordersLedgerSubtext')}</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('searchReceiptPlaceholder')}
              className="w-full bg-slate-50 border border-slate-200 rounded-md pl-9 pr-4 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>

          <div className="flex bg-slate-100 p-0.5 rounded-md text-xs font-medium">
            {(['all', 'paid', 'refunded'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1 rounded-sm capitalize transition-all ${
                  filterStatus === status 
                    ? 'bg-white text-slate-900 shadow-xs font-semibold' 
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {t(status === 'all' ? 'all' : status === 'paid' ? 'paid' : 'refunded')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-[11px] font-mono uppercase tracking-wider text-slate-400 bg-slate-50/50">
              <th className="py-3 px-4 font-medium">{t('receiptNumber')}</th>
              <th className="py-3 px-4 font-medium">{t('timestamp')}</th>
              <th className="py-3 px-4 font-medium">{t('customer')}</th>
              <th className="py-3 px-4 font-medium">{t('paymentMethod')}</th>
              <th className="py-3 px-4 font-medium text-center">{t('items')}</th>
              <th className="py-3 px-4 font-medium text-right">{t('total')}</th>
              <th className="py-3 px-4 font-medium text-center">{t('status')}</th>
              <th className="py-3 px-4 font-medium text-right">{t('action')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {filteredOrders.map(ord => (
              <tr 
                key={ord.id} 
                onClick={() => setSelectedOrder(ord)}
                className="hover:bg-slate-50/80 cursor-pointer transition-colors"
              >
                <td className="py-3.5 px-4 font-mono font-semibold text-slate-900">
                  {ord.receiptNumber}
                </td>
                <td className="py-3.5 px-4 text-slate-500 font-mono">
                  {ord.timestamp}
                </td>
                <td className="py-3.5 px-4">
                  <div className="font-semibold text-slate-900">{ord.customerName}</div>
                  <div className="text-[11px] font-mono text-slate-400">{ord.customerPhone || 'Walk-in Guest'}</div>
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded bg-slate-100 text-slate-700 font-mono">
                      {ord.paymentMethod === 'apple_pay' ? <Smartphone className="w-3.5 h-3.5" /> :
                       ord.paymentMethod === 'cash' ? <Banknote className="w-3.5 h-3.5" /> :
                       <CreditCard className="w-3.5 h-3.5" />}
                    </span>
                    <span className="capitalize text-slate-700">{ord.paymentMethod.replace('_', ' ')}</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-center font-mono font-medium">
                  {ord.items.length}
                </td>
                <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                  ${ord.total.toFixed(2)}
                </td>
                <td className="py-3.5 px-4 text-center">
                  <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-semibold border ${
                    ord.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    ord.paymentStatus === 'refunded' ? 'bg-slate-100 text-slate-600 border-slate-200' :
                    'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    {t(ord.paymentStatus === 'paid' ? 'paid' : 'refunded')}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedOrder(ord);
                    }}
                    className="px-2.5 py-1 border border-slate-300 rounded hover:bg-slate-900 hover:text-white transition-all"
                  >
                    {t('viewReceipt')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Slide-out Receipt Drawer */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex justify-end z-50">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between p-6">
            <div>
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{t('receiptDetails')}</h3>
                  <p className="text-xs font-mono text-slate-500">{selectedOrder.receiptNumber}</p>
                </div>
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Receipt Content */}
              <div className="mt-6 space-y-4 font-mono text-xs">
                <div className="text-center pb-3 border-b border-slate-100">
                  <div className="font-bold text-slate-900 text-sm">COUNTER BY RELAY</div>
                  <div className="text-slate-500 text-[11px]">SoHo Flagship Store • Reg #{selectedOrder.registerId}</div>
                  <div className="text-slate-400 text-[10px] mt-1">{selectedOrder.timestamp}</div>
                </div>

                <div className="space-y-2 py-2 border-b border-slate-100">
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="flex justify-between">
                      <div>
                        <div className="font-semibold text-slate-900">{item.name}</div>
                        <div className="text-[10px] text-slate-400">{item.sku} • Qty: {item.quantity}</div>
                      </div>
                      <div className="font-bold text-slate-900">
                        ${(item.unitPrice * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-1 text-slate-600 pt-2">
                  <div className="flex justify-between">
                    <span>{t('subtotal')}</span>
                    <span>${selectedOrder.subtotal.toFixed(2)}</span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between text-emerald-700">
                      <span>{t('discount')}</span>
                      <span>-${selectedOrder.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>{t('estimatedTax')}</span>
                    <span>${selectedOrder.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-slate-900 text-sm pt-2 border-t border-slate-200">
                    <span>{t('total')}</span>
                    <span>${selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200 flex items-center gap-3">
              <button 
                onClick={() => alert(`Printing receipt ${selectedOrder.receiptNumber}...`)}
                className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                {t('printReceipt')}
              </button>
              <button 
                onClick={() => alert(`Processed refund request for ${selectedOrder.receiptNumber}`)}
                className="px-4 py-2.5 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded text-xs font-semibold flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                {t('refund')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
