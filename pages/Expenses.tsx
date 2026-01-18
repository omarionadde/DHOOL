
import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Expense } from '../types';

export const Expenses: React.FC = () => {
  const { expenses, addExpense, deleteExpense, t } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Expense['category']>('Other');
  const [description, setDescription] = useState('');

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const newExpense: Expense = { id: Date.now().toString(), title, amount: parseFloat(amount), category, date: new Date().toISOString().split('T')[0], description };
    await addExpense(newExpense);
    setShowModal(false);
    setTitle(''); setAmount(''); setCategory('Other'); setDescription('');
  };

  const filteredExpenses = useMemo(() => {
    return expenses.filter(exp => 
      exp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [expenses, searchTerm]);

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="p-4 md:p-6 pb-24 md:pb-6 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{t('expenses')}</h2>
          <p className="text-sm text-gray-500">Total: ${totalExpenses.toLocaleString()}</p>
        </div>
        
        <div className="flex flex-1 w-full md:w-auto gap-3">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input 
              type="text" 
              placeholder={t('searchPlaceholder')} 
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-red-500 shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
             onClick={() => setShowModal(true)}
             className="bg-red-500 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md hover:bg-red-600 transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            + {t('addExpense')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="bg-red-50 p-4 rounded-2xl border border-red-100"><p className="text-red-500 font-bold text-xs uppercase mb-1">Rent & Utilities</p><h3 className="text-xl font-bold text-gray-800">${expenses.filter(e => e.category === 'Rent' || e.category === 'Utilities').reduce((sum, e) => sum + e.amount, 0)}</h3></div>
          <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100"><p className="text-orange-500 font-bold text-xs uppercase mb-1">Supplies</p><h3 className="text-xl font-bold text-gray-800">${expenses.filter(e => e.category === 'Supplies').reduce((sum, e) => sum + e.amount, 0)}</h3></div>
           <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100"><p className="text-blue-500 font-bold text-xs uppercase mb-1">Salaries</p><h3 className="text-xl font-bold text-gray-800">${expenses.filter(e => e.category === 'Salary').reduce((sum, e) => sum + e.amount, 0)}</h3></div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
           <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase"><tr><th className="p-4">{t('date')}</th><th className="p-4">Title</th><th className="p-4">{t('category')}</th><th className="p-4 text-right">{t('amount')}</th><th className="p-4 text-right">Action</th></tr></thead>
           <tbody className="divide-y divide-gray-50">
             {filteredExpenses.map(exp => (
               <tr key={exp.id} className="hover:bg-gray-50"><td className="p-4 text-sm text-gray-500">{exp.date}</td><td className="p-4 font-bold text-gray-800">{exp.title}</td><td className="p-4"><span className="text-xs px-2 py-1 bg-gray-100 rounded-full font-bold text-gray-600">{exp.category}</span></td><td className="p-4 text-right font-bold text-red-500">-${exp.amount}</td><td className="p-4 text-right"><button onClick={() => deleteExpense(exp.id)} className="text-gray-400 hover:text-red-600"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg></button></td></tr>
             ))}
             {filteredExpenses.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-gray-400">No expenses found.</td></tr>}
           </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold mb-4">{t('addExpense')}</h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <div><label className="text-xs font-bold text-gray-500 uppercase">Title</label><input required value={title} onChange={e => setTitle(e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:border-red-500 mt-1" /></div>
              <div className="flex gap-4"><div className="flex-1"><label className="text-xs font-bold text-gray-500 uppercase">{t('amount')}</label><input required type="number" value={amount} onChange={e => setAmount(e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:border-red-500 mt-1" /></div><div className="flex-1"><label className="text-xs font-bold text-gray-500 uppercase">{t('category')}</label><select value={category} onChange={e => setCategory(e.target.value as any)} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:border-red-500 mt-1"><option value="Rent">Rent</option><option value="Utilities">Utilities</option><option value="Supplies">Supplies</option><option value="Salary">Salary</option><option value="Other">Other</option></select></div></div>
              <div><label className="text-xs font-bold text-gray-500 uppercase">{t('description')}</label><textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:border-red-500 mt-1 h-20 resize-none" /></div>
              <div className="flex gap-3 mt-6"><button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 text-gray-600 font-bold bg-gray-100 rounded-xl hover:bg-gray-200">{t('cancel')}</button><button type="submit" className="flex-1 py-3 text-white font-bold bg-red-600 rounded-xl hover:bg-red-700 shadow-lg shadow-red-200">{t('save')}</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
