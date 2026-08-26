import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import logo from "../assets/hei-streak-logo.png";
import "./Login.css";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [uiRole, setUiRole] = useState("student"); // decoratif uniquement, n'est jamais envoye au serveur
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await api.post("/auth/login", { email, password });
      login(data.token, data.role);
      navigate(data.role === "admin" ? "/admin" : "/student");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="corner corner-top-left" />
        <img src={logo} alt="HEI Streak" className="login-logo" />
        <p className="login-description">
          Our online coding learning platform. Manage exams, track results, and streamline the way HEI handles
          assessments — all in one place, built for students and
          administrators alike.
        </p>
        <div className="corner corner-bottom-right" />
      </div>

      <div className="login-right">
        <form className="login-form" onSubmit={handleSubmit}>
          <h1>Login management</h1>

          {error && <p className="login-error">{error}</p>}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="login-role-select">
            <label>
              <input
                type="radio"
                name="uiRole"
                value="admin"
                checked={uiRole === "admin"}
                onChange={() => setUiRole("admin")}
              />
              Admin
            </label>
            <label>
              <input
                type="radio"
                name="uiRole"
                value="student"
                checked={uiRole === "student"}
                onChange={() => setUiRole("student")}
              />
              Student
            </label>

            <button type="submit" disabled={loading}>
              {loading ? "..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}