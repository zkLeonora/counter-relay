'use client';

import React, { useState } from 'react';
import { Product } from '@/lib/types';
import { useLanguage } from '@/lib/utils/i18n';
import { 
  Search, 
  Plus, 
  Barcode
} from 'lucide-react';

interface ProductsViewProps {
  products: Product[];
}

export const ProductsView: React.FC<ProductsViewProps> = ({ products }) => {
  const { t } = useLanguage();
  const [search, setSearch] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const categories = ['All', 'Apparel', 'Footwear', 'Accessories', 'Bags', 'Lifestyle'];

  const getCategoryLabel = (cat: string) => {
    switch(cat) {
      case 'All': return t('all');
      case 'Apparel': return t('apparel');
      case 'Footwear': return t('footwear');
      case 'Accessories': return t('accessories');
      case 'Bags': return t('bags');
      case 'Lifestyle': return t('lifestyle');
      default: return cat;
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesCat = categoryFilter === 'All' || p.category === categoryFilter;
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                          p.sku.toLowerCase().includes(search.toLowerCase()) ||
                          p.barcode.includes(search);
    return matchesCat && matchesSearch;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Control Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div>
          <h2 className="text-base font-semibold text-slate-900">{t('catalogTitle')}</h2>
          <p className="text-xs text-slate-500 mt-0.5">{t('catalogSubtext')}</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('searchSKUPlaceholder')}
              className="w-full bg-slate-50 border border-slate-200 rounded-md pl-9 pr-4 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>

          <div className="flex bg-slate-100 p-0.5 rounded-md text-xs font-medium">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1 rounded-sm capitalize transition-all ${
                  categoryFilter === cat
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {getCategoryLabel(cat)}
              </button>
            ))}
          </div>

          <button 
            onClick={() => alert('Add Product SKU modal would open here')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded text-xs font-medium hover:bg-slate-800 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            {t('newSKU')}
          </button>
        </div>
      </div>

      {/* Catalog Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-[11px] font-mono uppercase tracking-wider text-slate-400 bg-slate-50/50">
              <th className="py-3 px-4 font-medium">{t('skuItem')}</th>
              <th className="py-3 px-4 font-medium">{t('category')}</th>
              <th className="py-3 px-4 font-medium">{t('binCode')}</th>
              <th className="py-3 px-4 font-medium text-right">{t('cost')}</th>
              <th className="py-3 px-4 font-medium text-right">{t('sellingPrice')}</th>
              <th className="py-3 px-4 font-medium text-right">{t('grossMargin')}</th>
              <th className="py-3 px-4 font-medium text-center">{t('stock')}</th>
              <th className="py-3 px-4 font-medium text-center">{t('barcode')}</th>
              <th className="py-3 px-4 font-medium text-right">{t('action')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {filteredProducts.map(prod => (
              <tr key={prod.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-html-key */}
                    <img 
                      src={prod.imageUrl} 
                      alt={prod.name} 
                      className="w-9 h-9 rounded object-cover border border-slate-200 shrink-0" 
                    />
                    <div>
                      <div className="font-semibold text-slate-900">{prod.name}</div>
                      <div className="text-[11px] font-mono text-slate-400">{prod.sku}</div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 font-medium text-slate-700">
                  {getCategoryLabel(prod.category)}
                </td>
                <td className="py-3 px-4 font-mono text-slate-600">
                  {prod.binLocation}
                </td>
                <td className="py-3 px-4 text-right font-mono text-slate-500">
                  ${prod.costPrice.toFixed(2)}
                </td>
                <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                  ${prod.sellingPrice.toFixed(2)}
                </td>
                <td className="py-3 px-4 text-right font-mono text-emerald-700 font-semibold">
                  {prod.marginPercent}%
                </td>
                <td className="py-3 px-4 text-center">
                  <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded border ${
                    prod.stock <= prod.reorderThreshold 
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-slate-100 text-slate-800 border-slate-200'
                  }`}>
                    {prod.stock} {t('units')}
                  </span>
                </td>
                <td className="py-3 px-4 text-center font-mono text-[11px] text-slate-500">
                  <div className="flex items-center justify-center gap-1">
                    <Barcode className="w-3.5 h-3.5 text-slate-400" />
                    <span>{prod.barcode}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-right">
                  <button 
                    onClick={() => setSelectedProduct(prod)}
                    className="px-2.5 py-1 border border-slate-300 rounded hover:bg-slate-900 hover:text-white transition-all text-[11px]"
                  >
                    {t('details')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg border border-slate-200 max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">{selectedProduct.name}</h3>
                <p className="text-xs font-mono text-slate-500">{selectedProduct.sku}</p>
              </div>
              <button 
                onClick={() => setSelectedProduct(null)}
                className="text-slate-400 hover:text-slate-600 font-mono text-xs"
              >
                {t('close')}
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Barcode EAN-13:</span>
                <span className="font-bold text-slate-900">{selectedProduct.barcode}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">{t('supplier')}:</span>
                <span className="text-slate-900">{selectedProduct.supplier}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">{t('costVsSelling')}:</span>
                <span className="text-slate-900">${selectedProduct.costPrice.toFixed(2)} / ${selectedProduct.sellingPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">{t('grossMargin')}:</span>
                <span className="font-bold text-emerald-700">{selectedProduct.marginPercent}%</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">{t('binCode')}:</span>
                <span className="text-slate-900">{selectedProduct.binLocation}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedProduct(null)}
              className="w-full py-2 bg-slate-900 text-white rounded text-xs font-semibold hover:bg-slate-800"
            >
              {t('done')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
