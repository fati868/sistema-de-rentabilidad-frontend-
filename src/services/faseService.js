import api from "./api";

export const getFasesByProyecto = async (proyectoId, orderBy = "fecha") => {
  const response = await api.get(`/proyectos/${proyectoId}/fases`, {
    params: { orderBy },
  });
  return response.data;
};

export const getFaseById = async (id) => {
  const response = await api.get(`/fases/${id}`);
  return response.data;
};

export const createFase = async (proyectoId, data) => {
  const response = await api.post(`/proyectos/${proyectoId}/fases`, data);
  return response.data;
};

export const updateFase = async (id, data) => {
  const response = await api.put(`/fases/${id}`, data);
  return response.data;
};
