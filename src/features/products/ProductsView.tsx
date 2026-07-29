'use client';

import React, { useState, useTransition } from 'react';
import { 
  Plus, 
  Search, 
  Package, 
  Edit2, 
  Trash2, 
  Eye, 
  Loader2, 
  AlertCircle, 
  CheckCircle2, 
  XCircle,
  Filter
} from 'lucide-react';
import { ProductItem } from './types';
import { CategoryItem } from '@/features/categories/types';
import { ProductFormModal } from './ProductFormModal';
import { ProductDetailModal } from './ProductDetailModal';
import { createProductAction, updateProductAction, toggleProductActiveAction, deleteProductAction } from './actions';

import { UserRole } from '@/lib/auth/roles';
import { canManageProducts } from '@/lib/auth/permissions';

interface ProductsViewProps {
  initialProducts: ProductItem[];
  categories: CategoryItem[];
  userRole?: UserRole;
}

export const ProductsView: React.FC<ProductsViewProps> = ({
  initialProducts,
  categories,
  userRole = 'owner',
}) => {
  const isWritable = canManageProducts(userRole);
  const [productsList, setProductsList] = useState<ProductItem[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [inspectingProduct, setInspectingProduct] = useState<ProductItem | null>(null);

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const filteredProducts = productsList.filter((prod) => {
    // Search matching
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      prod.name.toLowerCase().includes(query) ||
      prod.sku.toLowerCase().includes(query) ||
      (prod.barcode && prod.barcode.toLowerCase().includes(query));

    // Category matching
    const matchesCategory = selectedCategoryFilter === 'all' || prod.categoryId === selectedCategoryFilter;

    // Active status matching
    const matchesActive = 
      activeFilter === 'all' || 
      (activeFilter === 'active' && prod.isActive) || 
      (activeFilter === 'inactive' && !prod.isActive);

    return matchesSearch && matchesCategory && matchesActive;
  });

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (product: ProductItem) => {
    setEditingProduct(product);
    setIsFormModalOpen(true);
  };

  const handleInspectProduct = (product: ProductItem) => {
    setInspectingProduct(product);
    setIsDetailModalOpen(true);
  };

  const handleSubmitForm = async (data: any) => {
    setErrorMessage(null);
    startTransition(async () => {
      if (data.id) {
        // Edit Action
        const res = await updateProductAction(data);
        if (res.success && res.data) {
          setProductsList((prev) =>
            prev.map((p) => (p.id === data.id ? { ...p, ...res.data } : p))
          );
        } else {
          setErrorMessage(res.error || 'Failed to update product.');
        }
      } else {
        // Create Action
        const res = await createProductAction(data);
        if (res.success && res.data) {
          setProductsList((prev) => [res.data, ...prev]);
        } else {
          setErrorMessage(res.error || 'Failed to create product.');
        }
      }
    });
  };

  const handleToggleActive = async (product: ProductItem) => {
    const newStatus = !product.isActive;
    setErrorMessage(null);
    startTransition(async () => {
      const res = await toggleProductActiveAction(product.id, newStatus);
      if (res.success) {
        setProductsList((prev) =>
          prev.map((p) => (p.id === product.id ? { ...p, isActive: newStatus } : p))
        );
      } else {
        setErrorMessage(res.error || 'Failed to update active status.');
      }
    });
  };

  const handleDeleteSoft = async (id: string) => {
    if (!confirm('Are you sure you want to deactivate (soft-delete) this product?')) return;
    setDeletingId(id);
    setErrorMessage(null);
    startTransition(async () => {
      const res = await deleteProductAction(id);
      if (res.success) {
        setProductsList((prev) =>
          prev.map((p) => (p.id === id ? { ...p, isActive: false } : p))
        );
      } else {
        setErrorMessage(res.error || 'Failed to deactivate product.');
      }
      setDeletingId(null);
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center shadow-xs">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">Products Catalog</h1>
            <p className="text-xs text-slate-500">Manage merchandise inventory, pricing & SKUs</p>
          </div>
        </div>

        {isWritable && (
          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-all"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
        )}
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Table Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        {/* Filters Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Name, SKU, Barcode..."
                className="w-full pl-9 pr-3.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all placeholder:text-slate-400"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* Active Filter Pill Buttons */}
            <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs font-medium">
              {(['all', 'active', 'inactive'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-3 py-1 rounded-md capitalize transition-all ${
                    activeFilter === filter
                      ? 'bg-white text-slate-900 shadow-xs font-semibold'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="text-xs font-mono text-slate-500">
            Total Products: <span className="font-bold text-slate-900">{filteredProducts.length}</span>
          </div>
        </div>

        {/* Product Table */}
        {filteredProducts.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
              <Package className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900">No products found</h3>
            <p className="text-xs text-slate-500 max-w-xs mt-1">
              {searchQuery || selectedCategoryFilter !== 'all'
                ? 'Try adjusting your search or category filter.'
                : 'Create your first product item to get started.'}
            </p>
            {!searchQuery && selectedCategoryFilter === 'all' && (
              <button
                onClick={handleOpenAddModal}
                className="mt-4 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-all"
              >
                Add Product Now
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] font-mono uppercase tracking-wider text-slate-400">
                  <th className="pb-3 font-medium">Product Item</th>
                  <th className="pb-3 font-medium">Category</th>
                  <th className="pb-3 font-medium text-right">Cost</th>
                  <th className="pb-3 font-medium text-right">Selling Price</th>
                  <th className="pb-3 font-medium text-center">Stock</th>
                  <th className="pb-3 font-medium text-center">Status</th>
                  <th className="pb-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 pr-4">
                      <div className="flex items-center gap-3">
                        {p.imageUrl ? (
                          <img
                            src={p.imageUrl}
                            alt={p.name}
                            className="w-9 h-9 rounded-lg object-cover border border-slate-200 shrink-0"
                            onError={(e) => {
                              // Fallback on image load error
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center font-mono text-[10px] text-slate-500 shrink-0">
                            {p.sku.slice(-3)}
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-slate-900">{p.name}</div>
                          <div className="text-[11px] font-mono text-slate-500">{p.sku}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 pr-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-[11px] border border-slate-200">
                        {p.categoryName || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="py-3.5 pr-4 text-right font-mono text-slate-500">
                      ${p.purchasePrice.toFixed(2)}
                    </td>
                    <td className="py-3.5 pr-4 text-right font-mono font-bold text-slate-900">
                      ${p.sellingPrice.toFixed(2)}
                    </td>
                    <td className="py-3.5 pr-4 text-center">
                      <div className="font-mono font-bold text-slate-900">{p.stock} units</div>
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full mx-auto mt-1 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            p.stock <= p.minimumStock ? 'bg-red-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min(100, (p.stock / Math.max(1, p.minimumStock * 2)) * 100)}%` }}
                        />
                      </div>
                    </td>
                    <td className="py-3.5 pr-4 text-center">
                      <button
                        onClick={() => handleToggleActive(p)}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-mono text-[10px] uppercase font-semibold border transition-all ${
                          p.isActive
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                        }`}
                        title="Click to toggle status"
                      >
                        {p.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleInspectProduct(p)}
                          className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Inspect Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {isWritable && (
                          <>
                            <button
                              onClick={() => handleOpenEditModal(p)}
                              className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteSoft(p.id)}
                              disabled={deletingId === p.id}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                              title="Soft Delete / Deactivate"
                            >
                              {deletingId === p.id ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Trash2 className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Form Modal */}
      <ProductFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleSubmitForm}
        initialData={editingProduct}
        categories={categories}
        isLoading={isPending}
      />

      {/* Detail Inspector Modal */}
      <ProductDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        product={inspectingProduct}
      />
    </div>
  );
};
