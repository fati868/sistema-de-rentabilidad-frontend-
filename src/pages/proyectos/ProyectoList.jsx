import React from 'react';
import Layout from '../../components/layout/Layout';

const ProyectoList = () => {
  const proyectos = [
    { 
      id: 1, 
      nombre: "Desarrollo App Móvil", 
      descripcion: "Aplicación móvil para gestión de inventarios",
      presupuesto: "$15,000",
      lider: "Carlos Méndez",
      empleados: "Luis Ramírez, Sofia Vargas"
    },
    { 
      id: 2, 
      nombre: "Sitio Web Corporativo", 
      descripcion: "Rediseño completo del sitio web",
      presupuesto: "$8,000",
      lider: "Ana Torres",
      empleados: "Luis Ramírez"
    }
  ];

  return (
    <Layout>
      <div className="container-fluid px-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-1">Gestión de Proyectos</h2>
            <p className="text-muted small">Crea y gestiona proyectos, asigna líderes y empleados</p>
          </div>
          <button className="btn btn-primary px-4 py-2 rounded-3 fw-bold">
            <i className="bi bi-plus-lg me-2"></i> Nuevo proyecto
          </button>
        </div>

        <div className="d-flex flex-column gap-4">
          {proyectos.map((proyecto) => (
            <div className="card border-0 shadow-sm rounded-4 p-3" key={proyecto.id}>
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div className="d-flex align-items-center gap-3">
                    <div className="bg-primary-subtle text-primary rounded-3 p-2 d-flex align-items-center justify-content-center" style={{width: '45px', height: '45px'}}>
                      <i className="bi bi-kanban fs-4"></i>
                    </div>
                    <div>
                      <h5 className="fw-bold mb-1">{proyecto.nombre}</h5>
                      <p className="text-muted small mb-0">{proyecto.descripcion}</p>
                    </div>
                  </div>
                  <div className="d-flex gap-3">
                    <button className="btn btn-link text-primary p-0"><i className="bi bi-pencil fs-5"></i></button>
                    <button className="btn btn-link text-danger p-0"><i className="bi bi-trash fs-5"></i></button>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-4 mt-3 ps-5 ms-2 small">
                  <div className="d-flex align-items-center gap-2">
                    <span className="text-muted">Presupuesto:</span>
                    <span className="badge bg-success-subtle text-success px-3 py-2 rounded-2 fw-bold">{proyecto.presupuesto}</span>
                  </div>
                  <div className="d-flex align-items-center gap-1">
                    <i className="bi bi-award text-warning"></i>
                    <span className="text-muted">Líder:</span>
                    <span className="fw-medium">{proyecto.lider}</span>
                  </div>
                  <div className="d-flex align-items-center gap-1">
                    <i className="bi bi-people text-primary"></i>
                    <span className="text-muted">Empleados:</span>
                    <span className="fw-medium">{proyecto.empleados}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default ProyectoList;