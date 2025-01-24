import React from "react";
import { Link } from "react-router-dom";

function Register() {
    return (
        <div>
            <Link to="/register/customer">New Customer Account</Link>
            <Link to="/register/organization">New Partner (Organization)</Link>
            <Link to="/register/driver">New Driver</Link>
        </div>
    );
}

export default Register;
