import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import "animate.css";
import "../styles/global.css";
import { FaCalendarAlt, FaUser, FaSignOutAlt, FaUserCog, FaNotesMedical, FaChartBar } from "react-icons/fa";

function DoctorDashboard() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [profile, setProfile] = useState({});
  const [patients, setPatients] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [reports, setReports] = useState({});
  const user = JSON.parse(localStorage.getItem("user"));

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

    API.get("/admin/patients", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then(res => setPatients(res.data.patients || []))
      .catch(() => alert("Error fetching patients"));

    API.get("/admin/stats", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then(res => setReports(res.data || {}))
      .catch(() => alert("Error fetching reports"));
  }, []);

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

  const handleProfileUpdate = async () => {
    try {
      const res = await API.put("/user/profile", profile, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      alert("Profile updated successfully");
      setProfile(res.data.user);
    } catch {
      alert("Error updating profile");
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
          <li><FaNotesMedical /> Prescriptions</li>
          <li><FaChartBar /> Reports</li>
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

        {/* Grid Layout */}
        <div className="grid-container">
          {/* Profile Card */}
          <div className="card">
            <h2>My Profile</h2>
            <input value={profile.phone || ""} onChange={e => setProfile({ ...profile, phone: e.target.value })} placeholder="Phone" />
            <input value={profile.specialization || ""} onChange={e => setProfile({ ...profile, specialization: e.target.value })} placeholder="Specialization" />
            <input value={profile.hospital || ""} onChange={e => setProfile({ ...profile, hospital: e.target.value })} placeholder="Hospital" />
            <input value={profile.qualifications?.join(", ") || ""} onChange={e => setProfile({ ...profile, qualifications: e.target.value.split(",") })} placeholder="Qualifications (comma separated)" />
            <input value={profile.experience || ""} onChange={e => setProfile({ ...profile, experience: e.target.value })} placeholder="Experience" />
            <input value={profile.consultationFees || ""} onChange={e => setProfile({ ...profile, consultationFees: e.target.value })} placeholder="Consultation Fees" />
            <button onClick={handleProfileUpdate}>Save Profile</button>
          </div>

          {/* Appointments Card */}
          <div className="dashboard-card">
            <h2>My Appointments</h2>
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

          {/* Patients Card */}
          <div className="dashboard-card">
            <h2>My Patients</h2>
            {patients.length === 0 ? (
              <p>No patients found</p>
            ) : (
              patients.map(p => (
                <div key={p._id} className="patient-card">
                  <p><b>Name:</b> {p.name}</p>
                  <p><b>Email:</b> {p.email}</p>
                  <p><b>Medical History:</b> {p.medicalHistory?.join(", ")}</p>
                </div>
              ))
            )}
          </div>

          {/* Prescriptions Card */}
          <div className="dashboard-card">
            <h2>Prescriptions</h2>
            {prescriptions.length === 0 ? (
              <p>No prescriptions available</p>
            ) : (
              prescriptions.map(rx => (
                <div key={rx._id} className="prescription-card">
                  <p><b>Patient:</b> {rx.patientName}</p>
                  <p><b>Medicine:</b> {rx.medicine}</p>
                  <p><b>Dosage:</b> {rx.dosage}</p>
                  <p><b>Instructions:</b> {rx.instructions}</p>
                </div>
              ))
            )}
          </div>

          {/* Reports Card */}
          <div className="dashboard-card">
            <h2>Reports</h2>
            <p><b>Total Patients:</b> {reports.totalPatients}</p>
            <p><b>Total Appointments:</b> {reports.totalAppointments}</p>
            <p><b>Total Doctors:</b> {reports.totalDoctors}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorDashboard;