import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";
import Form from "../components/formComponent/form";
import { LoginFields } from "../assets/future_questions_fields/loginQuestions";

function Login() {
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (formData) => {
    try {
      const response = await axiosInstance.post("login", formData);
      const { authToken, userId, role } = response.data;

      localStorage.setItem("authToken", authToken);
      localStorage.setItem("userId", JSON.stringify(userId));
      localStorage.setItem('role', role);

      navigate("/dashboard");
    } catch (err) {
        setError(err.response?.data?.message || "Login faild. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <h2>login</h2>
      <Form fields={LoginFields} onSubmit={handleLogin} buttonPtops={{label: "Login", className: "primary-button"}}/>
      {error && <p className="error-message">{error}</p>}
      <Link className="links" to="/register">Don`t have an account?</Link>
      <Link className="links" to="/forgot-password">Forgot the password</Link>
    </div>
  );
}

export default Login;
