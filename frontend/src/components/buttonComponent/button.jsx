import React from "react";
import PropTypes from "prop-types";
import "./buttonStyle.css";

const Button = ({
  label,
  logo,
  onClick,
  type = "button",
  className = "",
  disabled = false,
  ...rest
}) => {
  return (
    <button
      type={type}
      className={`btn ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      {logo && <span className="btn-logo">{logo}</span>}
      {label}
    </button>
  );
};

Button.propTypes = {
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    type: PropTypes.oneOf(["button", "submit","reset"]),
    disabled: PropTypes.bool,
}

export default Button;
