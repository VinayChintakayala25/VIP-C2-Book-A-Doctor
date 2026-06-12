import React, { useEffect, useState } from "react";
import API from "../api/axios";

function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);

  // Fetch appointments assigned to this doctor
  useEffect(() => {
    API.get("/appointments/doctor")
      .then(res => {
        // Ensure we set the array correctly
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
      const res = await API.put(`/appointments/update/${id}`, { status });
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
    <div style={{ padding: "20px" }}>
      <h2>Doctor Dashboard</h2>
      {appointments.length === 0 ? (
        <p>No appointments assigned</p>
      ) : (
        <table border="1" style={{ width: "100%", marginTop: "10px" }}>
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
                <td>{app.status}</td>
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
  );
}

export default DoctorDashboard;
