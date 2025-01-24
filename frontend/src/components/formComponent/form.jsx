import React, { useState } from "react";
import Field from "../../assets/fields/field";
import "./formStyle.css";

const Form = ({ fields, onSubmit }) => {
  const [formData, setFormData] = useState({});
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };
  return (
    <form onSubmit={handleSubmit}>
      {fields.map((field) => (
        <div key={field.name}>
          <label htmlFor={field.name}>{field.label}</label>
          <Field {...field} onChange={handleChange} />
        </div>
      ))}
    </form>
  );
};

export default Form;
