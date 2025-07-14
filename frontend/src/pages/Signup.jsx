import React, { useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import Authgif from "../assets/a4cf01a2edfaf1b62c83b31ab78361e5.gif";
import "../styles/signupPage.css";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); // default role
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const user = await signup(email, password, role);
      alert("Account created successfully!");

      // Role-based redirection
      switch (user.role) {
        case "admin":
          navigate("/admin");
          break;
        case "partner":
          navigate("/partner");
          break;
        case "investor":
        case "user":
        default:
          navigate("/dashboard");
          break;
      }
    } catch (e) {
      console.error("Signup failed:", e);
      alert("Signup failed: " + (e.message || "Unknown error"));
    }
  };

  return (
    <div className="signup-page-wrapper">
      <div className="signup-container">
        <div className="signup-contents">
          <h1 className="signup-header">Let’s get you started</h1>
          <p className="signup-text">
            Already have an account? <a href="/login">Login</a>
          </p>

          <input
            className="firstname-field"
            type="text"
            placeholder="First name"
          />
          <input
            className="lastname-field"
            type="text"
            placeholder="Last name"
          />

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

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="role-select"
          >
            <option value="user">Investor</option>
            <option value="partner">Partner</option>
            <option value="admin">Admin</option>
          </select>

          <button className="signup-btn" onClick={handleSubmit}>
            Create Account
          </button>
        </div>

        <img className="signup-gif" src={Authgif} alt="signup animation" />
      </div>
    </div>
  );
};

export default Signup;
