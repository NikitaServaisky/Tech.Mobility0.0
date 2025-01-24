import React from "react";

const Field = ({ name, label, type, options, required, ...rest }) => {
  switch (type) {
    case "select":
      return (
        <select name={name} {...rest} required={required}>
          {options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    case "radio":
      return (
        <div>
          {options?.map((option) => (
            <label key={option.value}>
              <input
                type="radio"
                name={name}
                value={option.value}
                {...rest}
                required={required}
              />
              {option.label}
            </label>
          ))}
        </div>
      );
    default:
      return (
        <input
          type={type || "text"}
          name={name}
          required={required}
          {...rest}
        />
      );
  }
};

export default Field;
