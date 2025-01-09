import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa"; // Íconos para acciones
import Swal from "sweetalert2"; // SweetAlert2
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
    stock: "",
  });
  const [productoEditando, setProductoEditando] = useState(null);
  const [productoEditado, setProductoEditado] = useState({});

  useEffect(() => {
    const getProductos = async () => {
      const data = await fetchProductos();
      setProductos(data);
    };
    getProductos();
  }, []);

  const handleAgregarProducto = async () => {
    const { nombre, descripcion, precio, stock } = nuevoProducto;

    if (!nombre.trim() || !descripcion.trim() || !precio || !stock) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Por favor completa todos los campos.",
        confirmButtonColor: "#d33",
      });
      return;
    }

    const producto = {
      ...nuevoProducto,
      precio: Number(precio),
      stock: Number(stock),
    };

    try {
      const data = await crearProducto(producto);
      setProductos([...productos, data]);

      setNuevoProducto({ nombre: "", descripcion: "", precio: "", stock: "" });

      Swal.fire({
        icon: "success",
        title: "Producto Agregado",
        text: "El producto se agregó correctamente.",
        confirmButtonColor: "#3085d6",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo agregar el producto. Inténtalo nuevamente.",
        confirmButtonColor: "#d33",
      });
    }
  };

  const handleEliminarProducto = async (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Este producto será eliminado permanentemente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await eliminarProducto(id);
          setProductos(productos.filter((producto) => producto._id !== id));
          Swal.fire({
            icon: "success",
            title: "Eliminado",
            text: "El producto ha sido eliminado.",
            confirmButtonColor: "#3085d6",
          });
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudo eliminar el producto. Inténtalo nuevamente.",
            confirmButtonColor: "#d33",
          });
        }
      }
    });
  };

  const iniciarEdicion = (producto) => {
    setProductoEditando(producto);
    setProductoEditado(producto);
  };

  const cancelarEdicion = () => {
    setProductoEditando(null);
    setProductoEditado({});
  };

  const confirmarEdicion = async () => {
    if (
      !productoEditado.nombre.trim() ||
      !productoEditado.descripcion.trim() ||
      !productoEditado.precio ||
      !productoEditado.stock
    ) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Por favor completa todos los campos.",
        confirmButtonColor: "#d33",
      });
      return;
    }

    const productoActualizado = {
      ...productoEditado,
      precio: Number(productoEditado.precio),
      stock: Number(productoEditado.stock),
    };

    setProductos(
      productos.map((producto) =>
        producto._id === productoEditado._id ? productoActualizado : producto
      )
    );

    cancelarEdicion();

    Swal.fire({
      icon: "success",
      title: "Actualizado",
      text: "El producto se actualizó correctamente.",
      confirmButtonColor: "#3085d6",
    });
  };

  return (
    <div className="p-5 space-y-10">
      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-10">
        🛒 Gestión de Productos
      </h1>

      {/* Formulario para agregar productos */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-blue-600 mb-4 flex items-center gap-2">
          <FaPlus /> Registrar Nuevo Producto
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <input
            type="text"
            value={nuevoProducto.nombre}
            onChange={(e) =>
              setNuevoProducto({ ...nuevoProducto, nombre: e.target.value.toUpperCase() })
            }
            placeholder="Nombre del producto"
            className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            value={nuevoProducto.descripcion}
            onChange={(e) =>
              setNuevoProducto({
                ...nuevoProducto,
                descripcion: e.target.value.toUpperCase(),
              })
            }
            placeholder="Descripción"
            className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            value={nuevoProducto.precio}
            onChange={(e) =>
              setNuevoProducto({ ...nuevoProducto, precio: e.target.value })
            }
            placeholder="Precio"
            className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            value={nuevoProducto.stock}
            onChange={(e) =>
              setNuevoProducto({ ...nuevoProducto, stock: e.target.value })
            }
            placeholder="Stock"
            className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAgregarProducto}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg shadow-lg font-bold hover:from-blue-600 hover:to-blue-700 transition-all"
          >
            Agregar Producto
          </button>
        </div>
      </div>

      {/* Listado de productos */}
      <div>
        <h2 className="text-2xl font-bold text-green-600 mb-4">
          Productos Registrados
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {productos.map((producto) => (
            <div
              key={producto._id}
              className="bg-white border p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow relative"
            >
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
                    className="border p-2 rounded-lg w-full mb-2"
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
                    className="border p-2 rounded-lg w-full mb-2"
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
                    className="border p-2 rounded-lg w-full mb-2"
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
                    className="border p-2 rounded-lg w-full mb-2"
                  />
                  <div className="flex justify-between mt-2">
                    <button
                      onClick={confirmarEdicion}
                      className="bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={cancelarEdicion}
                      className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="text-lg font-bold">{producto.nombre}</h3>
                  <p className="text-sm text-gray-600">
                    {producto.descripcion}
                  </p>
                  <p className="text-sm font-bold text-green-600">
                    Precio: ${producto.precio}
                  </p>
                  <p className="text-sm font-bold text-blue-600">
                    Stock: {producto.stock}
                  </p>
                  <div className="flex justify-between mt-4">
                    <button
                      onClick={() => iniciarEdicion(producto)}
                      className="flex items-center bg-yellow-500 text-white px-3 py-2 rounded-lg hover:bg-yellow-600 gap-2"
                    >
                      <FaEdit /> Editar
                    </button>
                    <button
                      onClick={() => handleEliminarProducto(producto._id)}
                      className="flex items-center bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 gap-2"
                    >
                      <FaTrash /> Eliminar
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductosPage;
