import React, { useEffect, useState } from 'react';
import { getSales } from '../services/api';
import SaleForm from '../components/SaleForm';

const Ventas = () => {
  const [ventas, setVentas] = useState([]);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    const { data } = await getSales();
    setVentas(data);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Gestión de Ventas</h2>
      <SaleForm fetchSales={fetchSales} />
      <ul className="space-y-4">
        {ventas.map((venta) => (
          <li key={venta._id} className="bg-white rounded-md shadow p-4">
            <p className="text-gray-600">
              <strong>Fecha:</strong> {new Date(venta.fecha).toLocaleDateString()}
            </p>
            <p className="font-bold text-blue-500">
              <strong>Total:</strong> ${venta.total}
            </p>
            <ul className="mt-2">
              {venta.productos.map((prod) => (
                <li key={prod.productoId._id} className="text-sm">
                  {prod.productoId.nombre} - {prod.cantidad} unidad(es) - ${prod.subtotal}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Ventas;
