import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../assets/svg_files/logo/Logo";
import List from "../../assets/lists/list";
import { headerOptions } from "../../assets/future_questions_fields/headerList";
import Button from "../buttonComponent/button";
import "./headerStyle.css";
import Navigation from "../navigationComponent/navigation";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="header-container">
      <nav className="header-navigation">
        <Link to="/">
          <Logo />
        </Link>
        <Navigation />
        <div className="header-buttons">
          <Button
            type="button"
            label="Registration"
            onClick={() => navigate("register")}
          />
          <Button
            type="button"
            label="Sing-in"
            onClick={() => navigate("login")}
          />
        </div>
      </nav>
    </header>
  );
};

export default Header;
