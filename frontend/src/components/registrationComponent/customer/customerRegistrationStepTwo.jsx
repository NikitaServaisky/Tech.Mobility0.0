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
  
      const extraData = {
        paymentDetails: {
          cardHolderName: data.cardHolderName,
          cardNumber: data.cardNumber,
          expiryDate: data.expiryDate,
          cvv: data.cvv,
        },
      };
  
      requestData.append("step", "2");
      requestData.append("userId", userId);
      requestData.append("extraData", JSON.stringify(extraData));
  
      // ✅ Append file ONLY IF it exists
      if (data.profilePicture) {
        console.log("✅ File added to FormData:", data.profilePicture.name);
        requestData.append("profilePicture", data.profilePicture);
      } else {
        console.log("⚠️ No profile picture uploaded.");
      }
  
      console.log("🚀 Sending Step 2 data:", requestData);
  
      const response = await axiosInstance.post("/register/customer/step2", requestData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
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
