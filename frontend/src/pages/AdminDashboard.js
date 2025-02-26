import React, { useEffect, useState } from "react";
import axios from "axios";

// ✅ Update API Base URL to your Azure Container App Backend
const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

const AdminDashboard = () => {
  const [ideas, setIdeas] = useState([]);

  useEffect(() => {
    fetchIdeas();
  }, []);

  // ✅ Fetch All Ideas
  const fetchIdeas = async () => {
    try {
      console.log(`backend url: ${API_BASE_URL}`);
      const res = await axios.get(`${API_BASE_URL}/api/ideas`);
      setIdeas(res.data);
    } catch (err) {
      console.error("Error fetching ideas:", err);
    }
  };

  // ✅ Update Priority Function
  const updatePriority = async (id, priority) => {
    console.log("Updating priority for:", id, "New Priority:", priority);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/update-priority/${id}`, { priority });

      if (res.status === 200) {
        setIdeas(prevIdeas =>
          prevIdeas.map(idea => (idea._id === id ? { ...idea, priority } : idea))
        );
        console.log("Priority updated successfully:", priority);
      } else {
        console.error("Failed to update priority:", res);
      }
    } catch (err) {
      console.error("Error updating priority:", err);
    }
  };

  // ✅ Update Status Function
  const updateStatus = async (id, status) => {
    console.log("Updating status for:", id, "New Status:", status);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/update-idea/${id}`, { status });

      if (res.status === 200) {
        setIdeas(prevIdeas =>
          prevIdeas.map(idea => (idea._id === id ? { ...idea, status } : idea))
        );
        console.log("Status updated successfully:", status);
      } else {
        console.error("Failed to update status:", res);
      }
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  // ✅ Delete Idea Function
  const deleteIdea = async (id) => {
    const url = `${API_BASE_URL}/api/delete-idea/${id}`;
    console.log("Attempting to delete:", url);

    if (!window.confirm("Are you sure you want to delete this idea?")) return;

    try {
      const res = await axios.delete(url);
      console.log("Delete response:", res);

      if (res.status === 200) {
        setIdeas(prevIdeas => prevIdeas.filter(idea => idea._id !== id));
        console.log("Idea deleted successfully");
      } else {
        console.error("Failed to delete idea:", res);
      }
    } catch (err) {
      console.error("Error deleting idea:", err.response ? err.response.data : err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Admin Dashboard</h2>

        {/* ✅ Table Only Shows Unprioritized Ideas */}
        <h3 className="text-xl font-semibold text-gray-700 mb-2">All Ideas (Unprioritized)</h3>
        <table className="min-w-full border border-gray-300 mb-6">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Employee ID</th>
              <th className="p-2 border">Idea Description</th>
              <th className="p-2 border">Screenshot</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Priority</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {ideas
              .filter(idea => idea.priority === "Set Priority" || !idea.priority)
              .map((idea) => (
                <tr key={idea._id} className="text-center">
                  <td className="p-2 border">{idea.name}</td>
                  <td className="p-2 border">{idea.employeeId}</td>
                  <td className="p-2 border">{idea.ideaDesc}</td>
                  <td className="p-2 border">
                    <a href={`${API_BASE_URL}${idea.filePath}`} target="_blank" rel="noreferrer" className="text-blue-500 underline">
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
                  <td className="p-2 border">
                    <button
                      onClick={() => deleteIdea(idea._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
            ))}
          </tbody>
        </table>

        {/* ✅ Grid for Prioritized Ideas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {["High", "Medium", "Low"].map((level, idx) => (
            <div key={idx} className={`p-4 rounded-lg shadow-lg ${level === "High" ? "bg-red-200" : level === "Medium" ? "bg-yellow-200" : "bg-green-200"}`}>
              <h3 className={`text-xl font-semibold mb-2 ${level === "High" ? "text-red-700" : level === "Medium" ? "text-yellow-700" : "text-green-700"}`}>
                {level} Priority
              </h3>
              {ideas
                .filter(idea => idea.priority === level)
                .map((idea) => (
                  <div key={idea._id} className="p-2 border bg-white shadow rounded-lg mb-2">
                    <p className="font-semibold">{idea.name}</p>
                    <p className="text-sm text-gray-600">{idea.ideaDesc}</p>

                    {/* ✅ Status Changeable in Grid */}
                    <select
                      value={idea.status}
                      onChange={(e) => updateStatus(idea._id, e.target.value)}
                      className="border p-1 rounded mt-1 w-full"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>

                    {/* ✅ Priority Changeable in Grid */}
                    <select
                      value={idea.priority}
                      onChange={(e) => updatePriority(idea._id, e.target.value)}
                      className="border p-1 rounded mt-1 w-full"
                    >
                      <option value="Set Priority">Set Priority</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
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
