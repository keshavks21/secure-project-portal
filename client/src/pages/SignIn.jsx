import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';
import { BASE_URL } from '../utils/constant.js';
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!credentials.email || !credentials.password) {
      setMessage('Email and password are required.');
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${BASE_URL}/api/auth/login`, credentials, {
        withCredentials: true,
      });
      login(res?.data?.token);
      navigate('/');
    } catch (err) {
      console.error(err);
      setMessage('Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-gray-900 to-gray-800 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-950 border border-gray-700 shadow-xl rounded-2xl px-8 py-10 w-full max-w-md space-y-6"
      >
        <h2 className="text-2xl font-bold text-white text-center">Sign In</h2>

        <div>
          <label className="block text-sm text-gray-300 mb-1">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={credentials.email}
            onChange={e => setCredentials({ ...credentials, email: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={credentials.password}
            onChange={e => setCredentials({ ...credentials, password: e.target.value })}
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        {message && (
          <p className="text-center text-red-400 text-sm mt-2">{message}</p>
        )}
      </form>
    </div>
  );
};

export default SignIn;
