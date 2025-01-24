import React from "react";
import { Link } from "react-router-dom";
import classes from "./header.module.css";
import Button from "../buttonComponent/button";
import Logo from "../../assets/svg_files/logo/Logo";

const Header = () => {
  return (
    <header className={classes.header}>
      <div className="logo">
        <Logo />
      </div>
      <ul className={classes.list}>
        <li className={classes.listItem}>
          <Link to="/book-ride" className={classes.link}>
            Book a ride
          </Link>
        </li>
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
          <Link to="/Log-in" className={classes.link}>
            Sign-in
          </Link>
        </li>
        <li className={classes.listItem}>
          <Button label={"Sign-up"} />
        </li>
      </ul>
    </header>
  );
};

export default Header;
