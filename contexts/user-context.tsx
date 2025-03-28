'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'admin' | 'doctor' | 'patient' | 'staff';

interface User {
  id: string;
  role: UserRole;
  name: string;
}

interface UserContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  hasPermission: (action: 'view' | 'create' | 'delete' | 'edit', resource: string) => boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const rolePermissions: Record<UserRole, string[]> = {
  admin: ['view:all', 'create:all', 'delete:all', 'edit:all'],
  doctor: [
    'view:medical_records',
    'create:medical_records',
    'delete:own_medical_records',
    'edit:own_medical_records',
    'view:own_patients'
  ],
  patient: [
    'view:own_medical_records',
    'view:own_appointments'
  ],
  staff: [
    'view:medical_records',
    'create:medical_records'
  ]
};

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Load user from localStorage on mount
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const hasPermission = (action: 'view' | 'create' | 'delete' | 'edit', resource: string): boolean => {
    if (!user) return false;

    const userPermissions = rolePermissions[user.role];
    const requiredPermission = `${action}:${resource}`;

    return userPermissions.some(permission => 
      permission === requiredPermission || 
      permission === `${action}:all` || 
      permission === 'all:all'
    );
  };

  return (
    <UserContext.Provider value={{ user, login, logout, hasPermission }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
