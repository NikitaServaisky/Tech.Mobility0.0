import React from "react";

const Field = ({ name, label, type, options, required, onChange, ...rest }) => {
  switch (type) {
    case "select":
      return (
        <select name={name} required={required} onChange={onChange} {...rest}>
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
                required={required}
                onChange={onChange}
                {...rest}
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
              const file = e.target.files?.[0];
              if (file) {
                console.log(`📂 File selected [${name}]:`, file);
                onChange({ target: { name, value: file } }); // Simulate normal input event
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
