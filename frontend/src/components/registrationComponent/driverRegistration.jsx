import React from "react";
import { registerFieldsforDriver } from "../../assets/future_questions_fields/registerQuestions";
import axiosInstance from "../../api/axios";
import Form from "../formComponent/form";
import Button from "../buttonComponent/button";

function Driver() {
  const handleSubmit = async (formData) => {
    try {
      if (formData.password !== formData.confirmPassword) {
        alert("password do not match");
        return;
      }

      const { confirmPassword, ...payload } = formData;

      const data = new FormData();
      object.key(payload).forEach((key) => {
        data.append(key, payload[key]);
      });

      const response = await axiosInstance.post("register/driver", data, {
        headers: {'Content-Type': "multipart/form-data"},
      });
      console.log("Driver registred successfully", response.data);
    } catch (err) {
        console.error("error registration driver");
        alert("error registering driver. please try again.")
    }
  };
  return (
    <div>
      <h2>Driver Registration</h2>
      <Form fields={registerFieldsforDriver} />
      <Button label={"Save"} onClick={handleSubmit} />
    </div>
  );
}

export default Driver;
