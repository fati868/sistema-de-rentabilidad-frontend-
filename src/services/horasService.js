import api from "./api";

export const getHorasByLider = async () => {
  const response = await api.get("/horas/lider");
  return response.data;
};

export const getMisHoras = async () => {
  const response = await api.get("/horas/mis-horas");
  return response.data;
};

export const createHora = async (data) => {
  const response = await api.post("/horas", data);
  return response.data;
};

export const updateHora = async (id, data) => {
  const response = await api.put(`/horas/${id}`, data);
  return response.data;
};

export const deleteHora = async (id) => {
  const response = await api.delete(`/horas/${id}`);
  return response.data;
};
