
import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Patient, PatientHistory, Prescription, Transaction } from '../types';

export const Patients: React.FC = () => {
  const { patients, transactions, addPatient, deletePatient, patientHistory, addPatientHistory, prescriptions, addPrescription, user, t } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // New Patient Form
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  const [condition, setCondition] = useState('');

  // History Form
  const [diagnosis, setDiagnosis] = useState('');
  const [treatment, setTreatment] = useState('');
  const [notes, setNotes] = useState('');

  // Prescription Form
  const [medName, setMedName] = useState('');
  const [medDosage, setMedDosage] = useState('');
  const [medFrequency, setMedFrequency] = useState('');
  const [medDuration, setMedDuration] = useState('');
  const [currentMeds, setCurrentMeds] = useState<{name:string, dosage:string, frequency:string, duration:string}[]>([]);

  const [detailTab, setDetailTab] = useState<'info' | 'history' | 'prescription' | 'billing'>('info');

  const handleAddPatient = (e: React.FormEvent) => {
    e.preventDefault();
    const newPatient: Patient = {
      id: Date.now().toString(),
      name,
      age: parseInt(age),
      phone,
      lastVisit: new Date().toISOString().split('T')[0],
      condition: condition || 'Checkup'
    };
    addPatient(newPatient);
    setShowAddModal(false);
    setName(''); setAge(''); setPhone(''); setCondition('');
  };

  const handleDeletePatient = (id: string, name: string) => {
    if (window.confirm(`${t('confirmDelete')} (${name})?`)) {
      deletePatient(id);
    }
  };

  const handleAddHistory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;
    const newHistory: PatientHistory = {
      id: Date.now().toString(),
      patientId: selectedPatient.id,
      date: new Date().toISOString().split('T')[0],
      diagnosis,
      treatment,
      notes,
      doctorName: user?.name || 'Dr.'
    };
    await addPatientHistory(newHistory);
    setDiagnosis(''); setTreatment(''); setNotes('');
  };

  const filteredPatients = useMemo(() => {
    return patients.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.phone.includes(searchTerm)
    );
  }, [patients, searchTerm]);

  const addMedToPrescription = () => {
    if (!medName) return;
    setCurrentMeds([...currentMeds, { name: medName, dosage: medDosage, frequency: medFrequency, duration: medDuration }]);
    setMedName(''); setMedDosage(''); setMedFrequency(''); setMedDuration('');
  };

  const handleSavePrescription = async () => {
    if (!selectedPatient || currentMeds.length === 0) return;
    const newRx: Prescription = { id: Date.now().toString(), patientId: selectedPatient.id, doctorName: user?.name || 'Dr.', date: new Date().toISOString().split('T')[0], medicines: currentMeds };
    await addPrescription(newRx);
    setCurrentMeds([]);
  };

  const getPatientBalance = (patientId: string) => {
    return transactions
      .filter(tx => tx.patientId === patientId)
      .reduce((sum, tx) => sum + (Number(tx.balance) || 0), 0);
  };

  const printPrescription = (rx: Prescription) => {
    const printWindow = window.open('', '', 'height=600,width=800');
    if (!printWindow) return;
    const patient = patients.find(p => p.id === rx.patientId);
    printWindow.document.write('<html><head><title>Prescription</title><style>body { font-family: sans-serif; padding: 40px; color: #333; }.header { text-align: center; border-bottom: 2px solid #0052cc; padding-bottom: 20px; margin-bottom: 30px; }.logo { font-size: 28px; font-weight: 900; color: #0052cc; letter-spacing: -1px; margin-bottom: 5px; }.sub-logo { font-size: 10px; font-weight: bold; color: #00cc66; letter-spacing: 2px; text-transform: uppercase; }.clinic-info { font-size: 12px; color: #666; margin-top: 10px; }.patient-box { background: #f9fafb; padding: 15px; border-radius: 8px; border: 1px solid #eee; display: flex; justify-content: space-between; margin-bottom: 30px; font-size: 14px; }.rx-symbol { font-size: 40px; font-weight: bold; font-style: italic; margin-bottom: 10px; color: #0052cc; font-family: serif; }.med-list { width: 100%; border-collapse: collapse; margin-bottom: 50px; }.med-list th { text-align: left; border-bottom: 2px solid #eee; padding: 10px 5px; color: #888; font-size: 12px; text-transform: uppercase; }.med-list td { padding: 12px 5px; border-bottom: 1px solid #eee; font-size: 14px; }.footer { margin-top: 50px; display: flex; justify-content: space-between; font-size: 12px; align-items: flex-end; }.signature { border-top: 1px solid #000; padding-top: 10px; width: 200px; text-align: center; font-weight: bold; }.tagline { font-style: italic; color: #888; }</style></head><body>');
    printWindow.document.write(`<div class="header"><div class="logo">DHOOL</div><div class="sub-logo">Dental Clinic</div><div class="clinic-info">Maka Al-Mukarama Rd, Mogadishu | Tel: +252 61 5000000</div></div><div class="patient-box"><div><div style="color:#888; font-size:10px; text-transform:uppercase;">Patient Name</div><div style="font-weight:bold; font-size:16px;">${patient?.name}</div><div style="margin-top:5px;">Age: ${patient?.age}</div></div><div style="text-align:right;"><div style="color:#888; font-size:10px; text-transform:uppercase;">Date</div><div style="font-weight:bold;">${rx.date}</div><div style="margin-top:5px;">Dr. ${rx.doctorName}</div></div></div><div class="rx-symbol">Rx</div><table class="med-list"><thead><tr><th width="40%">Medicine</th><th width="20%">Dosage</th><th width="20%">Frequency</th><th width="20%">Duration</th></tr></thead><tbody>${rx.medicines.map(m => `<tr><td><strong>${m.name}</strong></td><td>${m.dosage}</td><td>${m.frequency}</td><td>${m.duration}</td></tr>`).join('')}</tbody></table><div class="footer"><div class="tagline">Your smile is our mission.</div><div class="signature">Doctor's Signature</div></div>`);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="p-4 md:p-6 pb-24 md:pb-6 max-w-5xl mx-auto relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{t('patients')}</h2>
        
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
             onClick={() => setShowAddModal(true)}
             className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md hover:bg-blue-700 transition-colors whitespace-nowrap"
          >
            + New Patient
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPatients.map(patient => {
          const balance = getPatientBalance(patient.id);
          return (
            <div key={patient.id} onClick={() => { setSelectedPatient(patient); setDetailTab('info'); }} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden">
               {balance > 0 && (
                 <div className="absolute top-0 left-0 bg-red-500 text-white text-[10px] px-3 py-1 font-bold rounded-br-lg shadow-sm">
                   Balance: ${balance.toFixed(2)}
                 </div>
               )}
               <button 
                  onClick={(e) => { e.stopPropagation(); handleDeletePatient(patient.id, patient.name); }}
                  className="absolute top-2 right-2 p-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity z-10"
               >
                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
               </button>
               
               <div className="flex items-center gap-4 mb-4 mt-2">
                 <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform">
                   {patient.name.charAt(0)}
                 </div>
                 <div>
                   <h3 className="font-bold text-gray-800">{patient.name}</h3>
                   <p className="text-xs text-gray-400">{patient.phone}</p>
                 </div>
               </div>
               <div className="bg-gray-50 rounded-xl p-3 text-sm">
                  <div className="flex justify-between mb-1"><span className="text-gray-500">Age</span><span className="font-bold text-gray-800">{patient.age}</span></div>
                  <div className="flex justify-between mb-1"><span className="text-gray-500">Condition</span><span className="font-bold text-blue-600">{patient.condition}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Last Visit</span><span className="font-bold text-gray-800">{patient.lastVisit}</span></div>
               </div>
            </div>
          );
        })}
      </div>
      
      {filteredPatients.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
             <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-400 mb-4">
               <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>
             </div>
             <h3 className="text-lg font-bold text-gray-700">No Patients Found</h3>
          </div>
      )}

      {/* Add Patient Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold mb-4">Register New Patient</h3>
            <form onSubmit={handleAddPatient} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Full Name</label>
                <input required value={name} onChange={setName} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:border-blue-500 mt-1" />
              </div>
              <div className="flex gap-4">
                <div className="w-1/3">
                   <label className="text-xs font-bold text-gray-500 uppercase">Age</label>
                   <input required type="number" value={age} onChange={e => setAge(e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:border-blue-500 mt-1" />
                </div>
                <div className="flex-1">
                   <label className="text-xs font-bold text-gray-500 uppercase">Phone</label>
                   <input required value={phone} onChange={e => setPhone(e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:border-blue-500 mt-1" />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Initial Condition</label>
                <input value={condition} onChange={e => setCondition(e.target.value)} placeholder="e.g., Toothache" className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:border-blue-500 mt-1" />
              </div>
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-3 text-gray-600 font-bold bg-gray-100 rounded-xl hover:bg-gray-200">Cancel</button>
                <button type="submit" className="flex-1 py-3 text-white font-bold bg-blue-600 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Patient Details Modal */}
      {selectedPatient && (
         <div className="fixed inset-0 bg-black bg-opacity-60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
           <div className="bg-white rounded-3xl w-full max-w-4xl h-[90vh] shadow-2xl overflow-hidden flex flex-col">
              <div className="bg-blue-600 text-white p-6 flex justify-between items-start">
                 <div>
                   <h2 className="text-3xl font-bold">{selectedPatient.name}</h2>
                   <p className="opacity-80 text-sm mt-1">{selectedPatient.age} years old | {selectedPatient.phone}</p>
                 </div>
                 <button onClick={() => setSelectedPatient(null)} className="text-white bg-blue-700 p-2 rounded-full hover:bg-blue-800 transition-colors">
                   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                 </button>
              </div>
              
              <div className="flex border-b border-gray-200 overflow-x-auto no-scrollbar bg-white sticky top-0 z-10">
                 <button onClick={() => setDetailTab('info')} className={`flex-1 min-w-[120px] py-4 font-bold text-xs uppercase tracking-wider ${detailTab === 'info' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' : 'text-gray-500 hover:bg-gray-50'}`}>Info</button>
                 <button onClick={() => setDetailTab('history')} className={`flex-1 min-w-[120px] py-4 font-bold text-xs uppercase tracking-wider ${detailTab === 'history' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' : 'text-gray-500 hover:bg-gray-50'}`}>Diagnosis</button>
                 <button onClick={() => setDetailTab('prescription')} className={`flex-1 min-w-[120px] py-4 font-bold text-xs uppercase tracking-wider ${detailTab === 'prescription' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' : 'text-gray-500 hover:bg-gray-50'}`}>Prescriptions</button>
                 <button onClick={() => setDetailTab('billing')} className={`flex-1 min-w-[120px] py-4 font-bold text-xs uppercase tracking-wider ${detailTab === 'billing' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' : 'text-gray-500 hover:bg-gray-50'}`}>
                    Billing {getPatientBalance(selectedPatient.id) > 0 && <span className="ml-1 bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full text-[9px] font-black tracking-normal">!</span>}
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                 {detailTab === 'info' && (
                    <div className="space-y-4">
                      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-gray-800 mb-4">Personal Details</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div><label className="text-xs text-gray-400 uppercase">Full Name</label><p className="font-bold text-gray-800">{selectedPatient.name}</p></div>
                          <div><label className="text-xs text-gray-400 uppercase">Phone</label><p className="font-bold text-gray-800">{selectedPatient.phone}</p></div>
                          <div><label className="text-xs text-gray-400 uppercase">Age</label><p className="font-bold text-gray-800">{selectedPatient.age}</p></div>
                          <div><label className="text-xs text-gray-400 uppercase">Last Visit</label><p className="font-bold text-gray-800">{selectedPatient.lastVisit}</p></div>
                        </div>
                      </div>
                    </div>
                 )}
                 
                 {detailTab === 'history' && (
                    <div className="space-y-6">
                      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-gray-800 mb-4">Add Diagnosis</h3>
                        <form onSubmit={handleAddHistory} className="space-y-4">
                          <div><label className="text-xs font-bold text-gray-500 uppercase">Diagnosis (Xanuunka)</label><input required value={diagnosis} onChange={e => setDiagnosis(e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:border-blue-500 mt-1" /></div>
                          <div><label className="text-xs font-bold text-gray-500 uppercase">Treatment (Daawaynta)</label><textarea required value={treatment} onChange={e => setTreatment(e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:border-blue-500 mt-1 h-20 resize-none" /></div>
                          <div><label className="text-xs font-bold text-gray-500 uppercase">Notes (Faahfaahin)</label><textarea value={notes} onChange={e => setNotes(e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:border-blue-500 mt-1 h-20 resize-none" /></div>
                          <button type="submit" className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700">Save Record</button>
                        </form>
                      </div>
                      <h3 className="font-bold text-gray-800">History Log</h3>
                      {patientHistory.filter(h => h.patientId === selectedPatient.id).length === 0 ? (
                         <p className="text-gray-400 text-center py-4">No history records found.</p>
                      ) : (
                         patientHistory.filter(h => h.patientId === selectedPatient.id).map(history => (
                           <div key={history.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 relative pl-4 border-l-4 border-l-blue-500">
                             <div className="flex justify-between mb-2"><span className="font-bold text-blue-800">{history.diagnosis}</span><span className="text-xs text-gray-500">{history.date}</span></div>
                             <p className="text-sm text-gray-600 mb-2"><strong>Treatment:</strong> {history.treatment}</p>
                             {history.notes && <p className="text-sm text-gray-500 italic">"{history.notes}"</p>}
                             <p className="text-xs text-gray-400 mt-2 text-right">Dr. {history.doctorName}</p>
                           </div>
                         ))
                      )}
                    </div>
                 )}

                 {detailTab === 'prescription' && (
                    <div className="space-y-6">
                      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-gray-800 mb-4">Create Prescription</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                          <input placeholder="Medicine Name" value={medName} onChange={e => setMedName(e.target.value)} className="p-2 border rounded-lg text-sm bg-gray-50" />
                          <input placeholder="Dosage (500mg)" value={medDosage} onChange={e => setMedDosage(e.target.value)} className="p-2 border rounded-lg text-sm bg-gray-50" />
                          <input placeholder="Freq (2x1)" value={medFrequency} onChange={e => setMedFrequency(e.target.value)} className="p-2 border rounded-lg text-sm bg-gray-50" />
                          <input placeholder="Duration (5 days)" value={medDuration} onChange={e => setMedDuration(e.target.value)} className="p-2 border rounded-lg text-sm bg-gray-50" />
                        </div>
                        <button onClick={addMedToPrescription} type="button" className="w-full py-2 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 mb-4 border border-gray-200">+ Add Medicine to List</button>
                        {currentMeds.length > 0 && (
                          <div className="mb-4 bg-blue-50 p-4 rounded-xl border border-blue-100">
                            <h4 className="font-bold text-blue-800 text-sm mb-2">Current List:</h4>
                            <ul className="space-y-1 text-sm text-blue-700">{currentMeds.map((m, i) => (<li key={i}>• {m.name} - {m.dosage} ({m.frequency} for {m.duration})</li>))}</ul>
                          </div>
                        )}
                        <button onClick={handleSavePrescription} disabled={currentMeds.length === 0} className="w-full py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 disabled:opacity-50">Save Prescription</button>
                      </div>
                      <h3 className="font-bold text-gray-800">Previous Prescriptions</h3>
                      {prescriptions.filter(p => p.patientId === selectedPatient.id).length === 0 ? (
                        <p className="text-gray-400 text-center py-4">No prescriptions found.</p>
                      ) : (
                        prescriptions.filter(p => p.patientId === selectedPatient.id).map(rx => (
                          <div key={rx.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                            <div><p className="font-bold text-gray-800">{rx.date}</p><p className="text-xs text-gray-500">{rx.medicines.length} Medicines • {rx.doctorName}</p></div>
                            <button onClick={() => printPrescription(rx)} className="px-4 py-2 bg-gray-900 text-white text-xs font-bold rounded-lg hover:bg-black flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>Print</button>
                          </div>
                        ))
                      )}
                    </div>
                 )}

                 {detailTab === 'billing' && (
                    <div className="space-y-6">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <p className="text-gray-400 text-xs font-bold uppercase mb-1">Total Outstanding</p>
                            <h3 className="text-2xl font-black text-red-600">${getPatientBalance(selectedPatient.id).toFixed(2)}</h3>
                         </div>
                         <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <p className="text-gray-400 text-xs font-bold uppercase mb-1">Total Spent</p>
                            <h3 className="text-2xl font-black text-blue-800">${transactions.filter(tx => tx.patientId === selectedPatient.id).reduce((sum, tx) => sum + (Number(tx.total) || 0), 0).toFixed(2)}</h3>
                         </div>
                       </div>
                       
                       <h3 className="font-bold text-gray-800">Payment History</h3>
                       <div className="space-y-3">
                         {transactions.filter(tx => tx.patientId === selectedPatient.id).length === 0 ? (
                           <p className="text-gray-400 text-center py-4">No billing history found.</p>
                         ) : (
                           transactions.filter(tx => tx.patientId === selectedPatient.id).map(tx => (
                             <div key={tx.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center">
                               <div>
                                 <p className="text-xs text-gray-400 mb-1">{tx.date}</p>
                                 <div className="flex items-center gap-2">
                                    <span className="font-bold text-gray-800">Total: ${ (Number(tx.total) || 0).toFixed(2)}</span>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${ (Number(tx.balance) || 0) > 0 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                                      { (Number(tx.balance) || 0) > 0 ? `Unpaid: $${(Number(tx.balance) || 0).toFixed(2)}` : 'Paid'}
                                    </span>
                                 </div>
                               </div>
                               <div className="text-right">
                                  <p className="text-xs font-medium text-gray-500">Method: {tx.method}</p>
                                  <p className="text-xs font-bold text-green-600">Paid: ${(Number(tx.paidAmount) || 0).toFixed(2)}</p>
                               </div>
                             </div>
                           ))
                         )}
                       </div>
                    </div>
                 )}
              </div>
           </div>
         </div>
      )}
    </div>
  );
};
