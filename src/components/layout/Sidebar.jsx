import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Obtenemos los datos del usuario guardados
  const user = JSON.parse(localStorage.getItem("user"));
  const rol = user?.rol || "empleado";
  const nombre = user?.nombre || "Sistema de rentabilidad";

  // Ajustamos el estilo activo para que sea más sutil como en el diseño
  const isActive = (path) =>
    location.pathname === path ? "bg-primary-subtle text-primary" : "text-dark";

  // Función de cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div
      className="bg-white border-end d-flex flex-column"
      style={{ width: "280px", height: "100vh", position: "sticky", top: 0 }}
    >
      <div className="ps-4 pb-2 pt-3 mb-3 border-bottom">
        <div className="d-flex align-items-center mb-1">
          <div
            className="bg-primary rounded-3 p-2 me-3 d-flex align-items-center justify-content-center"
            style={{ width: "40px", height: "40px" }}
          >
            <i className="bi bi-building-fill text-white"></i>
          </div>
          <div className="d-flex flex-column mt-3">
            <h5 className="fw-bold mb-0">{nombre}</h5>
            <p className="text-muted small mt-2 text-capitalize">{rol}</p>
          </div>
        </div>
      </div>

      <nav className="nav flex-column px-3 flex-grow-1">
        {/* Empresa: Los Admin van a la lista general, los Dueños a su configuración */}
        <Link
          to={rol === "admin" ? "/empresas" : "/empresa-config"}
          className={`nav-link mb-2 rounded-3 p-2 ${isActive(rol === "admin" ? "/empresas" : "/empresa-config")}`}
        >
          <i className="bi bi-building mx-2"></i> Empresa
        </Link>

        {/* Servicios: Solo para Dueños */}
        {rol === "propietario" && (
          <Link
            to="/servicios"
            className={`nav-link mb-2 rounded-3 p-2 ${isActive("/servicios")}`}
          >
            <i className="bi bi-briefcase mx-2"></i> Servicios
          </Link>
        )}

        {/* Usuarios: Visible para Admin y Dueño */}
        <Link
          to="/usuarios"
          className={`nav-link mb-2 rounded-3 p-2 ${isActive("/usuarios")}`}
        >
          <i className="bi bi-people mx-2"></i> Usuarios
        </Link>

        {/* Proyectos: Solo si NO es Admin */}
        {rol !== "admin" && (
          <Link
            to="/proyectos"
            className={`nav-link mb-2 rounded-3 p-2 ${isActive("/proyectos")}`}
          >
            <i className="bi bi-kanban mx-2"></i> Proyectos
          </Link>
        )}

        {/* "Reportes" ha sido eliminado según tus indicaciones */}
      </nav>

      <div className="p-4 border-top">
        <button
          className="btn btn-link text-danger text-decoration-none d-flex align-items-center p-0 w-100"
          onClick={handleLogout}
        >
          <i className="bi bi-box-arrow-left me-2 fs-5"></i>
          <span className="fw-medium">Cerrar sesión</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
