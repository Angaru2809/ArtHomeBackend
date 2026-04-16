import { Router } from 'express';
import { CarritoController } from '../controllers/CarritoController';

const router = Router();
const carritoController = new CarritoController();

router.post('/', async (req, res) => {
  try {
    await carritoController.createCarrito(req, res);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.get('/', async (req, res) => {
  try {
    await carritoController.getAllCarritos(req, res);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    await carritoController.getCarritoById(req, res);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    await carritoController.updateCarrito(req, res);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await carritoController.deleteCarrito(req, res);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

export default router; 