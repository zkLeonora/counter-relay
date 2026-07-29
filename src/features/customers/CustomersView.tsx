'use client';

import React, { useState, useTransition } from 'react';
import { 
  Plus, 
  Search, 
  Users, 
  Edit2, 
  Trash2, 
  Eye, 
  Loader2, 
  AlertCircle, 
  Award, 
  Phone, 
  Mail, 
  DollarSign, 
  ShoppingBag 
} from 'lucide-react';
import { CustomerItem } from './types';
import { CustomerFormModal } from './CustomerFormModal';
import { CustomerDetailModal } from './CustomerDetailModal';
import { createCustomerAction, updateCustomerAction, deleteCustomerAction } from './actions';

interface CustomersViewProps {
  initialCustomers: CustomerItem[];
}

export const CustomersView: React.FC<CustomersViewProps> = ({
  initialCustomers,
}) => {
  const [customersList, setCustomersList] = useState<CustomerItem[]>(initialCustomers);
  const [searchQuery, setSearchQuery] = useState('');

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<CustomerItem | null>(null);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [inspectingCustomer, setInspectingCustomer] = useState<CustomerItem | null>(null);

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const filteredCustomers = customersList.filter((cust) => {
    const query = searchQuery.toLowerCase();
    return (
      cust.name.toLowerCase().includes(query) ||
      (cust.phone && cust.phone.toLowerCase().includes(query)) ||
      (cust.email && cust.email.toLowerCase().includes(query))
    );
  });

  const totalStoreSpend = customersList.reduce((sum, c) => sum + c.totalSpend, 0);
  const vipCount = customersList.filter((c) => c.tier === 'VIP' || c.tier === 'Gold').length;

  const handleOpenAddModal = () => {
    setEditingCustomer(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (customer: CustomerItem) => {
    setEditingCustomer(customer);
    setIsFormModalOpen(true);
  };

  const handleInspectCustomer = (customer: CustomerItem) => {
    setInspectingCustomer(customer);
    setIsDetailModalOpen(true);
  };

  const handleSubmitForm = async (data: any) => {
    setErrorMessage(null);
    startTransition(async () => {
      if (data.id) {
        // Edit Action
        const res = await updateCustomerAction(data);
        if (res.success && res.data) {
          setCustomersList((prev) =>
            prev.map((c) => (c.id === data.id ? { ...c, ...res.data } : c))
          );
        } else {
          setErrorMessage(res.error || 'Failed to update customer.');
        }
      } else {
        // Create Action
        const res = await createCustomerAction(data);
        if (res.success && res.data) {
          setCustomersList((prev) => [res.data, ...prev]);
        } else {
          setErrorMessage(res.error || 'Failed to create customer.');
        }
      }
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this customer record?')) return;
    setDeletingId(id);
    setErrorMessage(null);
    startTransition(async () => {
      const res = await deleteCustomerAction(id);
      if (res.success) {
        setCustomersList((prev) => prev.filter((c) => c.id !== id));
      } else {
        setErrorMessage(res.error || 'Failed to delete customer.');
      }
      setDeletingId(null);
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center shadow-xs">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">Customers & Loyalty CRM</h1>
            <p className="text-xs text-slate-500">Track customer profiles, lifetime value & loyalty rewards</p>
          </div>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Customer
        </button>
      </div>

      {/* Top 3 Metric Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">Total Customers</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-3 text-2xl font-bold font-mono text-slate-900">{customersList.length}</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">VIP & Gold Members</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-3 text-2xl font-bold font-mono text-amber-700">{vipCount}</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">Total Customer Spend</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-3 text-2xl font-bold font-mono text-emerald-700">${totalStoreSpend.toFixed(2)}</div>
        </div>
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
        {/* Search Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Name, Phone, Email..."
              className="w-full pl-9 pr-3.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all placeholder:text-slate-400"
            />
          </div>

          <div className="text-xs font-mono text-slate-500">
            Total Results: <span className="font-bold text-slate-900">{filteredCustomers.length}</span>
          </div>
        </div>

        {/* Customer Table */}
        {filteredCustomers.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900">No customer records found</h3>
            <p className="text-xs text-slate-500 max-w-xs mt-1">
              {searchQuery ? 'Try adjusting your search query.' : 'Register your first customer to build loyalty data.'}
            </p>
            {!searchQuery && (
              <button
                onClick={handleOpenAddModal}
                className="mt-4 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-all"
              >
                Add Customer Now
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] font-mono uppercase tracking-wider text-slate-400">
                  <th className="pb-3 font-medium">Customer Profile</th>
                  <th className="pb-3 font-medium">Contact</th>
                  <th className="pb-3 font-medium text-center">Tier</th>
                  <th className="pb-3 font-medium text-center">Orders</th>
                  <th className="pb-3 font-medium text-right">Lifetime Spend</th>
                  <th className="pb-3 font-medium text-center">Loyalty Points</th>
                  <th className="pb-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredCustomers.map((cust) => {
                  const tierColor = 
                    cust.tier === 'VIP' ? 'bg-purple-100 text-purple-800 border-purple-200' :
                    cust.tier === 'Gold' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                    cust.tier === 'Silver' ? 'bg-slate-200 text-slate-800 border-slate-300' :
                    'bg-slate-100 text-slate-700 border-slate-200';

                  return (
                    <tr key={cust.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 pr-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold shrink-0 text-xs font-mono">
                            {cust.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900">{cust.name}</div>
                            <div className="text-[10px] font-mono text-slate-400">
                              Joined {new Date(cust.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 pr-4 font-mono text-slate-600">
                        <div className="space-y-0.5">
                          {cust.phone && <div className="flex items-center gap-1.5"><Phone className="w-3 h-3 text-slate-400" />{cust.phone}</div>}
                          {cust.email && <div className="flex items-center gap-1.5 text-slate-500"><Mail className="w-3 h-3 text-slate-400" />{cust.email}</div>}
                        </div>
                      </td>
                      <td className="py-3.5 pr-4 text-center">
                        <span className={`px-2 py-0.5 rounded font-mono text-[10px] uppercase font-bold border ${tierColor}`}>
                          {cust.tier}
                        </span>
                      </td>
                      <td className="py-3.5 pr-4 text-center font-mono font-semibold text-slate-800">
                        {cust.totalOrders}
                      </td>
                      <td className="py-3.5 pr-4 text-right font-mono font-bold text-emerald-700">
                        ${cust.totalSpend.toFixed(2)}
                      </td>
                      <td className="py-3.5 pr-4 text-center font-mono font-bold text-amber-700">
                        <span className="inline-flex items-center gap-1">
                          <Award className="w-3.5 h-3.5 text-amber-500" />
                          {cust.loyaltyPoints} pts
                        </span>
                      </td>
                      <td className="py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleInspectCustomer(cust)}
                            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                            title="View Profile Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenEditModal(cust)}
                            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(cust.id)}
                            disabled={deletingId === cust.id}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                            title="Delete Customer"
                          >
                            {deletingId === cust.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Form Modal */}
      <CustomerFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleSubmitForm}
        initialData={editingCustomer}
        isLoading={isPending}
      />

      {/* Customer Profile Inspector Modal */}
      <CustomerDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        customer={inspectingCustomer}
      />
    </div>
  );
};
