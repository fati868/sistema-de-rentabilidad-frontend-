import React, { useEffect, useState } from "react";
import Modal from "../../components/ui/Modal";
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
  const [successMessage, setSuccessMessage] = useState("");

  // Cargar datos si es edición
  useEffect(() => {
    const fetchEmpresa = async () => {
      if (empresaId && show) {
        try {
          setLoadingData(true);
          setError("");
          setSuccessMessage("");

          const response = await getEmpresaById(empresaId);

          if (response.success) {
            setNombre(response.data.nombre);
          } else {
            setError("No se pudo cargar la empresa.");
          }
        } catch (err) {
          console.error("Error al cargar empresa:", err);
          setError("No se pudo cargar la empresa.");
        } finally {
          setLoadingData(false);
        }
      }
    };

    fetchEmpresa();
  }, [empresaId, show]);

  // Reset cuando se abre para crear
  useEffect(() => {
    if (show && !empresaId) {
      setNombre("");
      setError("");
      setSuccessMessage("");
      setLoadingData(false);
    }
  }, [show, empresaId]);

  const handleClose = () => {
    setNombre("");
    setError("");
    setSuccessMessage("");
    setLoadingData(false);
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!nombre.trim()) {
      setError("El nombre es obligatorio.");
      return;
    }

    try {
      setSaving(true);

      let response;

      if (empresaId) {
        response = await updateEmpresa(empresaId, { nombre });
      } else {
        response = await createEmpresa({ nombre });
      }

      // Si backend devuelve success false
      if (!response.success) {
        if (response.errors && response.errors.length > 0) {
          setError(response.errors[0].msg);
        } else {
          setError("No se pudo guardar la empresa.");
        }
        return;
      }

      // Mensaje de éxito
      setSuccessMessage(
        empresaId
          ? "Empresa actualizada correctamente."
          : "Empresa creada correctamente."
      );

      // Refrescar lista y cerrar modal con pequeño delay
      setTimeout(() => {
        onSuccess();
        handleClose();
      }, 800);
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
    <Modal
      show={show}
      title={empresaId ? "Editar Empresa" : "Crear Empresa"}
      onClose={handleClose}
      footer={
        <>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleClose}
            disabled={saving || loadingData}
          >
            Cancelar
          </button>

          <button
            type="submit"
            form="empresaForm"
            className="btn btn-primary"
            disabled={saving || loadingData}
          >
            {saving ? "Guardando..." : empresaId ? "Actualizar" : "Guardar"}
          </button>
        </>
      }
    >
      {loadingData && (
        <div className="alert alert-info small">Cargando datos...</div>
      )}

      {error && <div className="alert alert-danger small">{error}</div>}

      {successMessage && (
        <div className="alert alert-success small">{successMessage}</div>
      )}

      <form id="empresaForm" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nombre de la Empresa</label>
          <input
            type="text"
            className="form-control"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            disabled={saving || loadingData}
          />
        </div>
      </form>
    </Modal>
  );
};

export default EmpresaForm;