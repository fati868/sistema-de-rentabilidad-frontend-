import React, { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import { getServicios } from "../../services/servicioService";
import "bootstrap/dist/css/bootstrap.min.css";

const ServicioList = () => {
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchServicios = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getServicios();

      if (response.success) {
        setServicios(response.data);
      } else {
        setError("No se pudo cargar la lista de servicios.");
      }
    } catch (err) {
      console.error("Error al obtener servicios:", err);
      setError("Error al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServicios();
  }, []);

  return (
    <Layout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold">Gestión de Servicios</h3>
          <p className="text-muted small">
            Administra los servicios registrados en el sistema
          </p>
        </div>

        {/* Botón futuro */}
        {/* <CreateButton label="Crear Servicio" onClick={handleCreate} /> */}
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary spinner-border-sm me-2"></div>
          Cargando servicios...
        </div>
      ) : servicios.length > 0 ? (
        <div className="container-fluid px-4">
          <div className="row g-4">
            {servicios.map((servicio) => (
              <div className="col-md-4" key={servicio.id_servicio}>
                <div className="card border-0 shadow-sm rounded-4 h-100 p-3">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div
                        className="bg-primary-subtle text-primary rounded-3 p-2 d-flex align-items-center justify-content-center"
                        style={{ width: "45px", height: "45px" }}
                      >
                        <i className="bi bi-briefcase fs-4"></i>
                      </div>

                      <div className="d-flex gap-2">
                        <button className="btn btn-link text-primary p-0">
                          <i className="bi bi-pencil small"></i>
                        </button>
                        <button className="btn btn-link text-danger p-0">
                          <i className="bi bi-trash small"></i>
                        </button>
                      </div>
                    </div>

                    <h5 className="fw-bold mb-2">{servicio.nombre}</h5>

                    <p className="text-muted small mb-2">
                      {servicio.descripcion || "Sin descripción"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-5 text-muted">
          No hay servicios registrados.
        </div>
      )}
    </Layout>
  );
};

export default ServicioList;