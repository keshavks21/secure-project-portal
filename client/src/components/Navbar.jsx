// Navbar.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <div className="p-4 bg-gray-800 text-white flex justify-between items-center">
      <span>PixelForge Nexus</span>
      <div>
        <span>{user?.name} ({user?.role})</span>
        <button className="ml-4 btn" onClick={logout}>Logout</button>
      </div>
    </div>
  );
};

export default Navbar;
