import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../api/axios";
import Form from "../../formComponent/form";
import { registerFieldsForCustomerStepTwo } from "../../../assets/future_questions_fields/registerQuestions";

function CustomerStep2({ userId }) {
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    try {
      const requestData = new FormData();

      requestData.append("step", 2);
      requestData.append("userId", userId);
      requestData.append("extraData", JSON.stringify(extraData));
      
      if (data.driverLicense) {
        console.log("📤 driverLicense sending:", data.driverLicense.name);
        requestData.append("driverLicense", data.driverLicense);
      }
      
      if (data.vehiclePhoto) {
        console.log("📤 vehiclePhoto sending:", data.vehiclePhoto.name);
        requestData.append("vehiclePhoto", data.vehiclePhoto);
      }
      
      const response = await axiosInstance.post("register/driver/step2", requestData);
      // 👆 בלי headers בכלל!
      
  
      console.log("✅ Step 2 Response:", response.data);
  
      if (response.data.token) {
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem('role', response.data.role);
        localStorage.setItem('userId', response.data.userId)
      }
  
      alert("Registration Complete");
      navigate("/dashboard/customer");
    } catch (err) {
      console.error("❌ Error in step 2:", err.response?.data || err);
    }
  };
  


  return (
    <>
      <h2 className="title">Step 2: Payment & Profile Photo</h2>
      <Form fields={registerFieldsForCustomerStepTwo} onSubmit={handleSubmit} buttonLabel="Finish Registration"/>
    </>
  );
}

export default CustomerStep2;
