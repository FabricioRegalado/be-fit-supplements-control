const express = require('express');
const Producto = require('../models/Producto');
const router = express.Router();

// Obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const productos = await Producto.find();
    res.status(200).json(productos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los productos', detalles: error.message });
  }
});

// Crear un nuevo producto
router.post('/', async (req, res) => {
  try {
    const { nombre, descripcion, precio, stock } = req.body;

    // Validación básica
    if (!nombre || !descripcion || !precio || stock == null) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const nuevoProducto = new Producto({ nombre, descripcion, precio, stock });
    await nuevoProducto.save();
    res.status(201).json(nuevoProducto);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el producto', detalles: error.message });
  }
});

// Editar un producto existente
router.put('/:id', async (req, res) => {
  try {
    const productoActualizado = await Producto.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!productoActualizado) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.status(200).json(productoActualizado);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el producto', detalles: error.message });
  }
});

// Eliminar un producto
router.delete('/:id', async (req, res) => {
  try {
    const productoEliminado = await Producto.findByIdAndDelete(req.params.id);

    if (!productoEliminado) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.status(200).json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el producto', detalles: error.message });
  }
});

module.exports = router;
