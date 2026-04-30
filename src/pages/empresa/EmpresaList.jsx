import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import api from '../../services/api';
import 'bootstrap/dist/css/bootstrap.min.css';

const EmpresaList = () => {
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        setLoading(true);
        // Consumo de API (GET /empresas)
        const response = await api.get('/empresas');
        
        if (response.data.success) {
          setEmpresas(response.data.data);
        }
      } catch (err) {
        console.error("Error al obtener empresas:", err);
        setError("No se pudo cargar la lista de empresas.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmpresas();
  }, []);

  return (
    <Layout>
      {/* Encabezado de la sección */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold">Gestión de Empresas</h3>
          <p className="text-muted small">Administra las empresas registradas en el sistema</p>
        </div>
        <button className="btn btn-primary px-4">
          <i className="bi bi-plus-lg me-2"></i>Crear Empresa
        </button>
      </div>

      {/* Mensaje de error */}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Tabla de Empresas */}
      <div className="card shadow-sm border-0 rounded-3">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="ps-4 py-3 text-muted fw-semibold" style={{ width: '100px' }}>ID</th>
                  <th className="py-3 text-muted fw-semibold">Nombre de la Empresa</th>
                  <th className="pe-4 py-3 text-muted fw-semibold text-end">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="3" className="text-center py-5">
                      <div className="spinner-border text-primary spinner-border-sm me-2" role="status"></div>
                      Cargando empresas...
                    </td>
                  </tr>
                ) : empresas.length > 0 ? (
                  empresas.map((empresa) => (
                    <tr key={empresa.id}>
                      <td className="ps-4 fw-bold text-primary">#{empresa.id}</td>
                      <td className="fw-medium">{empresa.nombre}</td>
                      <td className="pe-4 text-end">
                        <button className="btn btn-sm btn-success px-3 me-2">
                          <i className="bi bi-pencil-square me-1"></i> Editar
                        </button>
                        {/* Botón eliminar opcional según tu vista simple */}
                        <button className="btn btn-sm btn-outline-danger px-3">
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center py-5 text-muted">
                      No se encontraron empresas registradas.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EmpresaList;