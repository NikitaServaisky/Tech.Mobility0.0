import React from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import classes from "./header.module.css";
import Button from "../buttonComponent/button";
import Logo from "../../assets/svg_files/logo/Logo";

const Header = () => {
  const navigate = useNavigate();

  const navigateToRegister = () => {
    return navigate("/register")
  };
  return (
    <header className={classes.header}>
      <div className="logo">
        <Logo />
      </div>
      <ul className={classes.list}>


        <li className={classes.listItem}>
          <Link to="/drivers" className={classes.link}>
            To our drivers
          </Link>
        </li>
        {/* <li className={classes.listItem}>
            <select name="more" id="more-select">
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="it">Italian</option>
            </select>
          </li> */}
      </ul>
      <ul className={classes.list}>
        <li className={classes.listItem}>
          <Link to="/help" className={classes.link}>
            Help
          </Link>
        </li>
        <li className={classes.listItem}>
          <Link to="/login" className={classes.link}>
            Sign-in
          </Link>
        </li>
        <li className={classes.listItem}>
          <Button onClick={navigateToRegister} label={"Sign-up"} />
        </li>
      </ul>
    </header>
  );
};

export default Header;
