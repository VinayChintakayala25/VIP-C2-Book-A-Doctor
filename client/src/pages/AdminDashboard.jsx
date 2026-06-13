import React, { useEffect, useRef, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import {
  FaCalendarAlt,
  FaChartBar,
  FaCog,
  FaHospital,
  FaSignOutAlt,
  FaUserMd,
  FaUsers,
} from "react-icons/fa";
import "../styles/global.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const statsRef = useRef(null);
  const pendingDoctorsRef = useRef(null);
  const doctorsRef = useRef(null);
  const patientsRef = useRef(null);
  const appointmentsRef = useRef(null);
  const specializationRef = useRef(null);
  const settingsRef = useRef(null);

  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [allDoctors, setAllDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalPatients: 0,
    totalAppointments: 0,
  });

  const [newDoctor, setNewDoctor] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    specialization: "",
    hospital: "",
    experience: "",
    consultationFees: "",
  });

  const [specializations, setSpecializations] = useState([
    "Cardiologist",
    "Dermatologist",
    "Neurologist",
    "Dentist",
  ]);
  const [newSpecialization, setNewSpecialization] = useState("");

  const [settings, setSettings] = useState({
    hospitalName: "Book A Doctor Hospital",
    defaultFees: "500",
    notificationMessage: "Appointment reminders enabled",
  });

  useEffect(() => {
    loadAdminDashboard();
  }, []);

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const loadAdminDashboard = async () => {
    try {
      const pendingRes = await API.get("/admin/doctors/pending");
      setPendingDoctors(pendingRes.data.doctors || []);

      const doctorsRes = await API.get("/admin/doctors");
      setAllDoctors(doctorsRes.data.doctors || []);

      const patientsRes = await API.get("/admin/patients");
      setPatients(patientsRes.data.patients || []);

      const statsRes = await API.get("/admin/stats");
      setStats(statsRes.data || {});

      try {
        const appointmentRes = await API.get("/appointments");
        setAppointments(appointmentRes.data.appointments || []);
      } catch {
        setAppointments([]);
      }
    } catch (err) {
      console.error(err);
      alert("Error loading admin dashboard");
    }
  };

  const approveDoctor = async (id) => {
    try {
      await API.put(`/admin/doctors/${id}/approve`);
      alert("Doctor approved successfully");
      loadAdminDashboard();
    } catch (err) {
      console.error(err);
      alert("Error approving doctor");
    }
  };

  const rejectDoctor = async (id) => {
    try {
      await API.put(`/admin/doctors/${id}/reject`);
      alert("Doctor rejected successfully");
      loadAdminDashboard();
    } catch (err) {
      console.error(err);
      alert("Error rejecting doctor");
    }
  };

  const deleteDoctor = async (id) => {
    if (!window.confirm("Are you sure you want to delete this doctor?")) return;

    try {
      await API.delete(`/admin/doctors/${id}`);
      alert("Doctor deleted successfully");
      loadAdminDashboard();
    } catch (err) {
      console.error(err);
      alert("Error deleting doctor");
    }
  };

  const deletePatient = async (id) => {
    if (!window.confirm("Are you sure you want to delete this patient?")) return;

    try {
      await API.delete(`/admin/patients/${id}`);
      alert("Patient deleted successfully");
      loadAdminDashboard();
    } catch (err) {
      console.error(err);
      alert("Error deleting patient");
    }
  };

  const updateAppointmentStatus = async (id, status) => {
    try {
      await API.put(`/appointments/${id}/status`, { status });
      alert("Appointment status updated");
      loadAdminDashboard();
    } catch (err) {
      console.error(err);
      alert("Error updating appointment");
    }
  };

  const cancelAppointment = async (id) => {
    try {
      await API.put(`/appointments/${id}/cancel`);
      alert("Appointment cancelled");
      loadAdminDashboard();
    } catch (err) {
      console.error(err);
      alert("Error cancelling appointment");
    }
  };

  const addDoctor = async (e) => {
    e.preventDefault();

    try {
      await API.post("/user/register", {
        ...newDoctor,
        role: "doctor",
      });

      alert("Doctor added. Approve the doctor from pending list.");

      setNewDoctor({
        name: "",
        email: "",
        password: "",
        phone: "",
        specialization: "",
        hospital: "",
        experience: "",
        consultationFees: "",
      });

      loadAdminDashboard();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error adding doctor");
    }
  };

  const addSpecialization = () => {
    if (!newSpecialization.trim()) return;

    setSpecializations([...specializations, newSpecialization.trim()]);
    setNewSpecialization("");
    alert("Specialization added locally");
  };

  const deleteSpecialization = (name) => {
    setSpecializations(specializations.filter((item) => item !== name));
  };

  const saveSettings = () => {
    alert("Settings saved locally. Backend settings route can be added later.");
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <h2>Admin Panel</h2>

        <ul>
          <li onClick={() => scrollToSection(statsRef)}>
            <FaChartBar /> Statistics
          </li>

          <li onClick={() => scrollToSection(pendingDoctorsRef)}>
            <FaUserMd /> Approvals
          </li>

          <li onClick={() => scrollToSection(doctorsRef)}>
            <FaUserMd /> Doctors
          </li>

          <li onClick={() => scrollToSection(patientsRef)}>
            <FaUsers /> Patients
          </li>

          <li onClick={() => scrollToSection(appointmentsRef)}>
            <FaCalendarAlt /> Appointments
          </li>

          <li onClick={() => scrollToSection(specializationRef)}>
            <FaHospital /> Specializations
          </li>

          <li onClick={() => scrollToSection(settingsRef)}>
            <FaCog /> Settings
          </li>

          <li onClick={logout}>
            <FaSignOutAlt /> Logout
          </li>
        </ul>
      </div>

      <div className="main-content">
        <div className="banner">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135768.png"
            alt="Admin Dashboard"
            className="banner-img"
          />
          <div>
            <h2>Admin Dashboard</h2>
            <p>Manage doctors, patients, appointments and hospital operations</p>
          </div>
        </div>

        <div className="stats-cards" ref={statsRef}>
          <div className="stats-card">
            <h3>Total Doctors</h3>
            <p>{stats.totalDoctors || allDoctors.length}</p>
          </div>

          <div className="stats-card">
            <h3>Total Patients</h3>
            <p>{stats.totalPatients || patients.length}</p>
          </div>

          <div className="stats-card">
            <h3>Total Appointments</h3>
            <p>{stats.totalAppointments || appointments.length}</p>
          </div>

          <div className="stats-card">
            <h3>Total Revenue</h3>
            <p>₹0</p>
          </div>
        </div>

        <div className="grid-container">
          <div className="dashboard-card full-width" ref={pendingDoctorsRef}>
            <h2>Doctor Registration Approvals</h2>

            {pendingDoctors.length === 0 ? (
              <p>No pending doctor approvals.</p>
            ) : (
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Specialization</th>
                      <th>Hospital</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {pendingDoctors.map((doctor) => (
                      <tr key={doctor._id}>
                        <td>{doctor.name}</td>
                        <td>{doctor.email}</td>
                        <td>{doctor.specialization || "Not added"}</td>
                        <td>{doctor.hospital || "Not added"}</td>
                        <td>
                          <span className={`status-badge ${doctor.status}`}>
                            {doctor.status}
                          </span>
                        </td>
                        <td>
                          <button onClick={() => approveDoctor(doctor._id)}>
                            Approve
                          </button>
                          <button onClick={() => rejectDoctor(doctor._id)}>
                            Reject
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="dashboard-card" ref={doctorsRef}>
            <h2>Add Doctor</h2>

            <form onSubmit={addDoctor}>
              <input
                type="text"
                placeholder="Doctor Name"
                value={newDoctor.name}
                onChange={(e) =>
                  setNewDoctor({ ...newDoctor, name: e.target.value })
                }
                required
              />

              <input
                type="email"
                placeholder="Email"
                value={newDoctor.email}
                onChange={(e) =>
                  setNewDoctor({ ...newDoctor, email: e.target.value })
                }
                required
              />

              <input
                type="password"
                placeholder="Password"
                value={newDoctor.password}
                onChange={(e) =>
                  setNewDoctor({ ...newDoctor, password: e.target.value })
                }
                required
              />

              <input
                type="text"
                placeholder="Phone"
                value={newDoctor.phone}
                onChange={(e) =>
                  setNewDoctor({ ...newDoctor, phone: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="Specialization"
                value={newDoctor.specialization}
                onChange={(e) =>
                  setNewDoctor({
                    ...newDoctor,
                    specialization: e.target.value,
                  })
                }
                required
              />

              <input
                type="text"
                placeholder="Hospital"
                value={newDoctor.hospital}
                onChange={(e) =>
                  setNewDoctor({ ...newDoctor, hospital: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="Experience"
                value={newDoctor.experience}
                onChange={(e) =>
                  setNewDoctor({ ...newDoctor, experience: e.target.value })
                }
              />

              <input
                type="number"
                placeholder="Consultation Fees"
                value={newDoctor.consultationFees}
                onChange={(e) =>
                  setNewDoctor({
                    ...newDoctor,
                    consultationFees: e.target.value,
                  })
                }
              />

              <button type="submit">Add Doctor</button>
            </form>
          </div>

          <div className="dashboard-card">
            <h2>Doctor Management</h2>

            {allDoctors.length === 0 ? (
              <p>No doctors found.</p>
            ) : (
              allDoctors.map((doctor) => (
                <div className="mini-card" key={doctor._id}>
                  <p>
                    <b>Name:</b> Dr. {doctor.name}
                  </p>
                  <p>
                    <b>Email:</b> {doctor.email}
                  </p>
                  <p>
                    <b>Specialization:</b> {doctor.specialization || "Not added"}
                  </p>
                  <p>
                    <b>Status:</b> {doctor.status}
                  </p>
                  <button onClick={() => deleteDoctor(doctor._id)}>
                    Delete Doctor
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="dashboard-card full-width" ref={patientsRef}>
            <h2>Patient Management</h2>

            {patients.length === 0 ? (
              <p>No patients found.</p>
            ) : (
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Medical History</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {patients.map((patient) => (
                      <tr key={patient._id}>
                        <td>{patient.name}</td>
                        <td>{patient.email}</td>
                        <td>{patient.phone || "Not added"}</td>
                        <td>{patient.medicalHistory?.join(", ") || "None"}</td>
                        <td>
                          <button onClick={() => deletePatient(patient._id)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="dashboard-card full-width" ref={appointmentsRef}>
            <h2>Appointment Management</h2>

            {appointments.length === 0 ? (
              <p>No appointments found or appointment route not enabled.</p>
            ) : (
              <div className="table-wrapper">
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
                    {appointments.map((appointment) => (
                      <tr key={appointment._id}>
                        <td>{appointment.patientName}</td>
                        <td>
                          {new Date(appointment.date).toLocaleDateString()}
                        </td>
                        <td>
                          {appointment.rescheduledTimeSlot ||
                            appointment.timeSlot}
                        </td>
                        <td>
                          <span className={`status-badge ${appointment.status}`}>
                            {appointment.status}
                          </span>
                        </td>
                        <td>{appointment.reason}</td>
                        <td>
                          <button
                            onClick={() =>
                              updateAppointmentStatus(
                                appointment._id,
                                "approved"
                              )
                            }
                          >
                            Approve
                          </button>
                          <button
                            onClick={() =>
                              updateAppointmentStatus(
                                appointment._id,
                                "completed"
                              )
                            }
                          >
                            Complete
                          </button>
                          <button
                            onClick={() => cancelAppointment(appointment._id)}
                          >
                            Cancel
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="dashboard-card" ref={specializationRef}>
            <h2>Specialization Management</h2>

            <input
              type="text"
              placeholder="Add Specialization"
              value={newSpecialization}
              onChange={(e) => setNewSpecialization(e.target.value)}
            />

            <button onClick={addSpecialization}>Add Specialization</button>

            <div style={{ marginTop: "15px" }}>
              {specializations.map((item) => (
                <div className="mini-card" key={item}>
                  <p>
                    <b>{item}</b>
                  </p>
                  <button onClick={() => deleteSpecialization(item)}>
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="dashboard-card" ref={settingsRef}>
            <h2>System Settings</h2>

            <input
              type="text"
              placeholder="Hospital Name"
              value={settings.hospitalName}
              onChange={(e) =>
                setSettings({ ...settings, hospitalName: e.target.value })
              }
            />

            <input
              type="number"
              placeholder="Default Fees"
              value={settings.defaultFees}
              onChange={(e) =>
                setSettings({ ...settings, defaultFees: e.target.value })
              }
            />

            <textarea
              placeholder="Notification Message"
              value={settings.notificationMessage}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  notificationMessage: e.target.value,
                })
              }
            />

            <button onClick={saveSettings}>Save Settings</button>
          </div>

          <div className="dashboard-card full-width">
            <h2>Reports & Analytics</h2>

            <p>
              <b>Appointment Reports:</b> {appointments.length}
            </p>
            <p>
              <b>Doctor Performance Reports:</b> Basic doctor statistics available
            </p>
            <p>
              <b>Revenue Reports:</b> ₹0 until payment module is added
            </p>
            <p>
              <b>System Status:</b> Active
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
