
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Logo } from '../components/Logo';

export const Login: React.FC = () => {
  const { login, t, isLoading } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const result = await login(email, password);
    if (!result.success) {
      if (result.error?.includes('JSON')) {
         setError('Database connection error. Please check your internet.');
      } else {
         setError(result.error || 'Email ama Password khalad ah!');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="mb-8 text-center animate-fade-in-up">
        <Logo className="w-auto h-auto" />
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 w-full max-w-md animate-fade-in">
        <h2 className="text-xl font-bold text-gray-800 mb-6">{t('loginTitle')}</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 flex items-start gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 min-w-[16px]"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
            <span>{error}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t('email')}</label>
            <input 
              required
              type="email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@dhool.com" 
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 focus:outline-none transition-colors" 
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t('password')}</label>
            <input 
              required
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••" 
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 focus:outline-none transition-colors" 
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-blue-700 transition-all active:scale-95 mt-4 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center"
          >
            {isLoading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : t('loginBtn')}
          </button>
        </form>
        
        <div className="mt-8 pt-6 border-t border-gray-50 text-center text-xs text-gray-400">
           <p>Default Admin:</p>
           <p>Email: admin@dhool.com | Pass: admin123</p>
        </div>
      </div>
    </div>
  );
};
