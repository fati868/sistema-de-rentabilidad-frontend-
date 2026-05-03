import React, { useState, useEffect, useCallback } from "react";
import Layout from "../../components/layout/Layout";
import ServicioForm from "./ServicioForm";
import { getServicios, desactivarServicio, eliminarServicio } from "../../services/servicioService";

/* ── Modal de confirmación ──────────────────────── */
const ConfirmModal = ({ title, message, onConfirm, onCancel, danger = false }) => (
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
          {danger ? <><i className="bi bi-trash-fill me-2"></i>Eliminar</> : <><i className="bi bi-slash-circle me-2"></i>Desactivar</>}
        </button>
      </div>
    </div>
  </div>
);

const ServicioList = () => {
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [showForm, setShowForm]   = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch]       = useState("");
  const [confirm, setConfirm]     = useState(null); // { type: 'deactivate'|'delete', servicio }

  const fetchServicios = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getServicios();
      if (response.success) setServicios(response.data);
      else setError("No se pudo cargar la lista de servicios.");
    } catch {
      setError("Error al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchServicios(); }, [fetchServicios]);

  const handleSaved       = () => { setShowForm(false); setEditingId(null); fetchServicios(); };
  const handleEdit        = (id) => { setEditingId(id); setShowForm(true); };

  const handleConfirmAction = async () => {
    if (!confirm) return;
    try {
      if (confirm.type === "deactivate") await desactivarServicio(confirm.servicio.id_servicio);
      else await eliminarServicio(confirm.servicio.id_servicio);
      fetchServicios();
    } catch (err) {
      alert(err.response?.data?.message || "Error al procesar la acción.");
    } finally {
      setConfirm(null);
    }
  };

  const filtered = servicios.filter((s) =>
    s.nombre.toLowerCase().includes(search.toLowerCase()) ||
    (s.descripcion || "").toLowerCase().includes(search.toLowerCase())
  );
  const activos = servicios.filter((s) => s.is_active).length;

  return (
    <Layout>
      <div className="animate-fadeInUp">
        {/* Header */}
        <div className="page-header d-flex justify-content-between align-items-start flex-wrap gap-3">
          <div>
            <h2 className="fw-bold mb-1">Gestión de Servicios</h2>
            <p className="text-muted small mb-0">Administra los servicios de tu empresa</p>
          </div>
          <button className="btn btn-primary d-flex align-items-center gap-2 px-4"
            onClick={() => { setEditingId(null); setShowForm(true); }}>
            <i className="bi bi-plus-circle-fill"></i>
            Nuevo Servicio
          </button>
        </div>

        {/* Stats */}
        <div className="row g-3 mb-4 stagger">
          {[
            { label: "Total servicios", value: servicios.length, icon: "bi-briefcase-fill", color: "var(--primary)", bg: "rgba(79,70,229,.1)" },
            { label: "Activos",         value: activos,          icon: "bi-check-circle-fill", color: "var(--success)", bg: "rgba(16,185,129,.1)" },
            { label: "Inactivos",       value: servicios.length - activos, icon: "bi-x-circle-fill", color: "var(--danger)", bg: "rgba(239,68,68,.1)" },
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

        {showForm && (
          <ServicioForm
            servicioId={editingId}
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
              placeholder="Buscar servicio..."
              value={search} onChange={(e) => setSearch(e.target.value)} />
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
                  <th>#</th>
                  <th>Servicio</th>
                  <th>Descripción</th>
                  <th>Estado</th>
                  <th className="text-end">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 5 }).map((_, j) => (
                        <td key={j}><div className="skeleton rounded" style={{ height: 20, width: "80%" }}></div></td>
                      ))}
                    </tr>
                  ))
                ) : filtered.length > 0 ? (
                  filtered.map((s) => (
                    <tr key={s.id_servicio} className="animate-fadeIn">
                      <td className="text-muted fw-bold">#{s.id_servicio}</td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <div className="rounded-3 d-flex align-items-center justify-content-center"
                            style={{ width: 32, height: 32, background: "rgba(79,70,229,.1)", flexShrink: 0 }}>
                            <i className="bi bi-briefcase" style={{ color: "var(--primary)", fontSize: 14 }}></i>
                          </div>
                          <span className="fw-semibold">{s.nombre}</span>
                        </div>
                      </td>
                      <td className="text-muted" style={{ maxWidth: 200 }}>
                        <span className="text-truncate d-block">{s.descripcion || "—"}</span>
                      </td>
                      <td>
                        <span className={`badge badge-role ${s.is_active ? "badge-active" : "badge-inactive"}`}>
                          {s.is_active ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td className="text-end">
                        <div className="d-flex gap-2 justify-content-end">
                          <button className="btn btn-sm btn-success" title="Editar" onClick={() => handleEdit(s.id_servicio)}>
                            <i className="bi bi-pencil-square"></i>
                          </button>
                          {s.is_active && (
                            <button className="btn btn-sm btn-warning" title="Desactivar"
                              onClick={() => setConfirm({ type: "deactivate", servicio: s })}>
                              <i className="bi bi-slash-circle"></i>
                            </button>
                          )}
                          <button className="btn btn-sm btn-danger" title="Eliminar permanentemente"
                            onClick={() => setConfirm({ type: "delete", servicio: s })}>
                            <i className="bi bi-trash-fill"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">
                      <div className="empty-state">
                        <i className="bi bi-briefcase"></i>
                        <h6>Sin servicios</h6>
                        <p>Crea el primer servicio con el botón de arriba.</p>
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
          title={confirm.type === "delete" ? "Eliminar servicio" : "Desactivar servicio"}
          message={confirm.type === "delete"
            ? `¿Estás seguro de eliminar permanentemente "${confirm.servicio.nombre}"? Esta acción no se puede deshacer.`
            : `¿Desactivar el servicio "${confirm.servicio.nombre}"?`}
          onConfirm={handleConfirmAction}
          onCancel={() => setConfirm(null)}
        />
      )}
    </Layout>
  );
};

export default ServicioList;
