'use client';

import React from 'react';
import { X, User, Phone, Mail, MapPin, Award, ShoppingBag, DollarSign, Calendar, Clock } from 'lucide-react';
import { CustomerItem } from './types';

interface CustomerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: CustomerItem | null;
}

export const CustomerDetailModal: React.FC<CustomerDetailModalProps> = ({
  isOpen,
  onClose,
  customer,
}) => {
  if (!isOpen || !customer) return null;

  const tierColor = 
    customer.tier === 'VIP' ? 'bg-purple-100 text-purple-800 border-purple-200' :
    customer.tier === 'Gold' ? 'bg-amber-100 text-amber-800 border-amber-200' :
    customer.tier === 'Silver' ? 'bg-slate-200 text-slate-800 border-slate-300' :
    'bg-slate-100 text-slate-700 border-slate-200';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold">
              {customer.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-slate-900 text-base">{customer.name}</h3>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold border ${tierColor}`}>
                  {customer.tier} Tier
                </span>
              </div>
              <p className="text-xs font-mono text-slate-500">{customer.email || customer.phone || 'Customer Profile'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {/* Key Metric Stats Grid */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
              <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Lifetime Spend</div>
              <div className="text-base font-bold font-mono text-emerald-700 mt-1">
                ${customer.totalSpend.toFixed(2)}
              </div>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
              <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Total Orders</div>
              <div className="text-base font-bold font-mono text-slate-900 mt-1">
                {customer.totalOrders} Orders
              </div>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
              <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Reward Points</div>
              <div className="text-base font-bold font-mono text-amber-700 mt-1 flex items-center justify-center gap-1">
                <Award className="w-4 h-4 text-amber-500" />
                {customer.loyaltyPoints} pts
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-2.5 text-xs">
            {customer.phone && (
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100 font-mono">
                <span className="text-slate-500 flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" /> Phone:
                </span>
                <span className="font-semibold text-slate-900">{customer.phone}</span>
              </div>
            )}

            {customer.email && (
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100 font-mono">
                <span className="text-slate-500 flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" /> Email:
                </span>
                <span className="font-semibold text-slate-900">{customer.email}</span>
              </div>
            )}

            {customer.address && (
              <div className="py-2 border-b border-slate-100">
                <span className="text-slate-500 flex items-center gap-2 font-mono text-[10px] uppercase">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" /> Address:
                </span>
                <p className="text-slate-800 mt-1">{customer.address}</p>
              </div>
            )}

            {customer.notes && (
              <div className="py-2">
                <span className="text-slate-500 font-mono text-[10px] uppercase">Customer Notes:</span>
                <p className="text-slate-700 italic mt-1">{customer.notes}</p>
              </div>
            )}
          </div>

          {/* Audit Fields */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" /> Member since: {new Date(customer.createdAt).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" /> Updated: {new Date(customer.updatedAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-3.5 border-t border-slate-100 bg-slate-50/50">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
