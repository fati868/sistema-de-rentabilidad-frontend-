import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { login } from "../../services/authService"; // Servicio de login

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState(""); // Estado para manejar errores
  const [loading, setLoading] = useState(false); // Estado para cargar

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    try {
      setLoading(true);

      // Llamada al backend usando el servicio
      const data = await login(formData);

      // Guardar token y usuario en localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      console.log("Login exitoso:", data);
      alert("¡Inicio de sesión exitoso!");

      // Redireccionar a lista de empresas
      window.location.href = "/empresas";
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      setError(
        err.response?.data?.message || "Error al conectar con el servidor.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100 bg-light">
      <div
        className="card p-4 shadow-sm"
        style={{ width: "100%", maxWidth: "400px" }}
      >
        <div className="card-body">
          <h2 className="card-title text-center mb-4">Iniciar Sesión</h2>

          {/* Mostrar mensaje de error si existe */}
          {error && <div className="alert alert-danger small">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Correo electrónico</label>
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="usuario@ejemplo.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Contraseña</label>
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="********"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 mt-2"
              disabled={loading}
            >
              {loading ? "Ingresando..." : "Ingresar"}
            </button>
          </form>

          <div className="text-center mt-3">
            <a
              href="/recuperar-password"
              className="text-decoration-none small text-muted"
            >
              ¿Olvidaste tu contraseña?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
