import { Router } from 'express';
import { ContribucionController } from '../controllers/ContribucionController';
import { ContribucionAdapter } from '../adapter/ContribucionAdapter';
import { ContribucionService } from '../../application/ContribucionService';
import { authMiddleware } from '../middleware/auth.middleware';

// Inicialización de las capas
const contribucionAdapter = new ContribucionAdapter();
const contribucionService = new ContribucionService(contribucionAdapter);
const contribucionController = new ContribucionController(contribucionService);

const router = Router();

// Aplicar middleware de autenticación a todas las rutas de contribuciones
router.use(authMiddleware);

// Definir las rutas con manejo de errores

// Crear una nueva contribución
router.post('/', async (req, res) => {
  try {
    await contribucionController.createContribucion(req, res);
  } catch (error) {
    res.status(400).json({ message: 'Error en la creación de la contribución', error });
  }
});

// Obtener todas las contribuciones
router.get('/', async (req, res) => {
  try {
    await contribucionController.getAllContribuciones(req, res);
  } catch (error) {
    res.status(400).json({ message: 'Error al obtener las contribuciones', error });
  }
});

// Obtener una contribución por ID
router.get('/:id', async (req, res) => {
  try {
    await contribucionController.getContribucionById(req, res);
  } catch (error) {
    res.status(400).json({ message: 'Error al obtener la contribución', error });
  }
});

// Actualizar una contribución
router.put('/:id', async (req, res) => {
  try {
    await contribucionController.updateContribucion(req, res);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar la contribución', error });
  }
});

// Eliminar una contribución
router.delete('/:id', async (req, res) => {
  try {
    await contribucionController.deleteContribucion(req, res);
  } catch (error) {
    res.status(400).json({ message: 'Error al eliminar la contribución', error });
  }
});

// Obtener contribuciones por tipo de material
router.get('/material/:tipoMaterial', async (req, res) => {
  try {
    await contribucionController.getContribucionesByTipoMaterial(req, res);
  } catch (error) {
    res.status(400).json({ message: 'Error al obtener las contribuciones por tipo de material', error });
  }
});

// Obtener las contribuciones del usuario autenticado
router.get('/usuario/me', async (req, res) => {
  try {
    await contribucionController.getMisContribuciones(req, res);
  } catch (error) {
    res.status(400).json({ message: 'Error al obtener las contribuciones del usuario', error });
  }
});

// Obtener contribuciones por usuario
router.get('/usuario/:usuarioId', async (req, res) => {
  try {
    await contribucionController.getContribucionesByUsuario(req, res);
  } catch (error) {
    res.status(400).json({ message: 'Error al obtener las contribuciones del usuario', error });
  }
});

// Obtener contribuciones por estado
router.get('/estado/:estado', async (req, res) => {
  try {
    await contribucionController.getContribucionesByEstado(req, res);
  } catch (error) {
    res.status(400).json({ message: 'Error al obtener las contribuciones por estado', error });
  }
});

// Cambiar estado de una contribución (solo administradores)
router.patch('/:id/estado', async (req, res) => {
  try {
    await contribucionController.changeEstadoContribucion(req, res);
  } catch (error) {
    res.status(400).json({ message: 'Error al cambiar el estado de la contribución', error });
  }
});

export default router;
