import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const Settings: React.FC = () => {
  const { user, language, setLanguage, logout, updateCurrentUser, t } = useApp();
  
  // Profile Editing State
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [password, setPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const result = await updateCurrentUser(name, password);
    setIsSaving(false);
    if (result.success) {
      setIsEditing(false);
      setPassword(''); // Clear password field
      alert(t('profileUpdated'));
    } else {
      alert(`${t('updateError')}\nReason: ${result.error}`);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto pb-24">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('settings')}</h2>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
           <h3 className="font-bold text-lg text-gray-800">{t('profileInfo')}</h3>
           <button 
             onClick={() => {
               setIsEditing(!isEditing);
               setName(user?.name || '');
               setPassword('');
             }}
             className="text-blue-600 text-sm font-bold hover:underline"
           >
             {isEditing ? t('cancel') : t('editProfile')}
           </button>
        </div>

        {!isEditing ? (
          <div className="flex items-center gap-4 mb-2">
            <img src={user?.avatar} alt="Avatar" className="w-16 h-16 rounded-full border border-gray-200" />
            <div>
              <p className="font-bold text-lg">{user?.name}</p>
              <p className="text-gray-500 text-sm">{user?.email}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase">{user?.role}</span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleUpdateProfile} className="space-y-4 animate-fade-in">
             <div>
               <label className="text-xs font-bold text-gray-500 uppercase">{t('name')}</label>
               <input 
                 value={name} 
                 onChange={e => setName(e.target.value)} 
                 className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:border-blue-500 mt-1" 
               />
             </div>
             <div>
               <label className="text-xs font-bold text-gray-500 uppercase">{t('password')} (Optional)</label>
               <input 
                 type="password"
                 placeholder="Leave empty to keep current"
                 value={password} 
                 onChange={e => setPassword(e.target.value)} 
                 className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:border-blue-500 mt-1" 
               />
             </div>
             <button 
               type="submit" 
               disabled={isSaving}
               className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
             >
               {isSaving ? 'Saving...' : t('update')}
             </button>
          </form>
        )}
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-6">
        <h3 className="font-bold text-lg mb-4 text-gray-800">{t('appSettings')}</h3>
        
        <div className="flex items-center justify-between py-4 border-b border-gray-50">
          <div>
            <p className="font-bold text-gray-700">{t('language')}</p>
            <p className="text-xs text-gray-400">{t('chooseLanguage')}</p>
          </div>
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value as any)}
            className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-bold focus:outline-none"
          >
            <option value="so">Somali</option>
            <option value="en">English</option>
          </select>
        </div>

        <div className="flex items-center justify-between py-4">
           <div>
            <p className="font-bold text-gray-700">{t('dbConnection')}</p>
            <p className="text-xs text-green-600 font-medium">● {t('connected')}</p>
          </div>
        </div>
      </div>

      <button 
        onClick={logout}
        className="w-full bg-red-50 text-red-600 font-bold py-4 rounded-xl hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
        {t('signOut')}
      </button>
    </div>
  );
};