'use client';

import React from 'react';
import { X, Package, Tag, Barcode, DollarSign, Layers, CheckCircle2, XCircle } from 'lucide-react';
import { ProductItem } from './types';

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductItem | null;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  isOpen,
  onClose,
  product,
}) => {
  if (!isOpen || !product) return null;

  const margin = product.sellingPrice - product.purchasePrice;
  const marginPercent = product.sellingPrice > 0 ? (margin / product.sellingPrice) * 100 : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.name} className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0" />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold shrink-0">
                <Package className="w-5 h-5" />
              </div>
            )}
            <div>
              <h3 className="font-semibold text-slate-900 text-base">{product.name}</h3>
              <p className="text-xs font-mono text-slate-500">{product.sku}</p>
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
          {/* Status Bar */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2">
              {product.isActive ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <XCircle className="w-4 h-4 text-slate-400" />
              )}
              <span className="text-xs font-semibold text-slate-900">
                {product.isActive ? 'Active & Available in POS' : 'Inactive / Soft Deleted'}
              </span>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
              Category: {product.categoryName || 'Uncategorized'}
            </span>
          </div>

          {/* Grid Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3.5 rounded-lg border border-slate-200 bg-white">
              <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Purchase Price</div>
              <div className="text-lg font-bold font-mono text-slate-900 mt-1">${product.purchasePrice.toFixed(2)}</div>
            </div>

            <div className="p-3.5 rounded-lg border border-slate-200 bg-white">
              <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Selling Price</div>
              <div className="text-lg font-bold font-mono text-emerald-700 mt-1">${product.sellingPrice.toFixed(2)}</div>
            </div>

            <div className="p-3.5 rounded-lg border border-slate-200 bg-white">
              <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Profit Margin</div>
              <div className="text-base font-bold font-mono text-slate-900 mt-1">
                ${margin.toFixed(2)} <span className="text-xs font-normal text-emerald-600">({marginPercent.toFixed(1)}%)</span>
              </div>
            </div>

            <div className="p-3.5 rounded-lg border border-slate-200 bg-white">
              <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Stock Level</div>
              <div className="text-base font-bold font-mono text-slate-900 mt-1">
                {product.stock} units <span className="text-xs font-normal text-slate-500">(Min: {product.minimumStock})</span>
              </div>
            </div>
          </div>

          {/* Identification Details */}
          <div className="space-y-2 text-xs">
            {product.barcode && (
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100 font-mono">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Barcode className="w-3.5 h-3.5 text-slate-400" /> Barcode:
                </span>
                <span className="font-semibold text-slate-900">{product.barcode}</span>
              </div>
            )}
            {product.description && (
              <div className="pt-2">
                <div className="text-slate-500 font-mono text-[10px] uppercase">Description</div>
                <p className="text-slate-700 mt-1 leading-relaxed">{product.description}</p>
              </div>
            )}
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
