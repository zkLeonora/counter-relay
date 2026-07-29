'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Package, 
  ShoppingCart, 
  Tag, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles,
  QrCode
} from 'lucide-react';
import { ProductItem } from '@/features/products/types';
import { CategoryItem } from '@/features/categories/types';
import { CustomerItem } from '@/features/customers/types';
import { CartItem, CompletedOrderReceipt } from './types';
import { Cart } from './Cart';
import { CheckoutModal } from './CheckoutModal';
import { ReceiptModal } from './ReceiptModal';
import { processCheckoutAction } from './actions';

interface POSTerminalViewProps {
  initialProducts: ProductItem[];
  categories: CategoryItem[];
  customers: CustomerItem[];
}

export const POSTerminalView: React.FC<POSTerminalViewProps> = ({
  initialProducts,
  categories,
  customers,
}) => {
  const [productsList, setProductsList] = useState<ProductItem[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Cart State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerItem | null>(null);

  // Modals
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [completedReceipt, setCompletedReceipt] = useState<CompletedOrderReceipt | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const filteredProducts = productsList.filter((prod) => {
    if (!prod.isActive) return false;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      prod.name.toLowerCase().includes(query) ||
      prod.sku.toLowerCase().includes(query) ||
      (prod.barcode && prod.barcode.toLowerCase().includes(query));

    const matchesCategory = selectedCategory === 'all' || prod.categoryId === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (product: ProductItem) => {
    if (product.stock <= 0) {
      alert(`Product "${product.name}" is out of stock!`);
      return;
    }

    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const currentQty = prev[existingIndex].quantity;
        if (currentQty >= product.stock) {
          alert(`Cannot add more than available stock (${product.stock} units)`);
          return prev;
        }
        const updated = [...prev];
        const newQty = currentQty + 1;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          subtotal: newQty * product.sellingPrice,
        };
        return updated;
      }

      return [
        ...prev,
        {
          product,
          quantity: 1,
          subtotal: product.sellingPrice,
        },
      ];
    });
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            if (newQty > item.product.stock) {
              alert(`Cannot exceed stock limit (${item.product.stock} units)`);
              return item;
            }
            if (newQty <= 0) return null;
            return {
              ...item,
              quantity: newQty,
              subtotal: newQty * item.product.sellingPrice,
            };
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const calculateGrandTotal = () => {
    const subtotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
    const tax = subtotal * 0.1;
    return subtotal + tax;
  };

  const handleConfirmCheckout = async (paymentData: {
    paymentMethod: 'cash' | 'card' | 'transfer' | 'ewallet';
    amountPaid: number;
    change: number;
    notes?: string;
  }) => {
    const subtotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    const checkoutInput = {
      customerId: selectedCustomer?.id || null,
      items: cartItems.map((i) => ({
        productId: i.product.id,
        productName: i.product.name,
        productSku: i.product.sku,
        quantity: i.quantity,
        price: i.product.sellingPrice,
        subtotal: i.subtotal,
      })),
      subtotal,
      discount: 0,
      tax,
      total,
      paymentMethod: paymentData.paymentMethod,
      amountPaid: paymentData.amountPaid,
      change: paymentData.change,
      notes: paymentData.notes,
    };

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await processCheckoutAction(checkoutInput);
      if (res.success && res.data) {
        // Update local stock in real-time
        setProductsList((prev) =>
          prev.map((p) => {
            const cartMatch = cartItems.find((ci) => ci.product.id === p.id);
            if (cartMatch) {
              return {
                ...p,
                stock: Math.max(0, p.stock - cartMatch.quantity),
              };
            }
            return p;
          })
        );

        setCompletedReceipt(res.data);
        setIsCheckoutModalOpen(false);
        setCartItems([]);
        setIsReceiptModalOpen(true);
      } else {
        setErrorMessage(res.error || 'Checkout process failed');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Error executing checkout');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 flex-1 flex flex-col space-y-4 pb-8 min-h-[calc(100vh-4rem)]">
      {/* Top Banner Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-slate-200 rounded-xl p-4 shadow-xs shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold">
            <ShoppingCart className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900">POS Checkout Terminal</h1>
            <p className="text-xs text-slate-500">Fast checkout register for SoHo Flagship Store #01</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Scan barcode or type SKU/Name..."
            className="w-full pl-9 pr-3.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all placeholder:text-slate-400 font-mono"
          />
        </div>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2 shrink-0">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Terminal Workspace: Product Catalog + Cart Sidebar */}
      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
        {/* Left Side: Product Catalog Grid */}
        <div className="flex-1 flex flex-col space-y-4 min-h-0 bg-white border border-slate-200 rounded-xl p-4 shadow-xs overflow-hidden">
          {/* Category Tabs Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 shrink-0 border-b border-slate-100">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === 'all'
                  ? 'bg-slate-900 text-white font-semibold shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Items
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  selectedCategory === c.id
                    ? 'bg-slate-900 text-white font-semibold shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          {/* Product Cards Grid */}
          <div className="flex-1 overflow-y-auto pr-1">
            {filteredProducts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16 text-slate-400">
                <Package className="w-10 h-10 stroke-1 mb-2" />
                <h3 className="text-xs font-semibold text-slate-700">No active products match search</h3>
                <p className="text-[11px] text-slate-400 mt-1">Try switching category or clear search query</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
                {filteredProducts.map((p) => {
                  const isOutOfStock = p.stock <= 0;
                  return (
                    <div
                      key={p.id}
                      onClick={() => !isOutOfStock && handleAddToCart(p)}
                      className={`group p-3 rounded-xl border border-slate-200 hover:border-slate-400 bg-white hover:bg-slate-50/80 transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden ${
                        isOutOfStock ? 'opacity-50 cursor-not-allowed bg-slate-50' : 'hover:shadow-sm'
                      }`}
                    >
                      <div>
                        {/* Thumbnail or SKU initials */}
                        <div className="w-full h-24 rounded-lg bg-slate-100 border border-slate-200 mb-2 flex items-center justify-center overflow-hidden">
                          {p.imageUrl ? (
                            <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="font-mono text-xs font-bold text-slate-400">
                              {p.sku.slice(-4)}
                            </span>
                          )}
                        </div>

                        <div className="text-xs font-semibold text-slate-900 line-clamp-1 group-hover:text-slate-800">
                          {p.name}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400">{p.sku}</div>
                      </div>

                      <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100">
                        <div className="text-sm font-bold font-mono text-slate-900">
                          ${p.sellingPrice.toFixed(2)}
                        </div>
                        <span
                          className={`text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded ${
                            isOutOfStock
                              ? 'bg-red-100 text-red-700'
                              : p.stock <= p.minimumStock
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          {isOutOfStock ? 'Out' : `${p.stock} left`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Interactive Cart Sidebar */}
        <Cart
          cartItems={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onClearCart={handleClearCart}
          selectedCustomer={selectedCustomer}
          onSelectCustomer={setSelectedCustomer}
          customers={customers}
          onOpenCheckout={() => setIsCheckoutModalOpen(true)}
        />
      </div>

      {/* Payment Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        onSubmitCheckout={handleConfirmCheckout}
        grandTotal={calculateGrandTotal()}
        selectedCustomer={selectedCustomer}
        isLoading={isLoading}
      />

      {/* Printable Digital Receipt Modal */}
      <ReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        receipt={completedReceipt}
      />
    </div>
  );
};
