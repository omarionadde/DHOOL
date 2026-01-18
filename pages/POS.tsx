
import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { CartItem, Product, Patient } from '../types';
import { Invoice } from '../components/Invoice';

export const POS: React.FC = () => {
  const { products, patients, t, processSale } = useApp();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);
  
  // Checkout Details
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [phoneSearchTerm, setPhoneSearchTerm] = useState('');
  const [paidAmountInput, setPaidAmountInput] = useState<string>('');
  
  // Invoice State
  const [showInvoice, setShowInvoice] = useState(false);
  const [lastTransaction, setLastTransaction] = useState<{
    items: CartItem[];
    total: number;
    paidAmount: number;
    balance: number;
    id: string;
    method: string;
    date: string;
    patientName?: string;
  } | null>(null);

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Sync paidAmount with total by default
  useEffect(() => {
    setPaidAmountInput(total.toString());
  }, [total]);

  // Handle phone search to auto-select patient
  useEffect(() => {
    if (phoneSearchTerm.trim().length > 3) {
      const match = patients.find(p => p.phone.includes(phoneSearchTerm));
      if (match) {
        setSelectedPatientId(match.id);
      }
    }
  }, [phoneSearchTerm, patients]);

  const addToCart = (product: Product) => {
    if (product.stock <= 0) return;
    
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      if (existing.quantity >= product.stock) return; 
      setCart(cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const handleCheckout = (method: 'Cash' | 'EVC') => {
    if (cart.length === 0) return;
    
    const paid = parseFloat(paidAmountInput) || 0;
    const balance = total - paid;
    const transactionId = Date.now().toString();
    const date = new Date().toLocaleString();
    
    const patient = patients.find(p => p.id === selectedPatientId);

    // Save to DB
    processSale(
      cart.map(i => ({ id: i.id, quantity: i.quantity })), 
      total, 
      method,
      paid,
      selectedPatientId || undefined,
      patient?.name
    );
    
    // Set Invoice Data
    setLastTransaction({
      items: [...cart],
      total,
      paidAmount: paid,
      balance,
      id: transactionId,
      method: method === 'EVC' ? 'EVC / E-Dahab' : 'Cash',
      date,
      patientName: patient?.name
    });
    setShowInvoice(true);
    
    // Reset Cart & Form
    setCart([]);
    setSelectedPatientId('');
    setPhoneSearchTerm('');
    setShowCheckout(false);
  };

  return (
    <div className="h-[calc(100vh-80px)] md:h-screen flex flex-col md:flex-row overflow-hidden bg-gray-50 relative">
      
      {/* Invoice Modal */}
      {showInvoice && lastTransaction && (
        <Invoice 
          items={lastTransaction.items}
          total={lastTransaction.total}
          paidAmount={lastTransaction.paidAmount}
          balance={lastTransaction.balance}
          transactionId={lastTransaction.id}
          date={lastTransaction.date}
          method={lastTransaction.method}
          patientName={lastTransaction.patientName}
          onClose={() => setShowInvoice(false)}
        />
      )}

      {/* Product Grid */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 no-scrollbar">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <span className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            </span>
            {t('pos')}
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map(product => (
            <div 
              key={product.id} 
              onClick={() => addToCart(product)}
              className={`bg-white p-4 rounded-2xl shadow-sm border border-gray-100 cursor-pointer transition-all active:scale-95 flex flex-col ${product.stock === 0 ? 'opacity-50 grayscale pointer-events-none' : 'hover:shadow-md'}`}
            >
              <div className="h-24 bg-gray-100 rounded-xl mb-3 flex items-center justify-center text-gray-300 relative overflow-hidden">
                {product.image ? (
                   <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-xl" />
                ) : (
                   <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21 16-4 5-7.5-6-4.5 4"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                )}
                {product.stock === 0 && (
                  <div className="absolute inset-0 bg-black bg-opacity-10 flex items-center justify-center">
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">Out of Stock</span>
                  </div>
                )}
              </div>
              <h3 className="font-bold text-gray-800 text-sm mb-1">{product.name}</h3>
              <div className="flex justify-between items-center mt-auto">
                 <span className="text-blue-600 font-bold">${product.price}</span>
                 <span className={`text-[10px] px-2 py-1 rounded-full ${product.stock < 5 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                    {product.stock} {t('stock')}
                 </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Sidebar */}
      <div className={`md:w-96 bg-white border-l border-gray-100 flex flex-col shadow-2xl md:shadow-none absolute md:relative inset-0 md:inset-auto z-40 transition-transform duration-300 transform ${showCheckout ? 'translate-y-0' : 'translate-y-full md:translate-y-0'}`}>
        
        <div className="md:hidden flex justify-between items-center p-4 border-b border-gray-100">
          <h3 className="font-bold text-lg">Cart</h3>
          <button onClick={() => setShowCheckout(false)} className="p-2 bg-gray-100 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
             <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-50">
               <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
               <p className="mt-2 text-sm">Cart is empty</p>
             </div>
          ) : (
            cart.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center font-bold text-gray-400 border border-gray-100">x{item.quantity}</div>
                   <div className="max-w-[140px]">
                     <p className="font-bold text-gray-800 text-sm truncate">{item.name}</p>
                     <p className="text-xs text-gray-500">${((Number(item.price) || 0) * (Number(item.quantity) || 0)).toFixed(2)}</p>
                   </div>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600 p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Checkout Billing Details */}
        <div className="p-4 bg-blue-50 border-t border-blue-100 space-y-3 relative">
           <div>
             <label className="text-[11px] font-black text-blue-600 uppercase tracking-widest">Search No</label>
             <input 
               type="text" 
               placeholder="Search phone..."
               value={phoneSearchTerm}
               onChange={(e) => setPhoneSearchTerm(e.target.value)}
               className="w-full mt-1 p-2 bg-white border border-blue-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 shadow-sm"
             />
           </div>
           
           <div>
             <label className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">{t('selectPatient')}</label>
             <select 
               value={selectedPatientId} 
               onChange={(e) => setSelectedPatientId(e.target.value)}
               className="w-full mt-1 p-3 bg-white border border-blue-200 rounded-lg text-sm font-bold focus:outline-none focus:border-blue-500 shadow-sm"
             >
               <option value="">{t('generalSale')}</option>
               {patients.map(p => (
                 <option key={p.id} value={p.id}>{p.name} ({p.phone})</option>
               ))}
             </select>
           </div>
           
           <div className="flex gap-3">
             <div className="flex-1">
                <label className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">{t('amountPaid')}</label>
                <input 
                  type="number"
                  value={paidAmountInput}
                  onChange={(e) => setPaidAmountInput(e.target.value)}
                  className="w-full mt-1 p-2 bg-white border border-blue-200 rounded-lg text-sm font-bold focus:outline-none focus:border-blue-500"
                />
             </div>
             <div className="flex-1">
                <label className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">{t('balanceDue')}</label>
                <div className="mt-1 p-2 bg-gray-100 border border-gray-200 rounded-lg text-sm font-bold text-red-600">
                  ${(total - (parseFloat(paidAmountInput) || 0)).toFixed(2)}
                </div>
             </div>
           </div>
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-500 font-medium">{t('total')}</span>
            <span className="text-2xl font-bold text-gray-900">${total.toFixed(2)}</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => handleCheckout('Cash')}
              className="py-3 px-4 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl text-sm hover:bg-gray-50 transition-colors shadow-sm"
            >
              Cash
            </button>
            <button 
              onClick={() => handleCheckout('EVC')}
              className="py-3 px-4 bg-green-600 text-white font-bold rounded-xl text-sm hover:bg-green-700 transition-colors shadow-lg shadow-green-100"
            >
              EVC / E-Dahab
            </button>
          </div>
        </div>
      </div>

      <div className="md:hidden fixed bottom-24 right-4 z-30">
        <button 
           onClick={() => setShowCheckout(true)}
           className="bg-gray-900 text-white p-4 rounded-full shadow-xl flex items-center gap-2 relative"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
          <span className="font-bold">${total.toFixed(0)}</span>
          {cart.length > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-[10px] flex items-center justify-center border-2 border-white">{cart.length}</span>}
        </button>
      </div>

    </div>
  );
};
