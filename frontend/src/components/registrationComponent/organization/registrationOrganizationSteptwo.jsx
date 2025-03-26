import React from "react";
import axiosInstance from "../../../api/axios";
import Form from "../../formComponent/form";
import { registerFieldsForOrganizationStepTwo } from "../../../assets/future_questions_fields/registerQuestions";

function OrganizationStep2({ userId }) {
  const handleSubmit = async (data) => {
    try {
      const requestData = new FormData();
      requestData.append("step", "2");
      requestData.append("userId", userId);
      requestData.append("extraData", JSON.stringify({ organizationDetails: data }));

      if (data.businessLicense) {
        console.log("✅ Business License added:", data.businessLicense.name);
        requestData.append("businessLicense", data.businessLicense);
      }

      console.log("🚀 Sending Step 2 Data:", requestData);

      const response = await axiosInstance.post("/register/organization/step2", requestData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("✅ Step 2 Response:", response.data);
      alert("Registration Complete");
    } catch (err) {
      console.error("❌ Error in Step 2:", err.response?.data || err);
    }
  };

  return (
    <>
      <h2 className="title">Step 2: Business Information</h2>
      <Form fields={registerFieldsForOrganizationStepTwo} onSubmit={handleSubmit} />
    </>
  );
}

export default OrganizationStep2;
