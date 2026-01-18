
import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Logo } from '../components/Logo';

declare const html2pdf: any;

export const Reports: React.FC = () => {
  const { transactions, appUsers, t } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string>('all');

  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      const matchesSearch = tx.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            tx.method.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (tx.cashierName && tx.cashierName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                            (tx.patientName && tx.patientName.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesUser = selectedUserId === 'all' || tx.userId === selectedUserId;
      
      return matchesSearch && matchesUser;
    });
  }, [transactions, searchTerm, selectedUserId]);

  const totalRevenue = filteredTransactions.reduce((acc, curr) => acc + (Number(curr.total) || 0), 0);
  const totalReceived = filteredTransactions.reduce((acc, curr) => acc + (Number(curr.paidAmount) || 0), 0);
  const totalBalance = filteredTransactions.reduce((acc, curr) => acc + (Number(curr.balance) || 0), 0);
  const totalItemsSold = filteredTransactions.reduce((acc, curr) => acc + (Number(curr.items) || 0), 0);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    const element = document.getElementById('report-container');
    if (!element) return;
    const opt = {
      margin: 0.5,
      filename: `Dhool_Report_${new Date().toISOString().split('T')[0]}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape' }
    };

    if (typeof html2pdf !== 'undefined') {
       html2pdf().set(opt).from(element).save();
    } else {
       alert("Loading PDF library... try again.");
    }
  };

  return (
    <div className="p-4 md:p-6 pb-24 md:pb-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 print:hidden">
        <h2 className="text-2xl font-bold text-gray-800">{t('reports')}</h2>
        
        <div className="flex gap-3 w-full md:w-auto">
          <button 
            onClick={handleDownloadPDF}
            className="flex-1 md:flex-none px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-xl text-sm hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
            {t('downloadPdf')}
          </button>
          <button 
            onClick={handlePrint}
            className="flex-1 md:flex-none px-4 py-2 bg-blue-600 text-white font-bold rounded-xl text-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>
            {t('printReport')}
          </button>
        </div>
      </div>
      
      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 print:hidden">
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
        
        <div className="flex items-center gap-2">
          <label className="text-sm font-bold text-gray-500">{t('cashier')}:</label>
          <select 
            value={selectedUserId} 
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none shadow-sm"
          >
            <option value="all">{t('allUsers')}</option>
            {appUsers.map(u => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div id="report-container" className="space-y-8 bg-white print:p-8">
        {/* Printable Header */}
        <div className="hidden print:flex flex-col items-center mb-8 border-b-2 border-gray-100 pb-6">
           <Logo />
           <p className="text-sm text-gray-500 uppercase tracking-widest mt-4 font-bold">Sales & Revenue Report | {new Date().toLocaleDateString()}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-[#1155B3] to-[#0A3D82] rounded-2xl p-6 text-white shadow-xl shadow-blue-200">
             <p className="text-blue-100 font-medium text-xs uppercase mb-1">{t('totalRevenue')}</p>
             <h3 className="text-2xl font-bold">${totalRevenue.toFixed(2)}</h3>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
             <p className="text-green-500 font-bold text-xs uppercase mb-1">{t('amountPaid')}</p>
             <h3 className="text-2xl font-bold text-gray-800">${totalReceived.toFixed(2)}</h3>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
             <p className="text-red-500 font-bold text-xs uppercase mb-1">{t('outstanding')}</p>
             <h3 className="text-2xl font-bold text-red-600">${totalBalance.toFixed(2)}</h3>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
             <p className="text-gray-400 font-bold text-xs uppercase mb-1">{t('sales')}</p>
             <h3 className="text-2xl font-bold text-gray-800">{filteredTransactions.length}</h3>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 overflow-hidden">
          <h3 className="font-bold text-gray-800 mb-4">{t('recentTransactions')}</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-wider">
                 <tr>
                   <th className="p-3">ID</th>
                   <th className="p-3">{t('date')}</th>
                   <th className="p-3">Patient</th>
                   <th className="p-3">{t('method')}</th>
                   <th className="p-3 text-right">{t('total')}</th>
                   <th className="p-3 text-right">{t('amountPaid')}</th>
                   <th className="p-3 text-right">{t('balanceDue')}</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-gray-400">No transactions found.</td>
                  </tr>
                ) : (
                  filteredTransactions.map(tx => (
                    <tr key={tx.id} className="hover:bg-gray-50">
                      <td className="p-3 text-[10px] font-mono text-gray-400">#{tx.id.slice(-6)}</td>
                      <td className="p-3 text-xs">{tx.date}</td>
                      <td className="p-3 text-xs font-bold text-gray-700">{tx.patientName || t('generalSale')}</td>
                      <td className="p-3">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase ${tx.method === 'Zaad' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                          {tx.method}
                        </span>
                      </td>
                      <td className="p-3 text-right text-xs font-medium text-gray-500">${(Number(tx.total) || 0).toFixed(2)}</td>
                      <td className="p-3 text-right text-xs font-bold text-green-600">${(Number(tx.paidAmount) || 0).toFixed(2)}</td>
                      <td className={`p-3 text-right text-xs font-bold ${(Number(tx.balance) || 0) > 0 ? 'text-red-500' : 'text-gray-300'}`}>
                        ${(Number(tx.balance) || 0).toFixed(2)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
