import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { BASE_URL } from '../utils/constant';

const MyProjects = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get(BASE_URL + '/api/projects/my/projects', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setProjects(res.data);
      } catch (err) {
        console.error('Failed to fetch projects:', err);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-blue-800 mb-4">📂 My Projects</h2>
      {projects.length === 0 ? (
        <p className="text-gray-600">You are not assigned to any projects yet.</p>
      ) : (
        <ul className="space-y-4">
          {projects.map((proj) => (
            <li key={proj._id} className="bg-white shadow p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-700">{proj.name}</h3>
              <p className="text-gray-600 mb-1">{proj.description}</p>
              <p className="text-gray-500 mb-2">
                Deadline: {new Date(proj.deadline).toLocaleDateString()}
              </p>
              <Link
                to={`/projects/${proj._id}`}
                className="text-purple-600 hover:underline"
              >
                🔍 View Details
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyProjects;
