'use client';

import React, { useState } from 'react';
import { 
  Users as UsersIcon, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle 
} from 'lucide-react';
import { UserItem } from './types';
import { UserFormModal } from './UserFormModal';
import { deleteUserAction } from './actions';
import { UserRole } from '@/lib/auth/roles';

interface UsersViewProps {
  initialUsers: UserItem[];
  currentUserRole?: UserRole;
}

export const UsersView: React.FC<UsersViewProps> = ({
  initialUsers = [],
  currentUserRole = 'owner',
}) => {
  const [usersList, setUsersList] = useState<UserItem[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);

  const filteredUsers = usersList.filter((u) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      u.name.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query);

    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove user '${name}'?`)) return;
    const res = await deleteUserAction(id);
    if (res.success) {
      setUsersList((prev) => prev.filter((u) => u.id !== id));
    } else {
      alert(res.error || 'Failed to delete user');
    }
  };

  const handleOpenAdd = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: UserItem) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center shadow-xs">
            <UsersIcon className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">User & Role Access Management</h1>
            <p className="text-xs text-slate-500">Configure team roles (Owner, Manager, Cashier) & system permissions</p>
          </div>
        </div>

        {currentUserRole === 'owner' && (
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-all"
          >
            <Plus className="w-4 h-4" /> Add Team User
          </button>
        )}
      </div>

      {/* Main Table Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            {/* Search */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Name or Email..."
                className="w-full pl-9 pr-3.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all placeholder:text-slate-400"
              />
            </div>

            {/* Role Filter Pills */}
            <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs font-medium">
              {(['all', 'owner', 'manager', 'cashier'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRoleFilter(r)}
                  className={`px-3 py-1 rounded-md capitalize transition-all ${
                    roleFilter === r
                      ? 'bg-white text-slate-900 shadow-xs font-semibold'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="text-xs font-mono text-slate-500">
            Total Users: <span className="font-bold text-slate-900">{filteredUsers.length}</span>
          </div>
        </div>

        {/* Users Table */}
        {filteredUsers.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
              <UsersIcon className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900">No users found</h3>
            <p className="text-xs text-slate-500 max-w-xs mt-1">
              Click "Add Team User" to create team accounts with specific roles.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] font-mono uppercase tracking-wider text-slate-400">
                  <th className="pb-3 font-medium">User Member</th>
                  <th className="pb-3 font-medium">Email</th>
                  <th className="pb-3 font-medium text-center">Role</th>
                  <th className="pb-3 font-medium text-center">Status</th>
                  <th className="pb-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs font-mono">
                          {u.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">{u.name}</div>
                          <div className="text-[10px] font-mono text-slate-400">ID: {u.id.slice(0, 8)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 pr-4 font-mono text-slate-700">{u.email}</td>
                    <td className="py-3.5 pr-4 text-center">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] uppercase font-mono font-bold border ${
                        u.role === 'owner' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                        u.role === 'manager' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 pr-4 text-center">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-mono font-semibold ${
                        u.isActive ? 'text-emerald-700' : 'text-slate-400'
                      }`}>
                        {u.isActive ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {u.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      {currentUserRole === 'owner' ? (
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEdit(u)}
                            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(u.id, u.name)}
                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] font-mono text-slate-400">View Only</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* User Form Modal */}
      <UserFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userToEdit={selectedUser}
        onSuccess={() => {
          // re-fetch or state update
          window.location.reload();
        }}
      />
    </div>
  );
};
