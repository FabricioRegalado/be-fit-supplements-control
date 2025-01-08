const express = require('express');
const Venta = require('../models/Venta');
const Producto = require('../models/Producto'); // Importa el modelo de Producto para validar inventario
const router = express.Router();

// Registrar una nueva venta
router.post('/', async (req, res) => {
  try {
    const { productos } = req.body;

    let totalVenta = 0; // Variable para calcular el total

    // Validar productos y calcular subtotales si es necesario
    for (const item of productos) {
      const producto = await Producto.findById(item.productoId);
      if (!producto) {
        return res.status(404).json({ error: `Producto con ID ${item.productoId} no encontrado` });
      }

      // Verificar si hay suficiente stock
      if (producto.stock < item.cantidad) {
        return res.status(400).json({
          error: `Stock insuficiente para el producto ${producto.nombre}. Disponible: ${producto.stock}`,
        });
      }

      // Calcular el subtotal si no está presente en el request
      if (!item.subtotal) {
        item.subtotal = producto.precio * item.cantidad;
      }

      // Acumular el subtotal en el total de la venta
      totalVenta += item.subtotal;

      // Reducir el stock del producto
      producto.stock -= item.cantidad;
      await producto.save();
    }

    // Crear la venta con el total calculado
    const nuevaVenta = new Venta({
      productos,
      total: totalVenta, // Asignar el total calculado
    });

    await nuevaVenta.save();
    res.status(201).json(nuevaVenta);
  } catch (error) {
    console.error('Error al registrar la venta:', error);
    res.status(500).json({ error: 'Ocurrió un error al registrar la venta' });
  }
});


// Obtener todas las ventas con los detalles de productos
router.get('/', async (req, res) => {
  try {
    const ventas = await Venta.find().populate('productos.productoId', 'nombre precio');
    res.json(ventas);
  } catch (error) {
    console.error('Error al obtener las ventas:', error);
    res.status(500).json({ error: 'Ocurrió un error al obtener las ventas' });
  }
});

// Obtener una venta por ID
router.get('/:id', async (req, res) => {
  try {
    const venta = await Venta.findById(req.params.id).populate('productos.productoId', 'nombre precio');
    if (!venta) {
      return res.status(404).json({ error: 'Venta no encontrada' });
    }
    res.json(venta);
  } catch (error) {
    console.error('Error al obtener la venta:', error);
    res.status(500).json({ error: 'Ocurrió un error al obtener la venta' });
  }
});

// Eliminar una venta
router.delete('/:id', async (req, res) => {
  try {
    const venta = await Venta.findById(req.params.id);
    if (!venta) {
      return res.status(404).json({ error: 'Venta no encontrada' });
    }

    // Restaurar el stock de los productos al eliminar la venta
    for (const item of venta.productos) {
      const producto = await Producto.findById(item.productoId);
      if (producto) {
        producto.stock += item.cantidad;
        await producto.save();
      }
    }

    await Venta.findByIdAndDelete(req.params.id);
    res.json({ message: 'Venta eliminada' });
  } catch (error) {
    console.error('Error al eliminar la venta:', error);
    res.status(500).json({ error: 'Ocurrió un error al eliminar la venta' });
  }
});

module.exports = router;
