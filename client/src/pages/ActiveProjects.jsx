import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { BASE_URL } from '../utils/constant';
import { useAuth } from '../context/AuthContext';

const ActiveProjects = () => {
  const [projects, setProjects] = useState([]);
  const { user } = useAuth();

  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/projects/active`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setProjects(res.data);
    } catch (err) {
      console.error('Failed to fetch active projects:', err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleMarkComplete = async (projectId) => {
    try {  
      await axios.post(BASE_URL+`/api/projects/${projectId}/complete`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      console.log("HI");
      // Refresh list after marking as complete
      fetchProjects();
    } catch (err) {
      console.error('Error marking project complete:', err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Active Projects</h2>
      {projects.length === 0 ? (
        <p>No active projects found.</p>
      ) : (
        <ul className="space-y-4">
          {projects.map((project) => (
            <li key={project._id} className="border p-4 rounded shadow bg-white">
              <h3 className="text-lg font-semibold">{project.name}</h3>
              <p>{project.description}</p>
              <p className="text-sm text-gray-600">Deadline: {new Date(project.deadline).toLocaleDateString()}</p>

              <Link
                to={`/projects/${project._id}`}
                className="text-blue-600 hover:underline block mt-2"
              >
                🔍 View Details
              </Link>

              {user?.role === 'Admin' && (
                <button
                  onClick={() => handleMarkComplete(project._id)}
                  className="mt-3 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                >
                  ✅ Mark as Complete
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ActiveProjects;
