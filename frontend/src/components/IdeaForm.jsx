import React, { useState } from "react";
import axios from "axios";

// ✅ Read Backend API URL from Environment Variables
const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

const IdeaForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [ideaDesc, setIdeaDesc] = useState("");
  const [file, setFile] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Reset error before validation

    // ✅ Email validation: Must contain "@royalcyber.com"
    if (!email.endsWith("@royalcyber.com")) {
      setErrorMessage("Email must be from @royalcyber.com domain.");
      return;
    }

   

    // ✅ Create FormData Object
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email); // ✅ Ensure email is included
    formData.append("ideaDesc", ideaDesc);
    formData.append("file", file);

    // ✅ Debugging: Log FormData before sending
    console.log("Submitting Form Data:");
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    try {
      await axios.post(`${API_BASE_URL}/api/ideas`, formData, {
        headers: {
          "Content-Type": "multipart/form-data", // ✅ Ensure proper Content-Type
        },
      });

      setSuccessMessage("Idea Submitted Successfully! ✅");
      setTimeout(() => setSuccessMessage(""), 3000);
      setErrorMessage(""); // Clear error on success

      // ✅ Clear all input fields after successful submission
      setName("");
      setEmail("");
      setIdeaDesc("");
      setFile(null);

      // ✅ Clear file input field manually
      document.getElementById("fileInput").value = "";
    } catch (error) {
      console.error("Error submitting idea:", error);
      setErrorMessage("Failed to submit idea. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-4">Submit Your Idea</h2>

        {/* Display error message if exists */}
        {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}

        {/* Display success message if exists */}
        {successMessage && <p className="text-green-500 text-center">{successMessage}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4" encType="multipart/form-data">
          <input
            type="text"
            placeholder="Name"
            className="p-2 border rounded-md"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email (must be @royalcyber.com)"
            className="p-2 border rounded-md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

         

          <textarea
            placeholder="Describe your idea"
            className="p-2 border rounded-md h-24"
            value={ideaDesc}
            onChange={(e) => setIdeaDesc(e.target.value)}
            required
          ></textarea>

          <input
            type="file"
            id="fileInput"
            className="p-2 border rounded-md"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <button className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">Submit Idea</button>
        </form>
      </div>
    </div>
  );
};

export default IdeaForm;
