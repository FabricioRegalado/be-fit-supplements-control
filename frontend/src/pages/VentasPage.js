import React, { useState, useEffect } from "react";
import { fetchVentas, crearVenta, eliminarVenta } from "../services/ventas";
import { fetchProductos } from "../services/productos";

const VentasPage = () => {
  const [ventas, setVentas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [nuevaVenta, setNuevaVenta] = useState({
    productos: [],
  });

  useEffect(() => {
    const getVentas = async () => {
      const data = await fetchVentas();
      setVentas(data);
    };

    const getProductos = async () => {
      const data = await fetchProductos();
      setProductos(data);
    };

    getVentas();
    getProductos();
  }, []);

  const agregarProducto = (productoId, cantidad) => {
    const producto = productos.find((p) => p._id === productoId);
    if (!producto) return;

    if (cantidad <= 0) {
      alert("La cantidad debe ser mayor a 0.");
      return;
    }

    const subtotal = producto.precio * cantidad;

    const productoExistente = nuevaVenta.productos.find(
      (p) => p.productoId === productoId
    );

    let productosActualizados;
    if (productoExistente) {
      productosActualizados = nuevaVenta.productos.map((p) =>
        p.productoId === productoId
          ? { ...p, cantidad, subtotal }
          : p
      );
    } else {
      productosActualizados = [
        ...nuevaVenta.productos,
        { productoId, cantidad, subtotal },
      ];
    }

    setNuevaVenta({ ...nuevaVenta, productos: productosActualizados });
  };

  const handleCrearVenta = async () => {
    if (nuevaVenta.productos.length === 0) {
      alert("Debe agregar al menos un producto.");
      return;
    }

    const productosConSubtotales = nuevaVenta.productos.map((p) => ({
      productoId: p.productoId,
      cantidad: p.cantidad,
      subtotal: p.subtotal,
    }));

    try {
      const data = await crearVenta({ productos: productosConSubtotales });
      setVentas([...ventas, data]);
      setNuevaVenta({ productos: [] });
      alert("Venta registrada exitosamente.");
    } catch (error) {
      console.error("Error al crear la venta:", error);
      alert("No se pudo registrar la venta.");
    }
  };

  const handleEliminarVenta = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar esta venta?")) {
      try {
        await eliminarVenta(id);
        setVentas(ventas.filter((venta) => venta._id !== id));
      } catch (error) {
        console.error("Error al eliminar la venta:", error);
        alert("No se pudo eliminar la venta.");
      }
    }
  };

  return (
    <div className="p-5 space-y-8">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-5 text-center">
        🛒 Gestión de Ventas
      </h1>

      {/* Formulario para registrar una nueva venta */}
      <div className="bg-white shadow-lg rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-bold text-blue-600">Registrar Nueva Venta</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {productos.map((producto) => (
            <div
              key={producto._id}
              className="border p-4 rounded-lg shadow hover:shadow-xl transition-shadow bg-gradient-to-br from-blue-100 to-white"
            >
              <h3 className="text-xl font-semibold text-gray-800">
                {producto.nombre}
              </h3>
              <p className="text-gray-600 text-sm">{producto.descripcion}</p>
              <p className="text-lg font-bold text-green-600">
                Precio: ${producto.precio}
              </p>
              <input
                type="number"
                min="1"
                placeholder="Cantidad"
                className="border p-2 rounded mt-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) =>
                  agregarProducto(producto._id, Number(e.target.value))
                }
              />
            </div>
          ))}
        </div>
        <button
          onClick={handleCrearVenta}
          className="w-full md:w-auto bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg shadow-lg font-bold hover:from-blue-600 hover:to-blue-700 transition-all"
        >
          Registrar Venta
        </button>
      </div>

      {/* Listado de ventas */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-green-600">Ventas Registradas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ventas.map((venta) => (
            <div
              key={venta._id}
              className="bg-white border rounded-lg shadow-lg hover:shadow-xl transition-shadow p-6"
            >
              <h3 className="text-lg font-bold text-blue-500">
                Fecha: {new Date(venta.fecha).toLocaleDateString()}
              </h3>
              <p className="font-bold text-lg text-green-600">
                Total: ${venta.total}
              </p>
              <ul className="mt-4 space-y-2">
                {venta.productos.map((prod) => (
                  <li
                    key={prod.productoId._id}
                    className="text-sm flex justify-between items-center"
                  >
                    <span className="font-medium text-gray-800">
                      {prod.productoId.nombre}
                    </span>
                    <span className="text-gray-600">
                      {prod.cantidad} unidad(es)
                    </span>
                    <span className="font-bold text-gray-900">
                      ${prod.subtotal}
                    </span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleEliminarVenta(venta._id)}
                className="mt-4 w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all"
              >
                Eliminar Venta
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VentasPage;
