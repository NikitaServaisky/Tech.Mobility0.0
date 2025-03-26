import React from "react";

const Field = ({ name, label, type, options, required, onChange, ...rest }) => {
  switch (type) {
    case "select":
      return (
        <select name={name} {...rest} required={required} onChange={onChange}>
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
                onChange={onChange}
              />
              {option.label}
            </label>
          ))}
        </div>
      );
    case "file":
      return (
        <input
          type="file"
          name={name}
          required={required}
          onChange={(e) => {
            if (e.target.files.length > 0) {
              console.log("✅ File selected:", e.target.files[0].name);
              onChange({ target: { name, value: e.target.files[0] } }); // 🔥 Fix: Ensure event format
            } else {
              console.log("⚠️ No file selected.");
              onChange({ target: { name, value: null } });
            }
          }}
          {...rest}
        />
      );
    default:
      return (
        <input
          type={type || "text"}
          name={name}
          required={required}
          onChange={onChange}
          {...rest}
        />
      );
  }
};

export default Field;
