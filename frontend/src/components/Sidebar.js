import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="h-screen bg-gray-800 text-white flex flex-col p-5 space-y-4">
      <h1 className="text-2xl font-bold">Be Fit Supplements</h1>
      <Link to="/" className="hover:text-blue-300">
        Dashboard
      </Link>
      <Link to="/productos" className="hover:text-blue-300">
        Productos
      </Link>
      <Link to="/ventas" className="hover:text-blue-300">
        Ventas
      </Link>
    </div>
  );
};

export default Sidebar;
