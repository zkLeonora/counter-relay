'use client';

import React, { useState } from 'react';
import { 
  Search, 
  ShoppingBag, 
  Eye, 
  Calendar, 
  CreditCard, 
  Banknote, 
  Smartphone, 
  DollarSign, 
  Filter 
} from 'lucide-react';
import { OrderItemFull } from './types';
import { OrderDetailModal } from './OrderDetailModal';

interface OrdersViewProps {
  initialOrders: OrderItemFull[];
}

export const OrdersView: React.FC<OrdersViewProps> = ({
  initialOrders = [],
}) => {
  const [ordersList] = useState<OrderItemFull[]>(initialOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<OrderItemFull | null>(null);

  const filteredOrders = ordersList.filter((o) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      o.receiptNumber.toLowerCase().includes(query) ||
      o.customerName.toLowerCase().includes(query);

    const matchesStatus =
      paymentStatusFilter === 'all' || o.paymentStatus === paymentStatusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalRevenue = ordersList.reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center shadow-xs">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">Order Transactions Journal</h1>
            <p className="text-xs text-slate-500">View real-time POS sales receipts & payment records</p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-xs font-mono text-slate-500 uppercase">Journal Total</div>
          <div className="text-xl font-bold font-mono text-emerald-700">${totalRevenue.toFixed(2)}</div>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        {/* Filters Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            {/* Search */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Receipt # or Customer..."
                className="w-full pl-9 pr-3.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all placeholder:text-slate-400 font-mono"
              />
            </div>

            {/* Payment Status Pill Buttons */}
            <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs font-medium">
              {(['all', 'paid', 'refunded'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setPaymentStatusFilter(status)}
                  className={`px-3 py-1 rounded-md capitalize transition-all ${
                    paymentStatusFilter === status
                      ? 'bg-white text-slate-900 shadow-xs font-semibold'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="text-xs font-mono text-slate-500">
            Total Receipts: <span className="font-bold text-slate-900">{filteredOrders.length}</span>
          </div>
        </div>

        {/* Orders Table */}
        {filteredOrders.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900">No order transactions found</h3>
            <p className="text-xs text-slate-500 max-w-xs mt-1">
              Checkout transactions from the POS terminal will automatically appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] font-mono uppercase tracking-wider text-slate-400">
                  <th className="pb-3 font-medium">Receipt #</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Channel</th>
                  <th className="pb-3 font-medium text-center">Items</th>
                  <th className="pb-3 font-medium text-right">Total Amount</th>
                  <th className="pb-3 font-medium text-center">Status</th>
                  <th className="pb-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-mono">
                {filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 pr-4">
                      <div className="font-bold text-slate-900">{o.receiptNumber}</div>
                      <div className="text-[10px] text-slate-400">{new Date(o.createdAt).toLocaleString()}</div>
                    </td>
                    <td className="py-3.5 pr-4 font-sans font-semibold text-slate-800">
                      {o.customerName}
                    </td>
                    <td className="py-3.5 pr-4 uppercase text-slate-600 font-semibold">
                      {o.paymentMethod}
                    </td>
                    <td className="py-3.5 pr-4 text-center text-slate-700">
                      {o.items?.length || 1} items
                    </td>
                    <td className="py-3.5 pr-4 text-right font-bold text-slate-900">
                      ${o.total.toFixed(2)}
                    </td>
                    <td className="py-3.5 pr-4 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${
                        o.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        o.paymentStatus === 'refunded' ? 'bg-slate-100 text-slate-600 border-slate-200' :
                        'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {o.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <button
                        onClick={() => setSelectedOrder(o)}
                        className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors inline-flex items-center gap-1 font-sans text-xs font-medium"
                      >
                        <Eye className="w-3.5 h-3.5" /> Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Detail Inspector Modal */}
      <OrderDetailModal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        order={selectedOrder}
      />
    </div>
  );
};
