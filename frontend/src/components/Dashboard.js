import React, { useEffect, useState } from "react";
import { fetchVentas } from "../services/ventas";
import { fetchProductos } from "../services/productos";
import { FaShoppingCart, FaDollarSign, FaBoxes, FaClipboardList } from "react-icons/fa";

const Dashboard = () => {
  const [totalVentas, setTotalVentas] = useState(0);
  const [totalIngresos, setTotalIngresos] = useState(0);
  const [productosVendidos, setProductosVendidos] = useState(0);
  const [totalInventario, setTotalInventario] = useState(0);
  const [desgloseProductos, setDesgloseProductos] = useState([]);

  useEffect(() => {
    const obtenerMetricas = async () => {
      try {
        const ventas = await fetchVentas();
        setTotalVentas(ventas.length);

        const ingresos = ventas.reduce((acc, venta) => acc + venta.total, 0);
        setTotalIngresos(ingresos);

        const productosTotales = {};
        let totalCantidadVendida = 0;

        ventas.forEach((venta) => {
          venta.productos.forEach((producto) => {
            totalCantidadVendida += producto.cantidad;

            if (productosTotales[producto.productoId.nombre]) {
              productosTotales[producto.productoId.nombre] += producto.cantidad;
            } else {
              productosTotales[producto.productoId.nombre] = producto.cantidad;
            }
          });
        });

        setProductosVendidos(totalCantidadVendida);

        const desglose = Object.keys(productosTotales).map((nombre) => ({
          nombre,
          cantidad: productosTotales[nombre],
        }));
        setDesgloseProductos(desglose);

        const productos = await fetchProductos();
        const inventarioTotal = productos.reduce(
          (acc, prod) => acc + prod.stock,
          0
        );
        setTotalInventario(inventarioTotal);
      } catch (error) {
        console.error("Error al obtener métricas:", error);
      }
    };

    obtenerMetricas();
  }, []);

  return (
    <div className="p-5 space-y-10">
      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-10">
        📊 Dashboard
      </h1>

      {/* Métricas generales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Tarjeta Total de Ventas */}
        <div className="flex items-center bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-xl shadow-lg p-6">
          <FaShoppingCart className="text-4xl mr-4" />
          <div>
            <h2 className="text-lg font-bold">Total de Ventas</h2>
            <p className="text-4xl font-extrabold">{totalVentas}</p>
          </div>
        </div>

        {/* Tarjeta Total de Ingresos */}
        <div className="flex items-center bg-gradient-to-br from-green-500 to-green-700 text-white rounded-xl shadow-lg p-6">
          <FaDollarSign className="text-4xl mr-4" />
          <div>
            <h2 className="text-lg font-bold">Total de Ingresos</h2>
            <p className="text-4xl font-extrabold">
              ${totalIngresos.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Tarjeta Productos Vendidos */}
        <div className="flex items-center bg-gradient-to-br from-yellow-500 to-yellow-700 text-white rounded-xl shadow-lg p-6">
          <FaClipboardList className="text-4xl mr-4" />
          <div>
            <h2 className="text-lg font-bold">Productos Vendidos</h2>
            <p className="text-4xl font-extrabold">{productosVendidos}</p>
          </div>
        </div>

        {/* Tarjeta Inventario Total */}
        <div className="flex items-center bg-gradient-to-br from-purple-500 to-purple-700 text-white rounded-xl shadow-lg p-6">
          <FaBoxes className="text-4xl mr-4" />
          <div>
            <h2 className="text-lg font-bold">Inventario Disponible</h2>
            <p className="text-4xl font-extrabold">{totalInventario}</p>
          </div>
        </div>
      </div>

      {/* Tabla de desglose de productos vendidos */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Desglose de Productos Vendidos
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border-collapse border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800">
                <th className="py-3 px-5 text-left text-sm font-semibold uppercase tracking-wider">
                  Producto
                </th>
                <th className="py-3 px-5 text-left text-sm font-semibold uppercase tracking-wider">
                  Cantidad Vendida
                </th>
              </tr>
            </thead>
            <tbody>
              {desgloseProductos.map((producto, index) => (
                <tr
                  key={producto.nombre}
                  className={`${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-blue-100 transition-colors`}
                >
                  <td className="py-3 px-5 text-gray-700 font-medium border-b">
                    {producto.nombre}
                  </td>
                  <td className="py-3 px-5 text-gray-700 font-medium border-b">
                    {producto.cantidad}
                  </td>
                </tr>
              ))}
              {desgloseProductos.length === 0 && (
                <tr>
                  <td
                    colSpan="2"
                    className="py-3 px-5 text-center text-gray-500 font-medium"
                  >
                    No hay datos disponibles.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
