import React, { useState, useEffect } from "react";
import API from "../api/axios";

function BookAppointment() {
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    patientName: "",
    date: "",
    reason: "",
    doctorId: ""
  });

  useEffect(() => {
    API.get("/doctors")
      .then(res => setDoctors(res.data))
      .catch(err => alert("Error fetching doctors"));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/appointments/book", formData);
      alert("Appointment booked successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Error booking appointment");
    }
  };

  return (
    <div>
      <h2>Book Appointment</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="patientName"
          placeholder="Your Name"
          value={formData.patientName}
          onChange={handleChange}
          required
        />
        <br />
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
        <br />
        <input
          type="text"
          name="reason"
          placeholder="Reason"
          value={formData.reason}
          onChange={handleChange}
          required
        />
        <br />
        <select
          name="doctorId"
          value={formData.doctorId}
          onChange={handleChange}
          required
        >
          <option value="">Select Doctor</option>
          {doctors.map((doc) => (
            <option key={doc._id} value={doc._id}>
              {doc.name} ({doc.specialization})
            </option>
          ))}
        </select>
        <br />
        <button type="submit">Book Appointment</button>
      </form>
    </div>
  );
}

export default BookAppointment;
