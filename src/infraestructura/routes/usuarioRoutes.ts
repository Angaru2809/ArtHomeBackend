import { Router } from 'express';
import { UsuarioAdapter } from '../adapter/UsuarioAdapter'; // Importar el adaptador
import { UsuarioService } from '../../application/UsuarioService'; // Importar el servicio
import { UsuarioController } from '../controllers/UsuarioController';  // Importar el controlador

// Inicialización de las capas
const usuarioAdapter = new UsuarioAdapter();  // Crear una instancia del adaptador
const usuarioService = new UsuarioService(usuarioAdapter);  // Crear una instancia del servicio con el adaptador
const usuarioController = new UsuarioController(usuarioService);  // Crear la instancia del controlador con el servicio

const router = Router();

// Definir las rutas con manejo de errores

// Crear un nuevo usuario
router.post('/users', async (req, res) => {
  try {
    await usuarioController.crearUsuario(req, res);
  } catch (error) {
    res.status(400).json({ message: 'Error en la creación del usuario', error });
  }
});

// Login de usuario
router.post('/login', async (req, res) => {
  try {
    await usuarioController.login(req, res);
  } catch (error) {
    res.status(400).json({ message: 'Error al iniciar sesión', error });
  }
});

// Renovar access token
router.post('/refresh-token', async (req, res) => {
  try {
    await usuarioController.refreshToken(req, res);
  } catch (error) {
    res.status(401).json({ message: 'Error al renovar el token', error });
  }
});

// Cerrar sesión
router.post('/logout', async (req, res) => {
  try {
    await usuarioController.logout(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Error al cerrar sesión', error });
  }
});

// Obtener un usuario por ID
router.get('/users/:id', async (req, res) => {
  try {
    await usuarioController.obtenerUsuarioPorId(req, res);
  } catch (error) {
    res.status(400).json({ message: 'Error al obtener el usuario', error });
  }
});

// Obtener todos los usuarios
router.get('/users', async (req, res) => {
  try {
    await usuarioController.obtenerUsuarios(req, res);
  } catch (error) {
    res.status(400).json({ message: 'Error al obtener los usuarios', error });
  }
});

// Actualizar un usuario por ID
router.put('/users/:id', async (req, res) => {
  try {
    await usuarioController.actualizarUsuario(req, res);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar el usuario', error });
  }
});

// Eliminar usuario por ID (soft delete)
router.delete('/users/:id', async (req, res) => {
  try {
    await usuarioController.eliminarUsuario(req, res);
  } catch (error) {
    res.status(400).json({ message: 'Error al eliminar el usuario', error });
  }
});

// Buscar usuario por email
router.get('/users/email/:email', async (req, res) => {
  try {
    await usuarioController.buscarPorEmail(req, res);
  } catch (error) {
    res.status(400).json({ message: 'Error al obtener usuario por correo', error });
  }
});

// Buscar usuario por teléfono
router.get('/users/telefono/:telefono', async (req, res) => {
  try {
    await usuarioController.buscarPorTelefono(req, res);
  } catch (error) {
    res.status(400).json({ message: 'Error al obtener usuario por teléfono', error });
  }
});

// Recuperar contraseñas (olvidadas)
router.post('/users/olvido-contrasena', async (req, res) => {
  try {
    await usuarioController.olvidoContrasena(req, res);
  } catch (error) {
    res.status(400).json({ message: 'Error al procesar la solicitud de olvido de contraseña', error });
  }
});

// Recuperar contraseñas
router.post('/users/recuperar-contrasena', async (req, res) => {
  try {
    await usuarioController.recuperarContrasena(req, res);
  } catch (error) {
    res.status(400).json({ message: 'Error al procesar la recuperación de contraseña', error });
  }
});

// Verificar correo
router.post('/users/verificar-correo', async (req, res) => {
  try {
    await usuarioController.verificarCorreo(req, res);
  } catch (error) {
    res.status(400).json({ message: 'Error al verificar correo', error });
  }
});

// Verificar teléfono
router.post('/users/verificar-telefono', async (req, res) => {
  try {
    await usuarioController.verificarTelefono(req, res);
  } catch (error) {
    res.status(400).json({ message: 'Error al verificar teléfono', error });
  }
});

export default router;
