'use client';

import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  User, 
  UserPlus, 
  X, 
  ArrowRight, 
  Tag, 
  Percent 
} from 'lucide-react';
import { CartItem } from './types';
import { CustomerItem } from '@/features/customers/types';

interface CartProps {
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  selectedCustomer: CustomerItem | null;
  onSelectCustomer: (customer: CustomerItem | null) => void;
  customers: CustomerItem[];
  onOpenCheckout: () => void;
}

export const Cart: React.FC<CartProps> = ({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  selectedCustomer,
  onSelectCustomer,
  customers,
  onOpenCheckout,
}) => {
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [customerSearch, setCustomerSearch] = useState('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);

  const subtotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = taxableAmount * 0.1; // 10% tax
  const grandTotal = taxableAmount + taxAmount;

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
      (c.phone && c.phone.includes(customerSearch))
  );

  return (
    <div className="w-full lg:w-96 bg-white border border-slate-200 rounded-xl shadow-xs flex flex-col h-full overflow-hidden shrink-0">
      {/* Cart Top Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-slate-900" />
          <h2 className="font-semibold text-slate-900 text-sm">Current Order Cart</h2>
          <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-800 text-[10px] font-mono font-bold">
            {cartItems.length}
          </span>
        </div>
        {cartItems.length > 0 && (
          <button
            onClick={onClearCart}
            className="text-xs text-slate-400 hover:text-red-600 flex items-center gap-1 transition-colors font-mono"
          >
            <Trash2 className="w-3 h-3" /> Clear
          </button>
        )}
      </div>

      {/* Customer Attachment Bar */}
      <div className="p-3 border-b border-slate-100 bg-slate-50/30">
        {selectedCustomer ? (
          <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50 border border-emerald-200">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-md bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0 font-mono">
                {selectedCustomer.name.substring(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-slate-900 truncate">{selectedCustomer.name}</div>
                <div className="text-[10px] font-mono text-emerald-700">{selectedCustomer.tier} • {selectedCustomer.loyaltyPoints} pts</div>
              </div>
            </div>
            <button
              onClick={() => onSelectCustomer(null)}
              className="text-slate-400 hover:text-slate-600 p-1"
              title="Remove customer attachment"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsCustomerModalOpen(true)}
            className="w-full flex items-center justify-between p-2 rounded-lg border border-dashed border-slate-300 hover:border-slate-400 hover:bg-white text-slate-600 text-xs font-medium transition-all"
          >
            <span className="flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-slate-400" /> Attach Customer / Member
            </span>
            <span className="text-[10px] font-mono text-slate-400">Optional</span>
          </button>
        )}
      </div>

      {/* Items Scroll List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 min-h-[140px] max-h-[320px]">
        {cartItems.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center py-8 text-slate-400">
            <ShoppingBag className="w-8 h-8 stroke-1 mb-2" />
            <p className="text-xs font-medium text-slate-500">Cart is empty</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Click products from the catalog to add to order</p>
          </div>
        ) : (
          cartItems.map((item) => (
            <div
              key={item.product.id}
              className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 hover:border-slate-200 bg-slate-50/50 transition-all"
            >
              <div className="min-w-0 flex-1 pr-2">
                <div className="text-xs font-semibold text-slate-900 truncate">{item.product.name}</div>
                <div className="text-[10px] font-mono text-slate-500">
                  ${item.product.sellingPrice.toFixed(2)} / unit
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {/* Quantity Buttons */}
                <div className="flex items-center border border-slate-200 rounded-md bg-white overflow-hidden shadow-xs">
                  <button
                    onClick={() => onUpdateQuantity(item.product.id, -1)}
                    className="p-1 hover:bg-slate-100 text-slate-600 transition-colors"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="px-2 text-xs font-mono font-bold text-slate-900">{item.quantity}</span>
                  <button
                    onClick={() => onUpdateQuantity(item.product.id, 1)}
                    className="p-1 hover:bg-slate-100 text-slate-600 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                <div className="text-right min-w-[50px]">
                  <div className="text-xs font-mono font-bold text-slate-900">${item.subtotal.toFixed(2)}</div>
                </div>

                <button
                  onClick={() => onRemoveItem(item.product.id)}
                  className="text-slate-300 hover:text-red-600 p-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Cart Summary & Checkout Footer */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-3 shrink-0">
        {/* Quick Discount Selector */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500 font-mono text-[11px] uppercase">Order Discount:</span>
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded px-1.5 py-0.5">
            {[0, 5, 10, 15].map((pct) => (
              <button
                key={pct}
                onClick={() => setDiscountPercent(pct)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                  discountPercent === pct ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {pct}%
              </button>
            ))}
          </div>
        </div>

        {/* Calculation Table */}
        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between text-slate-500">
            <span>Subtotal</span>
            <span className="font-mono">${subtotal.toFixed(2)}</span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between text-emerald-600 font-medium">
              <span>Discount ({discountPercent}%)</span>
              <span className="font-mono">-${discountAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-slate-500">
            <span>Tax (10%)</span>
            <span className="font-mono">${taxAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-sm text-slate-900 pt-2 border-t border-slate-200">
            <span>TOTAL</span>
            <span className="font-mono">${grandTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Checkout Button */}
        <button
          onClick={onOpenCheckout}
          disabled={cartItems.length === 0}
          className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold text-xs shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>Pay & Checkout</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Customer Selection Modal */}
      {isCustomerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
              <h3 className="font-semibold text-slate-900 text-xs">Select Customer / Member</h3>
              <button onClick={() => setIsCustomerModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-3">
              <input
                type="text"
                value={customerSearch}
                onChange={(e) => setCustomerSearch(e.target.value)}
                placeholder="Search name or phone..."
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                autoFocus
              />

              <div className="max-h-56 overflow-y-auto space-y-1.5">
                {filteredCustomers.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => {
                      onSelectCustomer(c);
                      setIsCustomerModalOpen(false);
                    }}
                    className="p-2.5 rounded-lg border border-slate-100 hover:border-slate-300 hover:bg-slate-50 cursor-pointer flex items-center justify-between text-xs transition-colors"
                  >
                    <div>
                      <div className="font-semibold text-slate-900">{c.name}</div>
                      <div className="text-[10px] font-mono text-slate-500">{c.phone || c.email}</div>
                    </div>
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-100 font-semibold">
                      {c.tier}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
