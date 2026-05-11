import React, { useEffect, useState } from "react";
import { createFase, getFaseById, updateFase } from "../../services/faseService";
import { notifySuccess, notifyError } from "../../utils/notify"; // Importación corregida

const EMPTY = {
  nombre: "",
  horas_estimadas: "",
};

const FasesForm = ({ faseId, proyectoId, onSaved, onCancel }) => {
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!faseId) {
      setForm(EMPTY);
      return;
    }

    setError("");
    getFaseById(faseId)
      .then((res) => {
        if (res?.success) {
          setForm({
            nombre: res.data.nombre || "",
            horas_estimadas: res.data.horas_estimadas ?? "",
          });
        } else {
          notifyError(res?.message || "No se pudo cargar la fase."); // Uso de notifyError
        }
      })
      .catch((err) => {
        notifyError("Error al conectar con el servidor para cargar la fase."); //
      });
  }, [faseId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError(""); // Limpieza de errores al escribir
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // ── SUBTAREA: VALIDACIONES [H41] ──
    // Criterio: El nombre de la fase es obligatorio
    if (!form.nombre.trim()) {
      setError("El nombre de la fase es obligatorio.");
      return;
    }

    if (form.nombre.trim().length < 2) {
      setError("El nombre debe tener al menos 2 caracteres.");
      return;
    }

    // Criterio: Las horas estimadas deben ser mayores a cero
    const horasNum = Number(form.horas_estimadas);
    if (form.horas_estimadas === "" || isNaN(horasNum) || horasNum <= 0) {
      setError("Las horas estimadas deben ser un número mayor a cero.");
      return;
    }

    const payload = {
      nombre: form.nombre.trim(),
      horas_estimadas: horasNum,
    };

    setLoading(true);
    try {
      const res = faseId
        ? await updateFase(faseId, payload)
        : await createFase(proyectoId, payload);

      if (res?.success) {
        // ── SUBTAREA: FEEDBACK (TOAST) ──
        // Criterio: Confirmación visual al actualizar
        notifySuccess(faseId ? "Fase actualizada correctamente" : "Fase creada con éxito"); //
        onSaved?.();
      } else {
        // Criterio: Mensajes claros de error (Ej: Fases duplicadas)
        setError(res?.message || "Error al procesar la solicitud.");
        notifyError(res?.message || "Error al guardar."); //
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Error al guardar la fase.";
      setError(msg);
      notifyError(msg); //
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card border-0 rounded-4 mb-4 animate-scaleIn overflow-hidden shadow-sm">
      <div style={{ height: 4, background: "linear-gradient(90deg, var(--primary), var(--accent))" }}></div>
      <div className="p-4">
        <div className="d-flex justify-content-between align-items-start gap-3 mb-3">
          <div>
            <h5 className="fw-bold mb-1">{faseId ? "Editar fase" : "Nueva fase"}</h5>
            <p className="text-muted small mb-0">Planificación y actualización de etapas del proyecto</p>
          </div>
          <button type="button" className="btn btn-sm btn-outline-secondary rounded-3" onClick={onCancel}>
            Cancelar
          </button>
        </div>

        {error && (
          <div className="alert alert-danger py-2 small rounded-3 mb-3 animate-fadeIn">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>{error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-12 col-md-8">
              <label className="form-label fw-semibold small">Nombre de la fase *</label>
              <input
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                className={`form-control ${error && error.includes("nombre") ? "is-invalid" : ""}`}
                placeholder="Ej: Diseño de Interfaz"
                required
              />
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label fw-semibold small">Horas estimadas *</label>
              <input
                type="number"
                name="horas_estimadas"
                value={form.horas_estimadas}
                onChange={handleChange}
                className={`form-control ${error && error.includes("horas") ? "is-invalid" : ""}`}
                min="0.1"
                step="0.1"
                placeholder="0.0"
                required
              />
            </div>
          </div>

          <div className="d-flex gap-2 mt-4">
            <button 
              type="button" 
              className="btn btn-light fw-semibold px-4" 
              onClick={onCancel} 
              disabled={loading}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn btn-primary flex-fill fw-bold" 
              disabled={loading}
            >
              {loading ? (
                <><span className="spinner-border spinner-border-sm me-2"></span>Guardando...</>
              ) : (
                faseId ? "Actualizar fase" : "Crear fase"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FasesForm;