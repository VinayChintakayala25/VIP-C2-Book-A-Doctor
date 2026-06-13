import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import "animate.css";
import "../styles/global.css";
import { FaCalendarAlt, FaUser, FaSignOutAlt, FaUserCog } from "react-icons/fa";

function DoctorDashboard() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [profile, setProfile] = useState({});
  const user = JSON.parse(localStorage.getItem("user"));

  // Fetch doctor profile + appointments
  useEffect(() => {
    API.get("/doctors/appointments", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then(res => setAppointments(res.data.appointments || []))
      .catch(() => alert("Error fetching doctor appointments"));

    API.get("/user/profile", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then(res => setProfile(res.data.user || {}))
      .catch(() => alert("Error fetching profile"));
  }, []);

  // Update appointment status
  const updateStatus = async (id, status) => {
    try {
      const res = await API.put(`/doctors/appointments/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      alert(res.data.message);
      setAppointments(prev => prev.map(app => app._id === id ? { ...app, status } : app));
    } catch {
      alert("Error updating appointment");
    }
  };

  // Reschedule appointment
  const rescheduleAppointment = async (id) => {
    const newDate = prompt("Enter new date (YYYY-MM-DD):");
    const newSlot = prompt("Enter new time slot (e.g. 14:00-15:00):");
    if (!newDate || !newSlot) return;
    try {
      const res = await API.put(`/doctors/appointments/${id}/reschedule`, {
        rescheduledDate: newDate,
        rescheduledTimeSlot: newSlot,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      alert(res.data.message);
      window.location.reload();
    } catch {
      alert("Error rescheduling appointment");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar animate__animated animate__fadeInLeft">
        <h2>Doctor Panel</h2>
        <ul>
          <li><FaCalendarAlt /> Appointments</li>
          <li><FaUser /> Patients</li>
          <li><FaUserCog /> Profile</li>
          <li onClick={handleLogout}><FaSignOutAlt /> Logout</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Banner */}
        <div className="banner animate__animated animate__fadeInDown">
          <img src="/assets/doctor-banner.png" alt="Doctor Banner" className="banner-img" />
          <h2>Welcome Dr. {user.name}</h2>
        </div>

        {/* Profile Section */}
        <h2>My Profile</h2>
        <div className="card">
          <p><b>Name:</b> {profile.name}</p>
          <p><b>Email:</b> {profile.email}</p>
          <p><b>Phone:</b> {profile.phone}</p>
          <p><b>Specialization:</b> {profile.specialization}</p>
          <p><b>Hospital:</b> {profile.hospital}</p>
          <p><b>Qualifications:</b> {profile.qualifications?.join(", ")}</p>
          <p><b>Experience:</b> {profile.experience}</p>
          <p><b>Consultation Fees:</b> {profile.consultationFees}</p>
          <p><b>Availability:</b> {profile.availability?.timeSlots?.join(", ")}</p>
        </div>

        {/* Appointments Section */}
        <h2>My Appointments</h2>
        <div className="card animate__animated animate__fadeInUp">
          {appointments.length === 0 ? (
            <p>No appointments assigned</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Date</th>
                  <th>Time Slot</th>
                  <th>Status</th>
                  <th>Reason</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map(app => (
                  <tr key={app._id}>
                    <td>{app.patientName}</td>
                    <td>{new Date(app.date).toLocaleDateString()}</td>
                    <td>{app.timeSlot}</td>
                    <td><span className={`status-badge ${app.status}`}>{app.status}</span></td>
                    <td>{app.reason}</td>
                    <td>
                      {app.status === "pending" && (
                        <>
                          <button onClick={() => updateStatus(app._id, "approved")}>Approve</button>
                          <button onClick={() => updateStatus(app._id, "rejected")}>Reject</button>
                        </>
                      )}
                      {app.status === "approved" && (
                        <>
                          <button onClick={() => updateStatus(app._id, "completed")}>Complete</button>
                          <button onClick={() => rescheduleAppointment(app._id)}>Reschedule</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default DoctorDashboard;
