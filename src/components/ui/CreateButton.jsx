const CreateButton = ({ label = "Crear", onClick, icon = "bi-plus-lg" }) => {
  return (
    <button
      className="btn btn-primary px-4 rounded-3 py-2"
      onClick={onClick}
    >
      <i className={`bi ${icon} me-2`}></i>
      {label}
    </button>
  );
};

export default CreateButton;