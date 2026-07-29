'use client';

import React from 'react';
import { X, Printer, CheckCircle, Store, User, CreditCard, Banknote, Calendar } from 'lucide-react';
import { CompletedOrderReceipt } from './types';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  receipt: CompletedOrderReceipt | null;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  isOpen,
  onClose,
  receipt,
}) => {
  if (!isOpen || !receipt) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-150 print:shadow-none print:border-none print:w-full print:max-w-none print:m-0">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50/50 print:hidden">
          <div className="flex items-center gap-2 text-emerald-700 font-semibold text-xs">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            Transaction Successful
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Receipt Body */}
        <div className="p-6 font-mono text-xs space-y-4 text-slate-800" id="printable-receipt">
          {/* Header */}
          <div className="text-center space-y-1 pb-3 border-b border-dashed border-slate-300">
            <div className="font-bold text-sm text-slate-900 uppercase tracking-wide">{receipt.storeName}</div>
            <div className="text-[10px] text-slate-500">SoHo Flagship Store • Register 01</div>
            <div className="text-[10px] text-slate-500 flex items-center justify-center gap-1 mt-1">
              <Calendar className="w-3 h-3 text-slate-400" />
              {new Date(receipt.createdAt).toLocaleString()}
            </div>
          </div>

          {/* Transaction Metadata */}
          <div className="space-y-1 text-[11px] pb-3 border-b border-dashed border-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-500">Receipt #:</span>
              <span className="font-bold text-slate-900">{receipt.receiptNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Cashier:</span>
              <span>{receipt.cashierName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Customer:</span>
              <span className="font-medium text-slate-900">{receipt.customerName || 'Walk-in Customer'}</span>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="space-y-2 py-1">
            {receipt.items.map((item, idx) => (
              <div key={idx} className="space-y-0.5">
                <div className="flex justify-between font-semibold text-slate-900">
                  <span>{item.name}</span>
                  <span>${item.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>{item.quantity} x ${item.price.toFixed(2)}</span>
                  <span>SKU: {item.sku}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Totals Breakdown */}
          <div className="pt-3 border-t border-dashed border-slate-300 space-y-1 text-[11px]">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span>${receipt.subtotal.toFixed(2)}</span>
            </div>
            {receipt.discount > 0 && (
              <div className="flex justify-between text-slate-600">
                <span>Discount</span>
                <span>-${receipt.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span>Tax (10%)</span>
              <span>${receipt.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-sm text-slate-900 pt-1 border-t border-slate-200">
              <span>GRAND TOTAL</span>
              <span>${receipt.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Detail */}
          <div className="pt-3 border-t border-dashed border-slate-300 space-y-1 text-[11px]">
            <div className="flex justify-between text-slate-700 uppercase font-semibold">
              <span>Method</span>
              <span>{receipt.paymentMethod}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Amount Paid</span>
              <span>${receipt.amountPaid.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-slate-900">
              <span>Change</span>
              <span>${receipt.change.toFixed(2)}</span>
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-center pt-4 border-t border-dashed border-slate-300 text-[10px] text-slate-500">
            Thank you for shopping with us!
            <br />
            Please retain this receipt for returns.
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="flex items-center justify-between p-4 border-t border-slate-100 bg-slate-50/50 print:hidden">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
          >
            Close & Next Order
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Receipt
          </button>
        </div>
      </div>
    </div>
  );
};
