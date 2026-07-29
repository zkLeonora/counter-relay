'use client';

import React, { useState } from 'react';
import { ViewType, Order, Product, RestockItem, InventoryMovement } from '@/lib/types';
import { DashboardData } from '@/features/dashboard/types';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_RESTOCK_ITEMS, 
  INITIAL_ORDERS, 
  INITIAL_INVENTORY_MOVEMENTS, 
  INITIAL_CUSTOMERS, 
  HOURLY_SALES_METRICS 
} from '@/lib/constants/mockData';
import { LanguageProvider, useLanguage } from '@/lib/utils/i18n';

import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { DashboardView } from '@/features/dashboard/DashboardView';
import { POSTerminalView } from '@/features/pos';
import { OrdersView } from '@/features/orders/OrdersView';
import { ProductsView } from '@/features/products/ProductsView';
import { InventoryView } from '@/features/inventory/InventoryView';
import { CustomersView } from '@/features/customers/CustomersView';
import { ReportsView } from '@/features/reports/ReportsView';
import { CategoriesView, CategoryItem } from '@/features/categories';
import { ProductItem } from '@/features/products/types';
import { CustomerItem } from '@/features/customers/types';
import { FullReportData } from '@/features/reports/types';
import { OrderItemFull } from '@/features/orders/types';
import { UsersView, UserItem } from '@/features/users';
import { UserRole } from '@/lib/auth/roles';
import { canAccessView } from '@/lib/auth/permissions';
import { authClient } from '@/lib/auth/auth-client';

interface CounterAppProps {
  dashboardData?: DashboardData;
  categoriesData?: CategoryItem[];
  productsData?: ProductItem[];
  customersData?: CustomerItem[];
  reportsData?: FullReportData;
  ordersData?: OrderItemFull[];
  usersData?: UserItem[];
}

function CounterAppContent({ 
  dashboardData, 
  categoriesData = [], 
  productsData = [], 
  customersData = [], 
  reportsData, 
  ordersData = [],
  usersData = []
}: CounterAppProps) {
  const { data: sessionData } = authClient.useSession();
  const activeRole: UserRole = (sessionData?.user as any)?.role || 'owner';
  const { t } = useLanguage();
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [globalSearch, setGlobalSearch] = useState<string>('');
  
  // Dynamic State Stores
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [restockItems] = useState<RestockItem[]>(INITIAL_RESTOCK_ITEMS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [movements, setMovements] = useState<InventoryMovement[]>(INITIAL_INVENTORY_MOVEMENTS);
  const [customers] = useState(INITIAL_CUSTOMERS);
  const [hourlyMetrics] = useState(HOURLY_SALES_METRICS);

  // Handle completed sale from live POS checkout
  const handleCompleteSale = (newOrder: Order) => {
    setOrders(prev => [newOrder, ...prev]);

    newOrder.items.forEach(item => {
      setProducts(prev => prev.map(p => {
        if (p.id === item.productId) {
          const newStock = Math.max(0, p.stock - item.quantity);
          return { ...p, stock: newStock };
        }
        return p;
      }));

      const newMovement: InventoryMovement = {
        id: `mov-${Math.floor(110 + Math.random() * 900)}`,
        timestamp: newOrder.timestamp,
        sku: item.sku,
        productName: item.name,
        type: 'sale',
        quantityDelta: -item.quantity,
        remainingStock: 5,
        binLocation: 'A-12-04',
        operator: newOrder.cashierName,
        referenceId: newOrder.receiptNumber
      };

      setMovements(prev => [newMovement, ...prev]);
    });
  };
  
  const isViewAllowed = canAccessView(activeRole, currentView as any);

  const lowStockCount = restockItems.filter(i => i.status === 'critical' || i.status === 'warning').length;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100 text-slate-900 font-sans antialiased">
      {/* Grouped Navigation Sidebar */}
      <Sidebar
        currentView={currentView}
        onSelectView={setCurrentView}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        lowStockCount={lowStockCount}
        userRole={activeRole}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header 
          currentView={currentView}
          searchQuery={globalSearch}
          onSearchChange={setGlobalSearch}
          onOpenQuickScan={() => setCurrentView('counter')}
        />

        {/* Dynamic View Body */}
        <main className="flex-1 overflow-y-auto bg-slate-50">
          {!isViewAllowed ? (
            <div className="p-16 flex flex-col items-center justify-center text-center">
              <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-xl mb-4 shadow-xs">
                403
              </div>
              <h2 className="text-xl font-bold text-slate-900">403 Forbidden Access</h2>
              <p className="text-xs text-slate-500 max-w-sm mt-1 font-mono">
                Your system role '{activeRole.toUpperCase()}' is restricted from accessing the '{currentView}' module.
              </p>
              <button 
                onClick={() => setCurrentView('dashboard')}
                className="mt-5 px-5 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors shadow-xs"
              >
                Return to Dashboard
              </button>
            </div>
          ) : (
            <>
              {currentView === 'dashboard' && (
                <DashboardView
                  dashboardData={dashboardData}
                  restockItems={restockItems}
                  recentOrders={orders}
                  hourlyMetrics={hourlyMetrics}
                  onNavigateToPOS={() => setCurrentView('counter')}
                  onNavigateToInventory={() => setCurrentView('inventory')}
                  onSelectOrder={() => setCurrentView('orders')}
                />
              )}

              {currentView === 'counter' && (
                <POSTerminalView
                  initialProducts={productsData}
                  categories={categoriesData}
                  customers={customersData}
                />
              )}

              {currentView === 'orders' && (
                <OrdersView
                  initialOrders={ordersData}
                />
              )}

              {currentView === 'products' && (
                <ProductsView
                  initialProducts={productsData}
                  categories={categoriesData}
                  userRole={activeRole}
                />
              )}

              {currentView === 'categories' && (
                <CategoriesView
                  initialCategories={categoriesData}
                />
              )}

              {currentView === 'inventory' && (
                <InventoryView
                  movements={movements}
                />
              )}

              {currentView === 'customers' && (
                <CustomersView
                  initialCustomers={customersData}
                />
              )}

              {currentView === 'reports' && reportsData && (
                <ReportsView
                  initialReport={reportsData}
                />
              )}

              {currentView === 'users' && (
                <UsersView
                  initialUsers={usersData}
                  currentUserRole={activeRole}
                />
              )}

              {(currentView === 'store' || currentView === 'settings') && (
                <div className="p-12 flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 rounded-full bg-slate-250 text-slate-700 flex items-center justify-center font-mono font-bold text-lg mb-3">
                    {currentView.toUpperCase().slice(0, 2)}
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 capitalize">{currentView} Configuration</h2>
                  <p className="text-xs text-slate-500 max-w-sm mt-1">
                    Hardware terminal pairings, printer integrations, and cashier shift assignments for SoHo Flagship Store Register #01.
                  </p>
                  <button 
                    onClick={() => setCurrentView('dashboard')}
                    className="mt-4 px-4 py-2 bg-slate-900 text-white rounded text-xs font-semibold hover:bg-slate-800"
                  >
                    Return to Dashboard
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default function CounterApp({ dashboardData, categoriesData, productsData, customersData, reportsData, ordersData, usersData }: CounterAppProps) {
  return (
    <LanguageProvider>
      <CounterAppContent 
        dashboardData={dashboardData} 
        categoriesData={categoriesData} 
        productsData={productsData} 
        customersData={customersData} 
        reportsData={reportsData} 
        ordersData={ordersData}
        usersData={usersData}
      />
    </LanguageProvider>
  );
}
