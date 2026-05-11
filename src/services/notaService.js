import api from "./api";

export const getNotasByProyecto = async (proyectoId) => {
  const response = await api.get(`/proyectos/${proyectoId}/notas`);
  return response.data;
};

export const createNota = async (proyectoId, data) => {
  try {
    const response = await api.post(`/proyectos/${proyectoId}/notas`, data);
    return response.data;
  } catch (error) {
    // Captura el mensaje del backend para mostrarlo en el Toast de error
    throw error.response?.data?.message || "Error al registrar la nota";
  }
};

export const updateNota = async (id, data) => {
  const response = await api.put(`/notas/${id}`, data);
  return response.data;
};

export const desactivarNota = async (id) => {
  const response = await api.put(`/notas/${id}/desactivar`);
  return response.data;
};
