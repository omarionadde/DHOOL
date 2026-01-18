
import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';

export const Products: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, t } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [sortConfig, setSortConfig] = useState<{ key: keyof Product; direction: 'asc' | 'desc' } | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [image, setImage] = useState<string | undefined>(undefined);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setName(''); setPrice(''); setStock(''); setImage(undefined); setEditingId(null); setShowForm(false);
  };

  const toggleForm = () => {
    if (showForm) resetForm(); else setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        const updatedProduct: Product = { id: editingId, name, price: parseFloat(price), stock: parseInt(stock), image, category: 'General' };
        await updateProduct(updatedProduct);
      } else {
        const newProduct: Product = { id: Date.now().toString(), name, price: parseFloat(price), stock: parseInt(stock), image, category: 'General' };
        await addProduct(newProduct);
      }
      resetForm();
    } catch (error) { alert("Error saving product"); }
  };

  const handleEdit = (product: Product) => {
    setName(product.name); setPrice(product.price.toString()); setStock(product.stock.toString()); setImage(product.image); setEditingId(product.id); setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(t('confirmDelete'))) { await deleteProduct(id); }
  };

  const handleSort = (key: keyof Product) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const processedProducts = useMemo(() => {
    let filtered = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (sortConfig !== null) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (aValue === undefined || bValue === undefined) return 0;
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return filtered;
  }, [products, sortConfig, searchTerm]);

  const getSortIcon = (key: keyof Product) => {
    if (sortConfig?.key !== key) return <span className="opacity-20 ml-1">↕</span>;
    return sortConfig.direction === 'asc' ? <span className="ml-1">↑</span> : <span className="ml-1">↓</span>;
  };

  return (
    <div className="p-4 md:p-6 pb-24 md:pb-6 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{t('products')}</h2>
        
        <div className="flex flex-1 w-full md:w-auto gap-3">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input 
              type="text" 
              placeholder={t('searchPlaceholder')} 
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={toggleForm}
            className={`px-4 py-2 rounded-xl text-sm font-bold shadow-md transition-colors flex items-center gap-2 whitespace-nowrap ${showForm ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
          >
            {showForm ? t('cancel') : `+ ${t('products')}`}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-8 animate-fade-in-up">
           <h3 className="font-bold text-lg mb-4 text-gray-800">{editingId ? 'Edit Product' : 'Add New Product'}</h3>
           <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl p-6 mb-4 cursor-pointer hover:bg-gray-50 relative">
                 <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                 {image ? <img src={image} alt="Preview" className="h-32 object-contain" /> : (
                   <div className="text-center text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-2"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                      <p className="text-xs font-bold">Click to Upload Image</p>
                   </div>
                 )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                   <label className="text-xs font-bold text-gray-500 uppercase ml-1">Product Name</label>
                   <input required placeholder="e.g. Panadol" value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:border-blue-500 focus:outline-none mt-1" />
                </div>
                <div>
                   <label className="text-xs font-bold text-gray-500 uppercase ml-1">Price ($)</label>
                   <input required type="number" placeholder="0.00" value={price} onChange={e => setPrice(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:border-blue-500 focus:outline-none mt-1" />
                </div>
                <div>
                   <label className="text-xs font-bold text-gray-500 uppercase ml-1">Stock Quantity</label>
                   <input required type="number" placeholder="0" value={stock} onChange={e => setStock(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:border-blue-500 focus:outline-none mt-1" />
                </div>
              </div>
              <button type="submit" className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all">
                {editingId ? 'Update Product' : 'Save Product'}
              </button>
           </form>
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-bold">
            <tr>
              <th className="p-4 cursor-pointer hover:bg-gray-100 transition-colors select-none" onClick={() => handleSort('name')}>Item {getSortIcon('name')}</th>
              <th className="p-4 cursor-pointer hover:bg-gray-100 transition-colors select-none" onClick={() => handleSort('price')}>Price {getSortIcon('price')}</th>
              <th className="p-4 cursor-pointer hover:bg-gray-100 transition-colors select-none" onClick={() => handleSort('stock')}>Stock {getSortIcon('stock')}</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {processedProducts.map(product => (
              <tr key={product.id} className="hover:bg-gray-50 transition-colors group">
                <td className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden border border-gray-200">
                     {product.image ? <img src={product.image} alt="" className="w-full h-full object-cover" /> : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21 16-4 5-7.5-6-4.5 4"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                        </div>
                     )}
                  </div>
                  <span className="font-bold text-gray-700 text-sm">{product.name}</span>
                </td>
                <td className="p-4 text-sm font-medium">${product.price}</td>
                <td className="p-4">
                  <span className={`text-xs px-2 py-1 rounded-full font-bold ${product.stock < 5 ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
                    {product.stock}
                  </span>
                </td>
                <td className="p-4 text-right flex justify-end gap-2">
                  <button onClick={() => handleEdit(product)} className="text-gray-400 hover:text-blue-600 p-2 rounded-full hover:bg-blue-50 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                  </button>
                  <button onClick={() => handleDelete(product.id)} className="text-gray-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {processedProducts.length === 0 && <div className="p-8 text-center text-gray-400">No products found.</div>}
      </div>
    </div>
  );
};
