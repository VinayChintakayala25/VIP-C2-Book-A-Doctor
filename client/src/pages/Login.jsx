import React, { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import "animate.css"; // ✅ import animations
import "../styles/global.css"; // ✅ import global styles

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/user/login", formData);
      localStorage.setItem("token", res.data.token);
      const role = res.data.role;
      if (role === "patient") navigate("/patient");
      else if (role === "doctor") navigate("/doctor");
      else if (role === "admin") navigate("/admin");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-container">
      <div className="card animate__animated animate__fadeInDown">
        <h2 className="animate__animated animate__fadeIn">Welcome Back 👩‍⚕️</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            className="animate__animated animate__pulse animate__infinite"
          >
            Let’s Enter
          </button>
        </form>
        <p>
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="register-link"
          >
            Register here
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
