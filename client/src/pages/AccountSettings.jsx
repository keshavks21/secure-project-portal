import React, { useState } from 'react';
import axios from 'axios';

const AccountSettings = () => {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleChangePassword = async () => {
    if (!password) return;

    try {
      await axios.post('/api/users/update-password', { password });
      setMessage('Password updated!');
    } catch (err) {
      console.error('Error:', err);
      setMessage('Update failed.');
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <input
        type="password"
        value={password}
        className="input w-full"
        onChange={e => setPassword(e.target.value)}
        placeholder="New Password"
      />
      <button className="btn mt-2" onClick={handleChangePassword}>Update Password</button>
      {message && <p className="text-white mt-2">{message}</p>}
    </div>
  );
};

export default AccountSettings;