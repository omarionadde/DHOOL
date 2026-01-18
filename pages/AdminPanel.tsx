
import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { User, Role } from '../types';

export const AdminPanel: React.FC = () => {
  const { appUsers, addUser, deleteUser, t, user: currentUser } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('Staff');
  const [isLoading, setIsLoading] = useState(false);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const newUser: User = { id: Date.now().toString(), name, email, password, role, avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name.replace(' ', '')}` };
    const result = await addUser(newUser);
    setIsLoading(false);
    if (result.success) {
        alert(t('userAdded')); setShowModal(false); setName(''); setEmail(''); setPassword(''); setRole('Staff');
    } else { alert(`${t('errorAddingUser')}\nReason: ${result.error}`); }
  };

  const handleDelete = async (id: string, userName: string) => {
    // Check if user is trying to delete themselves
    if (id === currentUser?.id) { 
      alert(t('deleteSelfError')); 
      return; 
    }

    // Confirmation message: "Ma hubtaa inaad tirtirto [Name]?"
    const confirmMsg = `Ma hubtaa inaad tirtirto ${userName}?`;
    if (window.confirm(confirmMsg)) {
      try {
        await deleteUser(id);
        alert(`${userName} waa la tirtiray.`);
      } catch (error) {
        alert("Khalad ayaa dhacay markii la tirtirayay user-ka.");
      }
    }
  };

  const filteredUsers = useMemo(() => {
    return appUsers.filter(u => 
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [appUsers, searchTerm]);

  return (
    <div className="p-4 md:p-6 pb-24 md:pb-6 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div><h2 className="text-2xl font-bold text-gray-800">{t('admin')}</h2><p className="text-sm text-gray-500">{t('manageAccess')}</p></div>
        
        <div className="flex flex-1 w-full md:w-auto gap-3">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input 
              type="text" 
              placeholder={t('searchPlaceholder')} 
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md hover:bg-purple-700 transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            + {t('addUser')}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-bold">
            <tr><th className="p-4">{t('name')}</th><th className="p-4">{t('email')}</th><th className="p-4">{t('role')}</th><th className="p-4 text-right">{t('actions')}</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredUsers.map(u => (
              <tr key={u.id} className="hover:bg-gray-50 transition-colors group">
                <td className="p-4 flex items-center gap-3">
                  <img src={u.avatar} className="w-8 h-8 rounded-full bg-gray-100 border border-gray-100" alt="" />
                  <span className="font-bold text-gray-800">{u.name}</span>
                  {u.id === currentUser?.id && <span className="bg-blue-100 text-blue-600 text-[10px] px-2 py-0.5 rounded-full ml-1">You</span>}
                </td>
                <td className="p-4 text-sm text-gray-600">{u.email}</td>
                <td className="p-4">
                  <span className={`text-xs px-2 py-1 rounded-full font-bold ${u.role === 'Admin' ? 'bg-purple-100 text-purple-700' : u.role === 'Doctor' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                    {u.role}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button 
                    onClick={() => handleDelete(u.id, u.name)} 
                    className={`p-2 rounded-lg transition-all ${u.id === currentUser?.id ? 'text-gray-200 cursor-not-allowed' : 'text-red-500 bg-red-50 hover:bg-red-600 hover:text-white shadow-sm'}`} 
                    title={t('delete')} 
                    disabled={u.id === currentUser?.id}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                  </button>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && <tr><td colSpan={4} className="p-6 text-center text-gray-400">No users found.</td></tr>}
          </tbody>
        </table>
      </div>

       {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold mb-4 text-gray-800">{t('addUser')}</h3>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">{t('name')}</label>
                <input required value={name} onChange={e => setName(e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:border-purple-500 mt-1" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">{t('email')}</label>
                <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:border-purple-500 mt-1" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">{t('password')}</label>
                <input required type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:border-purple-500 mt-1" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">{t('role')}</label>
                <select value={role} onChange={e => setRole(e.target.value as Role)} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:border-purple-500 mt-1">
                  <option value="Admin">Admin</option>
                  <option value="Doctor">Doctor</option>
                  <option value="Staff">Staff</option>
                  <option value="Accountant">Accountant</option>
                </select>
              </div>
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 text-gray-600 font-bold bg-gray-100 rounded-xl hover:bg-gray-200">{t('cancel')}</button>
                <button type="submit" disabled={isLoading} className="flex-1 py-3 text-white font-bold bg-purple-600 rounded-xl hover:bg-purple-700 shadow-lg shadow-purple-200">
                  {isLoading ? 'Saving...' : t('save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
