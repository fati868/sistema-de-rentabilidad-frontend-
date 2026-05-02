import React, { useState, useEffect } from "react";
import Layout from "../../components/layout/Layout";
import { getEmpresaById, updateEmpresa } from "../../services/empresaService";
import "bootstrap/dist/css/bootstrap.min.css";

const EmpresaConfig = () => {
  const [nombre, setNombre] = useState("");
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState({ texto: "", tipo: "" });

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
      setMensaje({ texto: "El nombre no puede estar vacío.", tipo: "danger" });
      return;
    }

    try {
      setLoading(true);
      setMensaje({ texto: "", tipo: "" });
      const response = await updateEmpresa(empresaId, {
        nombre: nombre.trim(),
      });

      if (response.success) {
        setMensaje({
          texto: "Cambios guardados correctamente.",
          tipo: "success",
        });
        // Actualizamos el objeto user en localStorage si es necesario
      }
    } catch (err) {
      setMensaje({ texto: "Error al actualizar la empresa.", tipo: "danger" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold">Configuración de Empresa</h3>
          <p className="text-muted small">Edita la información de tu empresa</p>
        </div>
      </div>
      <div
        className="card border-0 shadow-sm rounded-4"
        style={{ maxWidth: "600px" }}
      >
        <div className="card-body p-4">
          <div className="d-flex align-items-center mb-4">
            <h5 className="mb-0">Editar Empresa</h5>
          </div>

          {mensaje.texto && (
            <div className={`alert alert-${mensaje.tipo} small py-2 fade show`}>
              {mensaje.texto}
            </div>
          )}

          <div className="mb-4">
            <label className="form-label">Nombre de la Empresa</label>
            <input
              type="text"
              className="form-control"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Tech Solutions SA"
              disabled={loading}
            />
          </div>

          <button
            className="btn btn-primary"
            onClick={handleGuardar}
            disabled={loading}
          >
            {loading ? "Guardando..." : "Actualizar"}
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default EmpresaConfig;
