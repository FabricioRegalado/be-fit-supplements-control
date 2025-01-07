import React, { useState, useEffect } from 'react';
import { getProducts, createSale } from '../services/api';

const SaleForm = ({ fetchSales }) => {
  const [productos, setProductos] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data } = await getProducts();
    setProductos(data);
  };

  const handleProductChange = (productId, cantidad) => {
    const producto = productos.find((p) => p._id === productId);
    if (!producto) return;

    const subtotal = cantidad * producto.precio;
    const updatedProducts = selectedProducts.filter((p) => p.productoId !== productId);

    if (cantidad > 0) {
      updatedProducts.push({ productoId: productId, cantidad, subtotal });
    }

    setSelectedProducts(updatedProducts);
    setTotal(updatedProducts.reduce((sum, p) => sum + p.subtotal, 0));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedProducts.length === 0) {
      alert('Selecciona al menos un producto.');
      return;
    }
    await createSale({ productos: selectedProducts, total });
    setSelectedProducts([]);
    setTotal(0);
    fetchSales();
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <h3 className="text-xl font-bold mb-4">Registrar Nueva Venta</h3>
      <ul className="space-y-4">
        {productos.map((producto) => (
          <li key={producto._id} className="flex items-center gap-4">
            <span className="flex-1">{producto.nombre} (${producto.precio})</span>
            <input
              type="number"
              min="0"
              placeholder="Cantidad"
              onChange={(e) => handleProductChange(producto._id, parseInt(e.target.value) || 0)}
              className="p-2 border rounded w-20"
            />
          </li>
        ))}
      </ul>
      <div className="mt-4">
        <p className="font-bold text-blue-500">Total: ${total}</p>
      </div>
      <button
        type="submit"
        className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
      >
        Registrar Venta
      </button>
    </form>
  );
};

export default SaleForm;
