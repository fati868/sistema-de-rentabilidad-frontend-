import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import { getEmpresaById, updateEmpresa } from '../../services/empresaService';
import 'bootstrap/dist/css/bootstrap.min.css';

const EmpresaConfig = () => {
  const [nombre, setNombre] = useState("");
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });

  // Obtener el ID de la empresa del usuario logueado
  const user = JSON.parse(localStorage.getItem("user"));
  const empresaId = user?.id_empresa;

  // Cargar datos actuales de la empresa al entrar
  useEffect(() => {
    const fetchEmpresa = async () => {
      if (!empresaId) return;
      try {
        const response = await getEmpresaById(empresaId);
        if (response.success) {
          setNombre(response.data.nombre);
        }
      } catch (err) {
        console.error("Error al cargar datos:", err);
      }
    };
    fetchEmpresa();
  }, [empresaId]);

  const handleGuardar = async () => {
    if (!nombre.trim()) {
      setMensaje({ texto: 'El nombre no puede estar vacío.', tipo: 'danger' });
      return;
    }

    try {
      setLoading(true);
      setMensaje({ texto: '', tipo: '' });
      const response = await updateEmpresa(empresaId, { nombre: nombre.trim() });
      
      if (response.success) {
        setMensaje({ texto: 'Cambios guardados correctamente.', tipo: 'success' });
        // Actualizamos el objeto user en localStorage si es necesario
      }
    } catch (err) {
      setMensaje({ texto: 'Error al actualizar la empresa.', tipo: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container-fluid px-4 py-2">
        <div className="mb-4 text-center text-md-start">
          <h2 className="fw-bold mb-1">Configuración de Empresa</h2>
          <p className="text-muted small">Edita la información de tu empresa</p>
        </div>

        <div className="card border-0 shadow-sm rounded-4 mx-auto" style={{ maxWidth: '600px' }}>
          <div className="card-body p-4">
            <div className="d-flex align-items-center mb-4">
              <div className="bg-primary-subtle text-primary rounded-3 p-2 me-3">
                <i className="bi bi-building fs-4"></i>
              </div>
              <h5 className="fw-bold mb-0">Información de la Empresa</h5>
            </div>

            {mensaje.texto && (
              <div className={`alert alert-${mensaje.tipo} small py-2 fade show`}>
                {mensaje.texto}
              </div>
            )}

            <div className="mb-4">
              <label className="form-label text-muted small fw-bold">Nombre de la Empresa</label>
              <input 
                type="text" 
                className="form-control form-control-lg bg-light border-0 fs-6" 
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej: Tech Solutions SA"
                disabled={loading}
              />
            </div>

            <div className="alert alert-info border-0 rounded-3 small d-flex align-items-start mb-4" style={{ backgroundColor: '#eef6ff', color: '#055160' }}>
              <i className="bi bi-info-circle-fill me-2 mt-1"></i>
              <span>Solo puedes editar el nombre de la empresa. Otros datos son gestionados por el administrador.</span>
            </div>

            <button 
              className="btn btn-primary w-100 py-2 fw-bold shadow-sm" 
              onClick={handleGuardar}
              disabled={loading}
            >
              {loading ? (
                <span className="spinner-border spinner-border-sm me-2"></span>
              ) : (
                <i className="bi bi-save me-2"></i>
              )}
              {loading ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EmpresaConfig;