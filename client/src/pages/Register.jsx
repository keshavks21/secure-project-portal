import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Developer',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userInfo.name || !userInfo.email || !userInfo.password) {
      setMessage('All fields are required.');
      return;
    }

    try {
      setLoading(true);
      setMessage('');
      await axios.post('/api/auth/register', userInfo);
      setMessage('User registered successfully!');
      setUserInfo({ name: '', email: '', password: '', role: 'Developer' });
    } catch (error) {
      setMessage(error.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-md mx-auto space-y-3">
      <input
        type="text"
        placeholder="Name"
        className="input w-full"
        value={userInfo.name}
        onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
      />
      <input
        type="email"
        placeholder="Email"
        className="input w-full"
        value={userInfo.email}
        onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        className="input w-full"
        value={userInfo.password}
        onChange={(e) => setUserInfo({ ...userInfo, password: e.target.value })}
      />
      <select
        className="input w-full"
        value={userInfo.role}
        onChange={(e) => setUserInfo({ ...userInfo, role: e.target.value })}
      >
        <option value="Developer">Developer</option>
        <option value="ProjectLead">Project Lead</option>
        <option value="Admin">Admin</option>
      </select>

      <button className="btn mt-4 w-full" disabled={loading}>
        {loading ? 'Registering...' : 'Register'}
      </button>

      {message && <p className="mt-2 text-sm text-center text-white">{message}</p>}
    </form>
  );
};

export default Register;