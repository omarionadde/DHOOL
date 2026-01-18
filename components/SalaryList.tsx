
import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Employee } from '../types';

export const SalaryList: React.FC = () => {
  const { employees, addEmployee, deleteEmployee, t } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [salary, setSalary] = useState('');
  const [date, setDate] = useState('');

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    const newEmp: Employee = {
      id: Date.now().toString(),
      name,
      role,
      salary: `$${salary}`,
      date: date || new Date().toLocaleDateString(),
      initials,
      status: 'Active'
    };
    addEmployee(newEmp);
    setShowModal(false);
    setName(''); setRole(''); setSalary(''); setDate('');
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`${t('confirmDelete')} (${name})?`)) {
      deleteEmployee(id);
    }
  };

  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => 
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [employees, searchTerm]);

  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 h-full">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">{t('salaryManagement')}</h2>
          <button 
            onClick={() => setShowModal(true)}
            className="text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-xs font-semibold hover:bg-blue-100 transition-colors flex items-center gap-1"
          >
            <span className="text-lg leading-none">+</span> {t('addEmployee')}
          </button>
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input 
            type="text"
            placeholder={t('searchPlaceholder')}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4 overflow-y-auto max-h-[400px] pr-2">
        {filteredEmployees.length === 0 ? (
           <div className="text-center py-8">
             <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2 text-gray-400">
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>
             </div>
             <p className="text-gray-400 text-sm">No employees found.</p>
           </div>
        ) : (
          filteredEmployees.map((emp) => (
            <div key={emp.id} className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-100 to-blue-50 flex items-center justify-center text-blue-600 font-bold shadow-sm border border-white text-sm">
                  {emp.initials}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{emp.name}</h3>
                  <p className="text-xs text-gray-500">{emp.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-bold text-green-600">{emp.salary}</p>
                  <p className="text-[10px] text-gray-400">{emp.date}</p>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleDelete(emp.id, emp.name); }}
                  className="p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold mb-4 text-gray-800">{t('addEmployee')}</h3>
            <form onSubmit={handleAddEmployee} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">{t('fullName')}</label>
                <input required value={name} onChange={e => setName(e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:border-blue-500 mt-1" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">{t('position')}</label>
                <input required value={role} onChange={e => setRole(e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:border-blue-500 mt-1" />
              </div>
              <div className="flex gap-4">
                 <div className="flex-1">
                   <label className="text-xs font-bold text-gray-500 uppercase">{t('salary')} ($)</label>
                   <input required type="number" value={salary} onChange={e => setSalary(e.target.value)} placeholder="500" className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:border-blue-500 mt-1" />
                 </div>
                 <div className="flex-1">
                   <label className="text-xs font-bold text-gray-500 uppercase">{t('startDate')}</label>
                   <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:border-blue-500 mt-1" />
                 </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 text-gray-600 font-bold bg-gray-100 rounded-xl hover:bg-gray-200">{t('cancel')}</button>
                <button type="submit" className="flex-1 py-3 text-white font-bold bg-blue-600 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200">{t('save')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
