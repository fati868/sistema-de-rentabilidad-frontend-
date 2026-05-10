import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import { useAuth } from "../../context/AuthContext";
import { getProyectoById } from "../../services/proyectoService";
import { desactivarNota, getNotasByProyecto } from "../../services/notaService";
import NotasForm from "./NotasForm";

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value).slice(0, 10);
  return date.toLocaleDateString("es-PE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

const ConfirmModal = ({ nota, onConfirm, onCancel }) => (
  <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onCancel()}>
    <div className="modal-card p-4 animate-scaleIn" style={{ maxWidth: 420 }}>
      <div className="d-flex align-items-start gap-3 mb-4">
        <div className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 44, height: 44, background: "rgba(239,68,68,.1)" }}>
          <i className="bi bi-trash-fill" style={{ color: "var(--danger)", fontSize: 20 }}></i>
        </div>
        <div>
          <h6 className="fw-bold mb-1">Eliminar nota</h6>
          <p className="text-muted small mb-0">
            ¿Deseas eliminar esta nota? Se ocultará del proyecto.
          </p>
        </div>
      </div>
      <div className="d-flex gap-2">
        <button className="btn btn-light flex-fill fw-semibold" onClick={onCancel}>Cancelar</button>
        <button className="btn btn-danger flex-fill fw-bold" onClick={() => onConfirm(nota)}>
          <i className="bi bi-trash-fill me-2"></i>Eliminar
        </button>
      </div>
    </div>
  </div>
);

const NotasLists = ({ proyectoId: proyectoIdProp, embedded = false, onClose }) => {
  const params = useParams();
  const { user } = useAuth();
  const proyectoId = proyectoIdProp || params.proyectoId || params.id;
  const canManage = user?.rol === "lider";

  const [proyecto, setProyecto] = useState(null);
  const [notas, setNotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingNota, setEditingNota] = useState(null);
  const [search, setSearch] = useState("");
  const [confirm, setConfirm] = useState(null);
  const canCreate = canManage && (!proyecto || Number(proyecto.id_lider) === Number(user?.id_usuario));

  const fetchNotas = useCallback(async () => {
    if (!proyectoId) {
      setLoading(false);
      setError("Selecciona un proyecto para ver sus notas.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = await getNotasByProyecto(proyectoId);
      if (response?.success) setNotas(Array.isArray(response.data) ? response.data : []);
      else setError(response?.message || "No se pudieron cargar las notas.");
    } catch (err) {
      setError(err.response?.data?.message || "Error al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  }, [proyectoId]);

  useEffect(() => {
    fetchNotas();
  }, [fetchNotas]);

  useEffect(() => {
    if (!proyectoId) return;
    getProyectoById(proyectoId)
      .then((res) => {
        if (res?.success) setProyecto(res.data);
      })
      .catch(() => {});
  }, [proyectoId]);

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return notas.filter((nota) =>
      nota.descripcion.toLowerCase().includes(term) ||
      (nota.nombre_lider || "").toLowerCase().includes(term)
    );
  }, [notas, search]);

  const handleSaved = () => {
    setShowForm(false);
    setEditingNota(null);
    fetchNotas();
  };

  const handleDelete = async (nota) => {
    if (!nota) return;

    try {
      await desactivarNota(nota.id_nota);
      await fetchNotas();
    } catch (err) {
      setError(err.response?.data?.message || "No se pudo eliminar la nota.");
    } finally {
      setConfirm(null);
    }
  };

  const content = (
    <div className="animate-fadeInUp">
      <div className="page-header d-flex justify-content-between align-items-start flex-wrap gap-3">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            {!embedded && (
              <Link to="/proyectos" className="btn btn-sm btn-light rounded-3" title="Volver a proyectos">
                <i className="bi bi-arrow-left"></i>
              </Link>
            )}
            <h2 className="fw-bold mb-0">Notas del proyecto</h2>
          </div>
          <p className="text-muted small mb-0">
            {proyecto?.nombre ? `Seguimiento y observaciones de ${proyecto.nombre}` : "Seguimiento y observaciones del proyecto"}
          </p>
        </div>

        <div className="d-flex gap-2 flex-wrap">
          {embedded && onClose && (
            <button className="btn btn-light d-flex align-items-center gap-2 px-3" onClick={onClose}>
              <i className="bi bi-x-lg"></i>
              Cerrar
            </button>
          )}
          {canCreate && (
            <button
              className="btn btn-primary d-flex align-items-center gap-2 px-4"
              onClick={() => { setEditingNota(null); setShowForm(true); }}
              disabled={!proyectoId}
            >
              <i className="bi bi-plus-circle-fill"></i>
              Nueva Nota
            </button>
          )}
        </div>
      </div>

      <div className="row g-3 mb-4 stagger">
        {[
          { label: "Total notas", value: notas.length, icon: "bi-journal-text", color: "var(--primary)", bg: "rgba(79,70,229,.1)" },
          { label: "Registradas por", value: new Set(notas.map((nota) => nota.id_lider)).size, icon: "bi-person-lines-fill", color: "var(--accent)", bg: "rgba(6,182,212,.1)" },
          { label: "Activas", value: notas.filter((nota) => nota.is_active).length, icon: "bi-check-circle-fill", color: "var(--success)", bg: "rgba(16,185,129,.1)" },
        ].map((stat, index) => (
          <div className="col-12 col-sm-4" key={index}>
            <div className="stat-card card-3d animate-fadeInUp">
              <div className="stat-card__glow" style={{ background: stat.color }}></div>
              <div className="d-flex align-items-center gap-3">
                <div className="rounded-3 d-flex align-items-center justify-content-center" style={{ width: 44, height: 44, background: stat.bg }}>
                  <i className={`bi ${stat.icon}`} style={{ color: stat.color, fontSize: 20 }}></i>
                </div>
                <div>
                  <p className="text-muted small mb-0">{stat.label}</p>
                  <h4 className="fw-bold mb-0" style={{ color: stat.color }}>{stat.value}</h4>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <NotasForm
          nota={editingNota}
          proyectoId={proyectoId}
          onSaved={handleSaved}
          onCancel={() => { setShowForm(false); setEditingNota(null); }}
        />
      )}

      <div className="mb-3">
        <div className="input-group" style={{ maxWidth: 360 }}>
          <span className="input-group-text bg-white border-end-0">
            <i className="bi bi-search text-muted"></i>
          </span>
          <input
            type="text"
            className="form-control border-start-0 ps-0"
            placeholder="Buscar nota..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
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
                <th>Nota</th>
                <th>Líder</th>
                <th>Fecha</th>
                {canManage && <th className="text-end">Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: canManage ? 5 : 4 }).map((_, j) => (
                      <td key={j}><div className="skeleton rounded" style={{ height: 20, width: "80%" }}></div></td>
                    ))}
                  </tr>
                ))
              ) : filtered.length > 0 ? (
                filtered.map((nota) => (
                  <tr key={nota.id_nota} className="animate-fadeIn">
                    <td className="text-muted fw-bold">#{nota.id_nota}</td>
                    <td style={{ minWidth: 280 }}>
                      <div className="d-flex align-items-start gap-2">
                        <div className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 32, height: 32, background: "rgba(79,70,229,.1)" }}>
                          <i className="bi bi-journal-text" style={{ color: "var(--primary)", fontSize: 14 }}></i>
                        </div>
                        <span className="text-muted small" style={{ whiteSpace: "pre-wrap", lineHeight: 1.5 }}>
                          {nota.descripcion}
                        </span>
                      </div>
                    </td>
                    <td className="text-muted small">{nota.nombre_lider || "-"}</td>
                    <td className="text-muted small">{formatDate(nota.fecha)}</td>
                    {canManage && (
                      <td className="text-end">
                        {Number(nota.id_lider) === Number(user?.id_usuario) && (
                          <div className="d-flex gap-2 justify-content-end">
                            <button
                              className="btn btn-sm btn-success"
                              title="Editar"
                              onClick={() => { setEditingNota(nota); setShowForm(true); }}
                            >
                              <i className="bi bi-pencil-square"></i>
                            </button>
                            <button className="btn btn-sm btn-danger" title="Eliminar" onClick={() => setConfirm(nota)}>
                              <i className="bi bi-trash-fill"></i>
                            </button>
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={canManage ? 5 : 4}>
                    <div className="empty-state">
                      <i className="bi bi-journal-text"></i>
                      <h6>Sin notas</h6>
                      <p>{canManage ? "Registra la primera nota del proyecto con el botón de arriba." : "Este proyecto aún no tiene notas registradas."}</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {confirm && (
        <ConfirmModal nota={confirm} onConfirm={handleDelete} onCancel={() => setConfirm(null)} />
      )}
    </div>
  );

  if (embedded) return content;

  return <Layout>{content}</Layout>;
};

export default NotasLists;
