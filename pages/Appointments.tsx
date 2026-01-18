
import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Appointment } from '../types';

export const Appointments: React.FC = () => {
  const { appointments, addAppointment, deleteAppointment, updateAppointmentStatus, t } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form State
  const [patientName, setPatientName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [type, setType] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const newApp: Appointment = { id: Date.now().toString(), patientName, doctorName: 'Dr. Ahmed', date, time, status: 'Pending', type };
    addAppointment(newApp);
    setShowModal(false);
    setPatientName(''); setDate(''); setTime(''); setType('');
  };

  const handleDelete = (id: string) => {
    if (window.confirm(t('confirmDelete'))) {
      deleteAppointment(id);
    }
  };

  const filteredAppointments = useMemo(() => {
    return appointments.filter(app => 
      app.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [appointments, searchTerm]);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Confirmed': return 'bg-green-100 text-green-700';
      case 'Pending': return 'bg-orange-100 text-orange-700';
      case 'Cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-4 md:p-6 pb-24 md:pb-6 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{t('appointments')}</h2>
        
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
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md hover:bg-blue-700 transition-colors whitespace-nowrap"
          >
            + Book Appointment
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="divide-y divide-gray-50">
          {filteredAppointments.map(app => (
            <div key={app.id} className="p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50 transition-colors group">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-xl bg-blue-50 flex flex-col items-center justify-center text-blue-600 font-bold border border-blue-100">
                    <span className="text-xs uppercase">{new Date(app.date).toLocaleString('default', { month: 'short' })}</span>
                    <span className="text-lg leading-none">{new Date(app.date).getDate()}</span>
                 </div>
                 <div>
                    <h3 className="font-bold text-gray-900">{app.patientName}</h3>
                    <p className="text-xs text-gray-500">{app.time} • {app.type}</p>
                 </div>
              </div>
              
              <div className="flex items-center gap-3 justify-end">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(app.status)}`}>
                  {app.status}
                </span>
                {app.status === 'Pending' && (
                  <>
                    <button onClick={() => updateAppointmentStatus(app.id, 'Confirmed')} className="p-2 text-green-600 bg-green-50 rounded-lg hover:bg-green-100">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    </button>
                    <button onClick={() => handleDelete(app.id)} className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100">
                       <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                  </>
                )}
                {app.status !== 'Pending' && (
                  <button onClick={() => handleDelete(app.id)} className="p-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                  </button>
                )}
              </div>
            </div>
          ))}
          {filteredAppointments.length === 0 && <div className="p-8 text-center text-gray-400">No appointments found</div>}
        </div>
      </div>

       {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold mb-4">Book Appointment</h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <div><label className="text-xs font-bold text-gray-500 uppercase">Patient Name</label><input required value={patientName} onChange={e => setPatientName(e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:border-blue-500 mt-1" /></div>
              <div className="flex gap-4"><div className="flex-1"><label className="text-xs font-bold text-gray-500 uppercase">Date</label><input required type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:border-blue-500 mt-1" /></div><div className="flex-1"><label className="text-xs font-bold text-gray-500 uppercase">Time</label><input required type="time" value={time} onChange={e => setTime(e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:border-blue-500 mt-1" /></div></div>
              <div><label className="text-xs font-bold text-gray-500 uppercase">Type of Visit</label><select value={type} onChange={e => setType(e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:border-blue-500 mt-1"><option value="">Select...</option><option value="Checkup">Checkup</option><option value="Cleaning">Cleaning</option><option value="Extraction">Extraction</option><option value="Root Canal">Root Canal</option></select></div>
              <div className="flex gap-3 mt-6"><button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 text-gray-600 font-bold bg-gray-100 rounded-xl hover:bg-gray-200">Cancel</button><button type="submit" className="flex-1 py-3 text-white font-bold bg-blue-600 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200">Book</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
