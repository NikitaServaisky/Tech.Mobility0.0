import React from "react";
import axiosInstance from "../../../api/axios";
import Form from "../../formComponent/form";
import { registerFieldsForDriverStepOne } from "../../../assets/future_questions_fields/registerQuestions";

function DriverStepOne({ onNext }) {
  const handleSubmit = async (data) => {
    if (
      !data.email ||
      !data.password ||
      !data.firstName ||
      !data.lastName ||
      !data.phone
    ) {
      alert("please fill in all required fields");
      return;
    }

    const requestData = {
      step: 1,
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      role: "driver",
    };

    console.log("Sending step 1 data", requestData);

    try {
      const response = await axiosInstance.post(
        "register/driver",
        requestData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("Step 1 Response:", response.data);
      onNext(response.data.userId);
    } catch (err) {
      console.error("Error in step 1:", err.response?.data || err);
    }
  };

  return (
    <>
      <h2 className="title">Step 1: basic Information</h2>
      <Form
        fields={registerFieldsForDriverStepOne}
        onSubmit={handleSubmit}
        buttonLabel="Next Step"
      />
    </>
  );
}

export default DriverStepOne;
