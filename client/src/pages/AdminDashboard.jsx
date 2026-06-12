import React, { useEffect, useState } from "react";
import API from "../api/axios";

function AdminDashboard() {
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

  return (
    <div style={{ padding: "20px" }}>
      <h2>Admin Dashboard</h2>

      <h3>Pending Doctors</h3>
      {pendingDoctors.length === 0 ? (
        <p>No pending doctors</p>
      ) : (
        <ul>
          {pendingDoctors.map((doc) => (
            <li key={doc._id}>
              {doc.name} ({doc.specialization}) - Status: {doc.status}
              <button onClick={() => approveDoctor(doc._id)}>Approve</button>
            </li>
          ))}
        </ul>
      )}

      <h3>All Doctors</h3>
      {allDoctors.length === 0 ? (
        <p>No doctors found</p>
      ) : (
        <ul>
          {allDoctors.map((doc) => (
            <li key={doc._id}>
              {doc.name} ({doc.specialization}) - Status: {doc.status}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AdminDashboard;
