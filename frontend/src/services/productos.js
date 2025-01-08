import API from "./api";

export const fetchProductos = async () => {
  const { data } = await API.get("/productos");
  return data;
};

export const crearProducto = async (producto) => {
  const { data } = await API.post("/productos", producto);
  return data;
};

export const eliminarProducto = async (id) => {
  await API.delete(`/productos/${id}`);
};
