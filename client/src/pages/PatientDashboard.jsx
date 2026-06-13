import React, { useState, useEffect } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import "animate.css";
import "../styles/global.css";
import { FaCalendarAlt, FaUserMd, FaSignOutAlt, FaUser } from "react-icons/fa";

function PatientDashboard() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [reason, setReason] = useState("");
  const [profile, setProfile] = useState({});
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resAppointments = await API.get(`/appointments/patient/${user.id}`);
        setAppointments(resAppointments.data.appointments || []);

        const resDoctors = await API.get("/doctors");
        setDoctors(resDoctors.data.doctors || []);

        const resProfile = await API.get("/user/profile");
        setProfile(resProfile.data.user || {});
      } catch (err) {
        alert(err.response?.data?.message || "Error fetching data");
      }
    };
    fetchData();
  }, [user.id]);

  const doctorMap = {};
  doctors.forEach((doc) => {
    doctorMap[doc._id] = doc;
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleBook = async (e) => {
    e.preventDefault();
    try {
      await API.post("/appointments/book", {
        patientId: user.id,
        patientName: user.name,
        doctorId: selectedDoctor,
        date,
        timeSlot,
        reason,
      });
      alert("Appointment booked!");
      setDate("");
      setTimeSlot("");
      setReason("");
      setSelectedDoctor("");
      window.location.reload();
    } catch (err) {
      alert(err.response?.data?.message || "Error booking appointment");
    }
  };

  const handleCancel = async (id) => {
    try {
      await API.put(`/appointments/${id}/cancel`);
      alert("Appointment cancelled!");
      window.location.reload();
    } catch (err) {
      alert("Error cancelling appointment");
    }
  };

  const handleReschedule = async (id) => {
    const newDate = prompt("Enter new date (YYYY-MM-DD):");
    const newSlot = prompt("Enter new time slot (e.g. 10:00-11:00):");
    if (!newDate || !newSlot) return;
    try {
      await API.put(`/appointments/${id}/reschedule`, {
        rescheduledDate: newDate,
        rescheduledTimeSlot: newSlot,
      });
      alert("Appointment rescheduled!");
      window.location.reload();
    } catch (err) {
      alert("Error rescheduling appointment");
    }
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar animate__animated animate__fadeInLeft">
        <h2>Patient Panel</h2>
        <ul>
          <li><FaCalendarAlt /> My Appointments</li>
          <li><FaUserMd /> Book Doctor</li>
          <li><FaUser /> Profile</li>
          <li onClick={handleLogout}><FaSignOutAlt /> Logout</li>
        </ul>
      </div>

      <div className="main-content">
        <div className="banner animate__animated animate__fadeInDown">
          <img src="/assets/patient-banner.png" alt="Patient Banner" className="banner-img" />
          <h2>Welcome {user.name}</h2>
        </div>

        {/* Profile Section */}
        <h2>My Profile</h2>
        <div className="card">
          <p><b>Name:</b> {profile.name}</p>
          <p><b>Email:</b> {profile.email}</p>
          <p><b>Phone:</b> {profile.phone}</p>
          <p><b>Medical History:</b> {profile.medicalHistory?.join(", ") || "None"}</p>
        </div>

        {/* Appointments Section */}
        <h2>My Appointments</h2>
        <div className="card">
          {appointments.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Time Slot</th>
                  <th>Doctor</th>
                  <th>Status</th>
                  <th>Reason</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appt) => (
                  <tr key={appt._id}>
                    <td>{new Date(appt.date).toLocaleDateString()}</td>
                    <td>{appt.timeSlot}</td>
                    <td>{doctorMap[appt.doctorId]?.name || "Unknown Doctor"}</td>
                    <td><span className={`status-badge ${appt.status}`}>{appt.status}</span></td>
                    <td>{appt.reason}</td>
                    <td>
                      {["pending", "approved", "rescheduled"].includes(appt.status) && (
                        <>
                          <button onClick={() => handleCancel(appt._id)}>Cancel</button>
                          <button onClick={() => handleReschedule(appt._id)}>Reschedule</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <p>No appointments found</p>}
        </div>

        {/* Booking Section */}
        <h2>Book Appointment</h2>
        <div className="card">
          <form onSubmit={handleBook}>
            <select
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              required
            >
              <option value="">Select Doctor</option>
              {doctors.map((doc) => (
                <option key={doc._id} value={doc._id}>
                  {doc.name} ({doc.specialization}) - {doc.hospital}
                </option>
              ))}
            </select>

            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            <input type="text" placeholder="Time Slot (e.g. 10:00-11:00)" value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)} required />
            <input type="text" placeholder="Reason" value={reason} onChange={(e) => setReason(e.target.value)} required />

            <button type="submit">Book Appointment</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PatientDashboard;
