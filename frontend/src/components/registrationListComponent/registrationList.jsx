import React from "react";
import { Link } from "react-router-dom";
import List from "../../assets/lists/list";
import "./registrationListStyle.css";

function RegistrationList({ links }) {
  return (
    <nav className="nav-container">
      <List
        className="registration-list"
        itemclassName="registration-list-item"
        items={links}
        renderItem={(link) => (
          <Link className="list-links" to={link.to}>
            {link.label}
          </Link>
        )}
      />
    </nav>
  );
}

export default RegistrationList;
