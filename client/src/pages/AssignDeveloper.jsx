import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../utils/constant';

const AssignDeveloper = () => {
  const [projects, setProjects] = useState([]);
  const [developers, setDevelopers] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedDev, setSelectedDev] = useState('');
  const [message, setMessage] = useState('');

  // Fetch developers and active projects
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [devRes, projectRes] = await Promise.all([
          axios.get(`${BASE_URL}/api/users/developers`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }),
          axios.get(`${BASE_URL}/api/projects/active`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }),
        ]);
        setDevelopers(devRes.data);
        setProjects(projectRes.data);
      } catch (err) {
        console.error("Fetch error:", err);
        setMessage("Error fetching data.");
      }
    };
    fetchData();
  }, []);

  const handleAssign = async () => {
    if (!selectedProject || !selectedDev) {
      return setMessage('Please select both project and developer');
    }

    try {
      const res = await axios.post(
        `${BASE_URL}/api/projects/${selectedProject}/assign`,
        { developerId: selectedDev },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setMessage(res.data.message || 'Developer assigned successfully');
    } catch (err) {
      console.error("Assignment error:", err);
      setMessage('Error assigning developer');
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Assign Developer to Active Project</h2>

      {/* Project Dropdown */}
      <label className="block mb-2">Select Active Project:</label>
      <select
        value={selectedProject}
        onChange={(e) => setSelectedProject(e.target.value)}
        className="w-full border p-2 rounded mb-4"
      >
        <option value="">-- Select Project --</option>
        {projects.map((project) => (
          <option key={project._id} value={project._id}>
            {project.name} - {project.description}
          </option>
        ))}
      </select>

      {/* Developer Dropdown */}
      <label className="block mb-2">Select Developer:</label>
      <select
        value={selectedDev}
        onChange={(e) => setSelectedDev(e.target.value)}
        className="w-full border p-2 rounded mb-4"
      >
        <option value="">-- Select Developer --</option>
        {developers.map((dev) => (
          <option key={dev._id} value={dev._id}>
            {dev.name} ({dev.email})
          </option>
        ))}
      </select>

      <button
        onClick={handleAssign}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Assign Developer
      </button>

      {message && <p className="mt-4 text-sm text-green-700">{message}</p>}
    </div>
  );
};

export default AssignDeveloper;
