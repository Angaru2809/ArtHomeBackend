import { Router } from 'express';
import { CodigoPostalController } from '../controllers/CodigoPostalController';
import { CodigoPostalAdapter } from '../adapter/CodigoPostalAdapter';
import { CodigoPostalService } from '../../application/CodigoPostalService';

const router = Router();

// Inicializar capas
const codigoPostalAdapter = new CodigoPostalAdapter();
const codigoPostalService = new CodigoPostalService(codigoPostalAdapter);
const codigoPostalController = new CodigoPostalController(codigoPostalService);

// Definir las rutas con manejo de errores
router.post('/', async (req, res) => {
  try {
    await codigoPostalController.createCodigoPostal(req, res);
  } catch (error) {
    res.status(400).json({ message: 'Error en la creación del código postal', error });
  }
});

router.get('/:id', async (req, res) => {
  try {
    await codigoPostalController.getCodigoPostalById(req, res);
  } catch (error) {
    res.status(400).json({ message: 'Error al obtener el código postal', error });
  }
});

router.get('/city/:ciudadId', async (req, res) => {
  try {
    await codigoPostalController.getCodigoPostalByCityId(req, res);
  } catch (error) {
    res.status(400).json({ message: 'Error al obtener códigos postales por ciudad', error });
  }
});

router.get('/', async (req, res) => {
  try {
    await codigoPostalController.getAllCodigosPostales(req, res);
  } catch (error) {
    res.status(400).json({ message: 'Error al obtener todos los códigos postales', error });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await codigoPostalController.deleteCodigoPostal(req, res);
  } catch (error) {
    res.status(400).json({ message: 'Error al eliminar el código postal', error });
  }
});

export default router;
