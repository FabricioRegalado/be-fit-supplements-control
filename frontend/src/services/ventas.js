import API from "./api";

// Obtener todas las ventas
export const fetchVentas = async () => {
  const { data } = await API.get("/ventas");
  return data;
};

// Crear una nueva venta
export const crearVenta = async (venta) => {
  const { data } = await API.post("/ventas", venta);
  return data;
};

// Eliminar una venta
export const eliminarVenta = async (id) => {
  await API.delete(`/ventas/${id}`);
};
