import React from 'react';
import { Tab } from '../types';
import { useApp } from '../context/AppContext';

export const BottomNavigation: React.FC = () => {
  const { activeTab, setActiveTab, t } = useApp();
  
  const getTabColor = (tab: Tab) => activeTab === tab ? "text-blue-600" : "text-gray-400 hover:text-gray-600";

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 pb-safe pt-2 px-4 h-20 flex justify-around items-end z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      
      <button onClick={() => setActiveTab(Tab.DASHBOARD)} className={`flex flex-col items-center mb-3 w-14 ${getTabColor(Tab.DASHBOARD)}`}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
        <span className="text-[10px] mt-1 font-medium">{t('dashboard')}</span>
      </button>

      <button onClick={() => setActiveTab(Tab.PRODUCTS)} className={`flex flex-col items-center mb-3 w-14 ${getTabColor(Tab.PRODUCTS)}`}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 7h-9"/><path d="M14 17H5"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/></svg>
        <span className="text-[10px] mt-1 font-medium">{t('products')}</span>
      </button>

      <div className="relative -top-6">
        <button 
          onClick={() => setActiveTab(Tab.POS)}
          className="bg-blue-600 text-white w-14 h-14 rounded-full shadow-lg border-4 border-gray-50 hover:bg-blue-700 hover:shadow-xl transition-all active:scale-95 flex items-center justify-center"
        >
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
        </button>
        <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-gray-500">{t('pos')}</span>
      </div>

      <button onClick={() => setActiveTab(Tab.PATIENTS)} className={`flex flex-col items-center mb-3 w-14 ${getTabColor(Tab.PATIENTS)}`}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><circle cx="19" cy="11" r="3"/></svg>
        <span className="text-[10px] mt-1 font-medium">{t('patients')}</span>
      </button>

      <button onClick={() => setActiveTab(Tab.APPOINTMENTS)} className={`flex flex-col items-center mb-3 w-14 ${getTabColor(Tab.APPOINTMENTS)}`}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        <span className="text-[10px] mt-1 font-medium">{t('appointments')}</span>
      </button>

    </div>
  );
};