import React, { useState, useEffect, useCallback } from "react";
import Layout from "../../components/layout/Layout";
import UsuarioForm from "./UsuarioForm";
import { useAuth } from "../../context/AuthContext";
import { getUsuarios, deleteUsuario, hardDeleteUsuario } from "../../services/usuarioService";

const ROL_BADGE = { lider: "badge-lider", empleado: "badge-empleado" };
const ROL_LABEL = { lider: "Líder", empleado: "Empleado" };

const UsuarioList = () => {
  const { user } = useAuth();
  const rol = user?.rol;
  const isLider = rol === "lider";

  const [usuarios, setUsuarios]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState("");
  const [showForm, setShowForm]           = useState(false);
  const [editingUsuario, setEditingUsuario] = useState(null);
  const [search, setSearch]               = useState("");
  const [confirmHardDelete, setConfirmHardDelete] = useState(null);

  const fetchUsuarios = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getUsuarios();
      if (response.success) setUsuarios(response.data);
      else setError("No se pudo cargar la lista de usuarios.");
    } catch {
      setError("Error al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsuarios(); }, [fetchUsuarios]);

  const handleSaved = () => { setShowForm(false); setEditingUsuario(null); fetchUsuarios(); };

  const handleEdit = (u) => { setEditingUsuario(u); setShowForm(true); };

  const handleDelete = async (u) => {
    if (!window.confirm(`¿Desactivar al usuario "${u.nombre}"?`)) return;
    try {
      await deleteUsuario(u.id_usuario);
      fetchUsuarios();
    } catch (err) {
      alert(err.response?.data?.message || "Error al desactivar.");
    }
  };

  const handleHardDelete = async () => {
    if (!confirmHardDelete) return;
    try {
      await hardDeleteUsuario(confirmHardDelete.id_usuario);
      fetchUsuarios();
    } catch (err) {
      alert(err.response?.data?.message || "Error al eliminar el usuario.");
    } finally {
      setConfirmHardDelete(null);
    }
  };

  const filtered = usuarios.filter((u) =>
    u.nombre.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const lideres   = usuarios.filter((u) => u.rol === "lider").length;
  const empleados = usuarios.filter((u) => u.rol === "empleado").length;

  const title    = isLider ? "Equipo de mi Empresa" : "Gestión de Usuarios";
  const subtitle = isLider
    ? "Lista de colaboradores de tu empresa (solo lectura)"
    : "Administra los miembros de tu empresa";

  return (
    <Layout>
      <div className="animate-fadeInUp">
        {/* Header */}
        <div className="page-header d-flex justify-content-between align-items-start flex-wrap gap-3">
          <div>
            <h2 className="fw-bold mb-1">{title}</h2>
            <p className="text-muted small mb-0">{subtitle}</p>
          </div>
          {!isLider && (
            <button className="btn btn-primary d-flex align-items-center gap-2 px-4"
              onClick={() => { setEditingUsuario(null); setShowForm(true); }}>
              <i className="bi bi-person-plus-fill"></i>
              Nuevo Usuario
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="row g-3 mb-4 stagger">
          {isLider ? (
            [
              { label: "Colaboradores", value: usuarios.length, icon: "bi-people-fill",  color: "var(--primary)", bg: "rgba(79,70,229,.1)" },
              { label: "Líderes",       value: lideres,          icon: "bi-star-fill",     color: "var(--warning)", bg: "rgba(245,158,11,.1)" },
              { label: "Empleados",     value: empleados,         icon: "bi-person-fill",   color: "var(--success)", bg: "rgba(16,185,129,.1)" },
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
            ))
          ) : (
            [
              { label: "Total colaboradores", value: usuarios.length, icon: "bi-people-fill",  color: "var(--primary)", bg: "rgba(79,70,229,.1)" },
              { label: "Líderes",             value: lideres,         icon: "bi-star-fill",     color: "var(--warning)", bg: "rgba(245,158,11,.1)" },
              { label: "Empleados",           value: empleados,       icon: "bi-person-fill",   color: "var(--success)", bg: "rgba(16,185,129,.1)" },
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
            ))
          )}
        </div>

        {/* Form inline */}
        {showForm && !isLider && (
          <UsuarioForm
            usuario={editingUsuario}
            onCreated={handleSaved}
            onCancel={() => { setShowForm(false); setEditingUsuario(null); }}
          />
        )}

        {confirmHardDelete && (
          <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setConfirmHardDelete(null)}>
            <div className="modal-card p-4 animate-scaleIn" style={{ maxWidth: 420 }}>
              <div className="d-flex align-items-start gap-3 mb-4">
                <div className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{ width: 44, height: 44, background: "rgba(239,68,68,.1)" }}>
                  <i className="bi bi-trash-fill" style={{ color: "var(--danger)", fontSize: 20 }}></i>
                </div>
                <div>
                  <h6 className="fw-bold mb-1">Eliminar usuario permanentemente</h6>
                  <p className="text-muted small mb-0">
                    ¿Estás seguro de eliminar a <strong>{confirmHardDelete.nombre}</strong>?
                    Esta acción <strong>no se puede deshacer</strong> y eliminará también sus registros de horas y asignaciones.
                  </p>
                </div>
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-light flex-fill fw-semibold" onClick={() => setConfirmHardDelete(null)}>Cancelar</button>
                <button className="btn btn-danger flex-fill fw-bold" onClick={handleHardDelete}>
                  <i className="bi bi-trash-fill me-2"></i>Eliminar permanentemente
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="mb-3">
          <div className="input-group" style={{ maxWidth: 360 }}>
            <span className="input-group-text bg-white border-end-0">
              <i className="bi bi-search text-muted"></i>
            </span>
            <input type="text" className="form-control border-start-0 ps-0"
              placeholder="Buscar por nombre o email..."
              value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
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
                  <th>Colaborador</th>
                  <th>Correo</th>
                  <th>Rol</th>
                  {!isLider && <th className="text-end">Acciones</th>}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: isLider ? 3 : 5 }).map((_, j) => (
                        <td key={j}><div className="skeleton rounded" style={{ height: 20, width: "80%" }}></div></td>
                      ))}
                    </tr>
                  ))
                ) : filtered.length > 0 ? (
                  filtered.map((u) => (
                    <tr key={u.id_usuario} className="animate-fadeIn">
                      <td className="text-muted fw-bold">#{u.id_usuario}</td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <div className="avatar" style={{ width: 34, height: 34, fontSize: 12 }}>
                            {u.nombre.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()}
                          </div>
                          <span className="fw-semibold">{u.nombre}</span>
                        </div>
                      </td>
                      <td className="text-muted">{u.email}</td>
                      <td>
                        <span className={`badge badge-role ${ROL_BADGE[u.rol] || "badge-owner"}`}>
                          {ROL_LABEL[u.rol] || u.rol}
                        </span>
                      </td>
                      {!isLider && (
                        <td className="text-end">
                          <div className="d-flex gap-2 justify-content-end">
                            <button className="btn btn-sm btn-success" title="Editar"
                              onClick={() => handleEdit(u)}>
                              <i className="bi bi-pencil-square"></i>
                            </button>
                            <button className="btn btn-sm btn-warning" title="Desactivar"
                              onClick={() => handleDelete(u)}>
                              <i className="bi bi-person-x-fill"></i>
                            </button>
                            <button className="btn btn-sm btn-danger" title="Eliminar permanentemente"
                              onClick={() => setConfirmHardDelete(u)}>
                              <i className="bi bi-trash-fill"></i>
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={isLider ? 4 : 5}>
                      <div className="empty-state">
                        <i className="bi bi-people"></i>
                        <h6>{isLider ? "Sin empleados" : "Sin usuarios"}</h6>
                        <p>{isLider
                          ? "No hay empleados registrados en tu empresa."
                          : "Crea el primer usuario con el botón de arriba."}</p>
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

export default UsuarioList;
