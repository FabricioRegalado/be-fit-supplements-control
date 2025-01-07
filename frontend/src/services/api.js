import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // URL base del backend
});

// Productos
export const getProducts = () => API.get('/productos');
export const createProduct = (product) => API.post('/productos', product);
export const updateProduct = (id, product) => API.put(`/productos/${id}`, product);
export const deleteProduct = (id) => API.delete(`/productos/${id}`);

// Ventas
export const getSales = () => API.get('/ventas');
export const createSale = (sale) => API.post('/ventas', sale);

export default API;
