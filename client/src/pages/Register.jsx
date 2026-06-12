import React, { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import "animate.css";
import "../styles/global.css";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "patient",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/user/register", formData);
      alert("Registered successfully!");
      navigate("/"); // ✅ redirect to login after register
    } catch (err) {
      alert(err.response?.data?.message || "Error registering");
    }
  };

  return (
    <div className="login-container">
      <div className="card animate__animated animate__fadeInUp">
        <h2 className="animate__animated animate__fadeIn">Create Account 🩺</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            required
          />
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
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            onChange={handleChange}
            required
          />
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
            <option value="admin">Admin</option>
          </select>
          <button
            type="submit"
            className="animate__animated animate__pulse animate__infinite"
          >
            Register
          </button>
        </form>
        <p>
          Have an account?{" "}
          <span onClick={() => navigate("/")} className="register-link">
            Login here
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;
