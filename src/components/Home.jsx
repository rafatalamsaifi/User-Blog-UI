import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Welcome</h1>
      <div>
        <Link to="/signup">
          <button style={{ margin: "10px", padding: "10px 20px" }}>
            Sign Up
          </button>
        </Link>
        <Link to="/login">
          <button style={{ margin: "10px", padding: "10px 20px" }}>
            Sign In
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
