
import React from 'react';
import { Logo } from './Logo';

export const Header: React.FC = () => {
  return (
    <div className="flex items-center justify-between py-4 mb-2">
      <div className="flex items-center gap-3">
        <Logo className="w-auto h-auto" variant="compact" />
        <div>
          <h1 className="text-2xl font-black text-[#1155B3] tracking-tight leading-none">DHOOL</h1>
          <p className="text-[10px] text-[#87D44F] font-bold tracking-[0.2em] uppercase">Dental Clinic</p>
        </div>
      </div>
      
      <div className="flex gap-2">
        <button className="p-2 bg-white rounded-full text-gray-400 hover:text-blue-600 border border-gray-100 shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
        </button>
        <div className="w-9 h-9 bg-gray-200 rounded-full overflow-hidden border-2 border-white shadow-sm">
           <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
        </div>
      </div>
    </div>
  );
};
