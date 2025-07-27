import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';
import { BASE_URL } from '../utils/constant.js';

const SignIn = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!credentials.email || !credentials.password) {
      setMessage('Email and password are required.');
      return;
    }

    try {
      setLoading(true);  
      console.log(credentials);
          
      const res = await axios.post(`${BASE_URL}/api/auth/login`, credentials, { withCredentials: true });
      console.log(res);
      
      login(res?.data?.token);
    } catch (err) {
      console.log(err);
      
      setMessage('Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-md mx-auto space-y-3">
      <input
        type="email"
        placeholder="Email"
        className="input w-full"
        value={credentials.email}
        onChange={e => setCredentials({ ...credentials, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        className="input w-full"
        value={credentials.password}
        onChange={e => setCredentials({ ...credentials, password: e.target.value })}
      />
      <button className="btn w-full" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
      {message && <p className="text-sm text-white text-center">{message}</p>}
    </form>
  );
};

export default SignIn;