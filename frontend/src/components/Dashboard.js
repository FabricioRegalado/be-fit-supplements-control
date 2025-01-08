import React, { useEffect, useState } from "react";
import { fetchVentas } from "../services/ventas";
import { fetchProductos } from "../services/productos";

const Dashboard = () => {
  const [totalVentas, setTotalVentas] = useState(0);
  const [totalIngresos, setTotalIngresos] = useState(0);
  const [productosVendidos, setProductosVendidos] = useState(0); // Este estado se usará en la tarjeta
  const [totalInventario, setTotalInventario] = useState(0);
  const [desgloseProductos, setDesgloseProductos] = useState([]); // Métrica adicional

  useEffect(() => {
    const obtenerMetricas = async () => {
      try {
        // Obtener ventas
        const ventas = await fetchVentas();
        setTotalVentas(ventas.length);

        // Calcular ingresos totales y productos vendidos
        const ingresos = ventas.reduce((acc, venta) => acc + venta.total, 0);
        setTotalIngresos(ingresos);

        const productosTotales = {};
        let totalCantidadVendida = 0; // Nuevo acumulador para la cantidad total de productos vendidos

        ventas.forEach((venta) => {
          venta.productos.forEach((producto) => {
            totalCantidadVendida += producto.cantidad; // Sumar al total de productos vendidos

            if (productosTotales[producto.productoId.nombre]) {
              productosTotales[producto.productoId.nombre] += producto.cantidad;
            } else {
              productosTotales[producto.productoId.nombre] = producto.cantidad;
            }
          });
        });

        // Actualizar métricas de productos vendidos
        setProductosVendidos(totalCantidadVendida);

        // Convertir el desglose a un array
        const desglose = Object.keys(productosTotales).map((nombre) => ({
          nombre,
          cantidad: productosTotales[nombre],
        }));
        setDesgloseProductos(desglose);

        // Obtener inventario
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
    <div className="p-5">
      <h1 className="text-3xl font-bold mb-5">Dashboard</h1>

      {/* Métricas generales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Tarjeta Total de Ventas */}
        <div className="bg-blue-500 text-white rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-bold">Total de Ventas</h2>
          <p className="text-4xl font-extrabold mt-3">{totalVentas}</p>
        </div>

        {/* Tarjeta Total de Ingresos */}
        <div className="bg-green-500 text-white rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-bold">Total de Ingresos</h2>
          <p className="text-4xl font-extrabold mt-3">${totalIngresos.toLocaleString()}</p>
        </div>

        {/* Tarjeta Productos Vendidos */}
        <div className="bg-yellow-500 text-white rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-bold">Productos Vendidos</h2>
          <p className="text-4xl font-extrabold mt-3">{productosVendidos}</p>
        </div>

        {/* Tarjeta Inventario Total */}
        <div className="bg-purple-500 text-white rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-bold">Inventario Disponible</h2>
          <p className="text-4xl font-extrabold mt-3">{totalInventario}</p>
        </div>
      </div>

      {/* Tabla de desglose de productos vendidos */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Desglose de Productos Vendidos</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Producto</th>
                <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Cantidad Vendida</th>
              </tr>
            </thead>
            <tbody>
              {desgloseProductos.map((producto) => (
                <tr key={producto.nombre}>
                  <td className="py-2 px-4 border-b text-gray-700">{producto.nombre}</td>
                  <td className="py-2 px-4 border-b text-gray-700">{producto.cantidad}</td>
                </tr>
              ))}
              {desgloseProductos.length === 0 && (
                <tr>
                  <td colSpan="2" className="py-2 px-4 text-center text-gray-500">
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
