import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    profileImage: null,
  });
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));

    try {
      await axios.post("http://localhost:8000/api/auth/signup", data);
      setMessage("Signup successful! Redirecting to login..."); 
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000); 
    } catch (error) {
      console.error(error);
      setMessage("Signup failed. Please try again.");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Sign Up</h2>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          maxWidth: "300px",
          margin: "0 auto",
        }}
      >
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="Email"
          required
          style={{ padding: "8px" }}
        />
        <input
          type="password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          placeholder="Password"
          required
          style={{ padding: "8px" }}
        />
        <input
          type="file"
          onChange={(e) =>
            setFormData({ ...formData, profileImage: e.target.files[0] })
          }
          style={{ padding: "8px" }}
        />
        <button type="submit" style={{ padding: "10px" }}>
          Sign Up
        </button>
      </form>
      
      {message && (
        <p style={{ 
          color: message.includes("failed") ? "red" : "green",
          marginTop: "15px" 
        }}>
          {message}
        </p>
      )}
      
      <p>
        <Link to="/">Back to Home</Link>
      </p>
    </div>
  );
};

export default Signup;