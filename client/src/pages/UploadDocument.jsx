import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constant";

const UploadDocuments = () => {
  const [file, setFile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchActiveProjects = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/projects/active`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setProjects(res.data);
      } catch (err) {
        console.error("Error fetching projects:", err);
      }
    };

    fetchActiveProjects();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file || !selectedProject) {
      setMessage("Please select both a file and a project.");
      return;
    }

    const formData = new FormData();
    formData.append("document", file);
    formData.append("projectId", selectedProject);

    try {
      const res = await axios.post(`${BASE_URL}/api/projects/documents/upload`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage(res.data.message || "Upload successful!");
    } catch (err) {
      console.error("Upload error:", err);
      setMessage("Upload failed.");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">📄 Upload Document for Project</h2>

      <label className="block mb-2 font-medium">Select Project:</label>
      <select
        value={selectedProject}
        onChange={(e) => setSelectedProject(e.target.value)}
        className="mb-4 block w-full p-2 border border-gray-300 rounded"
      >
        <option value="">-- Select a project --</option>
        {projects.map((project) => (
          <option key={project._id} value={project._id}>
            {project.name}
          </option>
        ))}
      </select>

      <input
        type="file"
        onChange={handleFileChange}
        className="mb-4 block w-full"
      />

      <button
        onClick={handleUpload}
        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
      >
        Upload
      </button>

      {message && <p className="mt-4 text-green-700">{message}</p>}
    </div>
  );
};

export default UploadDocuments;
