import { Router } from 'express';
import { CiudadController } from '../controllers/CiudadController';
import { CiudadAdapter } from '../adapter/CiudadAdapter';
import { CiudadService } from '../../application/CiudadService';

const router = Router();

// Inicializar capas
const ciudadAdapter = new CiudadAdapter();
const ciudadService = new CiudadService(ciudadAdapter);
const ciudadController = new CiudadController(ciudadService);

// Definir las rutas con manejo de errores
router.post('/', async (req, res) => {
  try {
    await ciudadController.createCiudad(req, res);
  } catch (error) {
    res.status(400).json({ message: 'Error en la creación de la ciudad', error });
  }
});

router.get('/:id', async (req, res) => {
  try {
    await ciudadController.getCiudadById(req, res);
  } catch (error) {
    res.status(400).json({ message: 'Error al obtener la ciudad', error });
  }
});

router.get('/', async (req, res) => {
  try {
    await ciudadController.getAllCiudades(req, res);
  } catch (error) {
    res.status(400).json({ message: 'Error al obtener las ciudades', error });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await ciudadController.deleteCiudad(req, res);
  } catch (error) {
    res.status(400).json({ message: 'Error al eliminar la ciudad', error });
  }
});

export default router;
