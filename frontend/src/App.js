import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Productos from './pages/Productos';
import Ventas from './pages/Ventas';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-blue-500 text-white py-4 px-6">
          <h1 className="text-lg font-bold">BeFit Supplements</h1>
        </header>
        <main className="p-6">
          <Routes>
            <Route path="/" element={<Productos />} />
            <Route path="/ventas" element={<Ventas />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
