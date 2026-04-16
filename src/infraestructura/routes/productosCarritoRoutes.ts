import { Router } from 'express';
import { ProductosCarritoController } from '../controllers/ProductosCarritoController';

const router = Router();
const productosCarritoController = new ProductosCarritoController();

router.post('/', async (req, res) => {
  try {
    await productosCarritoController.createProductosCarrito(req, res);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.get('/', async (req, res) => {
  try {
    await productosCarritoController.getAllProductosCarrito(req, res);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    await productosCarritoController.getProductosCarritoById(req, res);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    await productosCarritoController.updateProductosCarrito(req, res);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await productosCarritoController.deleteProductosCarrito(req, res);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

export default router; 