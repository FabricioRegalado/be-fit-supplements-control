import React, { useEffect, useState } from 'react';
import { getProducts, deleteProduct } from '../services/api';
import ProductForm from '../components/ProductForm';

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data } = await getProducts();
    setProductos(data);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      await deleteProduct(id);
      fetchProducts();
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Gestión de Productos</h2>
      <ProductForm
        fetchProducts={fetchProducts}
        editingProduct={editingProduct}
        setEditingProduct={setEditingProduct}
      />
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {productos.map((producto) => (
          <li key={producto._id} className="bg-white rounded-md shadow p-4">
            <h3 className="font-bold">{producto.nombre}</h3>
            <p className="text-gray-600">{producto.descripcion}</p>
            <p className="font-bold text-blue-500">${producto.precio}</p>
            <p className="text-sm text-gray-400">Stock: {producto.stock}</p>
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => setEditingProduct(producto)}
                className="px-4 py-2 bg-yellow-500 text-white rounded"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(producto._id)}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Productos;
