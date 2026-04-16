import { Router } from 'express';
import { ResenaController } from '../controllers/ResenaController';

const router = Router();
const resenaController = new ResenaController();

router.post('/', async (req, res) => {
  try {
    await resenaController.createResena(req, res);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.get('/', async (req, res) => {
  try {
    await resenaController.getAllResenas(req, res);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    await resenaController.getResenaById(req, res);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    await resenaController.updateResena(req, res);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await resenaController.deleteResena(req, res);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

export default router; 