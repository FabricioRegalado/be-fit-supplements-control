import API from "./api";

export const fetchVentas = async () => {
  const { data } = await API.get("/ventas");
  return data;
};

export const crearVenta = async (venta) => {
  const { data } = await API.post("/ventas", venta);
  return data;
};
