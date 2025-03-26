import React from "react";
import axiosInstance from "../../../api/axios";
import Form from "../../formComponent/form";
import { registerFieldsForOrganizationStepOne } from "../../../assets/future_questions_fields/registerQuestions";

function OrganizationStep1({ onNext }) {
  const handleSubmit = async (data) => {
    try {
      console.log("📩 Step 1 Form Data:", data);

      const requestData = { ...data, step: 1, role: "organization" };
      console.log("🚀 Sending Step 1 Data:", requestData);

      const response = await axiosInstance.post("/register/organization", requestData, {
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
      <h2 className="title">Step 1: Basic Information</h2>
      <Form fields={registerFieldsForOrganizationStepOne} onSubmit={handleSubmit} />
    </>
  );
}

export default OrganizationStep1;
