'use client';

import React, { useState, useEffect } from 'react';
import { X, Loader2, DollarSign, CreditCard, Smartphone, Banknote, Check } from 'lucide-react';
import { CustomerItem } from '@/features/customers/types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitCheckout: (data: {
    paymentMethod: 'cash' | 'card' | 'transfer' | 'ewallet';
    amountPaid: number;
    change: number;
    notes?: string;
  }) => Promise<void>;
  grandTotal: number;
  selectedCustomer: CustomerItem | null;
  isLoading?: boolean;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onSubmitCheckout,
  grandTotal,
  selectedCustomer,
  isLoading = false,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'transfer' | 'ewallet'>('cash');
  const [amountPaidInput, setAmountPaidInput] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setPaymentMethod('cash');
      setAmountPaidInput(grandTotal > 0 ? grandTotal.toFixed(2) : '');
      setNotes('');
      setError(null);
    }
  }, [isOpen, grandTotal]);

  if (!isOpen) return null;

  const numericPaid = parseFloat(amountPaidInput) || 0;
  const change = Math.max(0, numericPaid - grandTotal);
  const isPaidSufficient = paymentMethod !== 'cash' || numericPaid >= grandTotal;

  const handleQuickDenom = (amount: number) => {
    setAmountPaidInput(amount.toFixed(2));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentMethod === 'cash' && numericPaid < grandTotal) {
      setError(`Amount paid ($${numericPaid.toFixed(2)}) is less than total ($${grandTotal.toFixed(2)}).`);
      return;
    }

    try {
      setError(null);
      await onSubmitCheckout({
        paymentMethod,
        amountPaid: paymentMethod === 'cash' ? numericPaid : grandTotal,
        change: paymentMethod === 'cash' ? change : 0,
        notes: notes.trim() || undefined,
      });
    } catch (err: any) {
      setError(err?.message || 'Payment checkout failed.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Complete Payment</h3>
            <p className="text-xs text-slate-500">
              Customer: <span className="font-semibold text-slate-900">{selectedCustomer?.name || 'Walk-in Customer'}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
              {error}
            </div>
          )}

          {/* Total Amount Display Box */}
          <div className="p-4 rounded-xl bg-slate-900 text-white flex items-center justify-between shadow-xs">
            <div>
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Total Due</span>
              <div className="text-2xl font-bold font-mono">${grandTotal.toFixed(2)}</div>
            </div>
            {selectedCustomer && (
              <div className="text-right">
                <span className="text-[10px] font-mono text-amber-400 uppercase">Loyalty Reward</span>
                <div className="text-xs font-mono text-amber-300">+{Math.floor(grandTotal / 10)} pts</div>
              </div>
            )}
          </div>

          {/* Payment Method Selector Grid */}
          <div>
            <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-600 mb-2">
              Select Payment Channel
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  { id: 'cash', label: 'Cash', icon: Banknote },
                  { id: 'card', label: 'Credit Card', icon: CreditCard },
                  { id: 'transfer', label: 'Bank Transfer', icon: DollarSign },
                  { id: 'ewallet', label: 'QRIS / E-Wallet', icon: Smartphone },
                ] as const
              ).map((method) => {
                const Icon = method.icon;
                const isSelected = paymentMethod === method.id;
                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => {
                      setPaymentMethod(method.id);
                      if (method.id !== 'cash') {
                        setAmountPaidInput(grandTotal.toFixed(2));
                      }
                    }}
                    className={`flex items-center gap-2.5 p-3 rounded-lg border text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{method.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cash Payment Specific Inputs & Quick Denominations */}
          {paymentMethod === 'cash' && (
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  Cash Received ($) *
                </label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={amountPaidInput}
                    onChange={(e) => setAmountPaidInput(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-base font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all"
                    autoFocus
                  />
                </div>
              </div>

              {/* Quick Cash Buttons */}
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => handleQuickDenom(grandTotal)}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded text-xs font-mono font-semibold text-slate-800"
                >
                  Exact (${grandTotal.toFixed(2)})
                </button>
                {[10, 20, 50, 100].map((denom) => (
                  <button
                    key={denom}
                    type="button"
                    onClick={() => handleQuickDenom(denom >= grandTotal ? denom : grandTotal + denom)}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded text-xs font-mono font-semibold text-slate-800"
                  >
                    ${denom}
                  </button>
                ))}
              </div>

              {/* Change Amount Box */}
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <span className="text-xs font-mono font-medium text-emerald-800 uppercase">Change Due</span>
                <span className="text-lg font-bold font-mono text-emerald-700">${change.toFixed(2)}</span>
              </div>
            </div>
          )}

          {/* Action Submit */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !isPaidSufficient}
              className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-md transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing Order...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Confirm & Charge ${grandTotal.toFixed(2)}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
