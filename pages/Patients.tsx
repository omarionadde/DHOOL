
import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Patient, PatientHistory, Prescription, Transaction } from '../types';

export const Patients: React.FC = () => {
  const { patients, transactions, addPatient, deletePatient, patientHistory, addPatientHistory, prescriptions, addPrescription, settleBalance, user, t } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // New Patient Form
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [bloodType, setBloodType] = useState('');
  const [allergies, setAllergies] = useState('');
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
  const [justSavedRx, setJustSavedRx] = useState<Prescription | null>(null);

  // Settle Balance State
  const [showSettleForm, setShowSettleForm] = useState(false);
  const [settleAmount, setSettleAmount] = useState('');
  const [settleMethod, setSettleMethod] = useState<'Cash' | 'EVC'>('Cash');

  const [detailTab, setDetailTab] = useState<'info' | 'history' | 'prescription' | 'billing' | 'timeline'>('info');

  const handleAddPatient = (e: React.FormEvent) => {
    e.preventDefault();
    const newPatient: Patient = {
      id: Date.now().toString(),
      name,
      age: parseInt(age),
      gender,
      phone,
      address,
      bloodType,
      allergies,
      lastVisit: new Date().toISOString().split('T')[0],
      condition: condition || 'Checkup'
    };
    addPatient(newPatient);
    setShowAddModal(false);
    resetPatientForm();
  };

  const resetPatientForm = () => {
    setName(''); setAge(''); setGender('Male'); setPhone(''); setAddress(''); setBloodType(''); setAllergies(''); setCondition('');
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
    alert("Record saved!");
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
    setJustSavedRx(null); // Clear just saved if editing new
  };

  const handleSavePrescription = async () => {
    if (!selectedPatient || currentMeds.length === 0) return;
    const newRx: Prescription = { 
      id: Date.now().toString(), 
      patientId: selectedPatient.id, 
      doctorName: user?.name || 'Dr.', 
      date: new Date().toISOString().split('T')[0], 
      medicines: currentMeds 
    };
    await addPrescription(newRx);
    setJustSavedRx(newRx);
    setCurrentMeds([]);
  };

  const getPatientBalance = (patientId: string) => {
    return transactions
      .filter(tx => tx.patientId === patientId)
      .reduce((sum, tx) => sum + (Number(tx.balance) || 0), 0);
  };

  const handleSettleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient || !settleAmount) return;
    await settleBalance(selectedPatient.id, selectedPatient.name, parseFloat(settleAmount), settleMethod);
    setSettleAmount('');
    setShowSettleForm(false);
    alert(t('paymentSuccess'));
  };

  const timelineEvents = useMemo(() => {
    if (!selectedPatient) return [];
    
    const hist = patientHistory.filter(h => h.patientId === selectedPatient.id).map(h => ({ ...h, type: 'history' }));
    const rx = prescriptions.filter(p => p.patientId === selectedPatient.id).map(p => ({ ...p, type: 'prescription' }));
    const tx = transactions.filter(t => t.patientId === selectedPatient.id).map(t => ({ ...t, type: 'billing' }));
    
    return [...hist, ...rx, ...tx].sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [selectedPatient, patientHistory, prescriptions, transactions]);

  const printPrescription = (rx: Prescription) => {
    const printWindow = window.open('', '', 'height=800,width=800');
    if (!printWindow) return;
    const patient = patients.find(p => p.id === rx.patientId);
    printWindow.document.write(`
      <html>
        <head>
          <title>DHOOL Prescription - ${patient?.name}</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #1a202c; line-height: 1.5; }
            .header { text-align: center; border-bottom: 3px solid #1155B3; padding-bottom: 20px; margin-bottom: 30px; position: relative; }
            .logo-text { font-size: 36px; font-weight: 900; color: #1155B3; letter-spacing: -1px; margin: 0; }
            .logo-subtext { font-size: 14px; font-weight: bold; color: #87D44F; text-transform: uppercase; letter-spacing: 3px; margin: 0; }
            .clinic-info { font-size: 11px; color: #718096; margin-top: 8px; }
            .patient-info { background: #f7fafc; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; display: flex; justify-content: space-between; margin-bottom: 40px; }
            .info-block label { font-size: 10px; text-transform: uppercase; font-weight: 800; color: #a0aec0; letter-spacing: 1px; display: block; margin-bottom: 2px; }
            .info-block value { font-weight: 700; font-size: 16px; color: #2d3748; }
            .rx-section { margin-bottom: 40px; }
            .rx-symbol { font-size: 60px; font-weight: 900; color: #1155B3; font-family: serif; font-style: italic; margin-bottom: 10px; line-height: 1; }
            .med-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            .med-table th { text-align: left; border-bottom: 2px solid #e2e8f0; padding: 12px 8px; color: #718096; font-size: 12px; text-transform: uppercase; font-weight: 800; }
            .med-table td { padding: 15px 8px; border-bottom: 1px solid #edf2f7; font-size: 15px; }
            .med-name { font-weight: 700; color: #2d3748; }
            .footer { margin-top: 100px; display: flex; justify-content: space-between; align-items: flex-end; }
            .signature-box { border-top: 2px solid #2d3748; width: 250px; text-align: center; padding-top: 10px; }
            .signature-label { font-size: 12px; font-weight: 700; color: #4a5568; }
            .tagline { font-style: italic; color: #a0aec0; font-size: 12px; }
            @media print {
              body { padding: 20px; }
              .header { border-bottom-color: #1155B3 !important; -webkit-print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 class="logo-text">DHOOL</h1>
            <p class="logo-subtext">Dental Clinic</p>
            <div class="clinic-info">
              Mogadihu, Somalia | Maka Al-Mukarama Road | Tel: +252 61 000 0000 | Email: care@dhool.com
            </div>
          </div>

          <div class="patient-info">
            <div class="info-block">
              <label>Patient Name</label>
              <value>${patient?.name}</value>
              <div style="margin-top:10px;">
                <label>Age / Gender</label>
                <value>${patient?.age} yrs / ${patient?.gender}</value>
              </div>
            </div>
            <div class="info-block" style="text-align: right;">
              <label>Date</label>
              <value>${rx.date}</value>
              <div style="margin-top:10px;">
                <label>Doctor</label>
                <value>Dr. ${rx.doctorName}</value>
              </div>
            </div>
          </div>

          <div class="rx-section">
            <div class="rx-symbol">Rx</div>
            <table class="med-table">
              <thead>
                <tr>
                  <th>Medicine & Strength</th>
                  <th>Dosage</th>
                  <th>Frequency</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>
                ${rx.medicines.map(m => `
                  <tr>
                    <td class="med-name">${m.name}</td>
                    <td>${m.dosage}</td>
                    <td>${m.frequency}</td>
                    <td>${m.duration}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div class="footer">
            <div class="tagline">"Your smile is our mission."</div>
            <div class="signature-box">
              <div class="signature-label">Medical Officer Signature</div>
              <div style="font-size: 10px; color: #a0aec0; margin-top: 4px;">Reg No: DHOOL-${rx.id.slice(-4)}</div>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  return (
    <div className="p-4 md:p-6 pb-24 md:pb-6 max-w-6xl mx-auto relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
           <h2 className="text-2xl font-bold text-gray-800">{t('patients')}</h2>
           <p className="text-xs text-gray-500">{patients.length} patients registered</p>
        </div>
        
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
            <div key={patient.id} onClick={() => { setSelectedPatient(patient); setDetailTab('info'); setJustSavedRx(null); }} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden">
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
                 <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform shadow-md">
                   {patient.name.charAt(0)}
                 </div>
                 <div>
                   <h3 className="font-bold text-gray-800 truncate max-w-[150px]">{patient.name}</h3>
                   <p className="text-xs text-gray-400 font-mono">{patient.phone}</p>
                 </div>
               </div>
               <div className="bg-gray-50 rounded-xl p-3 text-sm">
                  <div className="flex justify-between mb-1"><span className="text-gray-500">Age / Gender</span><span className="font-bold text-gray-800">{patient.age} / {patient.gender?.charAt(0)}</span></div>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl overflow-y-auto max-h-[90vh]">
            <h3 className="text-xl font-bold mb-4">Register New Patient</h3>
            <form onSubmit={handleAddPatient} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Full Name</label>
                <input required value={name} onChange={e => setName(e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:border-blue-500 mt-1" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="text-xs font-bold text-gray-500 uppercase">Age</label>
                   <input required type="number" value={age} onChange={e => setAge(e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:border-blue-500 mt-1" />
                </div>
                <div>
                   <label className="text-xs font-bold text-gray-500 uppercase">Gender</label>
                   <select value={gender} onChange={e => setGender(e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:border-blue-500 mt-1">
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                   </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="text-xs font-bold text-gray-500 uppercase">Phone</label>
                   <input required value={phone} onChange={e => setPhone(e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:border-blue-500 mt-1" />
                </div>
                <div>
                   <label className="text-xs font-bold text-gray-500 uppercase">Blood Type (Optional)</label>
                   <input value={bloodType} onChange={e => setBloodType(e.target.value)} placeholder="O+" className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:border-blue-500 mt-1" />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Address</label>
                <input value={address} onChange={e => setAddress(e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:border-blue-500 mt-1" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Allergies</label>
                <input value={allergies} onChange={e => setAllergies(e.target.value)} placeholder="e.g., Penicillin" className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:border-blue-500 mt-1" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Initial Condition</label>
                <input value={condition} onChange={e => setCondition(e.target.value)} placeholder="e.g., Toothache" className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:border-blue-500 mt-1" />
              </div>
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-3 text-gray-600 font-bold bg-gray-100 rounded-xl hover:bg-gray-200">Cancel</button>
                <button type="submit" className="flex-1 py-3 text-white font-bold bg-blue-600 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200">Save Patient</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Patient Details Modal */}
      {selectedPatient && (
         <div className="fixed inset-0 bg-black bg-opacity-60 z-[110] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
           <div className="bg-white rounded-3xl w-full max-w-5xl h-[92vh] shadow-2xl overflow-hidden flex flex-col">
              <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white p-6 flex justify-between items-start">
                 <div className="flex gap-4 items-center">
                   <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-blue-700 font-black text-2xl shadow-inner border-4 border-blue-500">
                      {selectedPatient.name.charAt(0)}
                   </div>
                   <div>
                     <h2 className="text-3xl font-bold tracking-tight">{selectedPatient.name}</h2>
                     <p className="opacity-90 text-sm mt-1 flex items-center gap-2">
                        <span className="bg-white/20 px-2 py-0.5 rounded uppercase font-bold text-[10px]">{selectedPatient.gender}</span>
                        <span>{selectedPatient.age} years</span>
                        <span>•</span>
                        <span>{selectedPatient.phone}</span>
                     </p>
                   </div>
                 </div>
                 <button onClick={() => setSelectedPatient(null)} className="text-white bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors">
                   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                 </button>
              </div>
              
              <div className="flex border-b border-gray-200 overflow-x-auto no-scrollbar bg-white sticky top-0 z-10">
                 <button onClick={() => setDetailTab('info')} className={`flex-1 min-w-[100px] py-4 font-bold text-xs uppercase tracking-wider transition-all ${detailTab === 'info' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' : 'text-gray-500 hover:bg-gray-50'}`}>Patient Info</button>
                 <button onClick={() => setDetailTab('history')} className={`flex-1 min-w-[100px] py-4 font-bold text-xs uppercase tracking-wider transition-all ${detailTab === 'history' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' : 'text-gray-500 hover:bg-gray-50'}`}>Treatment</button>
                 <button onClick={() => setDetailTab('prescription')} className={`flex-1 min-w-[100px] py-4 font-bold text-xs uppercase tracking-wider transition-all ${detailTab === 'prescription' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' : 'text-gray-500 hover:bg-gray-50'}`}>Medicines</button>
                 <button onClick={() => setDetailTab('billing')} className={`flex-1 min-w-[100px] py-4 font-bold text-xs uppercase tracking-wider transition-all ${detailTab === 'billing' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' : 'text-gray-500 hover:bg-gray-50'}`}>Billing</button>
                 <button onClick={() => setDetailTab('timeline')} className={`flex-1 min-w-[100px] py-4 font-bold text-xs uppercase tracking-wider transition-all ${detailTab === 'timeline' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' : 'text-gray-500 hover:bg-gray-50'}`}>History Timeline</button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 bg-gray-50 no-scrollbar">
                 {detailTab === 'info' && (
                    <div className="space-y-6">
                      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-xl text-gray-800 mb-6 flex items-center gap-2">
                           <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
                           Patient Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-4">
                             <div><label className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Full Name</label><p className="font-bold text-gray-800 text-lg">{selectedPatient.name}</p></div>
                             <div><label className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Phone Number</label><p className="font-bold text-gray-800 text-lg">{selectedPatient.phone}</p></div>
                             <div><label className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Gender / Age</label><p className="font-bold text-gray-800 text-lg">{selectedPatient.gender} • {selectedPatient.age} yrs</p></div>
                          </div>
                          <div className="space-y-4">
                             <div><label className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Address</label><p className="font-bold text-gray-800 text-lg">{selectedPatient.address || 'N/A'}</p></div>
                             <div><label className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Blood Type</label><p className="font-bold text-red-600 text-lg">{selectedPatient.bloodType || 'Unknown'}</p></div>
                             <div><label className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Allergies</label><p className={`font-bold text-lg ${selectedPatient.allergies ? 'text-orange-600' : 'text-green-600'}`}>{selectedPatient.allergies || 'None'}</p></div>
                          </div>
                        </div>
                        <div className="mt-8 pt-6 border-t border-gray-50 grid grid-cols-2 gap-4">
                           <div className="bg-blue-50 p-4 rounded-2xl">
                              <label className="text-[9px] font-black text-blue-500 uppercase tracking-widest">Initial Condition</label>
                              <p className="font-bold text-blue-900 mt-1">{selectedPatient.condition}</p>
                           </div>
                           <div className="bg-gray-50 p-4 rounded-2xl">
                              <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Last Visit Date</label>
                              <p className="font-bold text-gray-800 mt-1">{selectedPatient.lastVisit}</p>
                           </div>
                        </div>
                      </div>
                    </div>
                 )}
                 
                 {detailTab === 'history' && (
                    <div className="space-y-6">
                      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                           <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600"><path d="M12 2v20"/><path d="m5 9 7 7 7-7"/></svg>
                           Register New Treatment
                        </h3>
                        <form onSubmit={handleAddHistory} className="space-y-4">
                          <div><label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Diagnosis</label><input required placeholder="e.g. Tooth Cavity" value={diagnosis} onChange={e => setDiagnosis(e.target.value)} className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 focus:outline-none focus:border-blue-500 mt-1 font-medium" /></div>
                          <div><label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Treatment Provided</label><textarea required placeholder="Describe the procedure..." value={treatment} onChange={e => setTreatment(e.target.value)} className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 focus:outline-none focus:border-blue-500 mt-1 h-24 resize-none font-medium" /></div>
                          <div><label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Additional Notes</label><textarea placeholder="Optional notes..." value={notes} onChange={e => setNotes(e.target.value)} className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 focus:outline-none focus:border-blue-500 mt-1 h-20 resize-none font-medium" /></div>
                          <button type="submit" className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-95 uppercase tracking-widest text-xs">
                             Save Treatment Record
                          </button>
                        </form>
                      </div>
                    </div>
                 )}

                 {detailTab === 'prescription' && (
                    <div className="space-y-6">
                      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/></svg>
                            Create Prescription
                        </h3>

                        {justSavedRx ? (
                          <div className="bg-green-50 p-8 rounded-3xl border border-green-200 text-center animate-fade-in">
                             <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                             </div>
                             <h4 className="text-xl font-black text-green-800 mb-2">Prescription Saved!</h4>
                             <p className="text-green-600 text-sm mb-6">The medicines have been added to patient's record.</p>
                             <div className="flex gap-3">
                               <button 
                                 onClick={() => setJustSavedRx(null)} 
                                 className="flex-1 py-4 bg-white text-green-700 font-bold rounded-2xl border border-green-200 hover:bg-green-100 transition-all text-sm uppercase tracking-widest"
                               >
                                  Create New
                               </button>
                               <button 
                                 onClick={() => printPrescription(justSavedRx)} 
                                 className="flex-1 py-4 bg-green-600 text-white font-black rounded-2xl hover:bg-green-700 shadow-xl shadow-green-100 transition-all active:scale-95 flex items-center justify-center gap-2 text-sm uppercase tracking-widest"
                               >
                                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>
                                  Print Prescription
                               </button>
                             </div>
                          </div>
                        ) : (
                          <>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                              <input placeholder="Medicine Name" value={medName} onChange={e => setMedName(e.target.value)} className="p-3 border rounded-xl text-sm bg-gray-50 font-medium" />
                              <input placeholder="Dosage (500mg)" value={medDosage} onChange={e => setMedDosage(e.target.value)} className="p-3 border rounded-xl text-sm bg-gray-50 font-medium" />
                              <input placeholder="Freq (2x1)" value={medFrequency} onChange={e => setMedFrequency(e.target.value)} className="p-3 border rounded-xl text-sm bg-gray-50 font-medium" />
                              <input placeholder="Duration (5 days)" value={medDuration} onChange={e => setMedDuration(e.target.value)} className="p-3 border rounded-xl text-sm bg-gray-50 font-medium" />
                            </div>
                            <button onClick={addMedToPrescription} type="button" className="w-full py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 mb-4 border border-gray-200 text-xs uppercase tracking-widest">+ Add Medicine</button>
                            
                            {currentMeds.length > 0 && (
                              <div className="mb-4 bg-green-50 p-5 rounded-2xl border border-green-100">
                                <h4 className="font-black text-green-800 text-[10px] uppercase tracking-widest mb-3">Prepared Medicines:</h4>
                                <div className="space-y-2">
                                   {currentMeds.map((m, i) => (
                                     <div key={i} className="flex justify-between items-center text-sm text-green-700 bg-white/50 p-2 rounded-lg">
                                        <span><strong>{m.name}</strong> ({m.dosage})</span>
                                        <span className="text-[10px] font-bold bg-green-200 px-2 py-0.5 rounded uppercase">{m.frequency} - {m.duration}</span>
                                     </div>
                                   ))}
                                </div>
                              </div>
                            )}
                            <button onClick={handleSavePrescription} disabled={currentMeds.length === 0} className="w-full py-4 bg-green-600 text-white font-black rounded-2xl hover:bg-green-700 disabled:opacity-50 shadow-lg shadow-green-100 uppercase tracking-widest text-xs transition-all active:scale-95">
                               Save & Generate Prescription
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                 )}

                 {detailTab === 'billing' && (
                    <div className="space-y-6">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group">
                            <div className="absolute -right-4 -top-4 w-20 h-20 bg-red-500/10 rounded-full"></div>
                            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">{t('outstanding')}</p>
                            <h3 className="text-3xl font-black text-red-600">${getPatientBalance(selectedPatient.id).toFixed(2)}</h3>
                            {getPatientBalance(selectedPatient.id) > 0 && (
                              <button 
                                onClick={() => setShowSettleForm(!showSettleForm)}
                                className="mt-4 px-6 py-2 bg-green-600 text-white text-xs font-black uppercase rounded-xl hover:bg-green-700 transition-all shadow-md active:scale-95"
                              >
                                {showSettleForm ? t('cancel') : 'Pay Balance'}
                              </button>
                            )}
                         </div>
                         <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
                            <div className="absolute -right-4 -top-4 w-20 h-20 bg-blue-500/10 rounded-full"></div>
                            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Total Treatment Cost</p>
                            <h3 className="text-3xl font-black text-blue-800">${transactions.filter(tx => tx.patientId === selectedPatient.id).reduce((sum, tx) => sum + (Number(tx.total) || 0), 0).toFixed(2)}</h3>
                         </div>
                       </div>

                       {showSettleForm && (
                         <div className="bg-white p-6 rounded-3xl border-2 border-green-200 animate-fade-in-up">
                            <h4 className="font-bold text-gray-800 mb-4 uppercase tracking-widest text-xs">Payment Method</h4>
                            <form onSubmit={handleSettleSubmit} className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Amount ($)</label>
                                  <input 
                                    required 
                                    type="number" 
                                    step="0.01" 
                                    max={getPatientBalance(selectedPatient.id)}
                                    value={settleAmount} 
                                    onChange={e => setSettleAmount(e.target.value)} 
                                    className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 focus:outline-none focus:border-green-500 mt-1 font-bold text-lg" 
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Method</label>
                                  <select 
                                    value={settleMethod} 
                                    onChange={e => setSettleMethod(e.target.value as any)} 
                                    className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 focus:outline-none focus:border-green-500 mt-1 font-bold"
                                  >
                                    <option value="Cash">Cash</option>
                                    <option value="EVC">Zaad / E-Dahab</option>
                                  </select>
                                </div>
                              </div>
                              <button type="submit" className="w-full py-4 bg-green-600 text-white font-black rounded-2xl hover:bg-green-700 shadow-xl shadow-green-100 uppercase tracking-widest text-xs">
                                Confirm Payment
                              </button>
                            </form>
                         </div>
                       )}
                    </div>
                 )}

                 {detailTab === 'timeline' && (
                    <div className="space-y-4 relative">
                       <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                          Patient History Timeline
                       </h3>
                       
                       <div className="absolute left-4 top-14 bottom-0 w-0.5 bg-gray-200"></div>
                       
                       {timelineEvents.length === 0 ? (
                         <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-100">
                            <p className="text-gray-400 font-medium">No records found for this patient.</p>
                         </div>
                       ) : (
                         timelineEvents.map((event: any, idx) => (
                           <div key={idx} className="relative pl-10 mb-8 animate-fade-in-up">
                              <div className={`absolute left-0 top-0 w-8 h-8 rounded-full flex items-center justify-center border-4 border-white shadow-sm z-10 ${
                                event.type === 'history' ? 'bg-blue-500' : 
                                event.type === 'prescription' ? 'bg-green-500' : 'bg-red-500'
                              }`}>
                                 {event.type === 'history' && <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>}
                                 {event.type === 'prescription' && <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/></svg>}
                                 {event.type === 'billing' && <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/></svg>}
                              </div>
                              
                              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                                 <div className="flex justify-between items-start mb-2">
                                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
                                      event.type === 'history' ? 'bg-blue-50 text-blue-600' : 
                                      event.type === 'prescription' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                                    }`}>
                                       {event.type === 'history' ? 'Diagnosis' : event.type === 'prescription' ? 'Prescription' : 'Billing'}
                                    </span>
                                    <span className="text-[10px] text-gray-400 font-bold">{event.date}</span>
                                 </div>
                                 
                                 {event.type === 'history' && (
                                   <>
                                     <p className="font-bold text-gray-800">{event.diagnosis}</p>
                                     <p className="text-sm text-gray-600 mt-1">{event.treatment}</p>
                                   </>
                                 )}
                                 
                                 {event.type === 'prescription' && (
                                   <div className="flex justify-between items-center">
                                      <div>
                                        <p className="font-bold text-gray-800">{event.medicines.length} Medicines</p>
                                        <ul className="text-xs text-gray-500 mt-1">
                                          {event.medicines.slice(0, 2).map((m: any, i: number) => <li key={i}>• {m.name} {m.dosage}</li>)}
                                          {event.medicines.length > 2 && <li>... and {event.medicines.length - 2} more</li>}
                                        </ul>
                                      </div>
                                      <button 
                                        onClick={() => printPrescription(event)} 
                                        className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all flex items-center gap-2 text-xs font-bold shadow-sm"
                                      >
                                         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>
                                         Print
                                      </button>
                                   </div>
                                 )}
                                 
                                 {event.type === 'billing' && (
                                   <div className="flex justify-between items-center">
                                      <div>
                                        <p className="font-bold text-gray-800">{Number(event.total) > 0 ? `Sale Total: $${Number(event.total).toFixed(2)}` : 'Balance Payment'}</p>
                                        <p className="text-xs text-green-600 font-bold mt-1">Paid: ${Number(event.paidAmount).toFixed(2)} ({event.method})</p>
                                      </div>
                                      {Number(event.balance) > 0 && (
                                        <span className="text-[10px] font-black bg-red-50 text-red-600 px-2 py-1 rounded">DEBT: ${Number(event.balance).toFixed(2)}</span>
                                      )}
                                   </div>
                                 )}
                                 
                                 <div className="mt-3 pt-3 border-t border-gray-50 text-[10px] text-gray-400 flex justify-between">
                                    <span>Staff: {event.doctorName || event.cashierName || 'System'}</span>
                                    <span>Ref: #{event.id.slice(-6)}</span>
                                 </div>
                              </div>
                           </div>
                         ))
                       )}
                    </div>
                 )}
              </div>
           </div>
         </div>
      )}
    </div>
  );
};
