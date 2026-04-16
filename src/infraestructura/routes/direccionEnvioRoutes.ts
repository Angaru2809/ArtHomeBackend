import { Router } from 'express';
import { DireccionEnvioController } from '../controllers/DireccionEnvioController';
// import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const direccionEnvioController = new DireccionEnvioController();

// router.use(authMiddleware);

router.post('/', async (req, res) => {
  try {
    await direccionEnvioController.createDireccionEnvio(req, res);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.get('/', async (req, res) => {
  try {
    await direccionEnvioController.getAllDireccionesEnvio(req, res);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    await direccionEnvioController.getDireccionEnvioById(req, res);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    await direccionEnvioController.updateDireccionEnvio(req, res);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await direccionEnvioController.deleteDireccionEnvio(req, res);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

export default router; 