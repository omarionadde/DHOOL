import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Login } from './pages/Login';
import { Dashboard } from './components/Dashboard';
import { Products } from './pages/Products';
import { POS } from './pages/POS';
import { Patients } from './pages/Patients';
import { Appointments } from './pages/Appointments';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';
import { AdminPanel } from './pages/AdminPanel';
import { Expenses } from './pages/Expenses';
import { Sidebar } from './components/Sidebar';
import { BottomNavigation } from './components/BottomNavigation';
import { Tab } from './types';

const AppContent: React.FC = () => {
  const { user, activeTab, isLoading } = useApp();

  if (!user) {
    return <Login />;
  }

  // Loading Screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
        <p className="text-blue-900 font-bold animate-pulse">Loading DHOOL System...</p>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case Tab.DASHBOARD: return <Dashboard />;
      case Tab.PRODUCTS: return <Products />;
      case Tab.POS: return <POS />;
      case Tab.PATIENTS: return <Patients />;
      case Tab.APPOINTMENTS: return <Appointments />;
      case Tab.EXPENSES: return <Expenses />;
      // Secure Reports Route
      case Tab.REPORTS: return (user.role === 'Admin' || user.role === 'Accountant') ? <Reports /> : <div className="flex h-full items-center justify-center text-red-500 font-bold">Access Denied: Admin Only</div>;
      case Tab.SETTINGS: return <Settings />;
      // Secure Admin Route
      case Tab.ADMIN: return user.role === 'Admin' ? <AdminPanel /> : <div className="flex h-full items-center justify-center text-red-500 font-bold">Access Denied: Admin Only</div>;
      default: return <div className="p-6 text-center text-gray-500 mt-20">Page under construction</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex">
       {/* Desktop Sidebar */}
       <Sidebar />
       
       {/* Main Content */}
       <main className="flex-1 overflow-x-hidden relative h-screen overflow-y-auto">
         {renderContent()}
         <BottomNavigation />
       </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;