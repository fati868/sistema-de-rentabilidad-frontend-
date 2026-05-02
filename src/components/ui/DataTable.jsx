const DataTable = ({
  columns,
  data,
  loading = false,
  emptyMessage = "No hay datos",
  renderActions,
}) => {
  return (
    <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light">
              <tr>
                {columns.map((col, index) => (
                  <th
                    key={index}
                    className={`py-3 text-muted fw-semibold ${col.className || ""}`}
                    style={col.style}
                  >
                    {col.header}
                  </th>
                ))}
                {renderActions && (
                  <th className="pe-4 py-3 text-muted fw-semibold text-end">
                    Acciones
                  </th>
                )}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={columns.length + (renderActions ? 1 : 0)} className="text-center py-5">
                    <div className="spinner-border text-primary spinner-border-sm me-2"></div>
                    Cargando...
                  </td>
                </tr>
              ) : data.length > 0 ? (
                data.map((row, i) => (
                  <tr key={i}>
                    {columns.map((col, j) => (
                      <td key={j} className={col.cellClassName}>
                        {col.render ? col.render(row) : row[col.accessor]}
                      </td>
                    ))}

                    {renderActions && (
                      <td className="pe-4 text-end">
                        {renderActions(row)}
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length + (renderActions ? 1 : 0)} className="text-center py-5 text-muted">
                    {emptyMessage}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DataTable;