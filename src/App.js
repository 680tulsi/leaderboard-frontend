import { useEffect, useState } from "react";
import axios from "axios";
import { FaUserPlus, FaMedal } from "react-icons/fa";

function App() {
  const [users, setUsers] = useState([]);
  const [newName, setNewName] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const backend = "https://leaderboard-1-0jek.onrender.com/api";

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${backend}/users`);
      setUsers(res.data);
      if (res.data.length > 0) setSelectedUserId(res.data[0].id);
    } catch (err) {
      setError("⚠️ Failed to load users. Is backend running?");
    }
  };

  const addUser = async () => {
    if (!newName.trim()) return;
    try {
      await axios.post(`${backend}/users?name=${newName}`);
      setMessage(`✅ Added user "${newName}" successfully!`);
      setNewName("");
      setError("");
      fetchUsers();
    } catch {
      setError("❌ Could not add user. Try again.");
    }
  };

  const claimPoints = async () => {
    try {
      const res = await axios.post(`${backend}/users/${selectedUserId}/claim`);
      setMessage(`🎉 ${res.data.name} now has ${res.data.totalPoints} points!`);
      setError("");
      fetchUsers();
    } catch {
      setError("❌ Failed to claim points.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-green-100 p-6 relative">

      {/* ✅ LOGO + TopPointers OUTSIDE BOX - TOP LEFT */}
      <div className="absolute top-6 left-6 flex items-center gap-2 z-10">
        <img src="/logo1.png" alt="Logo" className="h-10 w-10" />
        <span className="text-2xl font-bold text-gray-800">TopPointers</span>
      </div>

      {/* MAIN CARD BOX */}
      <div className="bg-white mt-20 p-8 rounded-3xl shadow-2xl w-full max-w-xl mx-auto border border-gray-200">
        {/* Centered Title */}
        <h1 className="text-4xl font-extrabold text-center text-indigo-600 mb-8 flex items-center justify-center gap-2">
          <FaMedal /> Leaderboard
        </h1>

        {/* Add User */}
        <div className="flex mb-4">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Enter user name"
            className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 outline-none text-gray-700"
          />
          <button
            onClick={addUser}
            className="bg-green-500 text-white px-5 rounded-r-lg hover:bg-green-600 flex items-center gap-1 transition"
          >
            <FaUserPlus /> Add
          </button>
        </div>

        {/* Select User and Claim */}
        <div className="flex mb-4">
          <select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 text-gray-700"
          >
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
          <button
            onClick={claimPoints}
            className="bg-blue-500 text-white px-5 rounded-r-lg hover:bg-blue-600 transition"
          >
            Claim
          </button>
        </div>

        {/* Messages */}
        {message && (
          <div className="bg-green-100 text-green-800 px-4 py-2 rounded mb-4 text-sm shadow-inner font-medium">
            {message}
          </div>
        )}
        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm shadow-inner font-medium">
            {error}
          </div>
        )}

        {/* Leaderboard */}
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">🏅 Leaderboard</h2>
          {users
            .sort((a, b) => b.totalPoints - a.totalPoints)
            .map((user, index) => (
              <div
                key={user.id}
                className="bg-gray-100 px-5 py-3 rounded-lg mb-2 flex justify-between items-center shadow-sm"
              >
                <span className="font-medium text-gray-700">
                  #{index + 1} {user.name}
                </span>
                <span className="text-indigo-700 font-bold">{user.totalPoints} pts</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default App;
