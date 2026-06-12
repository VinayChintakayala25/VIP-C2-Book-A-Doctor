import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import "animate.css";
import "../styles/global.css";
import { FaCalendarAlt, FaUser, FaSignOutAlt } from "react-icons/fa";

function DoctorDashboard() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);

  // Fetch appointments assigned to this doctor
  useEffect(() => {
    API.get("/appointments/doctor", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then(res => {
        setAppointments(res.data.appointments || []);
      })
      .catch(err => {
        console.error(err);
        alert("Error fetching doctor appointments");
      });
  }, []);

  // Approve or reject appointment
  const updateStatus = async (id, status) => {
    try {
      const res = await API.put(`/appointments/update/${id}`, { status }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      alert(res.data.message);

      // Refresh list after update
      setAppointments(prev =>
        prev.map(app =>
          app._id === id ? { ...app, status } : app
        )
      );
    } catch (err) {
      alert("Error updating appointment");
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar animate__animated animate__fadeInLeft">
        <h2>Doctor Panel</h2>
        <ul>
          <li><FaCalendarAlt /> Appointments</li>
          <li><FaUser /> Patients</li>
          <li onClick={() => navigate("/")}><FaSignOutAlt /> Logout</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Banner */}
        <div className="banner animate__animated animate__fadeInDown">
          <img src="/assets/doctor-banner.png" alt="Doctor Banner" className="banner-img" />
          <h2>Welcome Doctor 👨‍⚕️</h2>
        </div>

        <h2 className="animate__animated animate__fadeIn">My Appointments</h2>
        <div className="card animate__animated animate__fadeInUp">
          {appointments.length === 0 ? (
            <p>No appointments assigned</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Date</th>
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
                    <td>
                      <span className={`status-badge ${app.status}`}>
                        {app.status}
                      </span>
                    </td>
                    <td>{app.reason}</td>
                    <td>
                      {app.status === "pending" && (
                        <>
                          <button onClick={() => updateStatus(app._id, "approved")}>
                            Approve
                          </button>
                          <button onClick={() => updateStatus(app._id, "rejected")}>
                            Reject
                          </button>
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
