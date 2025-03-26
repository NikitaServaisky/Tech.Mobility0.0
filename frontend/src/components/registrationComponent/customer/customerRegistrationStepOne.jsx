import React from "react";
import axiosInstance from "../../../api/axios";
import Form from "../../formComponent/form";
import { registerFieldsForCustomerStepOne } from "../../../assets/future_questions_fields/registerQuestions";

function CustomerStep1({ onNext }) {

    const handleSubmit = async (data) => {
      
        if (!data.email || !data.password || !data.firstName || !data.lastName || !data.phone) {
          alert("Please fill in all required fields.");
          return;
        }
      
        const requestData = {
          step: 1,
          email: data.email,
          password: data.password,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          role: "customer",
        };
      
        console.log("🚀 Sending Step 1 Data:", requestData);
      
        try {
          const response = await axiosInstance.post("/register/customer", requestData, {
            headers: { "Content-Type": "application/json" },
          });
      
          console.log("✅ Step 1 Response:", response.data);
          onNext(response.data.userId);
        } catch (err) {
          console.error("❌ Error in Step 1:", err.response?.data || err);
        }
      };
      

  return (
    <>
      <h2 className="title">Step 1: Basic information</h2>
      <Form fields={registerFieldsForCustomerStepOne} onSubmit={handleSubmit} buttonLabel="Next Step"/>
      </>
  );
}

export default CustomerStep1;
