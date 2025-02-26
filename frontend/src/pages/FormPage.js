import React, { useState } from "react";
import axios from "axios";

// ✅ Read Backend API URL from Environment Variables
const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

const FormPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState(""); // ✅ Added email field
  const [employeeId, setEmployeeId] = useState("");
  const [ideaDesc, setIdeaDesc] = useState("");
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email); // ✅ Ensure email is included
    formData.append("employeeId", employeeId);
    formData.append("ideaDesc", ideaDesc);
    formData.append("file", file);

    try {
      await axios.post(`${API_BASE_URL}/`, formData);
      alert("Idea Submitted Successfully ✅");
    } catch (error) {
      console.error("Error submitting idea:", error);
      alert("Failed to submit idea ❌");
    }


    return (
      <div>
        <h2>Submit Your Idea</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <input type="text" placeholder="Name" onChange={(e) => setName(e.target.value)} required />
          <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required /> {/* ✅ Added email input */}
          <input type="text" placeholder="Employee ID" onChange={(e) => setEmployeeId(e.target.value)} required />
          <textarea placeholder="Describe your idea" onChange={(e) => setIdeaDesc(e.target.value)} required></textarea>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} required />
          <button type="submit">Submit Idea</button>
        </form>
      </div>
    );
  };
};
export default FormPage;
