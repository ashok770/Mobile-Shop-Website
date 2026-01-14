import { useState } from "react";

const API = import.meta.env.VITE_API_URL;

function AdminLogin({ setToken }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const res = await fetch(`${API}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (data.token) {
      localStorage.setItem("adminToken", data.token);
      setToken(data.token);
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="order-page">
      <h2>Admin Login</h2>

      <div className="order-form">
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="btn order-btn" onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  );
}

export default AdminLogin;
