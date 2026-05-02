import React from 'react';
import Layout from '../../components/layout/Layout';

const ServicioList = () => {
  const servicios = [
    { id: 1, nombre: "Desarrollo Web", descripcion: "Desarrollo de aplicaciones web personalizadas" },
    { id: 2, nombre: "Diseño UX/UI", descripcion: "Diseño de interfaces y experiencia de usuario" },
    { id: 3, nombre: "Consultoría IT", descripcion: "Asesoría tecnológica para empresas" }
  ];

  return (
    <Layout>
      <div className="container-fluid px-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-1">Servicios</h2>
            <p className="text-muted small">Gestiona los servicios que ofrece tu empresa</p>
          </div>
          <button className="btn btn-primary px-4 py-2 rounded-3 fw-bold">
            <i className="bi bi-plus-lg me-2"></i> Nuevo servicio
          </button>
        </div>

        <div className="row g-4">
          {servicios.map((servicio) => (
            <div className="col-md-4" key={servicio.id}>
              <div className="card border-0 shadow-sm rounded-4 h-100 p-3">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="bg-primary-subtle text-primary rounded-3 p-2 d-flex align-items-center justify-content-center" style={{width: '45px', height: '45px'}}>
                      <i className="bi bi-briefcase fs-4"></i>
                    </div>
                    <div className="d-flex gap-2">
                      <button className="btn btn-link text-primary p-0"><i className="bi bi-pencil small"></i></button>
                      <button className="btn btn-link text-danger p-0"><i className="bi bi-trash small"></i></button>
                    </div>
                  </div>
                  <h5 className="fw-bold mb-2">{servicio.nombre}</h5>
                  <p className="text-muted small mb-0">{servicio.descripcion}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default ServicioList;