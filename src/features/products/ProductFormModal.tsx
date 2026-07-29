'use client';

import React, { useState, useEffect } from 'react';
import { X, Loader2, Package, DollarSign, Barcode, Image as ImageIcon, Upload } from 'lucide-react';
import { ProductItem } from './types';
import { CategoryItem } from '@/features/categories/types';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  initialData?: ProductItem | null;
  categories: CategoryItem[];
  isLoading?: boolean;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  categories,
  isLoading = false,
}) => {
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [barcode, setBarcode] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [purchasePrice, setPurchasePrice] = useState<number | ''>('');
  const [sellingPrice, setSellingPrice] = useState<number | ''>('');
  const [stock, setStock] = useState<number | ''>('');
  const [minimumStock, setMinimumStock] = useState<number | ''>(5);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingImage(true);
      setError(null);
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.url) {
        setImageUrl(data.url);
      } else {
        setError(data.error || 'Failed to upload image');
      }
    } catch (err: any) {
      setError(err?.message || 'Error uploading image file');
    } finally {
      setIsUploadingImage(false);
    }
  };

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setSku(initialData.sku || '');
      setBarcode(initialData.barcode || '');
      setCategoryId(initialData.categoryId || '');
      setPurchasePrice(initialData.purchasePrice ?? '');
      setSellingPrice(initialData.sellingPrice ?? '');
      setStock(initialData.stock ?? '');
      setMinimumStock(initialData.minimumStock ?? 5);
      setDescription(initialData.description || '');
      setImageUrl(initialData.imageUrl || '');
      setIsActive(initialData.isActive ?? true);
    } else {
      setName('');
      setSku(`SKU-${Math.floor(100000 + Math.random() * 900000)}`);
      setBarcode('');
      setCategoryId('');
      setPurchasePrice('');
      setSellingPrice('');
      setStock(10);
      setMinimumStock(5);
      setDescription('');
      setImageUrl('');
      setIsActive(true);
    }
    setError(null);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Product name is required.');
      return;
    }
    if (!sku.trim()) {
      setError('SKU is required.');
      return;
    }
    if (purchasePrice === '' || Number(purchasePrice) < 0) {
      setError('Valid purchase price is required.');
      return;
    }
    if (sellingPrice === '' || Number(sellingPrice) < 0) {
      setError('Valid selling price is required.');
      return;
    }

    try {
      setError(null);
      await onSubmit({
        id: initialData?.id,
        name: name.trim(),
        sku: sku.trim(),
        barcode: barcode.trim() || undefined,
        categoryId: categoryId || undefined,
        purchasePrice: Number(purchasePrice),
        sellingPrice: Number(sellingPrice),
        stock: Number(stock || 0),
        minimumStock: Number(minimumStock || 0),
        description: description.trim() || undefined,
        imageUrl: imageUrl.trim() || undefined,
        isActive,
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || 'An error occurred while saving.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-2xl my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-base">
                {initialData ? 'Edit Product' : 'Add New Product'}
              </h3>
              <p className="text-xs text-slate-500">Configure item details, pricing & inventory</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
              {error}
            </div>
          )}

          {/* Grid 1: Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Product Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Wireless Ergonomic Mouse"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all placeholder:text-slate-400"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-600 mb-1">
                SKU *
              </label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="e.g. SKU-100291"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Barcode
              </label>
              <div className="relative">
                <Barcode className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  placeholder="e.g. 88019283741"
                  className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Category
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all"
              >
                <option value="">Uncategorized</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Grid 2: Pricing & Stock */}
          <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Purchase Price ($) *
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="0.00"
                  className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Selling Price ($) *
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="0.00"
                  className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Initial Stock *
              </label>
              <input
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="10"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Minimum Stock Alert *
              </label>
              <input
                type="number"
                min="0"
                value={minimumStock}
                onChange={(e) => setMinimumStock(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="5"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Additional info */}
          <div className="pt-2 border-t border-slate-100 space-y-4">
            <div>
              <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Product Image (Upload File or Enter URL)
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <ImageIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Paste image URL (https://...) or upload file"
                    className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all placeholder:text-slate-400"
                  />
                </div>
                <label className="flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold cursor-pointer transition-all shrink-0">
                  {isUploadingImage ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload File</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={isUploadingImage}
                  />
                </label>
              </div>

              {/* Preview image if available */}
              {imageUrl && (
                <div className="mt-2.5 flex items-center gap-3 p-2 bg-slate-50 border border-slate-200 rounded-lg">
                  <img src={imageUrl} alt="Preview" className="w-12 h-12 rounded object-cover border border-slate-200" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-slate-900 truncate">{imageUrl}</div>
                    <div className="text-[10px] text-emerald-600 font-mono">Image attached ready for save</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setImageUrl('')}
                    className="text-xs text-slate-400 hover:text-red-600 px-2 py-1"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Description (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Product specifications and features..."
                rows={2}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all placeholder:text-slate-400 resize-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActiveToggle"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
              />
              <label htmlFor="isActiveToggle" className="text-xs font-medium text-slate-700 cursor-pointer">
                Product is Active & Available for Sale
              </label>
            </div>
          </div>

          {/* Footer Actions */}
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
              disabled={isLoading}
              className="flex items-center gap-2 px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
            >
              {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {initialData ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
