import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/headerComponent/Header";

function Root() {
  return (
  <>
  <Header />
    <main>
        <Outlet />
    </main>
  </>
);
}

export default Root;
