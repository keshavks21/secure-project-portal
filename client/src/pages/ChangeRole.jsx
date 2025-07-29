import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { BASE_URL } from '../utils/constant';

const ChangeRole = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);

  // Fetch all users (Admin only)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(BASE_URL + '/api/admin/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = Array.isArray(res.data) ? res.data : res.data.users;
        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          console.error("Unexpected response structure", res.data);
        }
      } catch (err) {
        console.error("Error fetching users:", err);
        setUsers([]);
      }
    };

    if (user?.role === 'Admin') {
      fetchUsers();
    }
  }, [user]);

  const handleRoleChange = async (userId, newRole) => {
  try {
    const token = localStorage.getItem('token'); // or from context if stored there

    const res = await axios.put(
      BASE_URL + `/api/admin/change/role/${userId}`,
      { role: newRole },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log('Role change response:', res.data);

    // Update local state with new role
    setUsers(prev =>
      prev.map(u => u._id === userId ? { ...u, role: newRole } : u)
    );
  } catch (error) {
    console.error("Failed to change role:", error);
    alert("Failed to update role");
  }
};


  const grouped = {
    Admin: [],
    ProjectLead: [],
    Developer: [],
  };

  if (Array.isArray(users)) {
    users.forEach(u => {
      if (grouped[u.role]) {
        grouped[u.role].push(u);
      }
    });
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Change User Roles</h1>

      {['Admin', 'ProjectLead', 'Developer'].map(role => (
        <div key={role} className="mb-6">
          <h2 className="text-lg font-semibold mb-2 text-blue-700">{role}s</h2>
          <ul className="space-y-2">
            {grouped[role].map(u => {
              const isCurrentAdmin = u._id === user?._id;

              return (
                <li
                  key={u._id}
                  className="bg-white p-4 rounded shadow flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2"
                >
                  <div>
                    <p className="font-medium">{u.name}</p>
                    <p className="text-sm text-gray-500">{u.email}</p>
                  </div>

                  <div>
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u._id, e.target.value)}
                      className={`border px-2 py-1 rounded ${isCurrentAdmin ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}`}
                      disabled={isCurrentAdmin}
                    >
                      <option value="Developer">Developer</option>
                      <option value="ProjectLead">Project Lead</option>
                      <option value="Admin">Admin</option>
                    </select>
                    {isCurrentAdmin && (
                      <p className="text-xs text-red-500 mt-1">
                        You cannot change your own role
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default ChangeRole;
