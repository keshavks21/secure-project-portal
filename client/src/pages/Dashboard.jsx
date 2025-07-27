import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Welcome, {user?.name}</h1>
      {user?.role === 'Admin' && <p>Admin controls here...</p>}
      {user?.role === 'ProjectLead' && <p>Project Lead dashboard...</p>}
      {user?.role === 'Developer' && <p>Your assigned projects...</p>}
    </div>
  );
};

export default Dashboard;