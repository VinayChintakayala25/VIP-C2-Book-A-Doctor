import React, { useState, useEffect } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import "animate.css";
import "../styles/global.css";
import { FaCalendarAlt, FaUserMd, FaSignOutAlt } from "react-icons/fa";

function PatientDashboard() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resAppointments = await API.get("/appointments/patient");
        setAppointments(resAppointments.data.appointments || []);

        const resDoctors = await API.get("/admin/doctors");
        setDoctors(resDoctors.data.doctors || []);
      } catch (err) {
        alert(err.response?.data?.message || "Error fetching data");
      }
    };
    fetchData();
  }, []);

  const doctorMap = {};
  doctors.forEach((doc) => {
    doctorMap[doc._id] = doc;
  });

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar animate__animated animate__fadeInLeft">
        <h2>Patient Panel</h2>
        <ul>
          <li onClick={() => navigate("/patient")}><FaCalendarAlt /> Appointments</li>
          <li onClick={() => navigate("/book-appointment")}><FaUserMd /> Book Doctor</li>
          <li onClick={() => navigate("/")}><FaSignOutAlt /> Logout</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Banner Image */}
        <div className="banner animate__animated animate__fadeInDown">
          <img src="/assets/patient-banner.png" alt="Patient Banner" className="banner-img" />
          <h2>Welcome to Your Dashboard</h2>
        </div>

        <h2 className="animate__animated animate__fadeIn">My Appointments</h2>
        <div className="card animate__animated animate__fadeInUp">
          {appointments && appointments.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Doctor</th>
                  <th>Status</th>
                  <th>Reason</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appt) => (
                  <tr key={appt._id}>
                    <td>{new Date(appt.date).toLocaleDateString()}</td>
                    <td>{doctorMap[appt.doctorId]?.name || "Unknown Doctor"}</td>
                    <td>
                      <span className={`status-badge ${appt.status}`}>
                        {appt.status}
                      </span>
                    </td>
                    <td>{appt.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No appointments found</p>
          )}
        </div>

        <h2 className="animate__animated animate__fadeIn">Available Doctors</h2>
        <div className="doctor-list">
          {doctors.map((doc) => (
            <div key={doc._id} className="card animate__animated animate__zoomIn">
              <img src="/assets/doctor-icon.png" alt="Doctor" className="doctor-avatar" />
              <h3>{doc.name}</h3>
              <p>{doc.specialization}</p>
              <p>Status: {doc.status}</p>
              {doc.status === "approved" && (
                <button onClick={() => navigate("/book-appointment")}>
                  Book Now
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PatientDashboard;
