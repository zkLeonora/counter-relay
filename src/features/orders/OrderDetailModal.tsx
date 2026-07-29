'use client';

import React from 'react';
import { X, Printer, ShoppingBag, Calendar, User, DollarSign, CreditCard } from 'lucide-react';
import { OrderItemFull } from './types';

interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: OrderItemFull | null;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  isOpen,
  onClose,
  order,
}) => {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150 print:shadow-none print:border-none print:w-full print:max-w-none print:m-0">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-base">{order.receiptNumber}</h3>
              <p className="text-xs text-slate-500 font-mono">
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Receipt Content */}
        <div className="p-6 space-y-4 text-xs font-mono">
          <div className="space-y-1 pb-3 border-b border-dashed border-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-500">Customer:</span>
              <span className="font-bold text-slate-900">{order.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Cashier:</span>
              <span>{order.cashierName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Payment Channel:</span>
              <span className="uppercase font-semibold text-slate-900">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Payment Status:</span>
              <span className="uppercase font-bold text-emerald-700">{order.paymentStatus}</span>
            </div>
          </div>

          {/* Line items */}
          <div className="space-y-2 py-1">
            <div className="text-[11px] font-bold text-slate-400 uppercase">Items Purchased</div>
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center py-1 border-b border-slate-100">
                <div>
                  <div className="font-semibold text-slate-900">{item.productName}</div>
                  <div className="text-[10px] text-slate-400">{item.quantity} x ${item.price.toFixed(2)}</div>
                </div>
                <div className="font-bold text-slate-900">${item.subtotal.toFixed(2)}</div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="pt-2 border-t border-dashed border-slate-300 space-y-1 text-[11px]">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-slate-600">
                <span>Discount</span>
                <span>-${order.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span>Tax (10%)</span>
              <span>${order.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-sm text-slate-900 pt-1 border-t border-slate-200">
              <span>TOTAL</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-slate-100 bg-slate-50/50 print:hidden">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-200"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Receipt
          </button>
        </div>
      </div>
    </div>
  );
};
