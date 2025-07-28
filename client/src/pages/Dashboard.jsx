import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 text-gray-800">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">👋 Welcome, {user?.name}</h1>

        {/* Admin Dashboard */}
        {user?.role === 'Admin' && (
          <div className="grid gap-6">
            <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition">
              <h2 className="text-xl font-semibold mb-4 text-blue-700">🛠 Admin Controls</h2>
              <ul className="space-y-3">
                <li>
                  <Link to="/projects/new" className="text-blue-600 hover:underline">
                    ➕ Add New Project
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="text-blue-600 hover:underline">
                    👤 Register New User
                  </Link>
                </li>
                <li>
                  <Link to="/projects/complete" className="text-purple-600 hover:underline">
                    ✅ Completed Projects
                  </Link>
                </li>
                <li>
                  <Link to="/projects/active" className="text-blue-600 hover:underline">
                    📁 View All Projects
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Project Lead Dashboard */}
        {user?.role === 'ProjectLead' && (
          <div className="grid gap-6">
            <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition">
              <h2 className="text-xl font-semibold mb-4 text-purple-700">📊 Project Lead Dashboard</h2>
              <ul className="space-y-3">
                <li>
                  <Link to="/projects/active" className="text-purple-600 hover:underline">
                    🚀 Active Projects
                  </Link>
                </li>
                <li>
                  <Link to="/projects/assign" className="text-purple-600 hover:underline">
                    👥 Assign Developers
                  </Link>
                </li>
                <li>
                  <Link to="/documents/upload" className="text-purple-600 hover:underline">
                    📤 Upload Documents
                  </Link>
                </li>
                <li>
                  <Link to="/projects" className="text-purple-600 hover:underline">
                    📁 View All Projects
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Developer Dashboard */}
        {user?.role === 'Developer' && (
          <div className="grid gap-6">
            <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition">
              <h2 className="text-xl font-semibold mb-4 text-green-700">💻 Developer Dashboard</h2>
              <ul className="space-y-3">
                <li>
                  <Link to="/my-projects" className="text-green-600 hover:underline">
                    📋 View My Projects
                  </Link>
                </li>
                <li>
                  <Link to="/projects" className="text-green-600 hover:underline">
                    📁 View All Projects
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
