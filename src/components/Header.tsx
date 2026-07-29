'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ViewType } from '@/lib/types';
import { useLanguage } from '@/lib/utils/i18n';
import { authClient } from '@/lib/auth/auth-client';
import { 
  Search, 
  Scan, 
  MapPin, 
  Calendar,
  ChevronDown,
  User,
  LogOut,
  Check,
  Loader2
} from 'lucide-react';

interface HeaderProps {
  currentView: ViewType;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenQuickScan?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  searchQuery,
  onSearchChange,
  onOpenQuickScan,
}) => {
  const { language, setLanguage, t } = useLanguage();
  const router = useRouter();

  // Better Auth Live Session Data
  const { data: sessionData, isPending } = authClient.useSession();
  const user = sessionData?.user;
  const userName = user?.name || 'Store Owner';
  const userEmail = user?.email || 'owner@counter.app';

  const [showDateDropdown, setShowDateDropdown] = useState<boolean>(false);
  const [showUserDropdown, setShowUserDropdown] = useState<boolean>(false);
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  const [selectedDateFilter, setSelectedDateFilter] = useState<'today' | 'yesterday' | 'last7Days' | 'last30Days' | 'customRange'>('today');

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

  const dateOptions: { id: 'today' | 'yesterday' | 'last7Days' | 'last30Days' | 'customRange'; labelKey: Parameters<typeof t>[0]; dateLabel: string }[] = [
    { id: 'today', labelKey: 'today', dateLabel: 'Jul 28, 2026' },
    { id: 'yesterday', labelKey: 'yesterday', dateLabel: 'Jul 27, 2026' },
    { id: 'last7Days', labelKey: 'last7Days', dateLabel: 'Jul 21 - Jul 28' },
    { id: 'last30Days', labelKey: 'last30Days', dateLabel: 'Jun 28 - Jul 28' },
    { id: 'customRange', labelKey: 'customRange', dateLabel: 'Select Dates' },
  ];

  const currentOption = dateOptions.find(o => o.id === selectedDateFilter) || dateOptions[0];

  const getTitle = () => {
    switch (currentView) {
      case 'dashboard': return t('dashboard');
      case 'counter': return t('counterPOS');
      case 'orders': return t('ordersLedgerTitle');
      case 'products': return t('catalogTitle');
      case 'inventory': return t('stockLedgerTitle');
      case 'customers': return t('crmTitle');
      case 'reports': return t('reports');
      case 'store': return t('store');
      case 'users': return t('users');
      case 'settings': return t('settings');
      default: return t('dashboard');
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 z-30">
      {/* Left: View Title & Store Switcher */}
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-slate-900 tracking-tight">
          {getTitle()}
        </h1>

        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-md text-xs font-medium text-slate-700">
          <MapPin className="w-3.5 h-3.5 text-slate-500" />
          <span>{t('sohoFlagship')}</span>
          <span className="text-slate-400">•</span>
          <span className="font-mono text-slate-600">{t('register01')}</span>
          <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
        </div>
      </div>

      {/* Center: Global SKU / Order / Barcode Search */}
      <div className="flex-1 max-w-md mx-6 hidden lg:block">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full bg-slate-50 border border-slate-200 rounded-md pl-9 pr-12 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white transition-all"
          />
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono border border-slate-200 bg-white text-slate-400 px-1 rounded">
            ⌘K
          </span>
        </div>
      </div>

      {/* Right: Language Switcher, Quick Action, Shift Info, User Menu & Dropdown */}
      <div className="flex items-center gap-3">
        {/* Language Switcher Pill EN / ID */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-md border border-slate-200 text-xs font-mono">
          <button
            onClick={() => setLanguage('en')}
            className={`px-2 py-0.5 rounded-sm font-semibold transition-all cursor-pointer ${
              language === 'en'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setLanguage('id')}
            className={`px-2 py-0.5 rounded-sm font-semibold transition-all cursor-pointer ${
              language === 'id'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            ID
          </button>
        </div>

        {onOpenQuickScan && (
          <button
            onClick={onOpenQuickScan}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-medium transition-colors shadow-xs cursor-pointer"
          >
            <Scan className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t('scanBarcode')}</span>
          </button>
        )}

        {/* User Account Dropdown Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="flex items-center gap-2 px-2.5 py-1 border border-slate-200 rounded-md text-xs bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <div className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold">
              <User className="w-3 h-3 text-white" />
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-slate-900 font-semibold text-[11px] leading-tight truncate max-w-[120px]">
                {isPending ? 'Loading...' : userName}
              </span>
            </div>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showUserDropdown && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowUserDropdown(false)} 
              />
              <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-lg shadow-xl z-50 p-2 text-xs font-sans">
                {/* User Info Header */}
                <div className="px-2 py-1.5 border-b border-slate-100 mb-1">
                  <p className="font-semibold text-slate-900 truncate">{userName}</p>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">{userEmail}</p>
                </div>

                {/* Logout Action */}
                <button
                  onClick={() => {
                    setShowUserDropdown(false);
                    handleLogout();
                  }}
                  disabled={isLoggingOut}
                  className="w-full flex items-center gap-2 px-2 py-1.5 text-rose-600 hover:bg-rose-50 rounded-md transition-colors text-left font-medium cursor-pointer disabled:opacity-50"
                >
                  {isLoggingOut ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <LogOut className="w-3.5 h-3.5" />
                  )}
                  <span>Sign Out</span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Interactive Date Selector & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDateDropdown(!showDateDropdown)}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 rounded-md text-xs font-medium text-slate-700 transition-colors shadow-xs cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>{t(currentOption.labelKey)}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showDateDropdown && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowDateDropdown(false)} 
              />
              <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-md shadow-xl z-50 p-1 divide-y divide-slate-100 text-xs font-sans">
                <div className="py-1">
                  {dateOptions.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => {
                        setSelectedDateFilter(opt.id);
                        setShowDateDropdown(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 text-left rounded hover:bg-slate-100 transition-colors group cursor-pointer"
                    >
                      <div>
                        <div className="font-medium text-slate-900">{t(opt.labelKey)}</div>
                        <div className="text-[10px] font-mono text-slate-400">{opt.dateLabel}</div>
                      </div>
                      {selectedDateFilter === opt.id && (
                        <Check className="w-3.5 h-3.5 text-slate-900" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
