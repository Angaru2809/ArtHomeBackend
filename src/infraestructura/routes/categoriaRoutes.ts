import { Router } from 'express';
import { CategoriaController } from '../controllers/CategoriaController';

const router = Router();
const categoriaController = new CategoriaController();

router.post('/', async (req, res) => {
  try {
    await categoriaController.createCategoria(req, res);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.get('/', async (req, res) => {
  try {
    await categoriaController.getAllCategorias(req, res);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    await categoriaController.getCategoriaById(req, res);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    await categoriaController.updateCategoria(req, res);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await categoriaController.deleteCategoria(req, res);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.get('/api/categorias', (req, res) => categoriaController.getAllCategorias(req, res));

export default router; 