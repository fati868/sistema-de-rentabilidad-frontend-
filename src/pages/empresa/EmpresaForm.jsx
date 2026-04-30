import React, { useState } from "react";
import { createEmpresa } from "../../services/empresaService";

const EmpresaForm = ({ show, onClose, onSuccess }) => {
  const [nombre, setNombre] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  if (!show) return null;

  const handleClose = () => {
    setNombre("");
    setError("");
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!nombre.trim()) {
      setError("El nombre de la empresa es obligatorio.");
      return;
    }

    try {
      setSaving(true);

      const response = await createEmpresa({
        nombre: nombre.trim(),
      });

      if (!response.success) {
        setError("No se pudo crear la empresa.");
        return;
      }

      if (onSuccess) onSuccess();

      setNombre("");
      handleClose();
    } catch (err) {
      if (err.response?.data?.errors) {
  setError(err.response.data.errors[0].msg);
} else {
  setError(err.response?.data?.message || "Error al crear empresa.");
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
              <h5 className="modal-title">Crear Empresa</h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleClose}
                disabled={saving}
              ></button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {error && (
                  <div className="alert alert-danger small">{error}</div>
                )}

                <div className="mb-3">
                  <label className="form-label">Nombre</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Ej: Empresa ABC"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    disabled={saving}
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
                  disabled={saving}
                >
                  {saving ? "Guardando..." : "Guardar"}
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