import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createEmpresa,
  getEmpresaById,
  updateEmpresa,
} from "../../services/empresaService";
import api from "../../services/api";

const EmpresaForm = ({ show, onClose, onSuccess, empresaId, owner }) => {
  const navigate    = useNavigate();
  const [nombre, setNombre]           = useState("");
  const [error, setError]             = useState("");
  const [saving, setSaving]           = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [successMsg, setSuccessMsg]   = useState("");
  const [confirmDeleteOwner, setConfirmDeleteOwner] = useState(false);
  const [deletingOwner, setDeletingOwner]           = useState(false);

  const isEdit = Boolean(empresaId);

  const handleClose = () => {
    setNombre("");
    setError("");
    setSuccessMsg("");
    setConfirmDeleteOwner(false);
    onClose();
  };

  useEffect(() => {
    const fetchEmpresa = async () => {
      if (!show || !empresaId) { setNombre(""); return; }
      try {
        setLoadingData(true);
        setError("");
        const response = await getEmpresaById(empresaId);
        if (response.success) setNombre(response.data.nombre);
        else setError("No se pudo cargar los datos de la empresa.");
      } catch {
        setError("Error al cargar los datos de la empresa.");
      } finally {
        setLoadingData(false);
      }
    };
    fetchEmpresa();
  }, [empresaId, show]);

  if (!show) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    if (!nombre.trim()) { setError("El nombre de la empresa es obligatorio."); return; }
    try {
      setSaving(true);
      const response = isEdit
        ? await updateEmpresa(empresaId, { nombre: nombre.trim() })
        : await createEmpresa({ nombre: nombre.trim() });
      if (!response.success) { setError("No se pudo guardar la empresa."); return; }
      setSuccessMsg(isEdit ? "Empresa actualizada correctamente." : "Empresa creada correctamente.");
      if (onSuccess) onSuccess();
      setTimeout(handleClose, 900);
    } catch (err) {
      setError(
        err.response?.data?.errors?.[0]?.msg ||
        err.response?.data?.message ||
        "Error al guardar empresa."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteOwner = async () => {
    if (!owner) return;
    try {
      setDeletingOwner(true);
      await api.delete(`/usuarios/${owner.id_usuario}/hard-delete`);
      setConfirmDeleteOwner(false);
      if (onSuccess) onSuccess();
      setSuccessMsg("Propietario eliminado. La empresa quedó sin propietario asignado.");
    } catch (err) {
      setError(err.response?.data?.message || "Error al eliminar el propietario.");
      setConfirmDeleteOwner(false);
    } finally {
      setDeletingOwner(false);
    }
  };

  return (
    <>
      {/* ── Modal principal ── */}
      <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && handleClose()}>
        <div className="modal-card p-4 animate-scaleIn" style={{ maxWidth: 500 }}>

          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h5 className="fw-bold mb-0">{isEdit ? "Editar Empresa" : "Crear Empresa"}</h5>
              <p className="text-muted small mb-0">
                {isEdit ? "Modifica el nombre y gestiona el propietario" : "Registra una nueva empresa en el sistema"}
              </p>
            </div>
            <button className="btn btn-sm btn-light rounded-circle p-1 lh-1" onClick={handleClose} disabled={saving}>
              <i className="bi bi-x-lg"></i>
            </button>
          </div>

          {error && (
            <div className="alert alert-danger d-flex align-items-center py-2 small rounded-3 mb-3">
              <i className="bi bi-exclamation-circle-fill me-2"></i>{error}
            </div>
          )}
          {successMsg && (
            <div className="alert alert-success d-flex align-items-center py-2 small rounded-3 mb-3">
              <i className="bi bi-check-circle-fill me-2"></i>{successMsg}
            </div>
          )}

          {loadingData ? (
            <div className="text-center py-4">
              <span className="spinner-border spinner-border-sm me-2"></span>
              <span className="text-muted small">Cargando datos...</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Nombre */}
              <div className="mb-4">
                <label className="form-label fw-semibold small">Nombre de la empresa *</label>
                <div className="input-group">
                  <span className="input-group-text bg-white">
                    <i className="bi bi-building text-muted"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Ej: Empresa ABC"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    disabled={saving}
                    required
                  />
                </div>
              </div>

              {/* ── Sección propietario (solo en edición) ── */}
              {isEdit && (
                <div className="mb-4">
                  <label className="form-label fw-semibold small d-flex align-items-center gap-2">
                    <i className="bi bi-person-fill-gear" style={{ color: "var(--primary)" }}></i>
                    Propietario asignado
                  </label>

                  {owner ? (
                    <div className="border rounded-3 p-3" style={{ background: "rgba(16,185,129,.04)" }}>
                      <div className="d-flex align-items-center gap-3 mb-3">
                        <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                          style={{ width: 40, height: 40, background: "linear-gradient(135deg,#4F46E5,#06B6D4)", color: "#fff", fontSize: 13, fontWeight: 700 }}>
                          {owner.nombre.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()}
                        </div>
                        <div className="flex-grow-1 overflow-hidden">
                          <p className="fw-bold mb-0 text-truncate" style={{ fontSize: 14 }}>{owner.nombre}</p>
                          <p className="text-muted mb-0 text-truncate" style={{ fontSize: 12 }}>{owner.email}</p>
                        </div>
                        <span className={`badge badge-role ${owner.is_active ? "badge-active" : "badge-inactive"}`}>
                          {owner.is_active ? "Activo" : "Inactivo"}
                        </span>
                      </div>

                      <div className="d-flex gap-2">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary flex-fill fw-semibold"
                          onClick={() => navigate("/usuarios", { state: { editOwnerId: owner.id_usuario } })}
                        >
                          <i className="bi bi-pencil-square me-1"></i>Editar propietario
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger fw-semibold px-3"
                          onClick={() => setConfirmDeleteOwner(true)}
                        >
                          <i className="bi bi-trash-fill me-1"></i>Eliminar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="border rounded-3 p-3 d-flex align-items-center gap-2"
                      style={{ background: "rgba(245,158,11,.05)", borderColor: "rgba(245,158,11,.3) !important" }}>
                      <i className="bi bi-exclamation-triangle-fill text-warning"></i>
                      <span className="small text-muted">Esta empresa no tiene propietario asignado.</span>
                      <button
                        type="button"
                        className="btn btn-sm btn-warning ms-auto fw-semibold"
                        onClick={() => navigate("/usuarios")}
                      >
                        <i className="bi bi-person-plus me-1"></i>Asignar
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Botones del form */}
              <div className="d-flex gap-2">
                <button type="button" className="btn btn-light flex-fill fw-semibold" onClick={handleClose} disabled={saving}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary flex-fill" disabled={saving || loadingData}>
                  {saving
                    ? <><span className="spinner-border spinner-border-sm me-2"></span>Guardando...</>
                    : isEdit
                      ? <><i className="bi bi-check-lg me-2"></i>Guardar cambios</>
                      : <><i className="bi bi-building-add me-2"></i>Crear empresa</>}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* ── Modal confirmación eliminar propietario ── */}
      {confirmDeleteOwner && owner && (
        <div className="modal-overlay" style={{ zIndex: 2100 }}
          onClick={(e) => e.target === e.currentTarget && setConfirmDeleteOwner(false)}>
          <div className="modal-card p-4 animate-scaleIn" style={{ maxWidth: 440 }}>
            <div className="d-flex align-items-start gap-3 mb-4">
              <div className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                style={{ width: 48, height: 48, background: "rgba(239,68,68,.1)" }}>
                <i className="bi bi-trash-fill" style={{ color: "var(--danger)", fontSize: 22 }}></i>
              </div>
              <div>
                <h6 className="fw-bold mb-1">Eliminar propietario permanentemente</h6>
                <p className="text-muted small mb-0">
                  ¿Estás seguro de eliminar a <strong>{owner.nombre}</strong> ({owner.email})?
                </p>
                <div className="alert alert-danger d-flex align-items-start gap-2 small rounded-3 mt-2 mb-0 py-2">
                  <i className="bi bi-exclamation-octagon-fill flex-shrink-0 mt-1"></i>
                  <div>
                    Esta acción es <strong>irreversible</strong>. Se eliminarán también sus registros de horas y asignaciones de proyectos.
                  </div>
                </div>
              </div>
            </div>
            <div className="d-flex gap-2">
              <button
                className="btn btn-light flex-fill fw-semibold"
                onClick={() => setConfirmDeleteOwner(false)}
                disabled={deletingOwner}
              >
                Cancelar
              </button>
              <button
                className="btn btn-danger flex-fill fw-bold"
                onClick={handleDeleteOwner}
                disabled={deletingOwner}
              >
                {deletingOwner
                  ? <><span className="spinner-border spinner-border-sm me-2"></span>Eliminando...</>
                  : <><i className="bi bi-trash-fill me-2"></i>Eliminar permanentemente</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EmpresaForm;
