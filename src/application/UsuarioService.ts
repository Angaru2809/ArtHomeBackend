import { UserPort } from '../domain/UserPort';
import { User } from '../domain/User';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { config } from '../infraestructura/config/config';

export class UsuarioService {
    private userPort: UserPort;

    constructor(userPort: UserPort) {
        this.userPort = userPort;
    }

    private normalizeEmail(email: string): string {
        return email.trim().toLowerCase();
    }

    private normalizeOptional(value: unknown): string | null {
        if (typeof value !== 'string') return null;
        const v = value.trim();
        return v.length ? v : null;
    }

    // Función privada para generar tokens
    private generateTokens(user: User) {
        const accessToken = jwt.sign(
            {
                id: user.id,
                email: user.email,
                rol: user.rol?.nombre
            },
            config.jwt.secret,
            { expiresIn: '15m' } // Token de acceso expira en 15 minutos
        );

        const refreshToken = jwt.sign(
            {
                id: user.id,
                email: user.email
            },
            config.jwt.secret,
            { expiresIn: '7d' } // Refresh token expira en 7 días
        );

        return { accessToken, refreshToken };
    }

    // Función para verificar un token
    private verifyToken(token: string): any {
        try {
            return jwt.verify(token, config.jwt.secret);
        } catch (error) {
            throw new Error('Token inválido');
        }
    }

    // Crear un nuevo usuario
    async crearUsuario(usuarioData: any): Promise<any> {
        try {
            const rawEmail = String(usuarioData.email ?? '');
            const email = this.normalizeEmail(rawEmail);
            const contrasena = String(usuarioData.contrasena ?? '');
            const nombre = String(usuarioData.nombre ?? '');
            const rolId = usuarioData.rolId;
            const ciudadId = usuarioData.ciudadId;
            const cedula = this.normalizeOptional(usuarioData.cedula);
            const telefono = this.normalizeOptional(usuarioData.telefono);

            console.log('Datos recibidos:', { email, nombre, rolId, ciudadId });

            // Verificar duplicados (email/cédula/teléfono)
            console.log('Verificando si el usuario existe...');
            const usuarioPorEmail = await this.userPort.getUserByEmail(email);
            if (usuarioPorEmail) {
                throw new Error('El correo electrónico ya está registrado');
            }

            if (cedula) {
                const usuarioPorCedula = await this.userPort.getUserByCedula(cedula);
                if (usuarioPorCedula) {
                    throw new Error('La cédula ya está registrada');
                }
            }

            if (telefono) {
                const usuarioPorTelefono = await this.userPort.getUserByTelefono(telefono);
                if (usuarioPorTelefono) {
                    throw new Error('El teléfono ya está registrado');
                }
            }

            // Validar que exista la ciudad y el rol
            if (ciudadId) {
                console.log('Validando ciudad:', ciudadId);
                const ciudadExiste = await this.userPort.validateCiudadExists(ciudadId);
                if (!ciudadExiste) {
                    throw new Error('La ciudad especificada no existe');
                }
            }

            if (rolId) {
                console.log('Validando rol:', rolId);
                const rolExiste = await this.userPort.validateRoleExists(rolId);
                if (!rolExiste) {
                    throw new Error('El rol especificado no existe');
                }
            }

            // Encriptar contraseña
            console.log('Encriptando contraseña...');
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(contrasena, salt);

            // Crear nuevo usuario
            console.log('Creando usuario...');
            const user: Omit<User, 'id'> = {
                cedula: cedula ?? (usuarioData.cedula as any),
                nombre,
                email,
                telefono: telefono ?? (usuarioData.telefono as any),
                direccion: usuarioData.direccion,
                ciudadId,
                ciudad: undefined,
                rolId,
                rol: undefined,
                contrasenaHash: hashedPassword,
                estado: true,
                fechaRegistro: new Date()
            };

            console.log('Guardando usuario en la base de datos...');
            const id = await this.userPort.createUser(user);
            console.log('Usuario creado con ID:', id);

            const usuarioCreado = await this.userPort.getUserById(id);
            if (!usuarioCreado) throw new Error('Error al crear usuario');
            
            // Eliminar datos sensibles antes de devolver
            const { contrasenaHash: _, ...usuarioSinSensitive } = usuarioCreado;
            return usuarioSinSensitive;
        } catch (error) {
            console.error('Error en crearUsuario:', error);
            throw error;
        }
    }

    // Login: Verificación de credenciales y generación de tokens
    async login(email: string, password: string): Promise<any> {
        // Buscar usuario
        const usuario = await this.userPort.getUserByEmail(email);
        if (!usuario) {
            throw new Error('Credenciales inválidas');
        }

        // Verificar contraseña
        const passwordValido = await bcrypt.compare(password, usuario.contrasenaHash);
        if (!passwordValido) {
            throw new Error('Credenciales inválidas');
        }

        // Generar tokens
        const { accessToken, refreshToken } = this.generateTokens(usuario);

        // Retornar usuario y tokens
        const { contrasenaHash: _, ...usuarioSinPassword } = usuario;
        return {
            usuario: usuarioSinPassword,
            accessToken,
            refreshToken
        };
    }

    // Renovar access token usando refresh token
    async refreshAccessToken(refreshToken: string): Promise<any> {
        try {
            // Verificar refresh token
            const decoded = this.verifyToken(refreshToken);

            // Buscar usuario por ID
            const usuario = await this.userPort.getUserById(decoded.id);
            if (!usuario) {
                throw new Error('Usuario no encontrado');
            }

            // Generar nuevos tokens
            const tokens = this.generateTokens(usuario);

            return {
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken
            };
        } catch (error) {
            throw new Error('Error al renovar el token');
        }
    }

    // Obtener usuario por ID
    async obtenerUsuarioPorId(id: number): Promise<any> {
        const usuario = await this.userPort.getUserById(id);
        if (!usuario) {
            throw new Error('Usuario no encontrado');
        }
        const { contrasenaHash: _, ...usuarioSinSensitive } = usuario;
        return usuarioSinSensitive;
    }

    // Obtener todos los usuarios
    async obtenerUsuarios(): Promise<any[]> {
        const usuarios = await this.userPort.getAllUsers();
        return usuarios.map(usuario => {
            const { contrasenaHash: _, ...usuarioSinSensitive } = usuario;
            return usuarioSinSensitive;
        });
    }

    // Actualizar usuario
    async actualizarUsuario(id: number, usuarioData: any): Promise<any> {
        // Si se actualiza la contraseña, hashearla
        if (usuarioData.contrasenaHash) {
            const salt = await bcrypt.genSalt(10);
            usuarioData.contrasenaHash = await bcrypt.hash(usuarioData.contrasenaHash, salt);
        }
        const actualizado = await this.userPort.updateUser(id, usuarioData);
        if (!actualizado) throw new Error('Usuario no encontrado o no actualizado');
        const usuario = await this.userPort.getUserById(id);
        if (!usuario) throw new Error('Usuario no encontrado tras actualizar');
        const { contrasenaHash: _, ...usuarioSinSensitive } = usuario;
        return usuarioSinSensitive;
    }

    // Eliminar usuario
    async eliminarUsuario(id: number): Promise<void> {
        const eliminado = await this.userPort.deleteUser(id);
        if (!eliminado) throw new Error('Usuario no encontrado o no eliminado');
    }

    async obtenerUsuarioPorTelefono(telefono: string): Promise<any> {
        const usuario = await this.userPort.getUserByTelefono(telefono);
        if (usuario) {
            const { contrasenaHash: _, ...usuarioSinSensitive } = usuario;
            return usuarioSinSensitive;
        }
        return null;
    }

    async obtenerUsuarioPorEmail(email: string): Promise<any> {
        const usuario = await this.userPort.getUserByEmail(email);
        if (usuario) {
            const { contrasenaHash: _, ...usuarioSinSensitive } = usuario;
            return usuarioSinSensitive;
        }
        return null;
    }
}
