
import React from 'react';

export enum Tab {
  DASHBOARD = 'DASHBOARD',
  PRODUCTS = 'PRODUCTS',
  POS = 'POS',
  PATIENTS = 'PATIENTS',
  APPOINTMENTS = 'APPOINTMENTS',
  EXPENSES = 'EXPENSES', 
  REPORTS = 'REPORTS',
  SETTINGS = 'SETTINGS',
  ADMIN = 'ADMIN'
}

export type Role = 'Admin' | 'Doctor' | 'Staff' | 'Accountant';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
  password?: string;
}

export interface StatData {
  label: string;
  value: string;
  icon: React.ReactNode;
  colorBg: string;
  colorText: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  image?: string;
  category: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  phone: string;
  lastVisit: string;
  condition: string;
}

export interface PatientHistory {
  id: string;
  patientId: string;
  date: string;
  diagnosis: string;
  treatment: string;
  notes: string;
  doctorName: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  doctorName: string;
  date: string;
  medicines: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
  }[];
}

export interface Appointment {
  id: string;
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
  type: string;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: 'Rent' | 'Utilities' | 'Supplies' | 'Salary' | 'Other';
  date: string;
  description?: string;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  salary: string;
  date: string;
  initials: string;
  status: string;
}

export interface Transaction {
  id: string;
  date: string;
  total: number;
  paidAmount: number;
  balance: number;
  items: number;
  method: 'Cash' | 'Zaad';
  cashierName?: string;
  userId?: string;
  patientId?: string;
  patientName?: string;
}

export type Language = 'en' | 'so';
