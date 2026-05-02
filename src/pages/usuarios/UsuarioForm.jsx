import React, { useEffect, useState } from "react";
import { createUsuario } from "../../services/usuarioService";
import { getEmpresas } from "../../services/empresaService";

const UsuarioForm = ({ show, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    id_empresa: "",
  });

  const [empresas, setEmpresas] = useState([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [loadingEmpresas, setLoadingEmpresas] = useState(false);

  useEffect(() => {
    const fetchEmpresas = async () => {
      if (!show) return;

      try {
        setLoadingEmpresas(true);

        const response = await getEmpresas();
        if (response.success) {
          setEmpresas(response.data);
        }
      } catch (err) {
        console.error("Error al cargar empresas:", err);
      } finally {
        setLoadingEmpresas(false);
      }
    };

    fetchEmpresas();
  }, [show]);

  if (!show) return null;

  const handleClose = () => {
    setFormData({
      nombre: "",
      email: "",
      password: "",
      id_empresa: "",
    });
    setError("");
    onClose();
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !formData.nombre.trim() ||
      !formData.email.trim() ||
      !formData.password.trim() ||
      !formData.id_empresa
    ) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    try {
      setSaving(true);

      const response = await createUsuario({
        ...formData,
        id_empresa: Number(formData.id_empresa),
      });

      if (!response.success) {
        setError("No se pudo crear el usuario.");
        return;
      }

      if (onSuccess) onSuccess();
      handleClose();
    } catch (err) {
      console.error("Error al crear usuario:", err);

      if (err.response?.data?.errors) {
        setError(err.response.data.errors[0].msg);
      } else {
        setError(err.response?.data?.message || "Error al crear usuario.");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="modal d-block" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Crear Usuario Propietario</h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleClose}
                disabled={saving}
              ></button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {error && (
                  <div className="alert alert-danger small">{error}</div>
                )}

                <div className="mb-3">
                  <label className="form-label">Nombre</label>
                  <input
                    type="text"
                    name="nombre"
                    className="form-control"
                    value={formData.nombre}
                    onChange={handleChange}
                    disabled={saving}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={saving}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Contraseña</label>
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={saving}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Empresa</label>
                  <select
                    name="id_empresa"
                    className="form-select"
                    value={formData.id_empresa}
                    onChange={handleChange}
                    disabled={saving || loadingEmpresas}
                  >
                    <option value="">Seleccione una empresa</option>

                    {empresas.map((empresa) => (
                      <option
                        key={empresa.id_empresa}
                        value={empresa.id_empresa}
                      >
                        {empresa.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleClose}
                  disabled={saving}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                >
                  {saving ? "Guardando..." : "Crear Usuario"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="modal-backdrop fade show"></div>
    </>
  );
};

export default UsuarioForm;