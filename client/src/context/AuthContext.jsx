import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    try {
      return token ? JSON.parse(atob(token.split('.')[1])) : null;
    } catch (err) {
      return null;
    }
  });

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null); 
  };

  const login = (token) => {
    localStorage.setItem('token', token);
    setUser(JSON.parse(atob(token.split('.')[1])));
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, login }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);