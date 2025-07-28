import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';
import { BASE_URL } from '../utils/constant.js';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Developer',
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(`${BASE_URL}/api/auth/register`, formData, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setMessage('✅ User registered successfully!');
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setMessage(err?.response?.data?.message || '❌ Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== 'Admin') {
    return <p className="text-center mt-10 text-red-600">🚫 Access Denied</p>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white shadow-lg p-8 rounded-2xl space-y-5"
      >
        <h2 className="text-2xl font-bold text-center text-blue-800">👥 Register New User</h2>

        <div>
          <label className="block mb-1 text-sm font-medium">👤 Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter full name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">✉️ Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter email address"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">🔒 Password</label>
          <input
            type="password"
            name="password"
            placeholder="Create password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">🧩 Role</label>
          <select
            name="role"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="Developer">👨‍💻 Developer</option>
            <option value="ProjectLead">📊 Project Lead</option>
            <option value="Admin">🛠 Admin</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>

        {message && (
          <p
            className={`text-center text-sm ${
              message.startsWith('✅') ? 'text-green-600' : 'text-red-500'
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default Register;
