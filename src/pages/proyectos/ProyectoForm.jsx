import React, { useState, useEffect } from "react";
import { createProyecto, updateProyecto, getProyectoById } from "../../services/proyectoService";
import { getServicios } from "../../services/servicioService";
import { getUsuarios } from "../../services/usuarioService";

const EMPTY = {
  nombre: "", descripcion: "", id_servicio: "",
  lider_ids: [],
  presupuesto: "", horas_estimadas: "", fecha_inicio: "", fecha_fin_estimada: "",
  empleados_ids: [],
};

const ProyectoForm = ({ proyectoId, onSaved, onCancel }) => {
  const [form, setForm]           = useState(EMPTY);
  const [servicios, setServicios] = useState([]);
  const [lideres, setLideres]     = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [error, setError]         = useState("");
  const [loading, setLoading]     = useState(false);

  /* ── Carga selectores ───────────────────────── */
  useEffect(() => {
    Promise.all([getServicios(), getUsuarios()])
      .then(([sRes, uRes]) => {
        if (sRes?.success) setServicios(sRes.data.filter((s) => s.is_active));
        if (uRes?.success || Array.isArray(uRes?.data)) {
          const users = uRes.data || [];
          setLideres(users.filter((u) => u.rol === "lider"));
          setEmpleados(users.filter((u) => u.rol === "empleado"));
        }
      })
      .catch(() => {});
  }, []);

  /* ── Carga datos del proyecto (edición) ─────── */
  useEffect(() => {
    if (!proyectoId) return;
    getProyectoById(proyectoId)
      .then((res) => {
        if (res?.success) {
          const p = res.data;
          setForm({
            nombre:             p.nombre || "",
            descripcion:        p.descripcion || "",
            id_servicio:        p.id_servicio || "",
            lider_ids:          (p.lideres || []).map((l) => l.id_lider),
            presupuesto:        p.presupuesto || "",
            horas_estimadas:    p.horas_estimadas || "",
            fecha_inicio:       p.fecha_inicio?.slice(0, 10) || "",
            fecha_fin_estimada: p.fecha_fin_estimada?.slice(0, 10) || "",
            empleados_ids:      (p.empleados || []).map((e) => e.id_empleado),
          });
        }
      })
      .catch(() => setError("No se pudo cargar el proyecto."));
  }, [proyectoId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /* ── Toggle líderes (máx 3) ─────────────────── */
  const toggleLider = (id) => {
    setForm((prev) => {
      const ids = prev.lider_ids.includes(id)
        ? prev.lider_ids.filter((x) => x !== id)
        : prev.lider_ids.length < 3
          ? [...prev.lider_ids, id]
          : prev.lider_ids;
      return { ...prev, lider_ids: ids };
    });
  };

  /* ── Toggle empleados ───────────────────────── */
  const toggleEmpleado = (id) => {
    setForm((prev) => {
      const ids = prev.empleados_ids.includes(id)
        ? prev.empleados_ids.filter((x) => x !== id)
        : [...prev.empleados_ids, id];
      return { ...prev, empleados_ids: ids };
    });
  };

  /* ── Submit ─────────────────────────────────── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const payload = {
      nombre:             form.nombre,
      descripcion:        form.descripcion || undefined,
      id_servicio:        form.id_servicio     ? Number(form.id_servicio)     : undefined,
      lider_ids:          form.lider_ids.map(Number),
      presupuesto:        form.presupuesto     ? Number(form.presupuesto)     : undefined,
      horas_estimadas:    form.horas_estimadas ? Number(form.horas_estimadas) : undefined,
      fecha_inicio:       form.fecha_inicio         || undefined,
      fecha_fin_estimada: form.fecha_fin_estimada   || undefined,
      empleados_ids:      form.empleados_ids,
    };
    try {
      const res = proyectoId
        ? await updateProyecto(proyectoId, payload)
        : await createProyecto(payload);
      if (res?.success) {
        onSaved?.();
      } else {
        setError(res?.message || "Error al guardar el proyecto.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error al guardar el proyecto.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card border-0 rounded-4 mb-4 overflow-hidden animate-scaleIn" style={{ boxShadow: "var(--shadow-md)" }}>
      <div style={{ height: 4, background: "linear-gradient(90deg, var(--primary), var(--accent))" }}></div>
      <div className="p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h5 className="fw-bold mb-0">{proyectoId ? "Editar proyecto" : "Nuevo proyecto"}</h5>
            <p className="text-muted small mb-0">Completa los datos del proyecto</p>
          </div>
          <button type="button" className="btn btn-sm btn-light rounded-circle p-1 lh-1" onClick={onCancel}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        {error && (
          <div className="alert alert-danger d-flex align-items-center py-2 small rounded-3 mb-3">
            <i className="bi bi-exclamation-circle-fill me-2"></i>{error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="row g-3">

            {/* Nombre */}
            <div className="col-12 col-sm-6">
              <label className="form-label fw-semibold small">Nombre del proyecto *</label>
              <input type="text" name="nombre" value={form.nombre} onChange={handleChange}
                className="form-control" placeholder="Ej: Rediseño Web 2025" required minLength={3} />
            </div>

            {/* Servicio */}
            <div className="col-12 col-sm-6">
              <label className="form-label fw-semibold small">Servicio *</label>
              <select name="id_servicio" value={form.id_servicio} onChange={handleChange} className="form-select" required>
                <option value="">— Selecciona un servicio —</option>
                {servicios.map((s) => (
                  <option key={s.id_servicio} value={s.id_servicio}>{s.nombre}</option>
                ))}
              </select>
            </div>

            {/* Descripción */}
            <div className="col-12">
              <label className="form-label fw-semibold small">Descripción <span className="text-muted fw-normal">(opcional)</span></label>
              <textarea name="descripcion" value={form.descripcion} onChange={handleChange}
                className="form-control" rows={2} placeholder="Describe el alcance del proyecto..." />
            </div>

            {/* Presupuesto y horas */}
            <div className="col-6 col-sm-3">
              <label className="form-label fw-semibold small">Presupuesto</label>
              <input type="number" name="presupuesto" value={form.presupuesto} onChange={handleChange}
                className="form-control" placeholder="0.00" min="0" step="0.01" />
            </div>
            <div className="col-6 col-sm-3">
              <label className="form-label fw-semibold small">Horas estimadas</label>
              <input type="number" name="horas_estimadas" value={form.horas_estimadas} onChange={handleChange}
                className="form-control" placeholder="0" min="0" />
            </div>

            {/* Fechas */}
            <div className="col-12 col-sm-3">
              <label className="form-label fw-semibold small">Fecha inicio</label>
              <input type="date" name="fecha_inicio" value={form.fecha_inicio} onChange={handleChange} className="form-control" />
            </div>
            <div className="col-12 col-sm-3">
              <label className="form-label fw-semibold small">Fecha fin estimada</label>
              <input type="date" name="fecha_fin_estimada" value={form.fecha_fin_estimada} onChange={handleChange} className="form-control" />
            </div>

            {/* ── Separador líderes ── */}
            <div className="col-12">
              <hr className="my-1" style={{ borderColor: "rgba(245,158,11,.15)" }} />
              <p className="small fw-bold text-muted mb-0" style={{ fontSize: 11, letterSpacing: ".06em", textTransform: "uppercase" }}>
                <i className="bi bi-star-fill me-2" style={{ color: "#D97706" }}></i>Líderes del proyecto
              </p>
            </div>

            {/* Multi-select líderes */}
            {lideres.length > 0 ? (
              <div className="col-12">
                <label className="form-label fw-semibold small d-flex align-items-center justify-content-between">
                  <span>
                    <i className="bi bi-star-fill me-1" style={{ color: "#D97706", fontSize: 11 }}></i>
                    Selecciona hasta 3 líderes
                  </span>
                  <span className="text-muted fw-normal" style={{ fontSize: 11 }}>
                    {form.lider_ids.length}/3 seleccionados
                  </span>
                </label>
                <div className="border rounded-3 p-2" style={{ background: "#FAFBFC", maxHeight: 180, overflowY: "auto" }}>
                  {lideres.map((u) => {
                    const checked     = form.lider_ids.includes(u.id_usuario);
                    const maxReached  = form.lider_ids.length >= 3 && !checked;
                    return (
                      <div
                        key={u.id_usuario}
                        className="d-flex align-items-center gap-2 rounded-2 px-2 py-1 mb-1"
                        style={{
                          cursor:     maxReached ? "not-allowed" : "pointer",
                          background: checked     ? "rgba(245,158,11,.08)" : "transparent",
                          opacity:    maxReached  ? 0.45 : 1,
                          transition: "background .15s",
                        }}
                        onClick={() => !maxReached && toggleLider(u.id_usuario)}
                      >
                        <div
                          className="rounded d-flex align-items-center justify-content-center flex-shrink-0"
                          style={{
                            width: 18, height: 18,
                            background: checked ? "#F59E0B" : "#fff",
                            border: `2px solid ${checked ? "#F59E0B" : "#CBD5E1"}`,
                            transition: "all .15s",
                          }}
                        >
                          {checked && <i className="bi bi-check text-white" style={{ fontSize: 10, lineHeight: 1 }}></i>}
                        </div>
                        <div className="avatar flex-shrink-0" style={{ width: 26, height: 26, fontSize: 10, background: "linear-gradient(135deg,#F59E0B,#D97706)" }}>
                          {u.nombre.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()}
                        </div>
                        <span className="small fw-medium">{u.nombre}</span>
                        <span className="ms-auto small text-muted">{u.email}</span>
                        {checked && (
                          <span className="badge badge-role badge-lider ms-1" style={{ fontSize: 9 }}>Líder</span>
                        )}
                      </div>
                    );
                  })}
                </div>
                {form.lider_ids.length >= 3 && (
                  <p className="small mt-1" style={{ color: "#D97706" }}>
                    <i className="bi bi-info-circle me-1"></i>Máximo 3 líderes por proyecto.
                  </p>
                )}
              </div>
            ) : (
              <div className="col-12">
                <p className="small text-muted mb-0">
                  <i className="bi bi-info-circle me-1"></i>No hay líderes disponibles. Crea usuarios con rol Líder primero.
                </p>
              </div>
            )}

            {/* ── Separador empleados ── */}
            {empleados.length > 0 && (
              <div className="col-12">
                <hr className="my-1" style={{ borderColor: "rgba(79,70,229,.1)" }} />
                <p className="small fw-bold text-muted mb-0" style={{ fontSize: 11, letterSpacing: ".06em", textTransform: "uppercase" }}>
                  <i className="bi bi-people-fill me-2" style={{ color: "var(--primary)" }}></i>Asignación de empleados
                </p>
              </div>
            )}

            {/* Multi-select empleados */}
            {empleados.length > 0 && (
              <div className="col-12">
                <label className="form-label fw-semibold small d-flex align-items-center justify-content-between">
                  <span>
                    <i className="bi bi-people-fill me-1" style={{ color: "#10B981", fontSize: 11 }}></i>
                    Empleados del equipo
                  </span>
                  <span className="text-muted fw-normal" style={{ fontSize: 11 }}>
                    {form.empleados_ids.length} seleccionado{form.empleados_ids.length !== 1 ? "s" : ""}
                  </span>
                </label>
                <div className="border rounded-3 p-2" style={{ background: "#FAFBFC", maxHeight: 180, overflowY: "auto" }}>
                  {empleados.map((u) => {
                    const checked = form.empleados_ids.includes(u.id_usuario);
                    return (
                      <div
                        key={u.id_usuario}
                        className="d-flex align-items-center gap-2 rounded-2 px-2 py-1 mb-1"
                        style={{
                          cursor:     "pointer",
                          background: checked ? "rgba(79,70,229,.06)" : "transparent",
                          transition: "background .15s",
                        }}
                        onClick={() => toggleEmpleado(u.id_usuario)}
                      >
                        <div
                          className="rounded d-flex align-items-center justify-content-center flex-shrink-0"
                          style={{
                            width: 18, height: 18,
                            background: checked ? "var(--primary)" : "#fff",
                            border: `2px solid ${checked ? "var(--primary)" : "#CBD5E1"}`,
                            transition: "all .15s",
                          }}
                        >
                          {checked && <i className="bi bi-check text-white" style={{ fontSize: 10, lineHeight: 1 }}></i>}
                        </div>
                        <div className="avatar flex-shrink-0" style={{ width: 26, height: 26, fontSize: 10 }}>
                          {u.nombre.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()}
                        </div>
                        <span className="small fw-medium">{u.nombre}</span>
                        <span className="ms-auto small text-muted">{u.email}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="d-flex gap-2 mt-4">
            <button type="button" className="btn btn-light fw-semibold px-4" onClick={onCancel}>Cancelar</button>
            <button type="submit" className="btn btn-primary flex-fill" disabled={loading}>
              {loading
                ? <><span className="spinner-border spinner-border-sm me-2"></span>Guardando...</>
                : <><i className="bi bi-kanban-fill me-2"></i>{proyectoId ? "Guardar cambios" : "Crear proyecto"}</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProyectoForm;
