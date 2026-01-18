import React from 'react';
import { StatData } from '../types';

export const StatCard: React.FC<StatData> = ({ label, value, icon, colorBg, colorText }) => {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-32 relative overflow-hidden group">
      <div className={`absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-10 transition-transform group-hover:scale-110 ${colorBg}`}></div>
      
      <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${colorBg} ${colorText}`}>
        {icon}
      </div>
      
      <div>
        <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">{label}</p>
        <p className="text-xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
};