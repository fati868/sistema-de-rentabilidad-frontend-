import React, { useState, useEffect } from "react";
import Layout from "../../components/layout/Layout";
import { getUsuarios, deleteUsuario } from "../../services/usuarioService";
import "bootstrap/dist/css/bootstrap.min.css";

const UsuarioList = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const response = await getUsuarios();
      if (response.success) {
        setUsuarios(response.data);
      } else {
        setError("No se pudo cargar la lista de usuarios.");
      }
    } catch (err) {
      console.error("Error al obtener usuarios:", err);
      setError("Error al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este usuario?")) {
      try {
        const response = await deleteUsuario(id);
        if (response.success) {
          fetchUsuarios(); // Recargar lista
        }
      } catch (err) {
        alert("Error al eliminar el usuario.");
      }
    }
  };

  return (
    <Layout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold">Gestión de Usuarios</h3>
          <p className="text-muted small">Administra las cuentas de acceso al sistema</p>
        </div>
        <button className="btn btn-primary px-4">
          <i className="bi bi-person-plus me-2"></i>Crear Usuario
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card shadow-sm border-0 rounded-3">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="ps-4 py-3 text-muted fw-semibold" style={{ width: "100px" }}>ID</th>
                  <th className="py-3 text-muted fw-semibold">Nombre</th>
                  <th className="py-3 text-muted fw-semibold">Email</th>
                  <th className="pe-4 py-3 text-muted fw-semibold text-end">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" className="text-center py-5">
                      <div className="spinner-border text-primary spinner-border-sm me-2"></div>
                      Cargando usuarios...
                    </td>
                  </tr>
                ) : usuarios.length > 0 ? (
                  usuarios.map((user) => (
                    <tr key={user.id}>
                      <td className="ps-4 fw-bold text-primary">#{user.id}</td>
                      <td className="fw-medium">{user.nombre}</td>
                      <td className="text-muted">{user.email}</td>
                      <td className="pe-4 text-end">
                        <button className="btn btn-sm btn-success px-3 me-2">
                          <i className="bi bi-pencil-square"></i> Editar
                        </button>
                        <button 
                          className="btn btn-sm btn-danger px-3"
                          onClick={() => handleDelete(user.id)}
                        >
                          <i className="bi bi-trash"></i> Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-5 text-muted">
                      No hay usuarios registrados.
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

export default UsuarioList;