import React, { useState } from "react";
import Field from "../../assets/fields/field";
import Button from "../buttonComponent/button";
import "./formStyle.css";

const Form = ({ fields, onSubmit , className="", buttonPtops }) => {
  const [formData, setFormData] = useState({});
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };
  return (
    <form className={`custom-form${className}`} onSubmit={handleSubmit}>
      {fields.map((field) => (
        <div className="form-group" key={field.name}>
          <label htmlFor={field.name} className="form-label">{field.label}</label>
          <Field className="form-field" {...field} onChange={handleChange} />
        </div>
      ))}
      <Button type="submit" {...buttonPtops}/>
    </form>
  );
};

export default Form;
