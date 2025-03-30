import React from "react";
import { useNavigate } from "react-router-dom";
import Form from "../../formComponent/form";
import { registerFieldsForDriverStepTwo } from "../../../assets/future_questions_fields/registerQuestions";
// import axiosInstance from "../../../api/axios";
import axios from "axios";

function DriverStepTwo({ userId }) {
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    try {
      const requestData = new FormData();
      const extraData = {
        driverDetails: {
          licenseNumber: data.licenseNumber,
          vehicleMake: data.vehicleMake,
          vehicleModel: data.vehicleModel,
          vehicleColor: data.vehicleColor,
          vehicleYear: data.vehicleYear,
          vehiclePlate: data.vehiclePlate,
          bankName: data.bankName,
          branchNumber: data.branchNumber,
          accountOwner: data.accountOwner,
        },
      };

      requestData.append("step", 2);
      requestData.append("userId", userId);
      requestData.append("extraData", JSON.stringify(extraData));

      if (data.driverLicense) {
        console.log("📤 driverLicense sending:", data.driverLicense.name);
        requestData.append("driverLicense", data.driverLicense);
      } else {
        console.warn("⚠️ No driver license file provided!");
      }

      if (data.vehiclePhoto) {
        console.log("📤 vehiclePhoto sending:", data.vehiclePhoto.name);
        requestData.append("vehiclePhoto", data.vehiclePhoto);
      }

      console.log("📦 FormData before sending:");
      for (let [key, val] of requestData.entries()) {
        console.log(`${key}:`, val instanceof File ? val.name : val);
      }

      for (let pair of requestData.entries()) {
        console.log(
          `${pair[0]}:`,
          pair[1] instanceof File ? pair[1].name : pair[1]
        );
      }

      const response = await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/register/driver/step2`,
        requestData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("✅ Step 2 Response:", response.data);
      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("userId", response.data.userId);
      localStorage.setItem("role", response.data.role);
      
      alert("🎉 Registration Complete");
      navigate("/dashboard/driver");
    } catch (err) {
      console.error("❌ Error in step 2:", err.response?.data || err);
    }
  };

  return (
    <>
      <h2 className="title">Step 2: Vehicle & Bank Details</h2>
      <Form
        fields={registerFieldsForDriverStepTwo}
        onSubmit={handleSubmit}
        buttonLabel="Save"
      />
    </>
  );
}

export default DriverStepTwo;
