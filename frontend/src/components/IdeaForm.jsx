import React, { useState } from "react";
import axios from "axios";

// ✅ Read Backend API URL from Environment Variables
const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

const IdeaForm = () => {
  const [name, setName] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [ideaDesc, setIdeaDesc] = useState("");
  const [file, setFile] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("employeeId", employeeId);
    formData.append("ideaDesc", ideaDesc);
    formData.append("file", file);

    try {
      await axios.post(`${API_BASE_URL}/api/ideas`, formData);
      setSuccessMessage("Idea Submitted Successfully! ✅");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error submitting idea:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-4">Submit Your Idea</h2>
        {successMessage && <p className="text-green-500 text-center">{successMessage}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4" encType="multipart/form-data">
          <input type="text" placeholder="Name" className="p-2 border rounded-md" onChange={(e) => setName(e.target.value)} required />
          <input type="text" placeholder="Employee ID" className="p-2 border rounded-md" onChange={(e) => setEmployeeId(e.target.value)} required />
          <textarea placeholder="Describe your idea" className="p-2 border rounded-md h-24" onChange={(e) => setIdeaDesc(e.target.value)} required></textarea>
          <input type="file" className="p-2 border rounded-md" onChange={(e) => setFile(e.target.files[0])} />
          <button className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">Submit Idea</button>
        </form>
      </div>
    </div>
  );
};

export default IdeaForm;
