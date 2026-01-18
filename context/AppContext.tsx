
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, Product, Patient, Appointment, Language, Tab, Transaction, Employee, Expense, PatientHistory, Prescription } from '../types';
import { supabase } from '../lib/supabase';

interface AppContextType {
  user: User | null;
  login: (email: string, pass: string) => Promise<{success: boolean, error?: string}>;
  logout: () => void;
  updateCurrentUser: (name: string, password?: string) => Promise<{success: boolean, error?: string}>;
  isLoading: boolean;
  language: Language;
  setLanguage: (lang: Language) => void;
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  products: Product[];
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  patients: Patient[];
  addPatient: (patient: Patient) => Promise<void>;
  deletePatient: (id: string) => Promise<void>;
  appointments: Appointment[];
  addAppointment: (appointment: Appointment) => Promise<void>;
  deleteAppointment: (id: string) => Promise<void>;
  updateAppointmentStatus: (id: string, status: 'Confirmed' | 'Pending' | 'Cancelled') => Promise<void>;
  transactions: Transaction[];
  processSale: (items: {id: string, quantity: number}[], total: number, method: 'Cash' | 'Zaad', paidAmount: number, patientId?: string, patientName?: string) => Promise<void>;
  employees: Employee[];
  addEmployee: (employee: Employee) => Promise<void>;
  deleteEmployee: (id: string) => Promise<void>;
  // Expenses
  expenses: Expense[];
  addExpense: (expense: Expense) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  // Patient Details
  patientHistory: PatientHistory[];
  addPatientHistory: (history: PatientHistory) => Promise<void>;
  prescriptions: Prescription[];
  addPrescription: (prescription: Prescription) => Promise<void>;
  // User Management
  appUsers: User[];
  addUser: (user: User) => Promise<{success: boolean, error?: string}>;
  deleteUser: (id: string) => Promise<void>;
  t: (key: string) => string;
}

const translations = {
  en: {
    dashboard: 'Dashboard',
    products: 'Products',
    pos: 'POS',
    patients: 'Patients',
    appointments: 'Appointments',
    expenses: 'Expenses',
    reports: 'Reports',
    settings: 'Settings',
    admin: 'Admin Panel',
    welcome: 'Welcome back',
    lowStock: 'Low Stock',
    revenue: 'Revenue',
    addToCart: 'Add to Cart',
    total: 'Total',
    checkout: 'Checkout',
    stock: 'Stock',
    loginTitle: 'Login to DHOOL',
    email: 'Email',
    password: 'Password',
    loginBtn: 'Login',
    logout: 'Logout',
    addUser: 'Add User',
    role: 'Role',
    name: 'Name',
    save: 'Save',
    cancel: 'Cancel',
    users: 'Users',
    delete: 'Delete',
    manageAccess: 'Manage access and users',
    salaryManagement: 'Salary Management',
    addEmployee: 'Add Employee',
    fullName: 'Full Name',
    salary: 'Salary',
    startDate: 'Start Date',
    position: 'Position',
    actions: 'Actions',
    profileInfo: 'Profile Information',
    appSettings: 'App Settings',
    language: 'Language',
    dbConnection: 'Database Connection',
    connected: 'Connected to Supabase',
    signOut: 'Sign Out',
    accessDenied: 'Access Denied',
    invoiceFooter: 'Thank you for your visit!',
    poweredBy: 'Powered by DHOOL SYSTEM',
    date: 'Date',
    method: 'Method',
    cashier: 'Cashier',
    item: 'Item',
    qty: 'Qty',
    price: 'Price',
    itemsSold: 'Items Sold',
    recentTransactions: 'Recent Transactions',
    totalRevenue: 'Total Revenue',
    netProfit: 'Net Profit',
    sales: 'Sales',
    yourSmile: 'Your Smile Is Our Mission',
    editProfile: 'Edit Profile',
    update: 'Update',
    deleteSelfError: 'You cannot delete yourself!',
    chooseLanguage: 'Choose your preferred language',
    profileUpdated: 'Profile updated successfully!',
    updateError: 'Failed to update profile.',
    userAdded: 'User added successfully!',
    errorAddingUser: 'Error adding user. Email might already exist.',
    confirmDelete: 'Are you sure you want to delete this?',
    addExpense: 'Add Expense',
    category: 'Category',
    amount: 'Amount',
    description: 'Description',
    prescription: 'Prescription',
    diagnosis: 'Diagnosis',
    history: 'History',
    searchPlaceholder: 'Search here...',
    allUsers: 'All Users',
    amountPaid: 'Amount Paid',
    balanceDue: 'Balance Due',
    selectPatient: 'Select Patient',
    generalSale: 'General Sale',
    billing: 'Billing',
    outstanding: 'Outstanding',
    paidInFull: 'Paid In Full',
    downloadPdf: 'Download PDF',
    printReport: 'Print Report'
  },
  so: {
    dashboard: 'Boga Hore',
    products: 'Alaabta',
    pos: 'Iibka (POS)',
    patients: 'Bukaanada',
    appointments: 'Ballamaha',
    expenses: 'Kharashaadka',
    reports: 'Warbixinnada',
    settings: 'Hagaajinta',
    admin: 'Maamulka',
    welcome: 'Soo dhawoow',
    lowStock: 'Alaab Yar',
    revenue: 'Dakhliga',
    addToCart: 'Ku dar',
    total: 'Wadarta',
    checkout: 'Gaba Iibka',
    stock: 'Kaydka',
    loginTitle: 'Ku gal DHOOL',
    email: 'Email-ka',
    password: 'Furaha (Password)',
    loginBtn: 'Gal',
    logout: 'Ka Bax',
    addUser: 'Ku dar User',
    role: 'Shaqada',
    name: 'Magaca',
    save: 'Keydi',
    cancel: 'Jooji',
    users: 'Isticmaalayaasha',
    delete: 'Tirtir',
    manageAccess: 'Maamul isticmaalayaasha & galitaanka',
    salaryManagement: 'Maareynta Mushaarka',
    addEmployee: 'Ku dar Shaqaale',
    fullName: 'Magaca oo Dhamaystiran',
    salary: 'Mushaar',
    startDate: 'Taariikhda Bilowga',
    position: 'Booska / Shaqada',
    actions: 'Falalka',
    profileInfo: 'Macluumaadkaaga',
    appSettings: 'Hagaajinta App-ka',
    language: 'Luqadda',
    dbConnection: 'Xiriirka Database-ka',
    connected: 'Waa ku xiran yahay Supabase',
    signOut: 'Ka Bax',
    accessDenied: 'Lama ogola',
    invoiceFooter: 'Mahadsanid, soo noqo mar kale!',
    poweredBy: 'Waxaa sameeyay DHOOL SYSTEM',
    date: 'Taariikhda',
    method: 'Qaabka',
    cashier: 'Qasnajiga',
    item: 'Alaabta',
    qty: 'Tirada',
    price: 'Qiimaha',
    itemsSold: 'Alaabta la iibiyay',
    recentTransactions: 'Dhaqdhaqaaqyadii Ugu Dambeeyay',
    totalRevenue: 'Wadarta Dakhliga',
    netProfit: 'Faa\'iidada saafiga ah',
    sales: 'Iibka',
    yourSmile: 'Dhool cadeyntaada waa hadafkeena',
    editProfile: 'Bedel Xogtaada',
    update: 'Cusbooneysii',
    deleteSelfError: 'Isma tirtiri kartid adiga!',
    chooseLanguage: 'Dooro luqada aad rabto',
    profileUpdated: 'Xogtaada waa la bedelay!',
    updateError: 'Khalad ayaa dhacay, xogta lama bedelin.',
    userAdded: 'User cusub waa la keydiyay!',
    errorAddingUser: 'Khalad: Email-kan horey ayaa loo isticmaalay.',
    confirmDelete: 'Ma hubtaa inaad tirtirto?',
    addExpense: 'Ku dar Kharash',
    category: 'Qaybta',
    amount: 'Lacagta',
    description: 'Faahfaahin',
    prescription: 'Warqada Daawo',
    diagnosis: 'Xanuun Sheegid',
    history: 'Diiwaanka Hore',
    searchPlaceholder: 'Raadi waxaad rabto...',
    allUsers: 'Dhammaan Users',
    amountPaid: 'Lacagta la bixiyay',
    balanceDue: 'Inta hartay (Balance)',
    selectPatient: 'Dooro Bukaan',
    generalSale: 'Iib Caadi ah',
    billing: 'Biilka',
    outstanding: 'Lagu leeyahay',
    paidInFull: 'Wada bixiyay',
    downloadPdf: 'PDF soo deji',
    printReport: 'Report-ka Daabac'
  }
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const [language, setLanguage] = useState<Language>('so');
  const [activeTab, setActiveTab] = useState<Tab>(Tab.DASHBOARD);
  const [isLoading, setIsLoading] = useState(true);

  const [products, setProducts] = useState<Product[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [appUsers, setAppUsers] = useState<User[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [patientHistory, setPatientHistory] = useState<PatientHistory[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const { data: prodData } = await supabase.from('products').select('*');
        if (prodData) setProducts(prodData);

        const { data: patData } = await supabase.from('patients').select('*');
        if (patData) setPatients(patData);

        const { data: appData } = await supabase.from('appointments').select('*');
        if (appData) setAppointments(appData);

        const { data: txData } = await supabase.from('transactions').select('*').order('date', { ascending: false });
        if (txData) setTransactions(txData);

        const { data: empData } = await supabase.from('employees').select('*');
        if (empData) setEmployees(empData);

        const { data: expData } = await supabase.from('expenses').select('*');
        if (expData) setExpenses(expData);

        const { data: histData } = await supabase.from('patient_history').select('*');
        if (histData) setPatientHistory(histData);

        const { data: prescData } = await supabase.from('prescriptions').select('*');
        if (prescData) setPrescriptions(prescData);

        const { data: userData } = await supabase.from('users').select('*');
        if (userData) setAppUsers(userData as any);
      } catch (error) {
        console.error("Connection error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchData();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => localStorage.setItem('user', JSON.stringify(user)), [user]);

  const login = async (email: string, pass: string): Promise<{success: boolean, error?: string}> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('password', pass)
        .single();

      if (error) {
        setIsLoading(false);
        return { success: false, error: error.message };
      }
      if (!data) {
         setIsLoading(false);
         return { success: false, error: "User not found or password incorrect" };
      }
      setUser(data);
      setActiveTab(Tab.DASHBOARD);
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateCurrentUser = async (name: string, password?: string): Promise<{success: boolean, error?: string}> => {
    if (!user) return { success: false, error: "Not logged in" };
    const updates: any = { name };
    if (password && password.trim() !== '') updates.password = password;
    try {
      const { error } = await supabase.from('users').update(updates).eq('id', user.id);
      if (error) return { success: false, error: error.message };
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  };

  const addUser = async (newUser: User): Promise<{success: boolean, error?: string}> => {
    try {
        const { error } = await supabase.from('users').insert([newUser]);
        if (error) return { success: false, error: error.message };
        setAppUsers(prev => [...prev, newUser]);
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
  };

  const deleteUser = async (id: string) => {
    setAppUsers(prev => prev.filter(u => u.id !== id));
    await supabase.from('users').delete().eq('id', id);
  };

  const addExpense = async (expense: Expense) => {
    setExpenses(prev => [expense, ...prev]);
    await supabase.from('expenses').insert([expense]);
  };

  const deleteExpense = async (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
    await supabase.from('expenses').delete().eq('id', id);
  };

  const addProduct = async (product: Product) => {
    setProducts(prev => [...prev, product]);
    await supabase.from('products').insert([product]);
  };
  
  const updateProduct = async (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    await supabase.from('products').update(updatedProduct).eq('id', updatedProduct.id);
  };

  const deleteProduct = async (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    await supabase.from('products').delete().eq('id', id);
  };

  const addPatient = async (patient: Patient) => {
    setPatients(prev => [...prev, patient]);
    await supabase.from('patients').insert([patient]);
  };

  const deletePatient = async (id: string) => {
    setPatients(prev => prev.filter(p => p.id !== id));
    await supabase.from('patients').delete().eq('id', id);
  };

  const addPatientHistory = async (history: PatientHistory) => {
    setPatientHistory(prev => [history, ...prev]);
    await supabase.from('patient_history').insert([history]);
  };

  const addPrescription = async (prescription: Prescription) => {
    setPrescriptions(prev => [prescription, ...prev]);
    await supabase.from('prescriptions').insert([prescription]);
  };

  const addAppointment = async (appointment: Appointment) => {
    setAppointments(prev => [...prev, appointment]);
    await supabase.from('appointments').insert([appointment]);
  };
  
  const deleteAppointment = async (id: string) => {
    setAppointments(prev => prev.filter(a => a.id !== id));
    await supabase.from('appointments').delete().eq('id', id);
  };

  const updateAppointmentStatus = async (id: string, status: 'Confirmed' | 'Pending' | 'Cancelled') => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    await supabase.from('appointments').update({ status }).eq('id', id);
  };

  const addEmployee = async (employee: Employee) => {
    setEmployees(prev => [...prev, employee]);
    await supabase.from('employees').insert([employee]);
  };

  const deleteEmployee = async (id: string) => {
    setEmployees(prev => prev.filter(e => e.id !== id));
    await supabase.from('employees').delete().eq('id', id);
  };

  const processSale = async (cartItems: {id: string, quantity: number}[], total: number, method: 'Cash' | 'Zaad', paidAmount: number, patientId?: string, patientName?: string) => {
    // Update Stock
    const updatedProducts = products.map(p => {
      const itemInCart = cartItems.find(c => c.id === p.id);
      if (itemInCart) return { ...p, stock: Math.max(0, p.stock - itemInCart.quantity) };
      return p;
    });
    setProducts(updatedProducts);

    for (const item of cartItems) {
      const product = products.find(p => p.id === item.id);
      if (product) {
        const newStock = Math.max(0, product.stock - item.quantity);
        await supabase.from('products').update({ stock: newStock }).eq('id', item.id);
      }
    }

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      date: new Date().toLocaleString(),
      total,
      paidAmount,
      balance: total - paidAmount,
      items: cartItems.reduce((acc, curr) => acc + curr.quantity, 0),
      method,
      cashierName: user?.name,
      userId: user?.id,
      patientId,
      patientName
    };
    
    setTransactions(prev => [newTransaction, ...prev]);
    await supabase.from('transactions').insert([newTransaction]);
  };

  const t = (key: string) => (translations[language] as any)[key] || key;

  return (
    <AppContext.Provider value={{
      user, login, logout, updateCurrentUser, isLoading, language, setLanguage, activeTab, setActiveTab,
      products, addProduct, updateProduct, deleteProduct,
      patients, addPatient, deletePatient,
      appointments, addAppointment, deleteAppointment, updateAppointmentStatus,
      transactions, processSale,
      employees, addEmployee, deleteEmployee,
      expenses, addExpense, deleteExpense,
      patientHistory, addPatientHistory,
      prescriptions, addPrescription,
      appUsers, addUser, deleteUser,
      t
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
