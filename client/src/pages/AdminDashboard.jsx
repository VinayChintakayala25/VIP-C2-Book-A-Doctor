import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import "animate.css";
import "../styles/global.css";
import { FaUserMd, FaUsers, FaCalendarAlt, FaSignOutAlt } from "react-icons/fa";

function AdminDashboard() {
  const navigate = useNavigate();
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [allDoctors, setAllDoctors] = useState([]);

  useEffect(() => {
    API.get("/admin/doctors/pending")
      .then(res => setPendingDoctors(res.data.doctors || []))
      .catch(err => alert("Error fetching pending doctors"));

    API.get("/admin/doctors")
      .then(res => setAllDoctors(res.data.doctors || []))
      .catch(err => alert("Error fetching all doctors"));
  }, []);

  const approveDoctor = async (id) => {
    try {
      await API.put(`/admin/doctors/${id}/approve`);
      alert("Doctor approved!");
      setPendingDoctors(prev => prev.filter(doc => doc._id !== id));
      setAllDoctors(prev =>
        prev.map(doc => doc._id === id ? { ...doc, status: "approved" } : doc)
      );
    } catch (err) {
      alert("Error approving doctor");
    }
  };

  const rejectDoctor = async (id) => {
    try {
      await API.put(`/admin/doctors/${id}/reject`);
      alert("Doctor rejected!");
      setPendingDoctors(prev => prev.filter(doc => doc._id !== id));
      setAllDoctors(prev =>
        prev.map(doc => doc._id === id ? { ...doc, status: "rejected" } : doc)
      );
    } catch (err) {
      alert("Error rejecting doctor");
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar animate__animated animate__fadeInLeft">
        <h2>Admin Panel</h2>
        <ul>
          <li><FaUserMd /> Doctors</li>
          <li><FaUsers /> Users</li>
          <li><FaCalendarAlt /> Appointments</li>
          <li onClick={() => navigate("/")}><FaSignOutAlt /> Logout</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="banner animate__animated animate__fadeInDown">
          <img src="/assets/admin-banner.png" alt="Admin Banner" className="banner-img" />
          <h2>Welcome Admin 🛠️</h2>
        </div>

        {/* Pending Doctors */}
        <h2>Pending Doctors</h2>
        <div className="card animate__animated animate__fadeInUp">
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
                    <td>
                      <span className={`status-badge ${doc.status}`}>
                        {doc.status}
                      </span>
                    </td>
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
        <div className="card animate__animated animate__fadeInUp">
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
                    <td>
                      <span className={`status-badge ${doc.status}`}>
                        {doc.status}
                      </span>
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

export default AdminDashboard;
