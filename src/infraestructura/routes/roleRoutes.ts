import { Router } from 'express';
import { RoleController } from '../controllers/RoleController';
import { RoleAdapter } from '../adapter/RoleAdapter';
import { RoleService } from '../../application/RoleService';

// Inicializar capas
const roleAdapter = new RoleAdapter();
const roleService = new RoleService(roleAdapter);
const roleController = new RoleController(roleService);

const router = Router();

// Crear un nuevo rol
router.post('/', async (req, res) => {
  try {
    await roleController.createRole(req, res);
  } catch (error) {
    res.status(400).json({ message: 'Error en la creación del rol', error });
  }
});

// Obtener rol por ID
router.get('/:id', async (req, res) => {
  try {
    await roleController.getRoleById(req, res);
  } catch (error) {
    res.status(400).json({ message: 'Error al obtener el rol', error });
  }
});

// Obtener todos los roles
router.get('/', async (req, res) => {
  try {
    await roleController.getAllRoles(req, res);
  } catch (error) {
    res.status(400).json({ message: 'Error al obtener los roles', error });
  }
});

// Actualizar un rol
router.put('/:id', async (req, res) => {
  try {
    await roleController.updateRole(req, res);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar el rol', error });
  }
});

// Eliminar un rol
router.delete('/:id', async (req, res) => {
  try {
    await roleController.deleteRole(req, res);
  } catch (error) {
    res.status(400).json({ message: 'Error al eliminar el rol', error });
  }
});

export default router;
