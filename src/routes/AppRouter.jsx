import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/auth/Login";
import EmpresaList from "../pages/empresa/EmpresaList";

export default function AppRouter() {
  const token = localStorage.getItem("token");

  return (
    <Routes>
      <Route
        path="/"
        element={token ? <Navigate to="/empresas" /> : <Navigate to="/login" />}
      />

      <Route path="/login" element={<Login />} />

      <Route path="/empresas" element={<EmpresaList />} />

      <Route path="*" element={<h2>Página no encontrada</h2>} />
    </Routes>
  );
}