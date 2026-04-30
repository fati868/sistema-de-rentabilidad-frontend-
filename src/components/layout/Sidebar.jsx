import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  // Función para determinar si la ruta es la activa
  const isActive = (path) => location.pathname === path ? 'bg-primary text-white' : 'text-dark';

  return (
    <div className="bg-white border-end d-flex flex-column" style={{ width: '280px', height: '100vh', position: 'sticky', top: 0 }}>
      <div className="p-4">
        {/* Logo e información de empresa según diseño  */}
        <div className="d-flex align-items-center mb-1">
          <div className="bg-primary rounded-3 p-2 me-2 d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}}>
            <i className="bi bi-building-fill text-white"></i>
          </div>
          <h5 className="fw-bold mb-0">Sistema Rentabilidad</h5>
        </div>
        <p className="text-muted small ps-5">Admin</p>
      </div>
      
      <nav className="nav flex-column px-3 flex-grow-1">
        <Link to="/dashboard" className={`nav-link mb-2 rounded-3 p-2 ${isActive('/dashboard')}`}>
          <i className="bi bi-grid-fill me-2"></i> Dashboard
        </Link>
        <Link to="/empresas" className={`nav-link mb-2 rounded-3 p-2 ${isActive('/empresas')}`}>
          <i className="bi bi-building me-2"></i> Empresa
        </Link>
        <Link to="/servicios" className={`nav-link mb-2 rounded-3 p-2 ${isActive('/servicios')}`}>
          <i className="bi bi-briefcase me-2"></i> Servicios
        </Link>
        <Link to="/usuarios" className={`nav-link mb-2 rounded-3 p-2 ${isActive('/usuarios')}`}>
          <i className="bi bi-people me-2"></i> Usuarios
        </Link>
        <Link to="/proyectos" className={`nav-link mb-2 rounded-3 p-2 ${isActive('/proyectos')}`}>
          <i className="bi bi-kanban me-2"></i> Proyectos
        </Link>
        <Link to="/reportes" className={`nav-link mb-2 rounded-3 p-2 ${isActive('/reportes')}`}>
          <i className="bi bi-file-earmark-bar-graph me-2"></i> Reportes
        </Link>
      </nav>

      {/* Botón de cerrar sesión al fondo  */}
      <div className="p-4 border-top">
        <button className="btn btn-link text-danger text-decoration-none d-flex align-items-center p-0">
          <i className="bi bi-box-arrow-left me-2"></i> Cerrar sesión
        </button>
      </div>
    </div>
  );
};

export default Sidebar;