import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import "animate.css";
import "../styles/global.css";
import { FaUserMd, FaUsers, FaCalendarAlt, FaSignOutAlt, FaChartBar } from "react-icons/fa";

function AdminDashboard() {
  const navigate = useNavigate();
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [allDoctors, setAllDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [stats, setStats] = useState({ totalDoctors: 0, totalPatients: 0, totalAppointments: 0 });

  useEffect(() => {
    API.get("/admin/doctors/pending")
      .then(res => setPendingDoctors(res.data.doctors || []))
      .catch(() => alert("Error fetching pending doctors"));

    API.get("/admin/doctors")
      .then(res => setAllDoctors(res.data.doctors || []))
      .catch(() => alert("Error fetching all doctors"));

    API.get("/admin/patients")
      .then(res => setPatients(res.data.patients || []))
      .catch(() => alert("Error fetching patients"));

    API.get("/admin/stats")
      .then(res => setStats(res.data || {}))
      .catch(() => alert("Error fetching stats"));
  }, []);

  const approveDoctor = async (id) => {
    try {
      await API.put(`/admin/doctors/${id}/approve`);
      alert("Doctor approved!");
      setPendingDoctors(prev => prev.filter(doc => doc._id !== id));
      setAllDoctors(prev => prev.map(doc => doc._id === id ? { ...doc, status: "approved" } : doc));
    } catch {
      alert("Error approving doctor");
    }
  };

  const rejectDoctor = async (id) => {
    try {
      await API.put(`/admin/doctors/${id}/reject`);
      alert("Doctor rejected!");
      setPendingDoctors(prev => prev.filter(doc => doc._id !== id));
      setAllDoctors(prev => prev.map(doc => doc._id === id ? { ...doc, status: "rejected" } : doc));
    } catch {
      alert("Error rejecting doctor");
    }
  };

  const deletePatient = async (id) => {
    try {
      await API.delete(`/admin/patients/${id}`);
      alert("Patient deleted!");
      setPatients(prev => prev.filter(p => p._id !== id));
    } catch {
      alert("Error deleting patient");
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
        <h2>Admin Panel</h2>
        <ul>
          <li><FaUserMd /> Doctors</li>
          <li><FaUsers /> Patients</li>
          <li><FaCalendarAlt /> Appointments</li>
          <li><FaChartBar /> Stats</li>
          <li onClick={handleLogout}><FaSignOutAlt /> Logout</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="banner animate__animated animate__fadeInDown">
          <img src="/assets/admin-banner.png" alt="Admin Banner" className="banner-img" />
          <h2>Welcome Admin 🛠️</h2>
        </div>

        {/* Stats Section */}
        <h2>Dashboard Stats</h2>
        <div className="card">
          <p><b>Total Doctors:</b> {stats.totalDoctors}</p>
          <p><b>Total Patients:</b> {stats.totalPatients}</p>
          <p><b>Total Appointments:</b> {stats.totalAppointments}</p>
        </div>

        {/* Pending Doctors */}
        <h2>Pending Doctors</h2>
        <div className="card">
          {pendingDoctors.length === 0 ? (
            <p>No pending doctors</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Specialization</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingDoctors.map((doc) => (
                  <tr key={doc._id}>
                    <td>{doc.name}</td>
                    <td>{doc.specialization}</td>
                    <td><span className={`status-badge ${doc.status}`}>{doc.status}</span></td>
                    <td>
                      <button onClick={() => approveDoctor(doc._id)}>Approve</button>
                      <button onClick={() => rejectDoctor(doc._id)}>Reject</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* All Doctors */}
        <h2>All Doctors</h2>
        <div className="card">
          {allDoctors.length === 0 ? (
            <p>No doctors found</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Specialization</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {allDoctors.map((doc) => (
                  <tr key={doc._id}>
                    <td>{doc.name}</td>
                    <td>{doc.specialization}</td>
                    <td><span className={`status-badge ${doc.status}`}>{doc.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Patients Section */}
        <h2>Patients</h2>
        <div className="card">
          {patients.length === 0 ? (
            <p>No patients found</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((p) => (
                  <tr key={p._id}>
                    <td>{p.name}</td>
                    <td>{p.email}</td>
                    <td>{p.phone}</td>
                    <td><button onClick={() => deletePatient(p._id)}>Delete</button></td>
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

export default AdminDashboard;
