import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { BASE_URL } from '../utils/constant';

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await axios.get(BASE_URL+`/api/projects/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        console.log(res);
        
        setProject(res.data);
      } catch (err) {
        console.error('Error fetching project:', err);
      }
    };

    fetchProject();
  }, [id]);

  if (!project) {
    return <div className="p-6 text-center text-gray-500">Loading project details...</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-xl">
      <h2 className="text-3xl font-bold text-blue-800 mb-4">{project.name}</h2>

      <p className="text-gray-700 mb-2">
        <strong>Description:</strong> {project.description || 'No description provided.'}
      </p>

      <p className="text-gray-700 mb-2">
        <strong>Deadline:</strong>{' '}
        {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'N/A'}
      </p>

      <p className="text-gray-700 mb-4">
        <strong>Status:</strong>{' '}
        {project.completed ? (
          <span className="text-green-600">✅ Completed</span>
        ) : (
          <span className="text-yellow-600">⏳ Ongoing</span>
        )}
      </p>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-1">👥 Assigned Developers:</h3>
        {project.assignedDevs?.length > 0 ? (
          <ul className="list-disc pl-5">
            {project.assignedDevs.map((dev, index) => (
              <li key={index}>{dev.name || dev.email || dev._id}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No developers assigned.</p>
        )}
      </div>

      <div>
  <h3 className="text-lg font-semibold mb-2">📁 Uploaded Documents:</h3>
  {project.documents?.length > 0 ? (
    <ul className="list-disc pl-5 space-y-2">
      {project.documents.map((doc, index) => (
        <li key={index} className="text-sm">
          <a
            href={doc.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-600 hover:underline"
          >
            {doc.filename}
          </a>{' '}
          <span className="text-gray-500 ml-2">
            (Uploaded on {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : 'Unknown'})
          </span>
        </li>
      ))}
    </ul>
  ) : (
    <p className="text-gray-500">No documents uploaded yet.</p>
  )}
</div>
    </div>
  );
};

export default ProjectDetails;
