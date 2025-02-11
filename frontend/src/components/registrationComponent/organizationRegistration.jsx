import React from "react";
import Form from "../formComponent/form";
import Button from "../buttonComponent/button";
import { registerFieldsForOrganization } from "../../assets/future_questions_fields/registerQuestions";
import axiosInstance from "../../api/axios";

function Organization () {
    const handleSubmit = async (formData) => {
        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        if (!formData.businessLicense) {
            alert("need to upload  business License");
            return;
        }

        const {confirmPassword, ...payload} = formData;

        const data = new FormData();
        object.keys(payload).forEach((key) => {
            data.append(key, payload[key]);
        });

        try {
            const response =await axiosInstance.post('register/organiztion', data, {
                headers: {'Content-Type': "multipart/form-data"},
            });
            console.log('organization registered successfully:', response.data);
        } catch (err) {
            console.error("error registration organization");
            alert("error registering organization. please try again.")
        }
    };

    return (
        <div>
            <h2>Organiztion Registration</h2>
            <Form fields={registerFieldsForOrganization }/>
            <Button onClick={handleSubmit} label={"Save"}/>
        </div>
    );
}

export default Organization;