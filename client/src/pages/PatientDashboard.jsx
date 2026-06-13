import React, { useEffect, useRef, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import {
  FaBell,
  FaCalendarAlt,
  FaFileMedical,
  FaLock,
  FaSignOutAlt,
  FaUser,
  FaUserMd,
} from "react-icons/fa";
import "../styles/global.css";

function PatientDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const profileRef = useRef(null);
  const doctorsRef = useRef(null);
  const bookRef = useRef(null);
  const appointmentsRef = useRef(null);
  const reportsRef = useRef(null);
  const notificationsRef = useRef(null);
  const passwordRef = useRef(null);

  const [profile, setProfile] = useState({});
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const [searchName, setSearchName] = useState("");
  const [searchSpecialization, setSearchSpecialization] = useState("");
  const [searchHospital, setSearchHospital] = useState("");

  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [reason, setReason] = useState("");

  const [profilePicture, setProfilePicture] = useState("");
  const [reportData, setReportData] = useState({
    fileName: "",
    fileUrl: "",
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const notifications = [
    {
      title: "Appointment Updates",
      message: "Appointment confirmations and cancellations will appear here.",
    },
    {
      title: "Reminder",
      message: "Please check your booked appointments regularly.",
    },
  ];

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    loadDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const loadDashboardData = async () => {
    try {
      const profileRes = await API.get("/user/profile");
      const profileData = profileRes.data.user || {};
      setProfile(profileData);
      setProfilePicture(profileData.profilePicture || "");

      const doctorRes = await API.get("/doctors");
      const approvedDoctors = doctorRes.data.doctors || [];
      setDoctors(approvedDoctors);
      setFilteredDoctors(approvedDoctors);

      const userId = user._id || user.id;
      const appointmentRes = await API.get(`/appointments/patient/${userId}`);
      setAppointments(appointmentRes.data.appointments || []);
    } catch (err) {
      console.error(err);
      alert("Error loading patient dashboard");
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

  const uploadProfilePicture = async () => {
    try {
      await API.put("/user/profile-picture", { profilePicture });
      alert("Profile picture updated");
      loadDashboardData();
    } catch (err) {
      console.error(err);
      alert("Error updating profile picture");
    }
  };

  const changePassword = async () => {
    try {
      await API.put("/user/change-password", passwordData);
      alert("Password changed successfully");
      setPasswordData({ oldPassword: "", newPassword: "" });
    } catch (err) {
      console.error(err);
      alert("Error changing password");
    }
  };

  const uploadReport = async () => {
    if (!reportData.fileName || !reportData.fileUrl) {
      alert("Please enter report name and report URL");
      return;
    }

    try {
      const updatedReports = [
        ...(profile.reports || []),
        {
          fileName: reportData.fileName,
          fileUrl: reportData.fileUrl,
        },
      ];

      const res = await API.put("/user/profile", { reports: updatedReports });
      setProfile(res.data.user);
      setReportData({ fileName: "", fileUrl: "" });
      alert("Report uploaded successfully");
    } catch (err) {
      console.error(err);
      alert("Error uploading report");
    }
  };

  const searchDoctors = () => {
    const result = doctors.filter((doc) => {
      const nameMatch = (doc.name || "")
        .toLowerCase()
        .includes(searchName.toLowerCase());

      const specializationMatch = (doc.specialization || "")
        .toLowerCase()
        .includes(searchSpecialization.toLowerCase());

      const hospitalMatch = (doc.hospital || "")
        .toLowerCase()
        .includes(searchHospital.toLowerCase());

      return nameMatch && specializationMatch && hospitalMatch;
    });

    setFilteredDoctors(result);
  };

  const bookAppointment = async (e) => {
    e.preventDefault();

    try {
      const userId = user._id || user.id;

      await API.post("/appointments/book", {
        patientId: userId,
        patientName: profile.name || user.name,
        doctorId: selectedDoctor,
        date,
        timeSlot,
        reason,
      });

      alert("Appointment booked successfully");

      setSelectedDoctor("");
      setDate("");
      setTimeSlot("");
      setReason("");

      loadDashboardData();
    } catch (err) {
      console.error(err);
      alert("Error booking appointment");
    }
  };

  const cancelAppointment = async (id) => {
    try {
      await API.put(`/appointments/${id}/cancel`);
      alert("Appointment cancelled");
      loadDashboardData();
    } catch (err) {
      console.error(err);
      alert("Unable to cancel appointment");
    }
  };

  const rescheduleAppointment = async (id) => {
    const newDate = prompt("Enter new date (YYYY-MM-DD)");
    const newSlot = prompt("Enter new time slot");

    if (!newDate || !newSlot) return;

    try {
      await API.put(`/appointments/${id}/reschedule`, {
        rescheduledDate: newDate,
        rescheduledTimeSlot: newSlot,
      });

      alert("Appointment rescheduled");
      loadDashboardData();
    } catch (err) {
      console.error(err);
      alert("Unable to reschedule appointment");
    }
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <h2>Patient Panel</h2>

        <ul>
          <li onClick={() => scrollToSection(profileRef)}>
            <FaUser /> Profile
          </li>

          <li onClick={() => scrollToSection(doctorsRef)}>
            <FaUserMd /> Doctors
          </li>

          <li onClick={() => scrollToSection(bookRef)}>
            <FaCalendarAlt /> Book Appointment
          </li>

          <li onClick={() => scrollToSection(appointmentsRef)}>
            <FaCalendarAlt /> My Appointments
          </li>

          <li onClick={() => scrollToSection(reportsRef)}>
            <FaFileMedical /> Reports
          </li>

          <li onClick={() => scrollToSection(notificationsRef)}>
            <FaBell /> Notifications
          </li>

          <li onClick={() => scrollToSection(passwordRef)}>
            <FaLock /> Change Password
          </li>

          <li
            onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}
          >
            <FaSignOutAlt /> Logout
          </li>
        </ul>
      </div>

      <div className="main-content">
        <div className="banner">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3774/3774299.png"
            alt="Patient Dashboard"
            className="banner-img"
          />
          <div>
            <h2>Patient Dashboard</h2>
            <p>Manage appointments, medical reports and doctor bookings</p>
          </div>
        </div>

        <div className="stats-cards">
          <div className="stats-card">
            <h3>Total Doctors</h3>
            <p>{doctors.length}</p>
          </div>

          <div className="stats-card">
            <h3>Appointments</h3>
            <p>{appointments.length}</p>
          </div>

          <div className="stats-card">
            <h3>Reports</h3>
            <p>{profile.reports?.length || 0}</p>
          </div>

          <div className="stats-card">
            <h3>Notifications</h3>
            <p>{notifications.length}</p>
          </div>
        </div>

        <div className="grid-container">
          <div className="dashboard-card" ref={profileRef}>
            <h2>Profile Management</h2>

            <input
              type="text"
              placeholder="Name"
              value={profile.name || ""}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  name: e.target.value,
                })
              }
            />

            <input
              type="email"
              placeholder="Email"
              value={profile.email || ""}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  email: e.target.value,
                })
              }
            />

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

            <textarea
              placeholder="Medical History"
              value={profile.medicalHistory?.join(", ") || ""}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  medicalHistory: e.target.value
                    .split(",")
                    .map((item) => item.trim()),
                })
              }
            />

            <button onClick={updateProfile}>Update Profile</button>
          </div>

          <div className="dashboard-card">
            <h2>Profile Picture</h2>

            {profile.profilePicture ? (
              <img
                src={profile.profilePicture}
                alt="Profile"
                className="profile-preview"
              />
            ) : (
              <p>No profile picture added</p>
            )}

            <input
              type="text"
              placeholder="Paste image URL"
              value={profilePicture}
              onChange={(e) => setProfilePicture(e.target.value)}
            />

            <button onClick={uploadProfilePicture}>Update Picture</button>
          </div>

          <div className="dashboard-card full-width" ref={doctorsRef}>
            <h2>Doctor Search</h2>

            <div className="search-box">
              <input
                type="text"
                placeholder="Search by doctor name"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
              />

              <input
                type="text"
                placeholder="Specialization"
                value={searchSpecialization}
                onChange={(e) => setSearchSpecialization(e.target.value)}
              />

              <input
                type="text"
                placeholder="Hospital"
                value={searchHospital}
                onChange={(e) => setSearchHospital(e.target.value)}
              />

              <button onClick={searchDoctors}>Search</button>
            </div>

            {filteredDoctors.length === 0 ? (
              <p>No approved doctors found.</p>
            ) : (
              filteredDoctors.map((doc) => (
                <div className="mini-card" key={doc._id}>
                  <p>
                    <b>Name:</b> Dr. {doc.name}
                  </p>
                  <p>
                    <b>Specialization:</b> {doc.specialization || "Not added"}
                  </p>
                  <p>
                    <b>Hospital:</b> {doc.hospital || "Not added"}
                  </p>
                  <p>
                    <b>Consultation Fees:</b> ₹{doc.consultationFees || 0}
                  </p>
                </div>
              ))
            )}
          </div>

          <div className="dashboard-card" ref={bookRef}>
            <h2>Book Appointment</h2>

            <form onSubmit={bookAppointment}>
              <select
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
                required
              >
                <option value="">Select Doctor</option>

                {doctors.map((doc) => (
                  <option key={doc._id} value={doc._id}>
                    Dr. {doc.name} - {doc.specialization || "General"}
                  </option>
                ))}
              </select>

              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />

              <input
                type="text"
                placeholder="Time Slot e.g. 10:00-11:00"
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                required
              />

              <textarea
                placeholder="Reason for visit"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
              />

              <button type="submit">Book Appointment</button>
            </form>
          </div>

          <div className="dashboard-card full-width" ref={appointmentsRef}>
            <h2>My Appointments</h2>

            {appointments.length === 0 ? (
              <p>No appointments found.</p>
            ) : (
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
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
                        <td>{new Date(app.date).toLocaleDateString()}</td>
                        <td>{app.rescheduledTimeSlot || app.timeSlot}</td>
                        <td>
                          <span className={`status-badge ${app.status}`}>
                            {app.status}
                          </span>
                        </td>
                        <td>{app.reason}</td>
                        <td>
                          {["pending", "approved", "rescheduled"].includes(
                            app.status
                          ) && (
                            <>
                              <button
                                type="button"
                                onClick={() => cancelAppointment(app._id)}
                              >
                                Cancel
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

          <div className="dashboard-card" ref={reportsRef}>
            <h2>Medical Reports</h2>

            <input
              type="text"
              placeholder="Report Name"
              value={reportData.fileName}
              onChange={(e) =>
                setReportData({
                  ...reportData,
                  fileName: e.target.value,
                })
              }
            />

            <input
              type="text"
              placeholder="Report URL"
              value={reportData.fileUrl}
              onChange={(e) =>
                setReportData({
                  ...reportData,
                  fileUrl: e.target.value,
                })
              }
            />

            <button onClick={uploadReport}>Upload Report</button>

            <div style={{ marginTop: "15px" }}>
              {profile.reports?.length > 0 ? (
                profile.reports.map((report, index) => (
                  <div className="mini-card" key={index}>
                    <p>
                      <b>{report.fileName}</b>
                    </p>
                    <a href={report.fileUrl} target="_blank" rel="noreferrer">
                      View / Download
                    </a>
                  </div>
                ))
              ) : (
                <p>No reports uploaded.</p>
              )}
            </div>
          </div>

          <div className="dashboard-card" ref={notificationsRef}>
            <h2>Notifications</h2>

            {notifications.map((item, index) => (
              <div className="notification-item" key={index}>
                <h4>{item.title}</h4>
                <p>{item.message}</p>
              </div>
            ))}
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

export default PatientDashboard;
