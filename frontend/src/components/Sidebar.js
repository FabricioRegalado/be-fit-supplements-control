import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="h-screen bg-gray-200 flex flex-col p-6 space-y-10 shadow-neomorph-inner">
      {/* Encabezado */}
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-2">Be Fit</h1>
        <h2 className="text-lg font-medium text-gray-500">Supplements</h2>
      </div>

      {/* Navegación */}
      <nav className="flex flex-col space-y-6">
        <Link
          to="/"
          className="p-4 rounded-xl bg-gray-200 text-gray-700 font-bold shadow-neomorph-outer hover:shadow-lg hover:bg-gray-300 hover:text-gray-900 transition-all"
        >
          Dashboard
        </Link>
        <Link
          to="/productos"
          className="p-4 rounded-xl bg-gray-200 text-gray-700 font-bold shadow-neomorph-outer hover:shadow-lg hover:bg-gray-300 hover:text-gray-900 transition-all"
        >
          Productos
        </Link>
        <Link
          to="/ventas"
          className="p-4 rounded-xl bg-gray-200 text-gray-700 font-bold shadow-neomorph-outer hover:shadow-lg hover:bg-gray-300 hover:text-gray-900 transition-all"
        >
          Ventas
        </Link>
      </nav>

      {/* Footer */}
      <div className="mt-auto text-center text-sm text-gray-500">
        <p>© 2025 Be Fit Supplements</p>
        <p>Todos los derechos reservados.</p>
      </div>
    </div>
  );
};

export default Sidebar;
