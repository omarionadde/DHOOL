import React from 'react';
import { StatCard } from './StatCard';
import { SalaryList } from './SalaryList';
import { Header } from './Header';
import { StatData } from '../types';
import { useApp } from '../context/AppContext';

export const Dashboard: React.FC = () => {
  const { transactions, products, user, t, expenses } = useApp();

  // Calculate Real Stats
  const totalRevenue = transactions.reduce((sum, t) => sum + t.total, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = totalRevenue - totalExpenses;
  const lowStockCount = products.filter(p => p.stock < 5).length;

  const stats: StatData[] = [
    {
      label: t('revenue'), 
      value: `$${totalRevenue.toLocaleString()}`,
      colorBg: "bg-blue-100",
      colorText: "text-blue-600",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>
    },
    {
      label: t('expenses'),
      value: `$${totalExpenses.toLocaleString()}`,
      colorBg: "bg-red-100",
      colorText: "text-red-600",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
    },
    {
      label: t('netProfit'),
      value: `$${netProfit.toLocaleString()}`,
      colorBg: netProfit >= 0 ? "bg-green-100" : "bg-orange-100",
      colorText: netProfit >= 0 ? "text-green-600" : "text-orange-600",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
    },
    {
      label: t('lowStock'),
      value: `${lowStockCount} items`,
      colorBg: "bg-orange-100",
      colorText: "text-orange-600",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
    }
  ];

  return (
    <div className="pb-24 animate-fade-in px-4 md:px-6">
      <Header />

      {/* Greeting */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{t('welcome')}, {user?.name.split(' ')[0]} 👋</h2>
        <p className="text-gray-500">Halkaan ka maamul ganacsigaaga.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Feature: Salary List */}
        <div className="lg:col-span-2">
          <SalaryList />
        </div>

        {/* Banner/Action */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-r from-blue-900 to-blue-700 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden mb-6 h-full flex flex-col justify-center">
             <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
             <div className="relative z-10">
               <h3 className="font-bold text-lg mb-2">Warbixinta Bishaan</h3>
               <p className="text-blue-200 text-sm mb-4">
                 Wadarta Dakhliga: <br/>
                 <span className="text-2xl font-bold text-white">${totalRevenue.toLocaleString()}</span>
               </p>
               <button className="bg-white text-blue-900 px-4 py-2 rounded-lg text-xs font-bold shadow-md hover:bg-blue-50 transition-colors w-full">
                 Eeg Warbixinta oo Dhan
               </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};