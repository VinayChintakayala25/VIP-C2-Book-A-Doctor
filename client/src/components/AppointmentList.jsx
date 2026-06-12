import React, { useEffect, useState } from "react";
import API from "../api/axios";

function AppointmentList() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("patientToken"); // token saved after login
    API.get("/appointments/patient", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setAppointments(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h3>My Appointments</h3>
      <table border="1" style={{ width: "100%", marginTop: "10px" }}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Doctor ID</th>
            <th>Status</th>
            <th>Reason</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map(app => (
            <tr key={app._id}>
              <td>{new Date(app.date).toLocaleDateString()}</td>
              <td>{app.doctorId}</td>
              <td>{app.status}</td>
              <td>{app.reason}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AppointmentList;
