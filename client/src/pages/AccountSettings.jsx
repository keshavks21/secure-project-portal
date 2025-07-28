import React, { useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../utils/constant';

const AccountSettings = () => {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleChangePassword = async () => {
    if (!password) return;

    try {
      await axios.put(`${BASE_URL}/api/users/update/password`, { password }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}` // ensure token is sent
        }
      });
      setMessage('✅ Password updated successfully!');
      setIsError(false);
      setPassword('');
    } catch (err) {
      console.error('Error:', err);
      setMessage('❌ Failed to update password.');
      setIsError(true);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-xl rounded-2xl">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">🔒 Update Your Password</h2>
      <div className="space-y-4">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter new password"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          onClick={handleChangePassword}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-md transition duration-200"
        >
          Update Password
        </button>
        {message && (
          <p className={`text-sm ${isError ? 'text-red-600' : 'text-green-600'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default AccountSettings;
