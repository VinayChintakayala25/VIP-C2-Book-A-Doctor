import React, { useState, useEffect } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import "animate.css";
import "../styles/global.css";
import { FaCalendarAlt, FaClipboardList } from "react-icons/fa";

function BookAppointment() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    patientName: "",
    date: "",
    reason: "",
    doctorId: ""
  });

  useEffect(() => {
    API.get("/admin/doctors")
      .then(res => setDoctors(res.data.doctors || res.data))
      .catch(err => alert("Error fetching doctors"));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/appointments/book", formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      alert("Appointment booked successfully!");
      navigate("/patient");
    } catch (err) {
      alert(err.response?.data?.message || "Error booking appointment");
    }
  };

  return (
    <div className="login-container">
      <div className="card animate__animated animate__fadeInUp">
        <h2><FaClipboardList /> Book Appointment</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="patientName"
            placeholder="Your Name"
            value={formData.patientName}
            onChange={handleChange}
            required
          />

          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="reason"
            placeholder="Reason for visit"
            value={formData.reason}
            onChange={handleChange}
            required
          />

          <select
            name="doctorId"
            value={formData.doctorId}
            onChange={handleChange}
            required
          >
            <option value="">Select Doctor</option>
            {doctors.length === 0 ? (
              <option disabled>No doctors available</option>
            ) : (
              doctors.map((doc) => (
                <option key={doc._id} value={doc._id}>
                  {doc.name} ({doc.specialization})
                </option>
              ))
            )}
          </select>

          <button type="submit" className="animate__animated animate__pulse animate__infinite">
            <FaCalendarAlt /> Confirm Booking
          </button>
        </form>
      </div>
    </div>
  );
}

export default BookAppointment;
