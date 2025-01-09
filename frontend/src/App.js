import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import ProductosPage from "./pages/ProductosPage";
import VentasPage from "./pages/VentasPage";

const App = () => {
  return (
    <Router>
      <div className="flex">
        {/* Barra lateral fija */}
        <Sidebar />
        {/* Contenido principal desplazable */}
        <div className="flex-1 h-screen overflow-y-auto p-6 bg-gray-100">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/productos" element={<ProductosPage />} />
            <Route path="/ventas" element={<VentasPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
