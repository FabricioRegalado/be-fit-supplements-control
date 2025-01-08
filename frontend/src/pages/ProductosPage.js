import React, { useState, useEffect } from "react";
import {
  fetchProductos,
  crearProducto,
  eliminarProducto,
} from "../services/productos";

const ProductosPage = () => {
  const [productos, setProductos] = useState([]);
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "", // Cambiado de cantidad a stock
  });
  const [productoEditando, setProductoEditando] = useState(null);
  const [productoEditado, setProductoEditado] = useState({});

  // Obtener los productos al cargar el componente
  useEffect(() => {
    const getProductos = async () => {
      const data = await fetchProductos();
      setProductos(data);
    };
    getProductos();
  }, []);

  // Crear un nuevo producto
  const handleAgregarProducto = async () => {
    const { nombre, descripcion, precio, stock } = nuevoProducto;

    // Validación básica
    if (!nombre.trim() || !descripcion.trim() || !precio || !stock) {
      alert("Por favor completa todos los campos.");
      return;
    }

    const producto = { ...nuevoProducto, precio: Number(precio), stock: Number(stock) };
    const data = await crearProducto(producto);
    setProductos([...productos, data]);

    // Resetear formulario
    setNuevoProducto({ nombre: "", descripcion: "", precio: "", stock: "" });
  };

  // Eliminar un producto
  const handleEliminarProducto = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este producto?")) {
      await eliminarProducto(id);
      setProductos(productos.filter((producto) => producto._id !== id));
    }
  };

  // Iniciar edición
  const iniciarEdicion = (producto) => {
    setProductoEditando(producto);
    setProductoEditado(producto);
  };

  // Cancelar edición
  const cancelarEdicion = () => {
    setProductoEditando(null);
    setProductoEditado({});
  };

  // Confirmar edición
  const confirmarEdicion = async () => {
    if (
      !productoEditado.nombre.trim() ||
      !productoEditado.descripcion.trim() ||
      !productoEditado.precio ||
      !productoEditado.stock
    ) {
      alert("Por favor completa todos los campos.");
      return;
    }

    const productoActualizado = {
      ...productoEditado,
      precio: Number(productoEditado.precio),
      stock: Number(productoEditado.stock),
    };

    // Actualizar localmente (puedes agregar lógica real de actualización en el backend aquí)
    setProductos(
      productos.map((producto) =>
        producto._id === productoEditado._id ? productoActualizado : producto
      )
    );

    cancelarEdicion();
  };

  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold mb-5">Gestión de Productos</h1>

      {/* Formulario para agregar productos */}
      <div className="mb-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <input
          type="text"
          value={nuevoProducto.nombre}
          onChange={(e) =>
            setNuevoProducto({ ...nuevoProducto, nombre: e.target.value })
          }
          placeholder="Nombre del producto"
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          value={nuevoProducto.descripcion}
          onChange={(e) =>
            setNuevoProducto({ ...nuevoProducto, descripcion: e.target.value })
          }
          placeholder="Descripción"
          className="border p-2 rounded w-full"
        />
        <input
          type="number"
          value={nuevoProducto.precio}
          onChange={(e) =>
            setNuevoProducto({ ...nuevoProducto, precio: e.target.value })
          }
          placeholder="Precio"
          className="border p-2 rounded w-full"
        />
        <input
          type="number"
          value={nuevoProducto.stock}
          onChange={(e) =>
            setNuevoProducto({ ...nuevoProducto, stock: e.target.value })
          }
          placeholder="Stock"
          className="border p-2 rounded w-full"
        />
        <button
          onClick={handleAgregarProducto}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Agregar
        </button>
      </div>

      {/* Listado de productos en tarjetas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {productos.map((producto) => (
          <div
            key={producto._id}
            className="border p-4 rounded-lg shadow-lg bg-white"
          >
            {/* Si está editando este producto */}
            {productoEditando && productoEditando._id === producto._id ? (
              <div>
                <input
                  type="text"
                  value={productoEditado.nombre}
                  onChange={(e) =>
                    setProductoEditado({
                      ...productoEditado,
                      nombre: e.target.value,
                    })
                  }
                  className="border p-2 rounded w-full mb-2"
                />
                <input
                  type="text"
                  value={productoEditado.descripcion}
                  onChange={(e) =>
                    setProductoEditado({
                      ...productoEditado,
                      descripcion: e.target.value,
                    })
                  }
                  className="border p-2 rounded w-full mb-2"
                />
                <input
                  type="number"
                  value={productoEditado.precio}
                  onChange={(e) =>
                    setProductoEditado({
                      ...productoEditado,
                      precio: e.target.value,
                    })
                  }
                  className="border p-2 rounded w-full mb-2"
                />
                <input
                  type="number"
                  value={productoEditado.stock}
                  onChange={(e) =>
                    setProductoEditado({
                      ...productoEditado,
                      stock: e.target.value,
                    })
                  }
                  className="border p-2 rounded w-full mb-2"
                />
                <div className="mt-2 flex justify-between">
                  <button
                    onClick={confirmarEdicion}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    Guardar
                  </button>
                  <button
                    onClick={cancelarEdicion}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-lg font-semibold">{producto.nombre}</h2>
                <p className="text-sm text-gray-600">{producto.descripcion}</p>
                <p className="text-sm font-bold">Precio: ${producto.precio}</p>
                <p className="text-sm font-bold">Stock: {producto.stock}</p>
                <div className="mt-4 flex justify-between">
                  <button
                    onClick={() => iniciarEdicion(producto)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleEliminarProducto(producto._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductosPage;
