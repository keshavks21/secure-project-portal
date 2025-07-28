// Navbar.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  return (
    <div className="p-4 bg-gray-800 text-white flex justify-between items-center">
      <span>PixelForge Nexus</span>
      <div>
        <span>{user?.name} ({user?.role})</span>
        <button className="ml-4 btn" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Navbar;
