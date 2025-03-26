import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../assets/svg_files/logo/Logo";
import Navigation from "../navigationComponent/navigation";
import Button from "../buttonComponent/button";
import "./headerStyle.css";

const Header = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check for token on mount
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    navigate("/");
    setIsLoggedIn(false);
  };

  return (
    <header className="header-container">
      <nav className="header-navigation">
        <Link to="/">
          <Logo />
        </Link>
        <Navigation />
        <div className="header-buttons">
          {isLoggedIn ? (
            <>
              <Button type="button" label="Dashboard" onClick={() => navigate("/dashboard")} />
              <Button type="reset" label="Logout" onClick={handleLogout} />
            </>
          ) : (
            <>
              <Button type="button" label="Registration" onClick={() => navigate("/register")} />
              <Button type="button" label="Sign In" onClick={() => navigate("/login")} />
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
