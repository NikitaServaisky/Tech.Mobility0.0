import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";
import Form from "../components/formComponent/form";
import Button from "../components/buttonComponent/button";
import { LoginFields } from "../assets/future_questions_fields/loginQuestions";

function Login() {
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (formData) => {
    try {
      const response = await axiosInstance.post("login", formData);
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage, setItem("use", JSON.stringify(user));

      navigate("/dashboard");
    } catch (err) {
        setError(err.response?.data?.message || "Login faild. Please try again.");
    }
  };

  return (
    <div>
      <Form fields={LoginFields} onSubmit={handleLogin}/>
      {error && <p className="error-message">{error}</p>}
      <Button label="Login" type="submit" className="primary-button" />
      <Link to="/register">Don`t have an account?</Link>
      <Link to="/forgot-password">Forgot the password</Link>
    </div>
  );
}

export default Login;
