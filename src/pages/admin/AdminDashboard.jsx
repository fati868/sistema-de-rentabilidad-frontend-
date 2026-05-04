import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import { useAuth } from "../../context/AuthContext";
import { getEmpresas } from "../../services/empresaService";
import { getUsuarios } from "../../services/usuarioService";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [empresas, setEmpresas] = useState([]);
  const [owners, setOwners]     = useState([]);
  const [loading, setLoading]   = useState(true);

  const hora = new Date().getHours();
  const saludo = hora < 12 ? "Buenos días" : hora < 18 ? "Buenas tardes" : "Buenas noches";

  const fetchData = useCallback(async () => {
    try {
      const [empRes, ownerRes] = await Promise.all([
        getEmpresas(),
        getUsuarios().catch(() => ({ data: [] })),
      ]);
      if (empRes?.success) setEmpresas(empRes.data);
      setOwners(ownerRes?.data || []);
    } catch {/* silent */}
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const conOwner    = empresas.filter((e) => owners.some((o) => o.id_empresa === e.id_empresa));
  const sinOwner    = empresas.filter((e) => !owners.some((o) => o.id_empresa === e.id_empresa));
  const ownersActivos = owners.filter((o) => o.is_active);

  const stats = [
    { label: "Empresas registradas",   value: loading ? "…" : empresas.length,      icon: "bi-building-fill",      color: "#4F46E5", bg: "rgba(79,70,229,.1)",  to: "/empresas" },
    { label: "Propietarios activos",   value: loading ? "…" : ownersActivos.length,  icon: "bi-person-check-fill",  color: "#10B981", bg: "rgba(16,185,129,.1)", to: "/usuarios" },
    { label: "Empresas con propietario", value: loading ? "…" : conOwner.length,     icon: "bi-link-45deg",         color: "#06B6D4", bg: "rgba(6,182,212,.1)",  to: "/empresas" },
    { label: "Sin propietario",        value: loading ? "…" : sinOwner.length,       icon: "bi-exclamation-circle", color: "#F59E0B", bg: "rgba(245,158,11,.1)", to: "/empresas" },
  ];

  return (
    <Layout>
      <div className="animate-fadeInUp">
        {/* Header */}
        <div className="page-header">
          <h2 className="fw-bold mb-1">{saludo}, {user?.nombre?.split(" ")[0]} 👋</h2>
          <p className="text-muted small mb-0">Panel de administración del sistema</p>
        </div>

        {/* Stats */}
        <div className="row g-3 mb-4 stagger">
          {stats.map((s, i) => (
            <div className="col-6 col-lg-3" key={i}>
              <Link to={s.to || "#"} className="text-decoration-none">
                <div className="stat-card card-3d animate-fadeInUp" style={{ position: "relative", overflow: "hidden", cursor: s.to ? "pointer" : "default" }}>
                  <div className="stat-card__glow" style={{ background: s.color }}></div>
                  <div className="d-flex align-items-center gap-3">
                    <div className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                      style={{ width: 48, height: 48, background: s.bg }}>
                      <i className={`bi ${s.icon}`} style={{ color: s.color, fontSize: 22 }}></i>
                    </div>
                    <div>
                      <p className="text-muted small mb-0">{s.label}</p>
                      <h3 className="fw-bold mb-0" style={{ color: s.color }}>{s.value}</h3>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        <div className="row g-4">
          {/* Empresas recientes */}
          <div className="col-12 col-lg-6">
            <div className="card border-0 rounded-4 h-100" style={{ boxShadow: "var(--shadow-md)" }}>
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="fw-bold mb-0">Empresas del sistema</h6>
                  <Link to="/empresas" className="btn btn-sm btn-light rounded-3 fw-semibold" style={{ fontSize: 12 }}>
                    Ver todas <i className="bi bi-arrow-right ms-1"></i>
                  </Link>
                </div>
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="skeleton rounded-3 mb-2" style={{ height: 42 }}></div>
                  ))
                ) : empresas.length === 0 ? (
                  <div className="empty-state py-4">
                    <i className="bi bi-building" style={{ fontSize: "2rem" }}></i>
                    <p>No hay empresas registradas</p>
                  </div>
                ) : (
                  empresas.slice(0, 5).map((e) => {
                    const owner = e.propietario_nombre;
                    return (
                      <div key={e.id_empresa}
                        className="d-flex align-items-center justify-content-between p-2 rounded-3 mb-1"
                        style={{ background: "rgba(79,70,229,.03)", transition: "background .2s" }}
                        onMouseEnter={(ev) => ev.currentTarget.style.background = "rgba(79,70,229,.07)"}
                        onMouseLeave={(ev) => ev.currentTarget.style.background = "rgba(79,70,229,.03)"}
                      >
                        <div className="d-flex align-items-center gap-2">
                          <div className="rounded-2 d-flex align-items-center justify-content-center flex-shrink-0"
                            style={{ width: 30, height: 30, background: "rgba(79,70,229,.1)" }}>
                            <i className="bi bi-building-fill" style={{ color: "#4F46E5", fontSize: 13 }}></i>
                          </div>
                          <div>
                            <p className="fw-semibold mb-0" style={{ fontSize: 13 }}>{e.empresa_nombre}</p>
                            {owner
                              ? <p className="text-muted mb-0" style={{ fontSize: 11 }}>{owner}</p>
                              : <p className="mb-0" style={{ fontSize: 11, color: "#F59E0B" }}>Sin propietario</p>
                            }
                          </div>
                        </div>
                        <span className="badge badge-role" style={{ fontSize: 10, background: owner ? "rgba(16,185,129,.1)" : "rgba(245,158,11,.1)", color: owner ? "#059669" : "#D97706" }}>
                          {owner ? "Con propietario" : "Vacante"}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Propietarios recientes */}
          <div className="col-12 col-lg-6">
            <div className="card border-0 rounded-4 h-100" style={{ boxShadow: "var(--shadow-md)" }}>
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="fw-bold mb-0">Propietarios registrados</h6>
                  <Link to="/usuarios" className="btn btn-sm btn-light rounded-3 fw-semibold" style={{ fontSize: 12 }}>
                    Ver todos <i className="bi bi-arrow-right ms-1"></i>
                  </Link>
                </div>
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="skeleton rounded-3 mb-2" style={{ height: 42 }}></div>
                  ))
                ) : owners.length === 0 ? (
                  <div className="empty-state py-4">
                    <i className="bi bi-people" style={{ fontSize: "2rem" }}></i>
                    <p>No hay propietarios registrados</p>
                  </div>
                ) : (
                  owners.slice(0, 5).map((o) => (
                    <div key={o.id_usuario}
                      className="d-flex align-items-center justify-content-between p-2 rounded-3 mb-1"
                      style={{ background: "rgba(16,185,129,.03)", transition: "background .2s" }}
                      onMouseEnter={(ev) => ev.currentTarget.style.background = "rgba(16,185,129,.07)"}
                      onMouseLeave={(ev) => ev.currentTarget.style.background = "rgba(16,185,129,.03)"}
                    >
                      <div className="d-flex align-items-center gap-2">
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                          style={{ width: 30, height: 30, background: "linear-gradient(135deg,#4F46E5,#06B6D4)", fontSize: 11, fontWeight: 700, color: "#fff" }}
                        >
                          {o.nombre.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()}
                        </div>
                        <div>
                          <p className="fw-semibold mb-0" style={{ fontSize: 13 }}>{o.nombre}</p>
                          <p className="text-muted mb-0" style={{ fontSize: 11 }}>{o.empresa_nombre || "Sin empresa"}</p>
                        </div>
                      </div>
                      <span className={`badge badge-role ${o.is_active ? "badge-active" : "badge-inactive"}`} style={{ fontSize: 10 }}>
                        {o.is_active ? "Activo" : "Inactivo"}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Acciones rápidas */}
        <div className="row g-3 mt-1">
          {[
            { href: "/empresas", icon: "bi-building-add", label: "Crear empresa", color: "#4F46E5", bg: "rgba(79,70,229,.08)" },
            { href: "/usuarios", icon: "bi-person-plus-fill", label: "Nuevo propietario", color: "#10B981", bg: "rgba(16,185,129,.08)" },
          ].map((a, i) => (
            <div className="col-12 col-sm-6" key={i}>
              <Link to={a.href}
                className="card border-0 rounded-4 p-3 d-flex flex-row align-items-center gap-3 text-decoration-none card-3d"
                style={{ boxShadow: "var(--shadow-sm)", background: a.bg, transition: "var(--transition)" }}>
                <div className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{ width: 40, height: 40, background: a.bg }}>
                  <i className={`bi ${a.icon}`} style={{ color: a.color, fontSize: 20 }}></i>
                </div>
                <span className="fw-semibold" style={{ color: a.color }}>{a.label}</span>
                <i className="bi bi-arrow-right ms-auto" style={{ color: a.color, opacity: .6 }}></i>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
