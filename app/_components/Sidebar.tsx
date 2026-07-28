'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ViewType } from '@/lib/types';
import { useLanguage } from '@/lib/i18n';
import { authClient } from '@/lib/auth-client';
import { 
  LayoutDashboard, 
  Receipt, 
  ShoppingBag, 
  Package, 
  Boxes, 
  Users, 
  BarChart3, 
  Store, 
  UserCheck, 
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Loader2
} from 'lucide-react';

import { RelayMark } from './RelayMark';

interface SidebarProps {
  currentView: ViewType;
  onSelectView: (view: ViewType) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  lowStockCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  collapsed,
  onToggleCollapse,
  lowStockCount
}) => {
  const { t } = useLanguage();
  const router = useRouter();

  // Better Auth Live Session Data
  const { data: sessionData, isPending } = authClient.useSession();
  const user = sessionData?.user;
  const userName = user?.name || 'Store Owner';
  const userEmail = user?.email || 'owner@counter.app';
  const userInitials = userName
    .split(' ')
    .filter(Boolean)
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'SO';

  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  /**
   * Better Auth Logout Handler
   * Clears HttpOnly Session Cookie & Redirects to Login
   */
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await authClient.signOut();
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const mainNavItems: { id: ViewType; labelKey: Parameters<typeof t>[0]; icon: React.ComponentType<{ className?: string }>; badge?: number }[] = [
    { id: 'dashboard', labelKey: 'dashboard', icon: LayoutDashboard },
    { id: 'counter', labelKey: 'counterPOS', icon: ShoppingBag },
    { id: 'orders', labelKey: 'orders', icon: Receipt },
    { id: 'products', labelKey: 'products', icon: Package },
    { id: 'inventory', labelKey: 'inventory', icon: Boxes, badge: lowStockCount > 0 ? lowStockCount : undefined },
  ];

  const crmNavItems: { id: ViewType; labelKey: Parameters<typeof t>[0]; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'customers', labelKey: 'customers', icon: Users },
    { id: 'reports', labelKey: 'reports', icon: BarChart3 },
  ];

  const systemNavItems: { id: ViewType; labelKey: Parameters<typeof t>[0]; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'store', labelKey: 'store', icon: Store },
    { id: 'users', labelKey: 'users', icon: UserCheck },
    { id: 'settings', labelKey: 'settings', icon: Settings },
  ];

  const renderNavItem = (item: { id: ViewType; labelKey: Parameters<typeof t>[0]; icon: React.ComponentType<{ className?: string }>; badge?: number }) => {
    const Icon = item.icon;
    const isActive = currentView === item.id;
    const labelText = t(item.labelKey);

    return (
      <button
        key={item.id}
        onClick={() => onSelectView(item.id)}
        className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-all duration-150 group ${
          isActive 
            ? 'bg-slate-900 text-white shadow-xs' 
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
        }`}
        title={collapsed ? labelText : undefined}
      >
        <div className="flex items-center gap-3 min-w-0">
          <Icon className={`w-4 h-4 shrink-0 transition-colors ${
            isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-800'
          }`} />
          {!collapsed && <span className="truncate">{labelText}</span>}
        </div>
        {!collapsed && item.badge !== undefined && (
          <span className={`text-[11px] font-mono px-1.5 py-0.5 rounded font-semibold ${
            isActive ? 'bg-amber-400 text-slate-950' : 'bg-amber-100 text-amber-900 border border-amber-300'
          }`}>
            {item.badge}
          </span>
        )}
      </button>
    );
  };

  return (
    <aside 
      className={`bg-white border-r border-slate-200 flex flex-col justify-between h-full overflow-hidden transition-all duration-200 shrink-0 z-20 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="p-1 rounded bg-slate-950 text-white flex items-center justify-center shrink-0">
            <RelayMark size={24} color="#FFFFFF" />
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-semibold text-slate-900 text-sm tracking-tight leading-none">COUNTER</span>
              <span className="text-[10px] font-mono text-slate-400 tracking-wider uppercase mt-1">{t('byRelay')}</span>
            </div>
          )}
        </div>
        
        <button
          onClick={onToggleCollapse}
          className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Toggle Navigation"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* Main POS Operations */}
        <div className="space-y-1">
          {!collapsed && (
            <div className="px-3 text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1">
              {t('operations')}
            </div>
          )}
          {mainNavItems.map(renderNavItem)}
        </div>

        <div className="h-[1px] bg-slate-100 my-2" />

        {/* CRM & Insights */}
        <div className="space-y-1">
          {!collapsed && (
            <div className="px-3 text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1">
              {t('intelligence')}
            </div>
          )}
          {crmNavItems.map(renderNavItem)}
        </div>

        <div className="h-[1px] bg-slate-100 my-2" />

        {/* System Settings */}
        <div className="space-y-1">
          {!collapsed && (
            <div className="px-3 text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1">
              {t('administration')}
            </div>
          )}
          {systemNavItems.map(renderNavItem)}
        </div>
      </div>

      {/* User Profile & Logout Footer */}
      <div className="p-3 border-t border-slate-200 bg-slate-50/60 shrink-0">
        {!collapsed ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-mono font-bold shrink-0 shadow-xs">
                {isPending ? '...' : userInitials}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-slate-900 truncate">
                  {isPending ? 'Loading...' : userName}
                </div>
                <div className="text-[10px] font-mono text-slate-500 truncate" title={userEmail}>
                  {isPending ? '...' : userEmail}
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors disabled:opacity-50 cursor-pointer"
              title={t('logOut')}
            >
              {isLoggingOut ? (
                <Loader2 className="w-4 h-4 animate-spin text-slate-600" />
              ) : (
                <LogOut className="w-4 h-4" />
              )}
            </button>
          </div>
        ) : (
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex justify-center text-slate-400 hover:text-rose-600 py-1 transition-colors disabled:opacity-50 cursor-pointer"
            title={t('logOut')}
          >
            {isLoggingOut ? (
              <Loader2 className="w-4 h-4 animate-spin text-slate-600" />
            ) : (
              <LogOut className="w-4 h-4" />
            )}
          </button>
        )}
      </div>
    </aside>
  );
};
