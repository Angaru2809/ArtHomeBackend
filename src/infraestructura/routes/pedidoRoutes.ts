import { Router } from 'express';
import { PedidoController } from '../controllers/PedidoController';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const pedidoController = new PedidoController();

router.use(authMiddleware);

router.post('/', async (req, res) => {
  try {
    await pedidoController.createPedido(req, res);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.get('/', async (req, res) => {
  try {
    await pedidoController.getAllPedidos(req, res);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    await pedidoController.getPedidoById(req, res);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    await pedidoController.updatePedido(req, res);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await pedidoController.deletePedido(req, res);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

export default router; 