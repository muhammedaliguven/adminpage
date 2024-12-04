import React from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ marginLeft: "200px", padding: "20px", width: "100%" }}>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
