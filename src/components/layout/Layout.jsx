import React from 'react';
import Sidebar from './Sidebar';
import 'bootstrap/dist/css/bootstrap.min.css';

const Layout = ({ children }) => {
  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      <Sidebar />

      <div className="flex-grow-1 bg-light d-flex flex-column">
        {/* Header con sombras suaves [cite: 6] */}
        <header className="bg-white border-bottom p-3 px-4 d-flex justify-content-between align-items-center shadow-sm">
          <h5 className="mb-0 fw-medium">Sistema de Rentabilidad</h5>
          <div className="d-flex align-items-center">
            <i className="bi bi-person-circle fs-5 me-2"></i>
            <button className="btn btn-link text-decoration-none text-dark p-0 fw-medium">
              Cerrar Sesión
            </button>
          </div>
        </header>

        {/* El contenido se carga aquí de forma fluida */}
        <main className="p-4 flex-grow-1">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;