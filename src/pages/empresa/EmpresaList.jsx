import React, { useState, useEffect } from "react";
import Layout from "../../components/layout/Layout";
import EmpresaForm from "./EmpresaForm";
import { getEmpresas } from "../../services/empresaService";
import "bootstrap/dist/css/bootstrap.min.css";
import CreateButton from "../../components/ui/CreateButton";
import DataTable from "../../components/ui/DataTable";

const columns = [
  {
    header: "ID",
    accessor: "id_empresa",
    className: "ps-4",
    cellClassName: "ps-4 text-primary",
    style: { width: "100px" },
  },
  {
    header: "Nombre",
    accessor: "empresa_nombre",
    cellClassName: "fw-medium",
  },
  {
    header: "Propietario",
    accessor: "propietario_nombre",
    cellClassName: "text-muted",
    render: (row) => row.propietario_nombre || "",
  },
];

const EmpresaList = () => {
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [empresaId, setEmpresaId] = useState(null);

  const renderActions = (empresa) => (
    <>
      <button
        className="btn btn-sm btn-outline-success px-3 me-2"
        onClick={() => handleEdit(empresa.id_empresa)}
      >
        <i className="bi bi-pencil-square me-1"></i>
      </button>

      <button className="btn btn-sm btn-outline-danger px-3">
        <i className="bi bi-trash"></i>
      </button>
    </>
  );

  const fetchEmpresas = async () => {
    try {
      setLoading(true);

      const response = await getEmpresas();

      if (response.success) {
        setEmpresas(response.data);
      } else {
        setError("No se pudo cargar la lista de empresas.");
      }
    } catch (err) {
      console.error("Error al obtener empresas:", err);
      setError("No se pudo cargar la lista de empresas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmpresas();
  }, []);

  const handleCreate = () => {
    setEmpresaId(null);
    setShowModal(true);
  };

  const handleEdit = (id) => {
    setEmpresaId(id);
    setShowModal(true);
  };

  return (
    <Layout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold">Gestión de Empresas</h3>
          <p className="text-muted small">
            Administra las empresas registradas en el sistema
          </p>
        </div>

        <CreateButton label="Crear Empresa" onClick={handleCreate} />
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card shadow-sm border-0 rounded-3">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th
                    className="ps-4 py-3 text-muted fw-semibold"
                    style={{ width: "100px" }}
                  >
                    ID
                  </th>

                  <th className="py-3 text-muted fw-semibold">
                    Nombre de la Empresa
                  </th>

                  <th className="py-3 text-muted fw-semibold">
                    Propietario
                  </th>

                  <th className="pe-4 py-3 text-muted fw-semibold text-end">
                    Acciones
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" className="text-center py-5">
                      <div className="spinner-border text-primary spinner-border-sm me-2"></div>
                      Cargando empresas...
                    </td>
                  </tr>
                ) : empresas.length > 0 ? (
                  empresas.map((empresa) => (
                    <tr key={empresa.id_empresa}>
                      <td className="ps-4 fw-bold text-primary">
                        #{empresa.id_empresa}
                      </td>

                      <td className="fw-medium">{empresa.empresa_nombre}</td>

                      <td className="text-muted">
                        {empresa.propietario_nombre || ""}
                      </td>

                      <td className="pe-4 text-end">
                        <button
                          className="btn btn-sm btn-success px-3 me-2"
                          onClick={() => handleEdit(empresa.id_empresa)}
                        >
                          <i className="bi bi-pencil-square me-1"></i> Editar
                        </button>

                        <button className="btn btn-sm btn-outline-danger px-3">
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-5 text-muted">
                      No se encontraron empresas registradas.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      <EmpresaForm
        show={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={fetchEmpresas}
        empresaId={empresaId}
      />
    </Layout>
  );
};

export default EmpresaList;
