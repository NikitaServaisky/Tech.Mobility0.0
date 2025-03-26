import React, { useState } from "react";
import Field from "../../assets/fields/field";
import Button from "../buttonComponent/button";
import "./formStyle.css";

const Form = ({ fields, onSubmit, className = "", buttonLabel = "submit" }) => {
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "file" ? files[0] : value,  // ✅ Handles file input
    }));

    console.log("📌 Updated FormData:", { ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("📩 Final FormData before Submit:", formData);

    setTimeout(() => {
      onSubmit(formData);
    }, 0);
  };

  return (
    <form className={`custom-form ${className}`} onSubmit={handleSubmit}>
      {fields.map((field) => (
        <div className="form-group" key={field.name}>
          <label htmlFor={field.name} className="form-label">{field.label}</label>
          <Field className="form-field" {...field} onChange={handleChange} />
        </div>
      ))}
      <Button type="submmit" label={buttonLabel}/>
    </form>
  );
};

export default Form;
