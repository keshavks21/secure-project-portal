import React from 'react';
import axios from 'axios';

const ProjectDetails = () => {
  const handleFileChange = async (e) => {
    const formData = new FormData();
    formData.append('file', e.target.files[0]);

    try {
      await axios.post('/api/projects/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      alert('Upload successful!');
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Upload failed.');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold">Project Name</h2>
      <p>Description here</p>
      <p>Deadline: 2025-08-30</p>
      <p>Team Members: List here</p>
      <input type="file" onChange={handleFileChange} className="file-input" />
      <p>Documents:</p>
      <ul><li>doc.pdf</li></ul>
    </div>
  );
};

export default ProjectDetails;