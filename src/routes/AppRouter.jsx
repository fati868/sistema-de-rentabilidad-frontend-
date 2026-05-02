import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import EmpresaList from "../pages/empresa/EmpresaList";
import Dashboard from "../pages/dashboard/Dashboard";
import EmpresaConfig from "../pages/empresa/EmpresaConfig";
import UsuarioList from "../pages/usuarios/UsuarioList";

export default function AppRouter() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <Routes>
      <Route
        path="/"
        element={
          token ? (
            // Si es admin va a empresas, si es dueño va al dashboard[cite: 1]
            user?.rol === "admin" ? <Navigate to="/empresas" /> : <Navigate to="/dashboard" />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      
      {/* Rutas Públicas */}
      <Route path="/login" element={<Login />} />
      
      {/* Rutas de Admin */}
      <Route path="/empresas" element={<EmpresaList />} />
      
      {/* Rutas de Propietario / Comunes */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/empresa-config" element={<EmpresaConfig />} />
      <Route path="/usuarios" element={<UsuarioList />} />
      
      <Route path="*" element={<h2>Página no encontrada</h2>} />
    </Routes>
  );
}