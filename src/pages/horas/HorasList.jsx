import React, { useState, useEffect, useCallback } from "react";
import Layout from "../../components/layout/Layout";
import { getHorasByLider } from "../../services/horasService";

const HorasList = () => {
  const [horas, setHoras]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const [search, setSearch]   = useState("");
  const [filterProyecto, setFilterProyecto] = useState("");

  const fetchHoras = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getHorasByLider();
      if (res.success) setHoras(res.data);
      else setError("No se pudo cargar el reporte.");
    } catch {
      setError("Error al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchHoras(); }, [fetchHoras]);

  const proyectosUnicos = [...new Map(horas.map((h) => [h.id_proyecto, h.proyecto_nombre])).entries()];

  const filtered = horas.filter((h) => {
    const matchSearch =
      h.empleado_nombre.toLowerCase().includes(search.toLowerCase()) ||
      h.proyecto_nombre.toLowerCase().includes(search.toLowerCase()) ||
      (h.descripcion || "").toLowerCase().includes(search.toLowerCase());
    const matchProyecto = !filterProyecto || String(h.id_proyecto) === filterProyecto;
    return matchSearch && matchProyecto;
  });

  const totalHoras = filtered.reduce((acc, h) => acc + Number(h.horas || 0), 0);

  return (
    <Layout>
      <div className="animate-fadeInUp">
        {/* Header */}
        <div className="page-header d-flex justify-content-between align-items-start flex-wrap gap-3">
          <div>
            <h2 className="fw-bold mb-1">Reporte de Horas</h2>
            <p className="text-muted small mb-0">Horas registradas por los empleados en tus proyectos</p>
          </div>
          <div
            className="d-flex align-items-center gap-2 rounded-3 px-3 py-2"
            style={{ background: "rgba(79,70,229,.08)" }}
          >
            <i className="bi bi-clock-fill" style={{ color: "var(--primary)" }}></i>
            <span className="fw-bold" style={{ color: "var(--primary)" }}>{totalHoras.toFixed(1)}h</span>
            <span className="text-muted small">total filtrado</span>
          </div>
        </div>

        {/* Stats */}
        <div className="row g-3 mb-4 stagger">
          {[
            { label: "Total registros", value: horas.length,  icon: "bi-list-check",       color: "var(--primary)", bg: "rgba(79,70,229,.1)" },
            { label: "Total horas",     value: `${horas.reduce((a, h) => a + Number(h.horas || 0), 0).toFixed(1)}h`, icon: "bi-clock-fill", color: "var(--accent)", bg: "rgba(6,182,212,.1)" },
            { label: "Proyectos",       value: proyectosUnicos.length, icon: "bi-kanban-fill", color: "var(--success)", bg: "rgba(16,185,129,.1)" },
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

        {/* Filtros */}
        <div className="d-flex flex-wrap gap-3 mb-3">
          <div className="input-group" style={{ maxWidth: 300 }}>
            <span className="input-group-text bg-white border-end-0">
              <i className="bi bi-search text-muted"></i>
            </span>
            <input type="text" className="form-control border-start-0 ps-0"
              placeholder="Buscar empleado, proyecto..."
              value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select
            className="form-select"
            style={{ maxWidth: 220 }}
            value={filterProyecto}
            onChange={(e) => setFilterProyecto(e.target.value)}
          >
            <option value="">— Todos los proyectos —</option>
            {proyectosUnicos.map(([id, nombre]) => (
              <option key={id} value={String(id)}>{nombre}</option>
            ))}
          </select>
        </div>

        {error && (
          <div className="alert alert-danger d-flex align-items-center small rounded-3">
            <i className="bi bi-exclamation-circle-fill me-2"></i>{error}
          </div>
        )}

        {/* Table */}
        <div className="card border-0 rounded-4 overflow-hidden" style={{ boxShadow: "var(--shadow-md)" }}>
          <div className="table-responsive">
            <table className="table table-modern mb-0">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Empleado</th>
                  <th>Proyecto</th>
                  <th>Fecha</th>
                  <th>Horas</th>
                  <th>Descripción</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>{Array.from({ length: 6 }).map((_, j) => (
                      <td key={j}><div className="skeleton rounded" style={{ height: 20, width: "80%" }}></div></td>
                    ))}</tr>
                  ))
                ) : filtered.length > 0 ? (
                  filtered.map((h) => (
                    <tr key={h.id_registro} className="animate-fadeIn">
                      <td className="text-muted fw-bold">#{h.id_registro}</td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <div className="avatar" style={{ width: 30, height: 30, fontSize: 11 }}>
                            {h.empleado_nombre.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()}
                          </div>
                          <span className="fw-semibold small">{h.empleado_nombre}</span>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-role badge-lider small">{h.proyecto_nombre}</span>
                      </td>
                      <td className="text-muted small">
                        {h.fecha ? new Date(h.fecha).toLocaleDateString("es-AR") : "—"}
                      </td>
                      <td>
                        <span className="fw-bold" style={{ color: "var(--primary)" }}>
                          {Number(h.horas).toFixed(1)}h
                        </span>
                      </td>
                      <td className="text-muted small" style={{ maxWidth: 250 }}>
                        <span className="text-truncate d-block">{h.descripcion || "—"}</span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">
                      <div className="empty-state">
                        <i className="bi bi-clock-history"></i>
                        <h6>Sin registros de horas</h6>
                        <p>Cuando los empleados registren horas, aparecerán aquí.</p>
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

export default HorasList;
