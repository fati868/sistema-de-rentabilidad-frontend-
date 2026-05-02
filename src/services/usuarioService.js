import api from "./api";

// Obtener todos los usuarios (solo para Admin)
export const getUsuarios = async () => {
  const response = await api.get("/usuarios");
  return response.data;
};

export const createUsuario = async (formData) => {
  const response = await api.post("/usuarios", formData);
  return response.data;
};

// Eliminar un usuario
export const deleteUsuario = async (id) => {
  const response = await api.delete(`/usuarios/${id}`);
  return response.data;
};