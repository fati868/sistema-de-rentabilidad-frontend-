import React, { useEffect, useState } from "react";
import { createNota, updateNota } from "../../services/notaService";

const EMPTY = {
  descripcion: "",
};

const NotasForm = ({ nota, proyectoId, onSaved, onCancel }) => {
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!nota) {
      setForm(EMPTY);
      return;
    }

    setForm({
      descripcion: nota.descripcion || "",
    });
  }, [nota]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const descripcion = form.descripcion.trim();
    if (!descripcion) {
      setError("La descripción es obligatoria.");
      return;
    }

    if (descripcion.length > 1000) {
      setError("La descripción no puede superar los 1000 caracteres.");
      return;
    }

    if (!nota?.id_nota && !proyectoId) {
      setError("Selecciona un proyecto antes de registrar notas.");
      return;
    }

    setLoading(true);
    try {
      const payload = { descripcion };
      const res = nota?.id_nota
        ? await updateNota(nota.id_nota, payload)
        : await createNota(proyectoId, payload);

      if (res?.success) {
        onSaved?.();
      } else {
        setError(res?.message || "Error al guardar la nota.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error al guardar la nota.");
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
            <h5 className="fw-bold mb-1">{nota?.id_nota ? "Editar nota" : "Nueva nota"}</h5>
            <p className="text-muted small mb-0">Registra avances, acuerdos o incidencias del proyecto</p>
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
          <div className="mb-2">
            <label className="form-label fw-semibold small">Descripción *</label>
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              className="form-control"
              rows={5}
              maxLength={1000}
              required
            />
          </div>

          <div className="d-flex justify-content-end mb-3">
            <span className="text-muted small">{form.descripcion.length}/1000</span>
          </div>

          <div className="d-flex gap-2">
            <button type="button" className="btn btn-light fw-semibold px-4" onClick={onCancel}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary flex-fill fw-bold" disabled={loading}>
              {loading ? "Guardando..." : nota?.id_nota ? "Actualizar nota" : "Crear nota"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NotasForm;
