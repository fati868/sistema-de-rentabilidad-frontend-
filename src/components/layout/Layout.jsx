import React from "react";
import Sidebar from "./Sidebar";
import "bootstrap/dist/css/bootstrap.min.css";

const Layout = ({ children }) => {
  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <Sidebar />

      <div className="flex-grow-1 bg-light d-flex flex-column">
        {/* El contenido se carga aquí de forma fluida */}
        <main className="p-5 flex-grow-1">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
