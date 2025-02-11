import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

function Dashboard() {
  const role = localStorage.getItem("role");
  const location = useLocation();

  if (location.pathname === "/dashboard") {
    if (role === "driver") {
      return <Navigate to="/dashboard/driverDashboard" />;
    } else if (role === "organization") {
      return <Navigate to="/dashboard/organizationDashboard" />;
    } else {
      return <Navigate to="/dashboard/customerDashboard" />;
    }
  }

  return <Outlet />;
}

export default Dashboard;