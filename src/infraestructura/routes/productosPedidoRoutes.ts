import { Router } from 'express';
import { ProductosPedidoController } from '../controllers/ProductosPedidoController';

const router = Router();
const productosPedidoController = new ProductosPedidoController();

router.post('/', async (req, res) => {
  try {
    await productosPedidoController.createProductosPedido(req, res);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.get('/', async (req, res) => {
  try {
    await productosPedidoController.getAllProductosPedido(req, res);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    await productosPedidoController.getProductosPedidoById(req, res);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    await productosPedidoController.updateProductosPedido(req, res);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await productosPedidoController.deleteProductosPedido(req, res);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

export default router; 