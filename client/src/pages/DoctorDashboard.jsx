import React, { useEffect, useRef, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import {
  FaCalendarAlt,
  FaChartBar,
  FaClock,
  FaFileMedical,
  FaKey,
  FaNotesMedical,
  FaSignOutAlt,
  FaUser,
  FaUserCog,
} from "react-icons/fa";
import "../styles/global.css";

function DoctorDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const profileRef = useRef(null);
  const availabilityRef = useRef(null);
  const appointmentsRef = useRef(null);
  const patientsRef = useRef(null);
  const prescriptionRef = useRef(null);
  const reportsRef = useRef(null);
  const passwordRef = useRef(null);

  const [profile, setProfile] = useState({});
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({});
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const [prescription, setPrescription] = useState({
    patientName: "",
    medicine: "",
    dosage: "",
    instructions: "",
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    loadDoctorDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const loadDoctorDashboard = async () => {
    try {
      const profileRes = await API.get("/user/profile");
      setProfile(profileRes.data.user || {});

      const appointmentRes = await API.get("/doctors/appointments");
      setAppointments(appointmentRes.data.appointments || []);

      const statsRes = await API.get("/admin/stats");
      setStats(statsRes.data || {});
    } catch (err) {
      console.error(err);
      alert("Error loading doctor dashboard");
    }
  };

  const updateProfile = async () => {
    try {
      const res = await API.put("/user/profile", profile);
      setProfile(res.data.user);
      alert("Profile updated successfully");
    } catch (err) {
      console.error(err);
      alert("Error updating profile");
    }
  };

  const updateAvailability = async () => {
    try {
      const res = await API.put("/user/profile", {
        availability: profile.availability,
      });

      setProfile(res.data.user);
      alert("Availability updated successfully");
    } catch (err) {
      console.error(err);
      alert("Error updating availability");
    }
  };

  const updateAppointmentStatus = async (id, status) => {
    try {
      await API.put(`/doctors/appointments/${id}/status`, { status });
      alert(`Appointment ${status}`);
      loadDoctorDashboard();
    } catch (err) {
      console.error(err);
      alert("Error updating appointment");
    }
  };

  const rescheduleAppointment = async (id) => {
    const newDate = prompt("Enter new date (YYYY-MM-DD)");
    const newSlot = prompt("Enter new time slot e.g. 10:00-11:00");

    if (!newDate || !newSlot) return;

    try {
      await API.put(`/doctors/appointments/${id}/reschedule`, {
        rescheduledDate: newDate,
        rescheduledTimeSlot: newSlot,
      });

      alert("Appointment rescheduled successfully");
      loadDoctorDashboard();
    } catch (err) {
      console.error(err);
      alert("Error rescheduling appointment");
    }
  };

  const changePassword = async () => {
    try {
      await API.put("/user/change-password", passwordData);
      alert("Password changed successfully");
      setPasswordData({
        oldPassword: "",
        newPassword: "",
      });
    } catch (err) {
      console.error(err);
      alert("Error changing password");
    }
  };

  const addPrescription = () => {
    if (
      !prescription.patientName ||
      !prescription.medicine ||
      !prescription.dosage
    ) {
      alert("Please fill patient name, medicine and dosage");
      return;
    }

    alert("Prescription added locally. Backend prescription route can be added next.");
    setPrescription({
      patientName: "",
      medicine: "",
      dosage: "",
      instructions: "",
    });
  };

  const downloadPrescription = () => {
    const content = `
Prescription

Doctor: Dr. ${profile.name || user?.name || ""}
Patient: ${prescription.patientName}
Medicine: ${prescription.medicine}
Dosage: ${prescription.dosage}
Instructions: ${prescription.instructions}
`;

    const blob = new Blob([content], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "prescription.txt";
    link.click();
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const uniquePatients = [
    ...new Map(
      appointments.map((app) => [
        app.patientId,
        {
          id: app.patientId,
          name: app.patientName,
          reason: app.reason,
          status: app.status,
        },
      ])
    ).values(),
  ];

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <h2>Doctor Panel</h2>

        <ul>
          <li onClick={() => scrollToSection(profileRef)}>
            <FaUserCog /> Profile
          </li>

          <li onClick={() => scrollToSection(availabilityRef)}>
            <FaClock /> Availability
          </li>

          <li onClick={() => scrollToSection(appointmentsRef)}>
            <FaCalendarAlt /> Appointments
          </li>

          <li onClick={() => scrollToSection(patientsRef)}>
            <FaUser /> Patients
          </li>

          <li onClick={() => scrollToSection(prescriptionRef)}>
            <FaNotesMedical /> Prescriptions
          </li>

          <li onClick={() => scrollToSection(reportsRef)}>
            <FaChartBar /> Reports
          </li>

          <li onClick={() => scrollToSection(passwordRef)}>
            <FaKey /> Change Password
          </li>

          <li onClick={logout}>
            <FaSignOutAlt /> Logout
          </li>
        </ul>
      </div>

      <div className="main-content">
        <div className="banner">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2785/2785482.png"
            alt="Doctor Dashboard"
            className="banner-img"
          />
          <div>
            <h2>Welcome Dr. {profile.name || user?.name}</h2>
            <p>Manage appointments, patients, availability and prescriptions</p>
          </div>
        </div>

        <div className="stats-cards">
          <div className="stats-card">
            <h3>Total Patients</h3>
            <p>{uniquePatients.length}</p>
          </div>

          <div className="stats-card">
            <h3>Total Appointments</h3>
            <p>{appointments.length}</p>
          </div>

          <div className="stats-card">
            <h3>Completed</h3>
            <p>{appointments.filter((a) => a.status === "completed").length}</p>
          </div>

          <div className="stats-card">
            <h3>Pending</h3>
            <p>{appointments.filter((a) => a.status === "pending").length}</p>
          </div>
        </div>

        <div className="grid-container">
          <div className="dashboard-card" ref={profileRef}>
            <h2>Profile Management</h2>

            <input
              type="text"
              placeholder="Phone"
              value={profile.phone || ""}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  phone: e.target.value,
                })
              }
            />

            <input
              type="text"
              placeholder="Specialization"
              value={profile.specialization || ""}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  specialization: e.target.value,
                })
              }
            />

            <input
              type="text"
              placeholder="Hospital"
              value={profile.hospital || ""}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  hospital: e.target.value,
                })
              }
            />

            <input
              type="text"
              placeholder="Qualifications comma separated"
              value={profile.qualifications?.join(", ") || ""}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  qualifications: e.target.value
                    .split(",")
                    .map((q) => q.trim()),
                })
              }
            />

            <input
              type="text"
              placeholder="Experience"
              value={profile.experience || ""}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  experience: e.target.value,
                })
              }
            />

            <input
              type="number"
              placeholder="Consultation Fees"
              value={profile.consultationFees || ""}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  consultationFees: e.target.value,
                })
              }
            />

            <button onClick={updateProfile}>Save Profile</button>
          </div>

          <div className="dashboard-card" ref={availabilityRef}>
            <h2>Availability Management</h2>

            <input
              type="text"
              placeholder="Available Days e.g. Monday, Tuesday"
              value={profile.availability?.days?.join(", ") || ""}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  availability: {
                    ...profile.availability,
                    days: e.target.value.split(",").map((d) => d.trim()),
                  },
                })
              }
            />

            <input
              type="text"
              placeholder="Time Slots e.g. 10:00-12:00, 14:00-16:00"
              value={profile.availability?.timeSlots?.join(", ") || ""}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  availability: {
                    ...profile.availability,
                    timeSlots: e.target.value.split(",").map((t) => t.trim()),
                  },
                })
              }
            />

            <input
              type="text"
              placeholder="Leave Days e.g. 2026-06-20, 2026-06-25"
              value={profile.availability?.leaveDays?.join(", ") || ""}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  availability: {
                    ...profile.availability,
                    leaveDays: e.target.value.split(",").map((d) => d.trim()),
                  },
                })
              }
            />

            <button onClick={updateAvailability}>Save Availability</button>
          </div>

          <div className="dashboard-card full-width" ref={appointmentsRef}>
            <h2>Appointment Management</h2>

            {appointments.length === 0 ? (
              <p>No appointments assigned.</p>
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
                    {appointments.map((app) => (
                      <tr key={app._id}>
                        <td>{app.patientName}</td>
                        <td>{new Date(app.date).toLocaleDateString()}</td>
                        <td>{app.rescheduledTimeSlot || app.timeSlot}</td>
                        <td>
                          <span className={`status-badge ${app.status}`}>
                            {app.status}
                          </span>
                        </td>
                        <td>{app.reason}</td>
                        <td>
                          {app.status === "pending" && (
                            <>
                              <button
                                type="button"
                                onClick={() =>
                                  updateAppointmentStatus(app._id, "approved")
                                }
                              >
                                Accept
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  updateAppointmentStatus(app._id, "rejected")
                                }
                              >
                                Reject
                              </button>
                            </>
                          )}

                          {app.status === "approved" && (
                            <>
                              <button
                                type="button"
                                onClick={() =>
                                  updateAppointmentStatus(app._id, "completed")
                                }
                              >
                                Complete
                              </button>

                              <button
                                type="button"
                                onClick={() => rescheduleAppointment(app._id)}
                              >
                                Reschedule
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="dashboard-card" ref={patientsRef}>
            <h2>Patient Management</h2>

            {uniquePatients.length === 0 ? (
              <p>No patient records found.</p>
            ) : (
              uniquePatients.map((patient) => (
                <div className="mini-card" key={patient.id}>
                  <p>
                    <b>Name:</b> {patient.name}
                  </p>
                  <p>
                    <b>Last Reason:</b> {patient.reason}
                  </p>
                  <p>
                    <b>Status:</b> {patient.status}
                  </p>
                  <p>
                    Medical history and uploaded reports can be expanded after
                    adding full reports backend.
                  </p>
                </div>
              ))
            )}
          </div>

          <div className="dashboard-card" ref={prescriptionRef}>
            <h2>Prescription Management</h2>

            <input
              type="text"
              placeholder="Patient Name"
              value={prescription.patientName}
              onChange={(e) =>
                setPrescription({
                  ...prescription,
                  patientName: e.target.value,
                })
              }
            />

            <input
              type="text"
              placeholder="Medicine"
              value={prescription.medicine}
              onChange={(e) =>
                setPrescription({
                  ...prescription,
                  medicine: e.target.value,
                })
              }
            />

            <input
              type="text"
              placeholder="Dosage"
              value={prescription.dosage}
              onChange={(e) =>
                setPrescription({
                  ...prescription,
                  dosage: e.target.value,
                })
              }
            />

            <textarea
              placeholder="Instructions"
              value={prescription.instructions}
              onChange={(e) =>
                setPrescription({
                  ...prescription,
                  instructions: e.target.value,
                })
              }
            />

            <button onClick={addPrescription}>Add Prescription</button>
            <button onClick={downloadPrescription}>Download Prescription</button>
          </div>

          <div className="dashboard-card" ref={reportsRef}>
            <h2>Reports & Analytics</h2>

            <p>
              <b>Total Patients:</b> {uniquePatients.length}
            </p>
            <p>
              <b>Total Appointments:</b> {appointments.length}
            </p>
            <p>
              <b>Monthly Appointments:</b> {appointments.length}
            </p>
            <p>
              <b>System Doctors:</b> {stats.totalDoctors || 0}
            </p>
          </div>

          <div className="dashboard-card full-width" ref={passwordRef}>
            <h2>Change Password</h2>

            <input
              type="password"
              placeholder="Old Password"
              value={passwordData.oldPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  oldPassword: e.target.value,
                })
              }
            />

            <input
              type="password"
              placeholder="New Password"
              value={passwordData.newPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  newPassword: e.target.value,
                })
              }
            />

            <button onClick={changePassword}>Update Password</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorDashboard;
