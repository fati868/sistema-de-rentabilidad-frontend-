import React, { useEffect, useState } from "react";
import {
  createEmpresa,
  getEmpresaById,
  updateEmpresa,
} from "../../services/empresaService";

const EmpresaForm = ({ show, onClose, onSuccess, empresaId }) => {
  const [nombre, setNombre] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const isEdit = Boolean(empresaId);

  const handleClose = () => {
    setNombre("");
    setError("");
    setSuccessMsg("");
    onClose();
  };

  // Precargar datos si es edición
  useEffect(() => {
    const fetchEmpresa = async () => {
      if (!show || !empresaId) return;

      try {
        setLoadingData(true);
        setError("");

        const response = await getEmpresaById(empresaId);

        if (response.success) {
          setNombre(response.data.nombre);
        } else {
          setError("No se pudo cargar los datos de la empresa.");
        }
      } catch (err) {
        console.error("Error al cargar empresa:", err);
        setError("Error al cargar los datos de la empresa.");
      } finally {
        setLoadingData(false);
      }
    };

    fetchEmpresa();
  }, [empresaId, show]);

  // Si no está abierto el modal, no mostrar nada
  if (!show) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!nombre.trim()) {
      setError("El nombre de la empresa es obligatorio.");
      return;
    }

    try {
      setSaving(true);

      let response;

      if (isEdit) {
        response = await updateEmpresa(empresaId, { nombre: nombre.trim() });
      } else {
        response = await createEmpresa({ nombre: nombre.trim() });
      }

      if (!response.success) {
        setError("No se pudo guardar la empresa.");
        return;
      }

      setSuccessMsg(
        isEdit
          ? "Empresa actualizada correctamente."
          : "Empresa creada correctamente.",
      );

      if (onSuccess) onSuccess();

      setTimeout(() => {
        handleClose();
      }, 1000);
    } catch (err) {
      console.error("Error al guardar empresa:", err);

      if (err.response?.data?.errors) {
        setError(err.response.data.errors[0].msg);
      } else {
        setError(err.response?.data?.message || "Error al guardar empresa.");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="modal d-block" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {isEdit ? "Editar Empresa" : "Crear Empresa"}
              </h5>

              <button
                type="button"
                className="btn-close"
                onClick={handleClose}
                disabled={saving}
              ></button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {loadingData && (
                  <div className="alert alert-info small">
                    Cargando datos de la empresa...
                  </div>
                )}

                {error && (
                  <div className="alert alert-danger small">{error}</div>
                )}

                {successMsg && (
                  <div className="alert alert-success small">{successMsg}</div>
                )}

                <div className="mb-3">
                  <label className="form-label">Nombre</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Ej: Empresa ABC"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    disabled={saving || loadingData}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleClose}
                  disabled={saving}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving || loadingData}
                >
                  {saving ? "Guardando..." : isEdit ? "Actualizar" : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="modal-backdrop fade show"></div>
    </>
  );
};

export default EmpresaForm;