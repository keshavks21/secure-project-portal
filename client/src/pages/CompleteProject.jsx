import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../utils/constant';

const CompleteProject = () => {
  const [projects, setProjects] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get(BASE_URL+'/api/projects/complete', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        
        
        setProjects(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProjects();
  }, []);


  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Complete Projects</h2>
      {projects.length === 0 ? (
        <p>No completed projects.</p>
      ) : (
        <ul className="space-y-4">
          {projects.map((project) => (
            <li key={project._id} className="bg-white p-4 shadow rounded">
              <h3 className="font-semibold">{project.name}</h3>
              <p>{project.description}</p>
              <p>Deadline: {new Date(project.deadline).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      )}
      {message && <p className="mt-4 text-green-700">{message}</p>}
    </div>
  );
};

export default CompleteProject;
