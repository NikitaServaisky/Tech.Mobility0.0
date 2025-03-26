import React from "react";
import { useNavigate } from "react-router-dom";
import Form from "../../formComponent/form";
import { registerFieldsForDriverStepTwo } from "../../../assets/future_questions_fields/registerQuestions";
import axiosInstance from "../../../api/axios";

function DriverStepTwo() {
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
        console.log("file added to FormData:", data.driverLicense.name);
        requestData.append("drevirLicense", data.driverLicense);
      }

      if (data.vehiclePhoto) {
        console.log("veihiclePhoto added:", data.vehiclePhoto.name);
        requestData.append("vehiclePhoto", data.vehiclePhoto);
      }

      console.log("sending Step 2 data:", requestData);

      const response = await axiosInstance.post(
        "register/driver/step2",
        requestData,
        {
          headers: { "Content-Type": "multipart/from-data" },
        }
      );

      console.log("Step2 Response:", response.data);
      alert("Registratiom Complete");
      navigate("/dashboard/driver");
    } catch (err) {
      console.error("Error in step 2:", err.response?.data || err);
    }
  };

  return (
    <>
      <h2 className="title">Step 2: Vehicle & bank Details</h2>
      <Form
        fields={registerFieldsForDriverStepTwo}
        onSubmit={handleSubmit}
        buttonLabel="Save"
      />
    </>
  );
}

export default DriverStepTwo;
