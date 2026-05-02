import React, { useState, useEffect } from "react";
import Layout from "../../components/layout/Layout";
import { getUsuarios, deleteUsuario } from "../../services/usuarioService";
import "bootstrap/dist/css/bootstrap.min.css";
import UsuarioForm from "./UsuarioForm";
import CreateButton from "../../components/ui/CreateButton";
import DataTable from "../../components/ui/DataTable";

const columns = [
  {
    header: "ID",
    accessor: "id_usuario",
    className: "ps-4",
    cellClassName: "ps-4 text-primary",
    style: { width: "100px" },
  },
  {
    header: "Nombre",
    accessor: "nombre",
    cellClassName: "fw-medium",
  },
  {
    header: "Email",
    accessor: "email",
    cellClassName: "text-muted",
  },
  {
    header: "Empresa",
    accessor: "empresa_nombre",
    cellClassName: "text-muted",
  },
];

const UsuarioList = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);

  const renderActions = (user) => (
    <>
      <button className="btn btn-sm btn-outline-success px-3 me-2">
        <i className="bi bi-pencil-square"></i>
      </button>

      <button
        className="btn btn-sm btn-outline-danger px-3"
        onClick={() => handleDelete(user.id_usuario)}
      >
        <i className="bi bi-trash"></i>
      </button>
    </>
  );

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const response = await getUsuarios();

      if (response.success) {
        setUsuarios(response.data);
      } else {
        setError("No se pudo cargar la lista de usuarios.");
      }
    } catch (err) {
      console.error("Error al obtener usuarios:", err);
      setError("Error al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  // ✅ Crear usuario (abre modal)
  const handleCreate = () => {
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este usuario?")) {
      try {
        const response = await deleteUsuario(id);

        if (response.success) {
          fetchUsuarios();
        }
      } catch (err) {
        console.error("Error al eliminar usuario:", err);
        alert("Error al eliminar el usuario.");
      }
    }
  };

  return (
    <Layout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold">Gestión de Usuarios</h3>
          <p className="text-muted small">
            Administra las cuentas registradas en el sistema
          </p>
        </div>

        {/* <CreateButton label="Crear Usuario" onClick={handleCreate} /> */}
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <DataTable
        columns={columns}
        data={usuarios}
        loading={loading}
        emptyMessage="No hay usuarios registrados."
        renderActions={renderActions}
      />

      {/* Modal Crear Usuario */}
      <UsuarioForm
        show={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={fetchUsuarios}
      />
    </Layout>
  );
};

export default UsuarioList;
