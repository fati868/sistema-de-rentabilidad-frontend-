import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import ProyectoForm from "./ProyectoForm";
import HorasForm from "../horas/HorasForm";
import { useAuth } from "../../context/AuthContext";
import {
  getProyectos, getMisProyectos, desactivarProyecto,
  activarProyecto, eliminarProyecto, getHorasResumenProyecto, getEmpleadosProyecto,
} from "../../services/proyectoService";

/* ── Confirm modal ───────────────────────────── */
const ConfirmModal = ({ title, message, confirmLabel, danger, onConfirm, onCancel }) => (
  <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onCancel()}>
    <div className="modal-card p-4 animate-scaleIn" style={{ maxWidth: 420 }}>
      <div className="d-flex align-items-start gap-3 mb-4">
        <div className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
          style={{ width: 44, height: 44, background: danger ? "rgba(239,68,68,.1)" : "rgba(245,158,11,.1)" }}>
          <i className={`bi ${danger ? "bi-trash-fill" : "bi-exclamation-triangle-fill"}`}
            style={{ color: danger ? "var(--danger)" : "var(--warning)", fontSize: 20 }}></i>
        </div>
        <div>
          <h6 className="fw-bold mb-1">{title}</h6>
          <p className="text-muted small mb-0">{message}</p>
        </div>
      </div>
      <div className="d-flex gap-2">
        <button className="btn btn-light flex-fill fw-semibold" onClick={onCancel}>Cancelar</button>
        <button className={`btn ${danger ? "btn-danger" : "btn-warning"} flex-fill fw-bold`} onClick={onConfirm}>
          {confirmLabel}
        </button>
      </div>
    </div>
  </div>
);

/* ── Panel expandible de proyecto ────────────── */
const ProyectoDetailPanel = ({ proyecto }) => {
  const [resumen, setResumen] = useState({ horas: [], lideres: [] });
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getHorasResumenProyecto(proyecto.id_proyecto).catch(() => ({ data: [] })),
      getEmpleadosProyecto(proyecto.id_proyecto).catch(() => ({ data: [] })),
      import("../../services/proyectoService").then((m) =>
        m.getProyectoById ? m.getProyectoById(proyecto.id_proyecto).catch(() => ({ data: null })) : Promise.resolve({ data: null })
      ),
    ]).then(([hRes, eRes, pRes]) => {
      if (hRes?.success) setResumen((prev) => ({ ...prev, horas: hRes.data || [] }));
      if (eRes?.success) setEmpleados(eRes.data || []);
      if (pRes?.success && pRes.data?.lideres) setResumen((prev) => ({ ...prev, lideres: pRes.data.lideres }));
    }).finally(() => setLoading(false));
  }, [proyecto.id_proyecto]);

  const totalHoras = resumen.horas.reduce((acc, r) => acc + Number(r.total_horas || 0), 0);

  return (
    <tr>
      <td colSpan="7" style={{ padding: 0 }}>
        <div className="animate-fadeInUp" style={{ background: "linear-gradient(135deg,rgba(79,70,229,.03),rgba(6,182,212,.02))", borderTop: "2px solid rgba(79,70,229,.12)", padding: "1.25rem 1.5rem" }}>
          <div className="row g-3">
            {/* Detalles */}
            <div className="col-12 col-md-4">
              <h6 className="fw-bold mb-3 d-flex align-items-center gap-2" style={{ fontSize: 13 }}>
                <i className="bi bi-info-circle-fill" style={{ color: "var(--primary)" }}></i>
                Detalles del proyecto
              </h6>
              <div style={{ fontSize: 13 }}>
                {proyecto.descripcion && <p className="text-muted mb-2" style={{ lineHeight: 1.5 }}>{proyecto.descripcion}</p>}
                <div className="d-flex flex-wrap gap-2">
                  {proyecto.horas_estimadas && (
                    <span className="badge badge-role badge-propietario">
                      <i className="bi bi-clock me-1"></i>{proyecto.horas_estimadas}h estimadas
                    </span>
                  )}
                  {proyecto.presupuesto && (
                    <span className="badge badge-role badge-active">
                      ${Number(proyecto.presupuesto).toLocaleString()}
                    </span>
                  )}
                  {proyecto.fecha_inicio && (
                    <span className="badge badge-role badge-lider">
                      Inicio: {proyecto.fecha_inicio.slice(0, 10)}
                    </span>
                  )}
                  {proyecto.fecha_fin_estimada && (
                    <span className="badge badge-role badge-edit">
                      Fin est.: {proyecto.fecha_fin_estimada.slice(0, 10)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Equipo */}
            <div className="col-12 col-md-3">
              <h6 className="fw-bold mb-3 d-flex align-items-center gap-2" style={{ fontSize: 13 }}>
                <i className="bi bi-people-fill" style={{ color: "#10B981" }}></i>
                Equipo asignado
              </h6>
              {loading ? (
                Array.from({ length: 2 }).map((_, i) => <div key={i} className="skeleton rounded-3 mb-2" style={{ height: 28 }}></div>)
              ) : (
                <div style={{ fontSize: 12 }}>
                  {/* Múltiples líderes */}
                  {resumen.lideres?.length > 0
                    ? resumen.lideres.map((l) => (
                      <div key={l.id_lider} className="d-flex align-items-center gap-2 mb-1 p-2 rounded-3" style={{ background: "rgba(245,158,11,.08)" }}>
                        <i className="bi bi-star-fill" style={{ color: "#D97706", fontSize: 11 }}></i>
                        <span className="fw-semibold">{l.nombre}</span>
                        <span className="badge badge-role badge-lider ms-auto" style={{ fontSize: 9 }}>Líder</span>
                      </div>
                    ))
                    : proyecto.lider_nombre
                      ? (
                        <div className="d-flex align-items-center gap-2 mb-2 p-2 rounded-3" style={{ background: "rgba(245,158,11,.08)" }}>
                          <i className="bi bi-star-fill" style={{ color: "#D97706", fontSize: 12 }}></i>
                          <span className="fw-semibold">{proyecto.lider_nombre}</span>
                          <span className="badge badge-role badge-lider ms-auto" style={{ fontSize: 9 }}>Líder</span>
                        </div>
                      )
                      : null
                  }
                  {empleados.length === 0 && !proyecto.lider_nombre && !(resumen.lideres?.length > 0) && (
                    <p className="text-muted" style={{ fontSize: 12 }}>Sin equipo asignado</p>
                  )}
                  {empleados.map((e) => (
                    <div key={e.id_empleado} className="d-flex align-items-center gap-2 mb-1 p-1 rounded-2"
                      style={{ background: "rgba(16,185,129,.05)" }}>
                      <div className="avatar flex-shrink-0" style={{ width: 22, height: 22, fontSize: 8 }}>
                        {e.nombre.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()}
                      </div>
                      <span>{e.nombre}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Horas por empleado */}
            <div className="col-12 col-md-5">
              <h6 className="fw-bold mb-3 d-flex align-items-center gap-2" style={{ fontSize: 13 }}>
                <i className="bi bi-clock-history" style={{ color: "var(--accent)" }}></i>
                Horas registradas
                <span className="badge badge-role badge-active ms-auto">{totalHoras.toFixed(1)}h total</span>

              </h6>
              {loading ? (
                Array.from({ length: 2 }).map((_, i) => <div key={i} className="skeleton rounded-3 mb-2" style={{ height: 36 }}></div>)
              ) : resumen.horas.length === 0 ? (
                <p className="text-muted" style={{ fontSize: 12 }}>Sin horas registradas aún.</p>
              ) : (
                resumen.horas.map((r) => (
                  <div key={r.id_usuario} className="mb-2 p-2 rounded-3" style={{ background: "rgba(6,182,212,.05)", fontSize: 12 }}>
                    <div className="d-flex align-items-center justify-content-between mb-1">
                      <div className="d-flex align-items-center gap-2">
                        <div className="avatar flex-shrink-0" style={{ width: 22, height: 22, fontSize: 8 }}>
                          {r.empleado_nombre.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()}
                        </div>
                        <span className="fw-semibold">{r.empleado_nombre}</span>
                      </div>
                      <span className="badge badge-role badge-active">{Number(r.total_horas).toFixed(1)}h</span>
                    </div>
                    {r.tareas && (
                      <p className="text-muted mb-0 text-truncate" style={{ fontSize: 11, paddingLeft: 30 }}>
                        {r.tareas.slice(0, 80)}{r.tareas.length > 80 ? "…" : ""}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
};

/* ── Vista propietario ───────────────────────── */
const PropietarioView = () => {
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(null);  // id_proyecto expandido
  const [confirm, setConfirm] = useState(null);   // { type, proyecto }

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getProyectos();
      if (res.success) setProyectos(res.data);
      else setError("No se pudo cargar la lista de proyectos.");
    } catch {
      setError("Error al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const handleSaved = () => { setShowForm(false); setEditingId(null); fetch(); };
  const handleEdit = (id) => { setEditingId(id); setShowForm(true); };

  const handleConfirm = async () => {
    if (!confirm) return;
    try {
      setLoading(true);
      let res;

      // Lógica de "Eliminación Silenciosa" para la HU 22
      if (confirm.type === "delete") {
        // El usuario cree que elimina, pero nosotros mantenemos la trazabilidad
        res = await desactivarProyecto(confirm.proyecto.id_proyecto);
      } else if (confirm.type === "activate") {
        res = await activarProyecto(confirm.proyecto.id_proyecto);
      }

      if (res?.success) {
        // Refresco de lista tras acción (Criterio HU 22)
        await fetch();
        setConfirm(null);
      } else {
        setError(res?.message || "Error al procesar la solicitud.");
      }
    } catch (err) {
      setError("Error de conexión con el servidor.");
    } finally {
      setLoading(false);
      setConfirm(null);
    }
  };

  const toggleExpand = (id) => setExpanded((prev) => (prev === id ? null : id));

  const filtered = proyectos.filter((p) =>
    p.nombre.toLowerCase().includes(search.toLowerCase()) ||
    (p.descripcion || "").toLowerCase().includes(search.toLowerCase()) ||
    (p.servicio_nombre || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div className="animate-fadeInUp">
        <div className="page-header d-flex justify-content-between align-items-start flex-wrap gap-3">
          <div>
            <h2 className="fw-bold mb-1">Gestión de Proyectos</h2>
            <p className="text-muted small mb-0">Administra los proyectos de tu empresa</p>
          </div>
          <button className="btn btn-primary d-flex align-items-center gap-2 px-4"
            onClick={() => { setEditingId(null); setShowForm(true); }}>
            <i className="bi bi-plus-circle-fill"></i>
            Nuevo Proyecto
          </button>
        </div>

        {/* Stats */}
        <div className="row g-3 mb-4 stagger">
          {[
            { label: "Total proyectos", value: proyectos.length, icon: "bi-kanban-fill", color: "var(--primary)", bg: "rgba(79,70,229,.1)" },
            { label: "Activos", value: proyectos.filter(p => p.is_active).length, icon: "bi-check-circle-fill", color: "var(--success)", bg: "rgba(16,185,129,.1)" },
            { label: "Inactivos", value: proyectos.filter(p => !p.is_active).length, icon: "bi-x-circle-fill", color: "var(--danger)", bg: "rgba(239,68,68,.1)" },
          ].map((s, i) => (
            <div className="col-6 col-sm-4" key={i}>
              <div className="stat-card card-3d animate-fadeInUp">
                <div className="stat-card__glow" style={{ background: s.color }}></div>
                <div className="d-flex align-items-center gap-3">
                  <div className="rounded-3 d-flex align-items-center justify-content-center"
                    style={{ width: 44, height: 44, background: s.bg }}>
                    <i className={`bi ${s.icon}`} style={{ color: s.color, fontSize: 20 }}></i>
                  </div>
                  <div>
                    <p className="text-muted small mb-0">{s.label}</p>
                    <h4 className="fw-bold mb-0" style={{ color: s.color }}>{s.value}</h4>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {showForm && (
          <ProyectoForm
            proyectoId={editingId}
            onSaved={handleSaved}
            onCancel={() => { setShowForm(false); setEditingId(null); }}
          />
        )}

        <div className="mb-3">
          <div className="input-group" style={{ maxWidth: 360 }}>
            <span className="input-group-text bg-white border-end-0">
              <i className="bi bi-search text-muted"></i>
            </span>
            <input type="text" className="form-control border-start-0 ps-0"
              placeholder="Buscar proyecto..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>

        {error && (
          <div className="alert alert-danger d-flex align-items-center small rounded-3">
            <i className="bi bi-exclamation-circle-fill me-2"></i>{error}
          </div>
        )}

        <div className="card border-0 rounded-4 overflow-hidden" style={{ boxShadow: "var(--shadow-md)" }}>
          <div className="table-responsive">
            <table className="table table-modern mb-0">
              <thead>
                <tr>
                  <th style={{ width: 30 }}></th>
                  <th>Proyecto</th>
                  <th>Servicio</th>
                  <th>Líder</th>
                  <th>Fechas</th>
                  <th>Estado</th>
                  <th className="text-end">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i}>{Array.from({ length: 7 }).map((_, j) => (
                      <td key={j}><div className="skeleton rounded" style={{ height: 20, width: "80%" }}></div></td>
                    ))}</tr>
                  ))
                ) : filtered.length > 0 ? (
                  filtered.flatMap((p) => {
                    const isExpanded = expanded === p.id_proyecto;
                    const rows = [
                      <tr
                        key={p.id_proyecto}
                        className="animate-fadeIn"
                        style={{ cursor: "pointer", background: isExpanded ? "rgba(79,70,229,.04)" : "" }}
                        onClick={() => toggleExpand(p.id_proyecto)}
                      >
                        <td>
                          <i className={`bi ${isExpanded ? "bi-chevron-down" : "bi-chevron-right"}`}
                            style={{ color: "var(--primary)", fontSize: 12 }}></i>
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <div className="rounded-3 d-flex align-items-center justify-content-center"
                              style={{ width: 32, height: 32, background: p.is_active ? "rgba(79,70,229,.1)" : "rgba(100,116,139,.1)", flexShrink: 0 }}>
                              <i className="bi bi-kanban" style={{ color: p.is_active ? "var(--primary)" : "#94a3b8", fontSize: 14 }}></i>
                            </div>
                            <div>
                              <span className={`fw-semibold d-block ${!p.is_active ? "text-muted" : ""}`}>{p.nombre}</span>
                              {p.presupuesto && (
                                <span className="text-muted" style={{ fontSize: 11 }}>
                                  ${Number(p.presupuesto).toLocaleString()}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="text-muted small">{p.servicio_nombre || "—"}</td>
                        <td className="text-muted small">
                          {p.lider_nombre
                            ? p.lider_nombre.split(", ").map((n, i) => (
                              <span key={i} className="d-flex align-items-center gap-1 mb-1" style={{ fontSize: 11 }}>
                                <i className="bi bi-star-fill" style={{ color: "#D97706", fontSize: 9 }}></i>{n}
                              </span>
                            ))
                            : "—"}
                        </td>
                        <td className="text-muted small">
                          {p.fecha_inicio ? p.fecha_inicio.slice(0, 10) : "—"}
                          {p.fecha_fin_estimada ? <><br /><span style={{ fontSize: 10 }}>Fin: {p.fecha_fin_estimada.slice(0, 10)}</span></> : ""}
                        </td>
                        <td>
                          <span className={`badge badge-role ${p.is_active ? "badge-active" : "badge-inactive"}`}>
                            {p.is_active ? "Activo" : "Inactivo"}
                          </span>
                        </td>
                        <td className="text-end" onClick={(e) => e.stopPropagation()}>
                          <div className="d-flex gap-1 justify-content-end">
                            {/* Botón Editar: Solo visible si el proyecto está activo */}
                            {p.is_active && (
                              <Link
                                className="btn btn-sm btn-primary shadow-sm"
                                title="Fases"
                                to={`/proyectos/${p.id_proyecto}/fases`}
                              >
                                <i className="bi bi-layers"></i>
                              </Link>
                            )}

                            {p.is_active && (
                              <button className="btn btn-sm btn-success shadow-sm" title="Editar"
                                onClick={() => handleEdit(p.id_proyecto)}>
                                <i className="bi bi-pencil-square"></i>
                              </button>
                            )}

                            {/* El ÚNICO botón de eliminación: Silenciosamente solo desactiva */}
                            {p.is_active ? (
                              <button className="btn btn-sm btn-danger shadow-sm" title="Eliminar"
                                onClick={() => setConfirm({ type: "delete", proyecto: p })}>
                                <i className="bi bi-trash-fill"></i>
                              </button>
                            ) : (
                              /* Botón de restauración: Solo visible para proyectos "eliminados" (inactivos) */
                              <button className="btn btn-sm btn-primary shadow-sm" title="Restaurar"
                                onClick={() => setConfirm({ type: "activate", proyecto: p })}>
                                <i className="bi bi-arrow-counterclockwise"></i>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ];
                    if (isExpanded) rows.push(<ProyectoDetailPanel key={`detail-${p.id_proyecto}`} proyecto={p} />);
                    return rows;
                  })
                ) : (
                  <tr>
                    <td colSpan="7">
                      <div className="empty-state">
                        <i className="bi bi-kanban"></i>
                        <h6>Sin proyectos</h6>
                        <p>Crea el primer proyecto con el botón de arriba.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {confirm && (
        <ConfirmModal
          danger={confirm.type === "delete"}
          title={confirm.type === "delete" ? "Eliminar proyecto" : "Restaurar proyecto"}
          message={
            confirm.type === "delete"
              ? `¿Estás seguro de que deseas eliminar el proyecto "${confirm.proyecto.nombre}"? Esta acción no se puede deshacer.`
              : `¿Deseas restaurar el proyecto "${confirm.proyecto.nombre}" para volver a operar con él?`
          }
          confirmLabel={confirm.type === "delete" ? "Sí, eliminar" : "Sí, restaurar"}
          onConfirm={handleConfirm}
          onCancel={() => setConfirm(null)}
        />
      )}
    </Layout>
  );
};

/* ── Vista lider ─────────────────────────────── */
const LiderView = () => {
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getMisProyectos()
      .then((res) => { if (res.success) setProyectos(res.data); else setError("No se pudieron cargar tus proyectos."); })
      .catch(() => setError("Error al conectar con el servidor."))
      .finally(() => setLoading(false));
  }, []);

  const toggleExpand = (id) => setExpanded((prev) => (prev === id ? null : id));

  const filtered = proyectos.filter((p) =>
    p.nombre.toLowerCase().includes(search.toLowerCase()) ||
    (p.servicio_nombre || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div className="animate-fadeInUp">
        <div className="page-header d-flex justify-content-between align-items-start flex-wrap gap-3">
          <div>
            <h2 className="fw-bold mb-1">Proyectos que lidero</h2>
            <p className="text-muted small mb-0">
              {proyectos.length} proyecto{proyectos.length !== 1 ? "s" : ""} bajo tu liderazgo
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="row g-3 mb-4 stagger">
          {[
            { label: "Total proyectos", value: proyectos.length, icon: "bi-kanban-fill", color: "var(--primary)", bg: "rgba(79,70,229,.1)" },
            { label: "Activos", value: proyectos.filter(p => p.is_active).length, icon: "bi-check-circle-fill", color: "var(--success)", bg: "rgba(16,185,129,.1)" },
            { label: "Inactivos", value: proyectos.filter(p => !p.is_active).length, icon: "bi-x-circle-fill", color: "var(--danger)", bg: "rgba(239,68,68,.1)" },
          ].map((s, i) => (
            <div className="col-12 col-sm-4" key={i}>
              <div className="stat-card card-3d animate-fadeInUp">
                <div className="stat-card__glow" style={{ background: s.color }}></div>
                <div className="d-flex align-items-center gap-3">
                  <div className="rounded-3 d-flex align-items-center justify-content-center"
                    style={{ width: 44, height: 44, background: s.bg }}>
                    <i className={`bi ${s.icon}`} style={{ color: s.color, fontSize: 20 }}></i>
                  </div>
                  <div>
                    <p className="text-muted small mb-0">{s.label}</p>
                    <h4 className="fw-bold mb-0" style={{ color: s.color }}>{s.value}</h4>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mb-3">
          <div className="input-group" style={{ maxWidth: 360 }}>
            <span className="input-group-text bg-white border-end-0">
              <i className="bi bi-search text-muted"></i>
            </span>
            <input type="text" className="form-control border-start-0 ps-0"
              placeholder="Buscar proyecto..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>

        {error && (
          <div className="alert alert-danger d-flex align-items-center small rounded-3">
            <i className="bi bi-exclamation-circle-fill me-2"></i>{error}
          </div>
        )}

        <div className="card border-0 rounded-4 overflow-hidden" style={{ boxShadow: "var(--shadow-md)" }}>
          <div className="table-responsive">
            <table className="table table-modern mb-0">
              <thead>
                <tr>
                  <th style={{ width: 30 }}></th>
                  <th>Proyecto</th>
                  <th>Servicio</th>
                  <th>Fechas</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <tr key={i}>{Array.from({ length: 5 }).map((_, j) => (
                      <td key={j}><div className="skeleton rounded" style={{ height: 20, width: "80%" }}></div></td>
                    ))}</tr>
                  ))
                ) : filtered.length > 0 ? (
                  filtered.flatMap((p) => {
                    const isExpanded = expanded === p.id_proyecto;
                    return [
                      <tr
                        key={p.id_proyecto}
                        className="animate-fadeIn"
                        style={{ cursor: "pointer", background: isExpanded ? "rgba(79,70,229,.04)" : "" }}
                        onClick={() => toggleExpand(p.id_proyecto)}
                      >
                        <td>
                          <i className={`bi ${isExpanded ? "bi-chevron-down" : "bi-chevron-right"}`}
                            style={{ color: "var(--primary)", fontSize: 12 }}></i>
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <div className="rounded-3 d-flex align-items-center justify-content-center"
                              style={{ width: 32, height: 32, background: "rgba(79,70,229,.1)", flexShrink: 0 }}>
                              <i className="bi bi-kanban" style={{ color: "var(--primary)", fontSize: 14 }}></i>
                            </div>
                            <div>
                              <span className="fw-semibold d-block">{p.nombre}</span>
                              {p.horas_estimadas && (
                                <span className="text-muted" style={{ fontSize: 11 }}>{p.horas_estimadas}h estimadas</span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="text-muted small">{p.servicio_nombre || "—"}</td>
                        <td className="text-muted small">
                          {p.fecha_inicio ? p.fecha_inicio.slice(0, 10) : "—"}
                          {p.fecha_fin_estimada ? <><br /><span style={{ fontSize: 10 }}>Fin: {p.fecha_fin_estimada.slice(0, 10)}</span></> : ""}
                        </td>
                        <td>
                          <span className={`badge badge-role ${p.is_active ? "badge-active" : "badge-inactive"}`}>
                            {p.is_active ? "Activo" : "Inactivo"}
                          </span>
                        </td>
                      </tr>,
                      isExpanded && <ProyectoDetailPanel key={`detail-${p.id_proyecto}`} proyecto={p} />,
                    ].filter(Boolean);
                  })
                ) : (
                  <tr>
                    <td colSpan="5">
                      <div className="empty-state">
                        <i className="bi bi-kanban"></i>
                        <h6>Sin proyectos asignados</h6>
                        <p>Aún no tienes proyectos asignados. Consulta con tu propietario.</p>
                      </div>
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

/* ── Vista empleado ──────────────────────────── */
const EmpleadoView = () => {
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [horasProyecto, setHorasProyecto] = useState(null);

  useEffect(() => {
    getMisProyectos()
      .then((res) => { if (res.success) setProyectos(res.data); else setError("No se pudieron cargar tus proyectos."); })
      .catch(() => setError("Error al conectar con el servidor."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <div className="animate-fadeInUp">
        <div className="page-header d-flex justify-content-between align-items-start flex-wrap gap-3">
          <div>
            <h2 className="fw-bold mb-1">Mis proyectos asignados</h2>
            <p className="text-muted small mb-0">Proyectos a los que has sido asignado</p>
          </div>
          <button className="btn btn-primary d-flex align-items-center gap-2 px-4"
            onClick={() => setHorasProyecto({ id_proyecto: null })}>
            <i className="bi bi-clock-history"></i>
            Registrar Horas
          </button>
        </div>

        {error && (
          <div className="alert alert-danger d-flex align-items-center small rounded-3">
            <i className="bi bi-exclamation-circle-fill me-2"></i>{error}
          </div>
        )}

        {loading ? (
          <div className="row g-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div className="col-12 col-md-6 col-lg-4" key={i}>
                <div className="skeleton rounded-4" style={{ height: 180 }}></div>
              </div>
            ))}
          </div>
        ) : proyectos.length === 0 ? (
          <div className="card border-0 rounded-4 d-flex flex-column align-items-center justify-content-center py-5"
            style={{ boxShadow: "var(--shadow-md)", minHeight: 300 }}>
            <i className="bi bi-kanban" style={{ fontSize: "3rem", color: "var(--primary)", opacity: .4 }}></i>
            <h5 className="fw-bold mt-3 mb-1">Sin proyectos asignados</h5>
            <p className="text-muted small">Contacta con tu líder para que te asigne a un proyecto.</p>
          </div>
        ) : (
          <div className="row g-3">
            {proyectos.map((p) => (
              <div className="col-12 col-md-6 col-lg-4" key={p.id_proyecto}>
                <div className="card border-0 rounded-4 h-100 animate-fadeIn"
                  style={{ boxShadow: "var(--shadow-md)", transition: "transform .2s, box-shadow .2s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "var(--shadow-lg)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "var(--shadow-md)"; }}>
                  <div style={{ height: 4, background: "linear-gradient(90deg, var(--primary), var(--accent))", borderRadius: "12px 12px 0 0" }}></div>
                  <div className="card-body p-4">
                    <div className="d-flex align-items-start gap-3 mb-3">
                      <div className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                        style={{ width: 40, height: 40, background: "rgba(79,70,229,.1)" }}>
                        <i className="bi bi-kanban-fill" style={{ color: "var(--primary)", fontSize: 18 }}></i>
                      </div>
                      <div className="flex-grow-1">
                        <h6 className="fw-bold mb-0">{p.nombre}</h6>
                        {p.servicio_nombre && (
                          <span className="badge rounded-pill mt-1"
                            style={{ fontSize: 10, background: "rgba(6,182,212,.1)", color: "#0891B2" }}>
                            {p.servicio_nombre}
                          </span>
                        )}
                      </div>
                    </div>
                    {p.descripcion && (
                      <p className="text-muted small mb-3" style={{ lineHeight: 1.5 }}>
                        {p.descripcion.slice(0, 100)}{p.descripcion.length > 100 ? "…" : ""}
                      </p>
                    )}
                    {p.lider_nombre && (
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <i className="bi bi-star-fill" style={{ color: "#D97706", fontSize: 11 }}></i>
                        <span className="small text-muted">Líder: <strong>{p.lider_nombre}</strong></span>
                      </div>
                    )}
                    <div className="d-flex flex-wrap gap-2 mt-2">
                      {p.horas_estimadas && (
                        <span className="badge rounded-pill" style={{ fontSize: 11, background: "rgba(79,70,229,.08)", color: "var(--primary)" }}>
                          <i className="bi bi-clock me-1"></i>{p.horas_estimadas}h
                        </span>
                      )}
                      {p.fecha_inicio && (
                        <span className="badge rounded-pill" style={{ fontSize: 11, background: "rgba(16,185,129,.08)", color: "#059669" }}>
                          <i className="bi bi-calendar me-1"></i>{p.fecha_inicio.slice(0, 10)}
                        </span>
                      )}
                    </div>
                    <div className="mt-3 pt-3" style={{ borderTop: "1px solid rgba(79,70,229,.08)" }}>
                      <button
                        className="btn btn-sm btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
                        onClick={() => setHorasProyecto(p)}
                      >
                        <i className="bi bi-clock-history"></i>
                        Registrar Horas
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {horasProyecto !== null && (
        <HorasForm
          proyectoPreseleccionado={horasProyecto?.id_proyecto || null}
          onSaved={() => setHorasProyecto(null)}
          onCancel={() => setHorasProyecto(null)}
        />
      )}
    </Layout>
  );
};

/* ── Entry point ─────────────────────────────── */
const ProyectoList = () => {
  const { user } = useAuth();
  const rol = user?.rol;
  if (rol === "propietario") return <PropietarioView />;
  if (rol === "lider") return <LiderView />;
  return <EmpleadoView />;
};

export default ProyectoList;
