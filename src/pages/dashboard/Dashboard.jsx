import React from 'react';
import Layout from '../../components/layout/Layout';
import 'bootstrap/dist/css/bootstrap.min.css';

const Dashboard = () => {
  // Datos estáticos basados en tu diseño de alta fidelidad
  const kpis = [
    { title: "Ingresos Totales", value: "$45,230", trend: "+12.5%", color: "text-success", icon: "bi-currency-dollar" },
    { title: "Costos Totales", value: "$28,450", trend: "+8.3%", color: "text-primary", icon: "bi-graph-down" },
    { title: "Rentabilidad", value: "$16,780", trend: "+18.2%", color: "text-success", icon: "bi-cash-stack" },
    { title: "Proyectos Activos", value: "12", trend: "+2", color: "text-info", icon: "bi-kanban" }
  ];

  const proyectos = [
    { nombre: "Desarrollo App Móvil", progreso: 75, presupuesto: "$15,000", gastado: "$11,250", estado: "En progreso", color: "bg-primary" },
    { nombre: "Sitio Web Corporativo", progreso: 45, presupuesto: "$8,000", gastado: "$3,600", estado: "En progreso", color: "bg-primary" },
    { nombre: "Sistema ERP", progreso: 90, presupuesto: "$25,000", gastado: "$22,500", estado: "Por finalizar", color: "bg-warning" },
    { nombre: "Campaña Marketing", progreso: 30, presupuesto: "$5,000", gastado: "$1,500", estado: "Iniciado", color: "bg-info" }
  ];

  return (
    <Layout>
      <div className="container-fluid px-4 py-2">
        {/* Encabezado */}
        <div className="mb-4">
          <h2 className="fw-bold mb-1">Dashboard de Rentabilidad</h2>
          <p className="text-muted">Resumen general de tus proyectos y finanzas</p>
        </div>

        {/* Fila de KPIs */}
        <div className="row g-4 mb-4">
          {kpis.map((item, index) => (
            <div className="col-12 col-sm-6 col-xl-3" key={index}>
              <div className="card border-0 shadow-sm rounded-4 p-3">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className={`p-2 rounded-3 bg-light ${item.color}`}>
                    <i className={`bi ${item.icon} fs-4`}></i>
                  </div>
                  <span className="text-success small fw-bold">{item.trend}</span>
                </div>
                <p className="text-muted mb-1 small">{item.title}</p>
                <h4 className="fw-bold mb-0">{item.value}</h4>
              </div>
            </div>
          ))}
        </div>

        {/* Tabla de Proyectos Recientes[cite: 2] */}
        <div className="card border-0 shadow-sm rounded-4 mb-4">
          <div className="card-body p-4">
            <h5 className="fw-bold mb-4">Proyectos Recientes</h5>
            <div className="table-responsive">
              <table className="table align-middle">
                <thead className="text-muted small border-bottom">
                  <tr>
                    <th className="fw-medium">Proyecto</th>
                    <th className="fw-medium">Progreso</th>
                    <th className="fw-medium">Presupuesto</th>
                    <th className="fw-medium">Gastado</th>
                    <th className="fw-medium">Estado</th>
                  </tr>
                </thead>
                <tbody className="border-0">
                  {proyectos.map((proj, idx) => (
                    <tr key={idx}>
                      <td className="py-3 fw-medium">{proj.nombre}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="progress flex-grow-1 me-2" style={{ height: '6px' }}>
                            <div className={`progress-bar ${proj.color}`} style={{ width: `${proj.progreso}%` }}></div>
                          </div>
                          <span className="small text-muted">{proj.progreso}%</span>
                        </div>
                      </td>
                      <td className="fw-medium">{proj.presupuesto}</td>
                      <td className="fw-medium text-muted">{proj.gastado}</td>
                      <td>
                        <span className={`badge rounded-pill px-3 py-2 fw-normal ${
                          proj.estado === "En progreso" ? "bg-primary-subtle text-primary" :
                          proj.estado === "Por finalizar" ? "bg-warning-subtle text-warning" :
                          "bg-info-subtle text-info"
                        }`}>
                          {proj.estado}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Resumen Operativo Inferior[cite: 2] */}
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card border-0 shadow-sm rounded-4 p-3 d-flex flex-row align-items-center">
              <div className="p-3 bg-primary-subtle text-primary rounded-4 me-3">
                <i className="bi bi-people-fill fs-3"></i>
              </div>
              <div>
                <p className="text-muted mb-0 small">Total Empleados</p>
                <h5 className="fw-bold mb-0">24</h5>
                <small className="text-muted">8 líderes, 16 empleados</small>
              </div>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="card border-0 shadow-sm rounded-4 p-3 d-flex flex-row align-items-center">
              <div className="p-3 bg-purple-subtle text-purple rounded-4 me-3" style={{backgroundColor: '#f3e8ff', color: '#a855f7'}}>
                <i className="bi bi-briefcase-fill fs-3"></i>
              </div>
              <div>
                <p className="text-muted mb-0 small">Servicios Activos</p>
                <h5 className="fw-bold mb-0">8</h5>
                <small className="text-muted">Desarrollo, Diseño, Marketing</small>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card border-0 shadow-sm rounded-4 p-3 d-flex flex-row align-items-center">
              <div className="p-3 bg-success-subtle text-success rounded-4 me-3">
                <i className="bi bi-clock-history fs-3"></i>
              </div>
              <div>
                <p className="text-muted mb-0 small">Horas Facturables</p>
                <h5 className="fw-bold mb-0">1,240</h5>
                <small className="text-muted">Este mes</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;