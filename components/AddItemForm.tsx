import React from 'react';

export const AddItemForm: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 animate-fade-in-up">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">Ku Dar Alaab</h2>
        <button className="text-gray-400 hover:text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>

      <form className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 ml-1">Magaca Alaabta</label>
          <input 
            type="text" 
            placeholder="Gali magaca alaabta..." 
            className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-gray-100 focus:border-blue-500 focus:bg-white focus:outline-none transition-all text-sm font-medium"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 ml-1">Qiimaha</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
              <input 
                type="number" 
                placeholder="0.00" 
                className="w-full pl-8 pr-4 py-3 rounded-xl bg-gray-50 border-2 border-gray-100 focus:border-blue-500 focus:bg-white focus:outline-none transition-all text-sm font-medium"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 ml-1">Tirada</label>
            <input 
              type="number" 
              placeholder="0" 
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-gray-100 focus:border-blue-500 focus:bg-white focus:outline-none transition-all text-sm font-medium"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 ml-1">Faahfaahin</label>
          <textarea 
            rows={3} 
            placeholder="Ku qor faahfaahin dheeraad ah..." 
            className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-gray-100 focus:border-blue-500 focus:bg-white focus:outline-none transition-all text-sm font-medium resize-none"
          ></textarea>
        </div>

        <button 
          type="button" 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-blue-200 shadow-lg transform transition-transform active:scale-95 mt-2"
        >
          Ku Dar Alaabta
        </button>
      </form>
    </div>
  );
};