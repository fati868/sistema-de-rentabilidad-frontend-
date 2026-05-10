import React, { useEffect, useState } from "react";
import { createFase, getFaseById, updateFase } from "../../services/faseService";

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
          setError(res?.message || "No se pudo cargar la fase.");
        }
      })
      .catch((err) => {
        setError(err.response?.data?.message || "No se pudo cargar la fase.");
      });
  }, [faseId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!faseId && !proyectoId) {
      setError("Selecciona un proyecto antes de crear fases.");
      return;
    }

    if (form.nombre.trim().length < 2) {
      setError("El nombre debe tener al menos 2 caracteres.");
      return;
    }

    if (form.horas_estimadas !== "" && Number(form.horas_estimadas) < 0) {
      setError("Las horas estimadas no pueden ser negativas.");
      return;
    }

    const payload = {
      nombre: form.nombre.trim(),
      horas_estimadas: form.horas_estimadas === "" ? 0 : Number(form.horas_estimadas),
    };

    setLoading(true);
    try {
      const res = faseId
        ? await updateFase(faseId, payload)
        : await createFase(proyectoId, payload);

      if (res?.success) {
        onSaved?.();
      } else {
        setError(res?.message || "Error al guardar la fase.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error al guardar la fase.");
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
            <p className="text-muted small mb-0">Define el trabajo por etapas del proyecto</p>
          </div>
          <button type="button" className="btn btn-sm btn-outline-secondary rounded-3" onClick={onCancel}>
            Cancelar
          </button>
        </div>

        {error && (
          <div className="alert alert-danger py-2 small rounded-3 mb-3">
            <i className="bi bi-exclamation-circle-fill me-2"></i>{error}
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
                className="form-control"
                minLength={2}
                maxLength={100}
                required
              />
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label fw-semibold small">Horas estimadas</label>
              <input
                type="number"
                name="horas_estimadas"
                value={form.horas_estimadas}
                onChange={handleChange}
                className="form-control"
                min="0"
                step="0.25"
                placeholder="0"
              />
            </div>
          </div>

          <div className="d-flex gap-2 mt-4">
            <button type="button" className="btn btn-light fw-semibold px-4" onClick={onCancel}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary flex-fill fw-bold" disabled={loading}>
              {loading ? "Guardando..." : faseId ? "Actualizar fase" : "Crear fase"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FasesForm;
