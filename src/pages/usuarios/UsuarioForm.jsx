import React, { useEffect, useState } from "react";
import Modal from "../../components/ui/Modal";
import { createUsuario } from "../../services/usuarioService";
import { getEmpresas } from "../../services/empresaService";

const UsuarioForm = ({ show, onClose, onSuccess }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const rolUsuarioLogueado = user?.rol;

  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    id_empresa: "",
    rol: "",
    monto: "",
    tipo_pago: "",
  });

  const [empresas, setEmpresas] = useState([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [loadingEmpresas, setLoadingEmpresas] = useState(false);

  // Reset cuando se abre modal
  useEffect(() => {
    if (show) {
      setFormData({
        nombre: "",
        email: "",
        password: "",
        id_empresa: "",
        rol: "",
        monto: "",
        tipo_pago: "",
      });
      setError("");
    }
  }, [show]);

  // Cargar empresas solo si es admin
  useEffect(() => {
    const fetchEmpresas = async () => {
      if (!show) return;
      if (rolUsuarioLogueado !== "admin") return;

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
  }, [show, rolUsuarioLogueado]);

  const handleClose = () => {
    setFormData({
      nombre: "",
      email: "",
      password: "",
      id_empresa: "",
      rol: "",
      monto: "",
      tipo_pago: "",
    });
    setError("");
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,

      // Si cambia el rol y ya no es empleado, limpiar campos de pago
      ...(name === "rol" && value !== "empleado"
        ? { monto: "", tipo_pago: "" }
        : {}),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validaciones generales
    if (
      !formData.nombre.trim() ||
      !formData.email.trim() ||
      !formData.password.trim()
    ) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    // Admin debe elegir empresa
    if (rolUsuarioLogueado === "admin" && !formData.id_empresa) {
      setError("Debe seleccionar una empresa.");
      return;
    }

    // Propietario debe elegir rol
    if (rolUsuarioLogueado === "propietario" && !formData.rol) {
      setError("Debe seleccionar un rol.");
      return;
    }

    // Si es empleado, monto y tipo_pago son obligatorios
    if (formData.rol === "empleado") {
      if (!formData.monto || !formData.tipo_pago) {
        setError("Debe ingresar monto y tipo de pago para empleados.");
        return;
      }
    }

    try {
      setSaving(true);

      let payload = {
        nombre: formData.nombre,
        email: formData.email,
        password: formData.password,
      };

      // Admin crea propietarios
      if (rolUsuarioLogueado === "admin") {
        payload.rol = "propietario";
        payload.id_empresa = Number(formData.id_empresa);
      }

      // Propietario crea líder o empleado
      if (rolUsuarioLogueado === "propietario") {
        payload.rol = formData.rol;

        if (formData.rol === "empleado") {
          payload.monto = Number(formData.monto);
          payload.tipo_pago = formData.tipo_pago;
        }
      }

      const response = await createUsuario(payload);

      if (!response.success) {
        if (response.errors && response.errors.length > 0) {
          setError(response.errors[0].msg);
        } else {
          setError("No se pudo crear el usuario.");
        }
        return;
      }

      onSuccess();
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
    <Modal
      show={show}
      title={
        rolUsuarioLogueado === "admin"
          ? "Crear Usuario Propietario"
          : "Crear Usuario"
      }
      onClose={handleClose}
      footer={
        <>
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
            form="usuarioForm"
            className="btn btn-primary"
            disabled={saving}
          >
            {saving ? "Guardando..." : "Crear Usuario"}
          </button>
        </>
      }
    >
      {error && <div className="alert alert-danger small">{error}</div>}

      <form id="usuarioForm" onSubmit={handleSubmit}>
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

        {/* ADMIN: elegir empresa */}
        {rolUsuarioLogueado === "admin" && (
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
                <option key={empresa.id_empresa} value={empresa.id_empresa}>
                  {empresa.empresa_nombre}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* PROPIETARIO: elegir rol */}
        {rolUsuarioLogueado === "propietario" && (
          <div className="mb-3">
            <label className="form-label">Rol</label>
            <select
              name="rol"
              className="form-select"
              value={formData.rol}
              onChange={handleChange}
              disabled={saving}
            >
              <option value="">Seleccione un rol</option>
              <option value="lider">Líder</option>
              <option value="empleado">Empleado</option>
            </select>
          </div>
        )}

        {/* SOLO SI ES EMPLEADO */}
        {formData.rol === "empleado" && (
          <>
            <div className="mb-3">
              <label className="form-label">Monto</label>
              <input
                type="number"
                name="monto"
                className="form-control"
                value={formData.monto}
                onChange={handleChange}
                disabled={saving}
                placeholder="Ej: 1500"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Tipo de pago</label>
              <select
                name="tipo_pago"
                className="form-select"
                value={formData.tipo_pago}
                onChange={handleChange}
                disabled={saving}
              >
                <option value="">Seleccione tipo de pago</option>
                <option value="mensual">Mensual</option>
                <option value="por_hora">Por hora</option>
              </select>
            </div>
          </>
        )}
      </form>
    </Modal>
  );
};

export default UsuarioForm;