import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash } from "react-icons/fa"; // Importing delete icon
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

const AdminDashboard = () => {
  const [ideas, setIdeas] = useState([]);

  const [commentInputs, setCommentInputs] = useState({}); // ✅ Local state for comment inputs


  useEffect(() => {
    fetchIdeas();
  }, []);

  const fetchIdeas = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/ideas`);
      setIdeas(res.data);
  
      // ✅ Initialize commentInputs with existing comments
      const initialComments = {};
      res.data.forEach((idea) => {
        initialComments[idea._id] = idea.comment || ""; // If no comment, keep it empty
      });
      setCommentInputs(initialComments);
    } catch (err) {
      console.error("Error fetching ideas:", err);
    }
  };
  

  // ✅ Update Priority Function
  const updatePriority = async (id, priority) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/api/update-priority/${id}`, { priority });

      if (res.status === 200) {
        setIdeas(prevIdeas =>
          prevIdeas.map(idea => (idea._id === id ? { ...idea, priority } : idea))
        );
      }
    } catch (err) {
      console.error("Error updating priority:", err);
    }
  };

  // ✅ Update Status Function
  const updateStatus = async (id, status) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/api/update-idea/${id}`, { status });

      if (res.status === 200) {
        setIdeas(prevIdeas =>
          prevIdeas.map(idea => (idea._id === id ? { ...idea, status } : idea))
        );
      }
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const updateComment = async (id, comment) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/api/update-comment/${id}`, { comment });

      if (res.status === 200) {
        setIdeas(prevIdeas =>
          prevIdeas.map(idea => (idea._id === id ? { ...idea, comment } : idea))
        );

        alert("Comment updated successfully!");
      }
    } catch (err) {
      console.error("Error updating comment:", err);
      alert("Failed to update comment.");
    }
  };


  // ✅ Delete Idea Function
  const deleteIdea = async (id) => {
    if (!window.confirm("Are you sure you want to delete this idea?")) return;

    try {
      const res = await axios.delete(`${API_BASE_URL}/api/delete-idea/${id}`);

      if (res.status === 200) {
        setIdeas(prevIdeas => prevIdeas.filter(idea => idea._id !== id));
      }
    } catch (err) {
      console.error("Error deleting idea:", err);
    }
  };




  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto bg-white p-10 rounded-lg shadow-lg">

        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Admin Dashboard</h2>

        {/* ✅ Table for Ideas that are Not Prioritized */}
        <h3 className="text-xl font-semibold text-gray-700 mb-2">All Ideas (Unprioritized)</h3>
        <table className="min-w-full border border-gray-300 mb-6">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Idea Description</th>
              <th className="p-2 border">Screenshot</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Priority</th>
              <th className="p-2 border">Comment</th>
            </tr>
          </thead>
          <tbody>
            {ideas
              .filter(idea => idea.priority === "Set Priority" || !idea.priority)
              .map((idea) => (
                <tr key={idea._id} className="text-center">
                  <td className="p-2 border">{idea.name}</td>
                  <td className="p-2 border">{idea.email}</td>
                  <td className="p-2 border">{idea.ideaDesc}</td>
                  <td className="p-2 border">
                    <a
                      href={`${API_BASE_URL}${idea.filePath}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-500 underline"
                    >
                      View
                    </a>
                  </td>

                  <td className="p-2 border">
                    <select
                      value={idea.status}
                      onChange={(e) => updateStatus(idea._id, e.target.value)}
                      className="border p-1 rounded"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </td>


                  <td className="p-2 border">
                    <select
                      value={idea.priority || "Set Priority"}
                      onChange={(e) => updatePriority(idea._id, e.target.value)}
                      className="border p-1 rounded"
                    >
                      <option value="Set Priority">Set Priority</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </td>

                  <td className="p-2 border flex justify-center items-center">
                    <input
                      type="text"
                      className="border p-1 rounded w-full"
                      placeholder="Add Comment"
                      value={commentInputs[idea._id] ?? ""}
                      onChange={(e) => setCommentInputs(prev => ({ ...prev, [idea._id]: e.target.value }))}
                    />
                    <button
                      onClick={() => updateComment(idea._id, commentInputs[idea._id] ?? "")}
                      className="bg-blue-500 text-white px-3 py-1 rounded ml-2 hover:bg-blue-600"
                    >
                      Update
                    </button>
                  </td>



                  <td className="p-2 border">
                    <button onClick={() => deleteIdea(idea._id)} className="text-red-500 hover:text-red-700">
                      <FaTrash size={18} />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {/* ✅ Grid for Prioritized Ideas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {["High", "Medium", "Low"].map((level, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-lg shadow-lg ${level === "High" ? "bg-red-200" : level === "Medium" ? "bg-yellow-200" : "bg-green-200"
                }`}
            >
              <h3
                className={`text-xl font-semibold mb-2 ${level === "High" ? "text-red-700" : level === "Medium" ? "text-yellow-700" : "text-green-700"
                  }`}
              >
                {level} Priority
              </h3>
              {ideas
                .filter(idea => idea.priority === level)
                .map((idea) => (
                  <div key={idea._id} className="p-2 border bg-white shadow rounded-lg mb-2">
                    <p className="font-semibold">{idea.name}</p>
                    <p className="text-sm text-gray-600">{idea.ideaDesc}</p>
                    <p className="text-sm">
                      <strong>Status:</strong>
                      <select
                        value={idea.status}
                        onChange={(e) => updateStatus(idea._id, e.target.value)}
                        className="border p-1 rounded ml-2"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </p>
                    <p className="text-sm">
                      <strong>Priority:</strong>
                      <select
                        value={idea.priority}
                        onChange={(e) => updatePriority(idea._id, e.target.value)}
                        className="border p-1 rounded ml-2"
                      >
                        <option value="Set Priority">Set Priority</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                    </p>
                    <p className="text-sm">
                      <strong>Comment:</strong> {idea.comment || "No comment"}
                    </p>
                    <button onClick={() => deleteIdea(idea._id)} className="text-red-500 hover:text-red-700 mt-2">
                      <FaTrash size={18} />
                    </button>
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
