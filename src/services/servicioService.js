import api from "./api";

// GET servicios
export const getServicios = async () => {
  const response = await api.get("/servicios");
  return response.data;
};

// POST crear servicio
export const createServicio = async (data) => {
  const response = await api.post("/servicios", data);
  return response.data;
};