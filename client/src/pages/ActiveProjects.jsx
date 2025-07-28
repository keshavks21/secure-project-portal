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
      await axios.post(`${BASE_URL}/api/projects/${projectId}/complete`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      fetchProjects();
    } catch (err) {
      console.error('Error marking project complete:', err);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;

    try {
      await axios.delete(`${BASE_URL}/api/projects/delete/${projectId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      fetchProjects();
    } catch (err) {
      console.error('Error deleting project:', err);
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
              <p className="text-sm text-gray-600">
                Deadline: {new Date(project.deadline).toLocaleDateString()}
              </p>

              <Link
                to={`/projects/${project._id}`}
                className="text-blue-600 hover:underline block mt-2"
              >
                🔍 View Details
              </Link>

              {user?.role === 'Admin' && (
                <div className="flex gap-3 mt-3">
                  <button
                    onClick={() => handleMarkComplete(project._id)}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                  >
                    ✅ Mark as Complete
                  </button>

                  <button
                    onClick={() => handleDeleteProject(project._id)}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                  >
                    🗑️ Remove Project
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ActiveProjects;
