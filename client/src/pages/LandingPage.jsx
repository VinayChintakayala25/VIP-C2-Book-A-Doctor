import React from "react";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Book A Doctor</h1>
      <p>Effortlessly schedule your doctor appointments with just a few clicks.</p>
      <button onClick={() => navigate("/login")}>
        Book Your Doctor
      </button>
    </div>
  );
}

export default LandingPage;
