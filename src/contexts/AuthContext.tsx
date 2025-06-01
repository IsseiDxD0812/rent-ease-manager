
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  role: 'Admin' | 'Staff' | 'Customer';
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hardcoded users as specified
const users = [
  { id: "1", role: "Admin" as const, email: "admin@entnt.in", password: "admin123", name: "Admin User" },
  { id: "2", role: "Staff" as const, email: "staff@entnt.in", password: "staff123", name: "Staff Member" },
  { id: "3", role: "Customer" as const, email: "customer@entnt.in", password: "cust123", name: "Customer User" }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    const foundUser = users.find(u => u.email === email && u.password === password);
    if (foundUser) {
      const userSession = {
        id: foundUser.id,
        role: foundUser.role,
        email: foundUser.email,
        name: foundUser.name
      };
      setUser(userSession);
      localStorage.setItem('currentUser', JSON.stringify(userSession));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
