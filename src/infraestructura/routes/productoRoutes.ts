import { Router } from 'express';
import { ProductoController } from '../controllers/ProductoController';
import { ProductoService } from '../../application/ProductoService';
import { ProductoAdapter } from '../adapter/ProductoAdapter';


const router = Router();

// Inicializar dependencias
const productoAdapter = new ProductoAdapter();
const productoService = new ProductoService(productoAdapter);
const productoController = new ProductoController(productoService);

// Rutas para productos
router.post('/', async (req, res) => {
  try {
    await productoController.crearProducto(req, res);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.get('/', async (req, res) => {
  try {
    await productoController.obtenerProductos(req, res);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// Ruta específica para obtener productos con imágenes (para catálogo)
router.get('/con-imagenes', async (req, res) => {
  try {
    await productoController.obtenerProductosConImagenes(req, res);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// Ruta para filtrar productos por categoría (DEBE IR ANTES DE /:id)
router.get('/filtro', async (req, res) => {
  await productoController.getCatalogoPorCategoria(req, res);
});

// Ruta para buscar productos por nombre (parcial, insensible a mayúsculas)
router.get('/buscar', async (req, res) => {
  await productoController.buscarPorNombre(req, res);
});

router.get('/:id', async (req, res) => {
  try {
    await productoController.obtenerProductoPorId(req, res);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    await productoController.actualizarProducto(req, res);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await productoController.eliminarProducto(req, res);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

export default router; 