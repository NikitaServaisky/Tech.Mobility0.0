import React from "react";
import axiosInstance from "../../api/axios";
import Form from "../formComponent/form";
import { registerFieldsForCustomer } from "../../assets/future_questions_fields/registerQuestions";
import Button from "../buttonComponent/button";

function Customer () {
    const handleSubmit = async (formData) => {
        try {
            if (formData.password !== formData.confirmPassword) {
                alert('Password do not match');
                return;
            }

            const data = new FormData();
            object.keys(formData).forEcach(kye => {
                data.append(key, formData[key]);
            });

            const response = await axiosInstance.post("/register/customer", data, {
                headers: {"Content-Type": "multipart/form-data"},
            });

            console.log(response.data);
        } catch (err) {
            console.error("Error registring customer:", err);
        }
    };
    
    return (
        <div className="customer-registration">
            <h2>Customer Registration</h2>
            <Form  fields={registerFieldsForCustomer} />
            <Button onClick={handleSubmit} label={'Save'}/>
        </div>
    );
}

export default Customer;