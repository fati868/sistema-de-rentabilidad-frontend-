import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import api from '../../services/api'; // Importamos la instancia de Axios

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [error, setError] = useState(''); // Estado para manejar errores

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Limpiamos errores previos

    if (!formData.email || !formData.password) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    try {
      // Llamada al backend
      const response = await api.post('/auth/login', formData);
      
      // Si el login es exitoso
      console.log("Login exitoso:", response.data);
      alert("¡Inicio de sesión exitoso!");
      
      // Aquí podrías guardar el token, por ejemplo:
      // localStorage.setItem('token', response.data.token);
      
    } catch (err) {
      // Manejo de errores (credenciales incorrectas, servidor caído, etc.)
      console.error("Error al iniciar sesión:", err);
      setError(err.response?.data?.message || "Error al conectar con el servidor.");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow-sm" style={{ width: '100%', maxWidth: '400px' }}>
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
                onChange={handleChange} 
                required 
              />
            </div>

            <button type="submit" className="btn btn-primary w-100 mt-2">
              Ingresar
            </button>
          </form>

          <div className="text-center mt-3">
            <a href="/recuperar-password" className="text-decoration-none small text-muted">
              ¿Olvidaste tu contraseña?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;