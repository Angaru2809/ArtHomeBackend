import { Request, Response } from 'express';
import { UsuarioService } from '../../application/UsuarioService';
import { Usuario } from '../entities/Usuario';
import { Role } from '../entities/Role';
import { Ciudad } from '../../domain/Ciudad';  // Importando Ciudad
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { config } from '../config/config';

export class UsuarioController {
    private usuarioService: UsuarioService;

    constructor(usuarioService: UsuarioService) {
        this.usuarioService = usuarioService;
    }

    // Crear un nuevo usuario
    async crearUsuario(req: Request, res: Response): Promise<Response> {
        try {
            console.log('🔍 Iniciando creación de usuario');
            console.log('📝 Datos recibidos:', req.body);
            
            const { cedula, nombre, email, telefono, direccion, ciudadId, contrasena, password, rolId } = req.body;

            // Validaciones
            const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúñÑ]+(?: [A-Za-zÁÉÍÓÚáéíóúñÑ]+)*$/
            if (!nameRegex.test(nombre.trim()))
                return res.status(400).json({ error: "El nombre no es válido" });

            if (!/^[\w-]+(\.[\w-]+)*@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/.test(email))
                return res.status(400).json({ error: "Correo electrónico no válido" });

            const plainPassword = contrasena || password;
            if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=~`|\\\/\.,?><:{}[\];'"]{6,25}$/.test(plainPassword))
                return res.status(400).json({
                    error: "La contraseña debe tener entre 6 y 25 caracteres, al menos una letra y un número"
                });

            console.log('✅ Validaciones pasadas, llamando al servicio...');

            // Enviar la contraseña en texto plano al servicio
            const usuarioCreado = await this.usuarioService.crearUsuario({
                cedula, nombre, email, telefono, direccion, ciudadId, contrasena: plainPassword, rolId
            });

            console.log('✅ Usuario creado exitosamente');

            return res.status(201).json({
                message: 'Usuario creado exitosamente',
                usuario: usuarioCreado
            });
        } catch (error) {
            console.error('❌ Error en crearUsuario:', error);
            console.error('❌ Stack trace:', error instanceof Error ? error.stack : 'No stack trace available');

            const msg = error instanceof Error ? error.message : String(error);
            const isDuplicate =
                /ya est[aá] registrado|ya existe|registrad[oa]/i.test(msg);

            if (isDuplicate) {
                return res.status(409).json({
                    error: msg
                });
            }

            return res.status(500).json({
                error: 'Error interno del servidor',
                details: msg,
                stack: error instanceof Error ? error.stack : undefined
            });
        }
    }

    // Login de usuario
    async login(req: Request, res: Response): Promise<Response> {
        try {
            const { email, password, contrasena } = req.body;

            // Logs para depuración
            console.log('🔐 Iniciando proceso de login...');
            console.log('📝 Datos recibidos:', { email, password: password ? '***' : 'no enviado', contrasena: contrasena ? '***' : 'no enviado' });

            // Usar password o contrasena, cualquiera que esté presente
            const userPassword = password || contrasena;
            
            if (!userPassword) {
                console.log('❌ No se proporcionó contraseña');
                return res.status(400).json({ error: 'Contraseña es requerida' });
            }

            // Usar el servicio para login
            const result = await this.usuarioService.login(email, userPassword);
            
            console.log('✅ Login exitoso para:', email);

            return res.json(result);
        } catch (error: any) {
            console.error('❌ Error en login:', error);
            // Manejar errores de servidor
            return res.status(401).json({ error: error.message });
        }
    }

    // Renovar access token
    async refreshToken(req: Request, res: Response): Promise<Response> {
        try {
            const { refreshToken } = req.body;

            if (!refreshToken) {
                return res.status(401).json({ error: 'No refresh token provided' });
            }

            const tokens = await this.usuarioService.refreshAccessToken(refreshToken);

            return res.json(tokens);
        } catch (error) {
            return res.status(401).json({ error: 'Invalid refresh token' });
        }
    }

    // Cerrar sesión
    async logout(req: Request, res: Response): Promise<Response> {
        try {
            // En esta implementación simple, solo devolvemos un mensaje de éxito
            // No necesitamos hacer nada en la base de datos ya que no almacenamos tokens
            return res.json({ message: 'Logout successful' });
        } catch (error) {
            return res.status(500).json({ error: 'Error during logout' });
        }
    }

    // Obtener usuario por ID
    async obtenerUsuarioPorId(req: Request, res: Response): Promise<Response> {
        try {
            const id = parseInt(req.params.id);

            // Obtener usuario usando el servicio
            const usuario = await this.usuarioService.obtenerUsuarioPorId(id);

            return res.json(usuario);
        } catch (error) {
            return res.status(404).json({ error: 'Usuario no encontrado', details: error instanceof Error ? error.message : String(error) });
        }
    }

    // Obtener todos los usuarios
    async obtenerUsuarios(req: Request, res: Response): Promise<Response> {
        try {
            const usuarios = await this.usuarioService.obtenerUsuarios();
            return res.json(usuarios);
        } catch (error) {
            return res.status(500).json({ error: 'Error al obtener los usuarios', details: error instanceof Error ? error.message : String(error) });
        }
    }

    // Actualizar usuario
    async actualizarUsuario(req: Request, res: Response): Promise<Response> {
        try {
            const id = parseInt(req.params.id);
            const usuarioData = req.body;

            // Verificar si se proporciona una nueva contraseña, en cuyo caso la hasheamos
            if (usuarioData.contrasenaHash) {
                const salt = await bcrypt.genSalt(config.bcrypt.saltRounds);
                usuarioData.contrasenaHash = await bcrypt.hash(usuarioData.contrasenaHash, salt);
            }

            const actualizado = await this.usuarioService.actualizarUsuario(id, usuarioData);

            return res.json({ message: 'Usuario actualizado correctamente', usuario: actualizado });
        } catch (error) {
            return res.status(400).json({ error: 'Error al actualizar el usuario', details: error instanceof Error ? error.message : String(error) });
        }
    }

    // Eliminar usuario (soft delete)
    async eliminarUsuario(req: Request, res: Response): Promise<Response> {
        try {
            const id = parseInt(req.params.id);

            await this.usuarioService.eliminarUsuario(id);

            return res.status(204).send();  // 204 No Content
        } catch (error) {
            return res.status(404).json({ error: 'Usuario no encontrado', details: error instanceof Error ? error.message : String(error) });
        }
    }

    // Buscar por email
    async buscarPorEmail(req: Request, res: Response): Promise<Response> {
        try {
            const { email } = req.params;

            const usuario = await this.usuarioService.obtenerUsuarioPorEmail(email);

            return res.json(usuario);
        } catch (error) {
            return res.status(404).json({ error: 'Usuario no encontrado', details: error instanceof Error ? error.message : String(error) });
        }
    }

    // Buscar por teléfono
    async buscarPorTelefono(req: Request, res: Response): Promise<Response> {
        try {
            const { telefono } = req.params;

            const usuario = await this.usuarioService.obtenerUsuarioPorTelefono(telefono);

            return res.json(usuario);
        } catch (error) {
            return res.status(404).json({ error: 'Usuario no encontrado', details: error instanceof Error ? error.message : String(error) });
        }
    }

    // Recuperación de contraseña (olvidada)
    async olvidoContrasena(req: Request, res: Response): Promise<Response> {
        // Implementar lógica de recuperación
        return res.json({ mensaje: 'Enlace de recuperación enviado si el email existe.' });
    }

    // Recuperar contraseña
    async recuperarContrasena(req: Request, res: Response): Promise<Response> {
        // Implementar lógica de recuperación de contraseña
        return res.json({ mensaje: 'Contraseña recuperada exitosamente.' });
    }

    // Verificación de correo
    async verificarCorreo(req: Request, res: Response): Promise<Response> {
        return res.json({ mensaje: 'Correo verificado exitosamente.' });
    }

    // Verificación de teléfono
    async verificarTelefono(req: Request, res: Response): Promise<Response> {
        return res.json({ mensaje: 'Teléfono verificado exitosamente.' });
    }
}
