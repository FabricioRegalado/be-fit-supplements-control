import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import ProductosPage from "./pages/ProductosPage";

const App = () => {
  return (
    <Router>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-5">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/productos" element={<ProductosPage />} />
            <Route path="/ventas" element={<div>Ventas</div>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
