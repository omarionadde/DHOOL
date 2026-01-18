import React from 'react';
import { useApp } from '../context/AppContext';
import { CartItem } from '../types';
import { Logo } from './Logo';

interface InvoiceProps {
  items: CartItem[];
  total: number;
  paidAmount: number;
  balance: number;
  date: string;
  transactionId: string;
  method: string;
  patientName?: string;
  onClose: () => void;
}

declare const html2pdf: any;

export const Invoice: React.FC<InvoiceProps> = ({ items, total = 0, paidAmount = 0, balance = 0, date, transactionId, method, patientName, onClose }) => {
  const { t } = useApp();
  
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    const element = document.getElementById('invoice-content');
    if (!element) return;
    const opt = {
      margin: 0,
      filename: `Dhool_Invoice_${transactionId.slice(-6)}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    if (typeof html2pdf !== 'undefined') {
       html2pdf().set(opt).from(element).save();
    } else {
       alert("PDF library loading... please try again in 2 seconds.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-[60] flex items-center justify-center p-4 backdrop-blur-sm print:bg-white print:p-0 print:static">
      <div className="bg-white w-full max-w-sm rounded-xl shadow-2xl overflow-hidden print:shadow-none print:w-full print:max-w-none">
        
        {/* Print Content Area */}
        <div id="invoice-content" className="p-6 text-gray-800 font-mono text-sm bg-white">
          
          <div className="flex flex-col items-center justify-center mb-4 border-b-2 border-dashed border-gray-300 pb-4">
            <Logo variant="invoice" className="w-auto h-auto" />
          </div>

          <div className="mb-4 text-xs">
            <div className="flex justify-between mb-1">
              <span>{t('date')}: {date}</span>
              <span>#{transactionId.slice(-6)}</span>
            </div>
            {patientName && <div className="font-bold border-y border-gray-100 py-1 mb-1">Patient: {patientName}</div>}
            <div className="flex justify-between">
              <span>{t('method')}: {method}</span>
              <span>{t('cashier')}: Admin</span>
            </div>
          </div>

          <table className="w-full mb-4">
            <thead>
              <tr className="border-b border-gray-300 text-left">
                <th className="py-1">{t('item')}</th>
                <th className="py-1 text-center">{t('qty')}</th>
                <th className="py-1 text-right">{t('price')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dashed divide-gray-200">
              {items.map((item, index) => (
                <tr key={index}>
                  <td className="py-2">{item.name}</td>
                  <td className="py-2 text-center">{item.quantity}</td>
                  <td className="py-2 text-right">${((Number(item.price) || 0) * (Number(item.quantity) || 0)).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="border-t-2 border-dashed border-gray-300 pt-3 mb-6 space-y-1">
            <div className="flex justify-between font-bold text-base">
              <span>{t('total')}</span>
              <span>${(Number(total) || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-green-700">
              <span>{t('amountPaid')}</span>
              <span>${(Number(paidAmount) || 0).toFixed(2)}</span>
            </div>
            {(Number(balance) || 0) > 0 && (
              <div className="flex justify-between text-red-600 font-bold">
                <span>{t('balanceDue')}</span>
                <span>${(Number(balance) || 0).toFixed(2)}</span>
              </div>
            )}
          </div>

          <div className="text-center text-xs text-gray-500">
            <p className="mb-1">{t('invoiceFooter')}</p>
            <div className="mt-4 pt-2 border-t border-gray-100 flex items-center justify-center gap-1 opacity-50">
               <span className="text-[8px]">{t('poweredBy')}</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-50 flex gap-3 print:hidden border-t border-gray-100 flex-col sm:flex-row">
          <button 
            onClick={onClose}
            className="flex-1 py-3 text-gray-600 font-bold bg-white border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors"
          >
            {t('cancel')}
          </button>
          
          <button 
            onClick={handleDownloadPDF}
            className="flex-1 py-3 text-gray-700 font-bold bg-gray-100 rounded-xl hover:bg-gray-200 flex items-center justify-center gap-2"
          >
            {/* Fix: Duplicate x2 attribute removed and changed to y2 for the arrow stem */}
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            PDF
          </button>

          <button 
            onClick={handlePrint}
            className="flex-1 py-3 text-white font-bold bg-blue-600 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>
            Print
          </button>
        </div>

      </div>
    </div>
  );
};