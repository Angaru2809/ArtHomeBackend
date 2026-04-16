import { Repository } from 'typeorm';
import { ILike } from 'typeorm';
import { User as UserDomain } from '../../domain/User';
import { Usuario } from '../entities/Usuario';
import { UserPort } from '../../domain/UserPort';
import { AppDataSource } from '../config/data-base';
import { Ciudad } from '../entities/Ciudad';
import { Role } from '../entities/Role';

export class UsuarioAdapter implements UserPort {
  private repository: Repository<Usuario>;
  private ciudadRepository: Repository<Ciudad>;
  private roleRepository: Repository<Role>;

  constructor() {
    this.repository = AppDataSource.getRepository(Usuario);
    this.ciudadRepository = AppDataSource.getRepository(Ciudad);
    this.roleRepository = AppDataSource.getRepository(Role);
  }

  // Transforma la entidad de infraestructura (Usuario) al modelo de dominio (User)
  private toDomain(usuario: Usuario): UserDomain {
    return {
      id: usuario.id,
      cedula: usuario.cedula,
      nombre: usuario.nombre,
      email: usuario.email,
      telefono: usuario.telefono,
      direccion: usuario.direccion,
      ciudadId: usuario.ciudad ? usuario.ciudad.id : null,
      ciudad: usuario.ciudad,
      rolId: usuario.rol ? usuario.rol.id : null,
      rol: usuario.rol,
      contrasenaHash: usuario.contrasenaHash,
      estado: usuario.estado,
      fechaRegistro: usuario.fechaRegistro
    };
  }

  // Transforma el modelo de dominio (User) a la entidad de infraestructura (Usuario)
  private toEntity(user: Omit<UserDomain, 'id'>): Partial<Usuario> {
    return {
      cedula: user.cedula,
      nombre: user.nombre,
      email: user.email,
      telefono: user.telefono,
      direccion: user.direccion,
      ciudad: user.ciudadId ? { id: user.ciudadId } as any : undefined,
      rol: user.rolId ? { id: user.rolId } as any : undefined,
      contrasenaHash: user.contrasenaHash,
      estado: user.estado,
      fechaRegistro: user.fechaRegistro
    };
  }

  // Método para crear un nuevo usuario
  async createUser(user: Omit<UserDomain, 'id'>): Promise<number> {
    // NOTA: el servicio ya hace validaciones de duplicados; aquí evitamos
    // "tapar" errores para que el controlador pueda responder con detalle.
    const nuevoUsuario = this.repository.create(this.toEntity(user));
    const usuarioGuardado = await this.repository.save(nuevoUsuario);
    return usuarioGuardado.id;
  }

  // Obtener un usuario por su ID
  async getUserById(id: number): Promise<UserDomain | null> {
    try {
      const usuario = await this.repository.findOne({
        where: { id },
        relations: ['rol', 'ciudad'] // Obtener relaciones con rol y ciudad
      });

      return usuario ? this.toDomain(usuario) : null;
    } catch (error) {
      console.error('Error al obtener usuario por ID:', error);
      throw new Error('Error al obtener usuario por ID');
    }
  }

  // Obtener un usuario por su correo electrónico
  async getUserByEmail(email: string): Promise<UserDomain | null> {
    try {
      const cleaned = email.trim();
      // Búsqueda case-insensitive (Postgres) para evitar duplicados por mayúsculas/minúsculas
      const usuario = await this.repository.findOne({
        where: { email: ILike(cleaned) as any },
        relations: ['rol', 'ciudad'] // Obtener relaciones con rol y ciudad
      });

      return usuario ? this.toDomain(usuario) : null;
    } catch (error) {
      console.error('Error al obtener usuario por email:', error);
      throw new Error('Error al obtener usuario por email');
    }
  }

  // Obtener un usuario por su cédula
  async getUserByCedula(cedula: string): Promise<UserDomain | null> {
    try {
      const cleaned = cedula.trim();
      if (!cleaned) return null;
      const usuario = await this.repository.findOne({
        where: { cedula: cleaned },
        relations: ['rol', 'ciudad']
      });
      return usuario ? this.toDomain(usuario) : null;
    } catch (error) {
      console.error('Error al obtener usuario por cédula:', error);
      throw new Error('Error al obtener usuario por cédula');
    }
  }

  // Obtener un usuario por su teléfono
  async getUserByTelefono(telefono: string): Promise<UserDomain | null> {
    try {
      const cleaned = telefono.trim();
      if (!cleaned) return null;
      const usuario = await this.repository.findOne({
        where: { telefono: cleaned },
        relations: ['rol', 'ciudad']
      });
      return usuario ? this.toDomain(usuario) : null;
    } catch (error) {
      console.error('Error al obtener usuario por teléfono:', error);
      throw new Error('Error al obtener usuario por teléfono');
    }
  }

  // Actualizar un usuario por su ID
  async updateUser(id: number, user: Partial<UserDomain>): Promise<boolean> {
    try {
      const usuario = await this.repository.findOne({ where: { id } });
      if (!usuario) {
        throw new Error('Usuario no encontrado');
      }

      // Actualizar solo los campos enviados, de acuerdo con la lógica de UserAdapter
      Object.assign(usuario, {
        cedula: user.cedula ?? usuario.cedula,
        nombre: user.nombre ?? usuario.nombre,
        email: user.email ?? usuario.email,
        telefono: user.telefono ?? usuario.telefono,
        direccion: user.direccion ?? usuario.direccion,
        ciudad: user.ciudadId ? { id: user.ciudadId } as any : usuario.ciudad,
        rol: user.rolId ? { id: user.rolId } as any : usuario.rol,
        contrasenaHash: user.contrasenaHash ?? usuario.contrasenaHash,
        estado: user.estado ?? usuario.estado,
        fechaRegistro: user.fechaRegistro ?? usuario.fechaRegistro
      });

      // Guardar los cambios
      await this.repository.save(usuario);
      return true;
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      throw new Error('Error al actualizar usuario');
    }
  }

  // Eliminar (o desactivar) un usuario por su ID
  async deleteUser(id: number): Promise<boolean> {
    try {
      const usuario = await this.repository.findOne({ where: { id } });
      if (!usuario) {
        throw new Error('Usuario no encontrado');
      }

      // Cambiar el estado del usuario a `false` (desactivado)
      usuario.estado = false;
      await this.repository.save(usuario);
      return true;
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      throw new Error('Error al eliminar usuario');
    }
  }

  // Obtener todos los usuarios
  async getAllUsers(): Promise<UserDomain[]> {
    try {
      const usuarios = await this.repository.find({
        relations: ['rol', 'ciudad'] // Obtener relaciones con rol y ciudad
      });

      return usuarios.map(u => this.toDomain(u));
    } catch (error) {
      console.error('Error al obtener todos los usuarios:', error);
      throw new Error('Error al obtener todos los usuarios');
    }
  }

  // Validar si existe una ciudad
  async validateCiudadExists(ciudadId: number): Promise<boolean> {
    try {
      const ciudad = await this.ciudadRepository.findOne({
        where: { id: ciudadId }
      });
      return !!ciudad;
    } catch (error) {
      console.error('Error al validar ciudad:', error);
      throw new Error('Error al validar ciudad');
    }
  }

  // Validar si existe un rol
  async validateRoleExists(rolId: number): Promise<boolean> {
    try {
      const rol = await this.roleRepository.findOne({
        where: { id: rolId }
      });
      return !!rol;
    } catch (error) {
      console.error('Error al validar rol:', error);
      throw new Error('Error al validar rol');
    }
  }
}
