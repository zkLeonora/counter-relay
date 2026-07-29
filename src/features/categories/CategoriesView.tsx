'use client';

import React, { useState, useTransition } from 'react';
import { 
  Plus, 
  Search, 
  Tag, 
  Edit2, 
  Trash2, 
  FolderKanban, 
  Loader2, 
  AlertCircle 
} from 'lucide-react';
import { CategoryItem } from './types';
import { CategoryFormModal } from './CategoryFormModal';
import { createCategoryAction, updateCategoryAction, deleteCategoryAction } from './actions';

interface CategoriesViewProps {
  initialCategories: CategoryItem[];
}

export const CategoriesView: React.FC<CategoriesViewProps> = ({
  initialCategories,
}) => {
  const [categoriesList, setCategoriesList] = useState<CategoryItem[]>(initialCategories);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const filteredCategories = categoriesList.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (cat.description && cat.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleOpenAddModal = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (category: CategoryItem) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleSubmitForm = async (data: { id?: string; name: string; description?: string }) => {
    setErrorMessage(null);
    startTransition(async () => {
      if (data.id) {
        // Edit action
        const res = await updateCategoryAction({ id: data.id, name: data.name, description: data.description });
        if (res.success && res.data) {
          setCategoriesList((prev) =>
            prev.map((c) => (c.id === data.id ? { ...c, name: res.data.name, description: res.data.description } : c))
          );
        } else {
          setErrorMessage(res.error || 'Failed to update category.');
        }
      } else {
        // Create action
        const res = await createCategoryAction({ name: data.name, description: data.description });
        if (res.success && res.data) {
          setCategoriesList((prev) => [res.data, ...prev]);
        } else {
          setErrorMessage(res.error || 'Failed to create category.');
        }
      }
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    setDeletingId(id);
    setErrorMessage(null);
    startTransition(async () => {
      const res = await deleteCategoryAction(id);
      if (res.success) {
        setCategoriesList((prev) => prev.filter((c) => c.id !== id));
      } else {
        setErrorMessage(res.error || 'Failed to delete category.');
      }
      setDeletingId(null);
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Top Bar Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center shadow-xs">
            <FolderKanban className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">Categories Management</h1>
            <p className="text-xs text-slate-500">Group and classify your product inventory</p>
          </div>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Table Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        {/* Search & Stats Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search categories..."
              className="w-full pl-9 pr-3.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all placeholder:text-slate-400"
            />
          </div>

          <div className="text-xs font-mono text-slate-500">
            Total Categories: <span className="font-bold text-slate-900">{categoriesList.length}</span>
          </div>
        </div>

        {/* Table Content */}
        {filteredCategories.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
              <Tag className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900">No categories found</h3>
            <p className="text-xs text-slate-500 max-w-xs mt-1">
              {searchQuery ? 'Try adjusting your search query.' : 'Get started by creating your first product category.'}
            </p>
            {!searchQuery && (
              <button
                onClick={handleOpenAddModal}
                className="mt-4 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-all"
              >
                Add Category Now
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] font-mono uppercase tracking-wider text-slate-400">
                  <th className="pb-3 font-medium">Category Name</th>
                  <th className="pb-3 font-medium">Description</th>
                  <th className="pb-3 font-medium text-center">Products</th>
                  <th className="pb-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredCategories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold shrink-0">
                          <Tag className="w-3.5 h-3.5" />
                        </div>
                        <div className="font-semibold text-slate-900">{cat.name}</div>
                      </div>
                    </td>
                    <td className="py-3.5 pr-4 text-slate-500 max-w-sm truncate">
                      {cat.description || <span className="italic text-slate-300">No description</span>}
                    </td>
                    <td className="py-3.5 pr-4 text-center font-mono">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-[11px] border border-slate-200">
                        {cat.productCount ?? 0} Items
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEditModal(cat)}
                          className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id)}
                          disabled={deletingId === cat.id}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Delete"
                        >
                          {deletingId === cat.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                        </button>
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
      <CategoryFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitForm}
        initialData={selectedCategory}
        isLoading={isPending}
      />
    </div>
  );
};
