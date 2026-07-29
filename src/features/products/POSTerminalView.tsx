'use client';

import React, { useState } from 'react';
import { Product, OrderItem, Order } from '@/lib/types';
import { useLanguage } from '@/lib/utils/i18n';
import { 
  Search, 
  Scan, 
  Trash2, 
  Plus, 
  Minus, 
  CreditCard, 
  Smartphone, 
  Banknote, 
  UserPlus, 
  Receipt,
  X,
  Check,
  Percent
} from 'lucide-react';

interface POSTerminalViewProps {
  products: Product[];
  onCompleteSale: (newOrder: Order) => void;
}

export const POSTerminalView: React.FC<POSTerminalViewProps> = ({
  products,
  onCompleteSale
}) => {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<{ name: string; phone: string; tier: string } | null>({
    name: 'Marcus Vance',
    phone: '+1 (555) 234-8901',
    tier: 'Gold Member (1,420 pts)'
  });
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [showCheckoutModal, setShowCheckoutModal] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple_pay' | 'cash'>('apple_pay');
  const [cashTendered, setCashTendered] = useState<string>('300');
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

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

  const filteredProducts = products.filter(prod => {
    const matchesCategory = selectedCategory === 'All' || prod.category === selectedCategory;
    const matchesSearch = prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          prod.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          prod.barcode.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === product.id);
      if (existing) {
        return prev.map(item => 
          item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, {
        productId: product.id,
        sku: product.sku,
        name: product.name,
        unitPrice: product.sellingPrice,
        quantity: 1
      }];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.productId === productId) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const taxableSubtotal = subtotal - discountAmount;
  const tax = taxableSubtotal * 0.08875;
  const total = taxableSubtotal + tax;

  const handleProcessPayment = () => {
    const newOrder: Order = {
      id: `ord-${Math.floor(8942 + Math.random() * 1000)}`,
      receiptNumber: `REC-2026-${Math.floor(9000 + Math.random() * 900)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      customerName: selectedCustomer ? selectedCustomer.name : 'Walk-in Customer',
      customerPhone: selectedCustomer ? selectedCustomer.phone : undefined,
      items: [...cart],
      subtotal,
      tax,
      discount: discountAmount,
      total,
      paymentMethod,
      paymentStatus: 'paid',
      registerId: 'REG-01',
      cashierName: 'Elena Rostova'
    };

    setCompletedOrder(newOrder);
    onCompleteSale(newOrder);
  };

  const handleFinishTransaction = () => {
    setCart([]);
    setDiscountPercent(0);
    setShowCheckoutModal(false);
    setCompletedOrder(null);
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex overflow-hidden">
      {/* ----------------- LEFT: PRODUCT CATALOG & SCANNER ----------------- */}
      <div className="flex-1 flex flex-col bg-slate-50 border-r border-slate-200 overflow-hidden p-6 space-y-4">
        {/* Top Controls */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('scanBarcodePlaceholder')}
              className="w-full bg-white border border-slate-300 rounded-md pl-9 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>

          <button
            onClick={() => {
              const sample = products[0];
              if (sample) addToCart(sample);
            }}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 text-white rounded-md text-xs font-medium hover:bg-slate-800 transition-colors shrink-0"
          >
            <Scan className="w-3.5 h-3.5" />
            {t('simulateScan')}
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
              }`}
            >
              {getCategoryLabel(cat)}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pr-1">
          {filteredProducts.map(product => (
            <button
              key={product.id}
              onClick={() => addToCart(product)}
              className="bg-white border border-slate-200 rounded-lg p-3 text-left hover:border-slate-900 hover:shadow-xs transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="w-full h-28 rounded bg-slate-100 mb-2.5 overflow-hidden relative">
                  {/* eslint-disable-next-html-key */}
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-1.5 right-1.5 bg-slate-900/80 text-white text-[10px] font-mono px-1.5 py-0.5 rounded">
                    {t('stock')}: {product.stock}
                  </span>
                </div>
                <div className="text-xs font-semibold text-slate-900 line-clamp-2 leading-snug">
                  {product.name}
                </div>
                <div className="text-[11px] font-mono text-slate-400 mt-1">
                  {product.sku}
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="text-xs font-mono font-bold text-slate-900">
                  ${product.sellingPrice.toFixed(2)}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {getCategoryLabel(product.category)}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ----------------- RIGHT: LIVE REGISTER CART ----------------- */}
      <div className="w-96 bg-white flex flex-col justify-between shrink-0 shadow-lg z-10">
        {/* Customer Selector */}
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
          {selectedCustomer ? (
            <div className="flex items-center justify-between w-full">
              <div>
                <div className="text-xs font-semibold text-slate-900">{selectedCustomer.name}</div>
                <div className="text-[10px] font-mono text-emerald-700 font-medium">{selectedCustomer.tier}</div>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-xs font-mono text-slate-400 hover:text-slate-700"
              >
                {t('change')}
              </button>
            </div>
          ) : (
            <button
              onClick={() => setSelectedCustomer({ name: 'Claire Dupont', phone: '+1 (555) 901-4432', tier: 'VIP Member' })}
              className="flex items-center gap-2 text-xs font-medium text-slate-600 hover:text-slate-900"
            >
              <UserPlus className="w-4 h-4 text-slate-400" />
              {t('attachCustomer')}
            </button>
          )}
        </div>

        {/* Cart Line Items */}
        <div className="flex-1 overflow-y-auto p-4 divide-y divide-slate-100">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2">
              <Receipt className="w-8 h-8 stroke-1 text-slate-300" />
              <p className="text-xs font-mono uppercase">{t('registerCartEmpty')}</p>
              <p className="text-[11px] text-slate-400 text-center max-w-[200px]">{t('cartEmptySubtext')}</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.productId} className="py-3 flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-slate-900 truncate">{item.name}</div>
                  <div className="text-[11px] font-mono text-slate-400">${item.unitPrice.toFixed(2)} each</div>
                  
                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item.productId, -1)}
                      className="w-5 h-5 rounded bg-slate-100 text-slate-700 flex items-center justify-center hover:bg-slate-200"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-mono font-bold w-4 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, 1)}
                      className="w-5 h-5 rounded bg-slate-100 text-slate-700 flex items-center justify-center hover:bg-slate-200"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-mono font-bold text-slate-900">
                    ${(item.unitPrice * item.quantity).toFixed(2)}
                  </div>
                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="text-slate-300 hover:text-red-500 mt-2 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Totals & Checkout Panel */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/50 space-y-3">
          <div className="space-y-1.5 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>{t('subtotal')}</span>
              <span className="font-mono text-slate-900">${subtotal.toFixed(2)}</span>
            </div>
            
            {discountPercent > 0 && (
              <div className="flex justify-between text-emerald-700 font-mono">
                <span>{t('discount')} ({discountPercent}%)</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between text-slate-500">
              <span>{t('estimatedTax')}</span>
              <span className="font-mono text-slate-900">${tax.toFixed(2)}</span>
            </div>

            <div className="h-[1px] bg-slate-200 my-2" />

            <div className="flex justify-between text-base font-bold text-slate-900">
              <span>{t('totalDue')}</span>
              <span className="font-mono text-lg">${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDiscountPercent(prev => prev === 10 ? 0 : 10)}
              className={`flex-1 py-1.5 border rounded text-xs font-mono font-medium flex items-center justify-center gap-1 transition-all ${
                discountPercent > 0 ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Percent className="w-3 h-3" />
              {discountPercent > 0 ? t('discountApplied') : t('applyDiscount')}
            </button>

            <button
              onClick={() => setCart([])}
              disabled={cart.length === 0}
              className="px-3 py-1.5 border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 rounded text-xs font-medium disabled:opacity-40"
            >
              {t('clear')}
            </button>
          </div>

          {/* High-Impact Checkout Trigger */}
          <button
            onClick={() => setShowCheckoutModal(true)}
            disabled={cart.length === 0}
            className="w-full py-3 bg-slate-950 hover:bg-slate-800 text-white rounded-md font-semibold text-sm transition-all shadow-sm disabled:opacity-40 flex items-center justify-center gap-2"
          >
            <span>{t('charge')} ${total.toFixed(2)}</span>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">SPACE</span>
          </button>
        </div>
      </div>

      {/* ----------------- CHECKOUT & RECEIPT MODAL ----------------- */}
      {showCheckoutModal && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg border border-slate-200 max-w-md w-full p-6 shadow-2xl space-y-6">
            {!completedOrder ? (
              <>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">{t('completePayment')}</h3>
                    <p className="text-xs text-slate-500 font-mono">{t('totalCharge')}: ${total.toFixed(2)}</p>
                  </div>
                  <button 
                    onClick={() => setShowCheckoutModal(false)}
                    className="p-1 text-slate-400 hover:text-slate-600 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setPaymentMethod('apple_pay')}
                    className={`p-3 rounded border text-left flex flex-col justify-between transition-all ${
                      paymentMethod === 'apple_pay'
                        ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <Smartphone className="w-5 h-5 mb-2" />
                    <span className="text-xs font-semibold">{t('contactless')}</span>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded border text-left flex flex-col justify-between transition-all ${
                      paymentMethod === 'card'
                        ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 mb-2" />
                    <span className="text-xs font-semibold">{t('creditCard')}</span>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('cash')}
                    className={`p-3 rounded border text-left flex flex-col justify-between transition-all ${
                      paymentMethod === 'cash'
                        ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <Banknote className="w-5 h-5 mb-2" />
                    <span className="text-xs font-semibold">{t('cashTender')}</span>
                  </button>
                </div>

                {paymentMethod === 'cash' && (
                  <div className="bg-slate-50 p-3 rounded border border-slate-200 space-y-2">
                    <label className="text-xs font-mono uppercase text-slate-500">{t('cashReceived')}</label>
                    <input
                      type="number"
                      value={cashTendered}
                      onChange={(e) => setCashTendered(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-sm font-mono font-bold text-slate-900"
                    />
                    <div className="flex justify-between text-xs font-mono pt-1 text-slate-600">
                      <span>{t('changeDue')}:</span>
                      <span className="font-bold text-emerald-700">
                        ${Math.max(0, parseFloat(cashTendered || '0') - total).toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleProcessPayment}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-semibold text-xs tracking-wider uppercase transition-colors"
                >
                  {t('confirmPayment')}
                </button>
              </>
            ) : (
              <div className="space-y-4 text-center py-2">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{t('transactionComplete')}</h3>
                  <p className="text-xs font-mono text-slate-500">{completedOrder.receiptNumber}</p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded p-4 text-left font-mono text-xs space-y-2">
                  <div className="text-center font-bold border-b border-slate-200 pb-2">
                    COUNTER BY RELAY
                    <div className="text-[10px] font-normal text-slate-500">SoHo Flagship Store • Reg #01</div>
                  </div>

                  <div className="space-y-1 py-2 border-b border-slate-200">
                    {completedOrder.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span>{it.quantity}x {it.name.slice(0, 20)}</span>
                        <span>${(it.unitPrice * it.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-1 text-slate-600">
                    <div className="flex justify-between">
                      <span>Pajak / Tax</span>
                      <span>${completedOrder.tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-slate-900 text-sm">
                      <span>{t('totalPaid')}</span>
                      <span>${completedOrder.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => alert(`Printing receipt ${completedOrder.receiptNumber}...`)}
                    className="flex-1 py-2 border border-slate-300 rounded text-xs font-medium hover:bg-slate-50"
                  >
                    {t('printReceipt')}
                  </button>
                  <button
                    onClick={handleFinishTransaction}
                    className="flex-1 py-2 bg-slate-900 text-white rounded text-xs font-medium hover:bg-slate-800"
                  >
                    {t('nextTransaction')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
