'use client';

import React, { useState } from 'react';
import { ViewType, Order, Product, RestockItem, InventoryMovement } from '@/lib/types';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_RESTOCK_ITEMS, 
  INITIAL_ORDERS, 
  INITIAL_INVENTORY_MOVEMENTS, 
  INITIAL_CUSTOMERS, 
  HOURLY_SALES_METRICS 
} from '@/lib/mockData';
import { LanguageProvider, useLanguage } from '@/lib/i18n';

import { Sidebar } from './_components/Sidebar';
import { Header } from './_components/Header';
import { DashboardView } from './_components/DashboardView';
import { POSTerminalView } from './_components/POSTerminalView';
import { OrdersView } from './_components/OrdersView';
import { ProductsView } from './_components/ProductsView';
import { InventoryView } from './_components/InventoryView';
import { CustomersView } from './_components/CustomersView';
import { ReportsView } from './_components/ReportsView';

function CounterAppContent() {
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
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Navigation Header */}
        <Header
          currentView={currentView}
          searchQuery={globalSearch}
          onSearchChange={setGlobalSearch}
          onOpenQuickScan={() => setCurrentView('counter')}
        />

        {/* Dynamic View Body */}
        <main className="flex-1 overflow-y-auto bg-slate-50">
          {currentView === 'dashboard' && (
            <DashboardView
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
              products={products}
              onCompleteSale={handleCompleteSale}
            />
          )}

          {currentView === 'orders' && (
            <OrdersView
              orders={orders}
            />
          )}

          {currentView === 'products' && (
            <ProductsView
              products={products}
            />
          )}

          {currentView === 'inventory' && (
            <InventoryView
              movements={movements}
            />
          )}

          {currentView === 'customers' && (
            <CustomersView
              customers={customers}
            />
          )}

          {currentView === 'reports' && (
            <ReportsView
              products={products}
            />
          )}

          {(currentView === 'store' || currentView === 'users' || currentView === 'settings') && (
            <div className="p-12 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-mono font-bold text-lg mb-3">
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
        </main>
      </div>
    </div>
  );
}

export default function CounterApp() {
  return (
    <LanguageProvider>
      <CounterAppContent />
    </LanguageProvider>
  );
}
