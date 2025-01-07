import React, { useState, useEffect } from 'react';
import { createProduct, updateProduct } from '../services/api';

const ProductForm = ({ fetchProducts, editingProduct, setEditingProduct }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
  });

  useEffect(() => {
    if (editingProduct) {
      setFormData(editingProduct);
    }
  }, [editingProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingProduct) {
      await updateProduct(editingProduct._id, formData);
      setEditingProduct(null);
    } else {
      await createProduct(formData);
    }
    setFormData({ nombre: '', descripcion: '', precio: '', stock: '' });
    fetchProducts();
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="nombre"
          placeholder="Nombre del producto"
          value={formData.nombre}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="descripcion"
          placeholder="Descripción"
          value={formData.descripcion}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          type="number"
          name="precio"
          placeholder="Precio"
          value={formData.precio}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={formData.stock}
          onChange={handleChange}
          className="p-2 border rounded"
        />
      </div>
      <button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
        {editingProduct ? 'Actualizar' : 'Agregar'}
      </button>
    </form>
  );
};

export default ProductForm;
