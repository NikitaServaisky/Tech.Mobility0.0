import React from "react";
import { Link } from "react-router-dom";
import List from "../../assets/lists/list";
import { clientLinks } from "../../assets/future_questions_fields/registerFirstList";

function RegistrationList() {
  return (
    <nav>
      <List
        items={clientLinks}
        renderItem={(link) => <Link to={link.to}>{link.label}</Link>}
      />
    </nav>
  );
}

export default RegistrationList;
