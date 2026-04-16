import { Repository } from 'typeorm';
import { Role } from '../entities/Role';
import { RolePort } from '../../domain/RolePort';
import { AppDataSource } from '../config/data-base';

export class RoleAdapter implements RolePort {
    private repository: Repository<Role>;

    constructor() {
        this.repository = AppDataSource.getRepository(Role);
    }

    // Crear un nuevo rol
    async createRole(role: Omit<Role, 'id'>): Promise<number> {
        const newRole = this.repository.create(role);
        const savedRole = await this.repository.save(newRole);
        return savedRole.id;
    }

    // Obtener rol por ID
    async getRoleById(id: number): Promise<Role | null> {
        const role = await this.repository.findOne({ where: { id } });
        return role || null;
    }

    // Obtener rol por nombre
    async getRoleByName(name: string): Promise<Role | null> {
        const role = await this.repository.findOne({ where: { nombre: name } });
        return role || null;
    }

    // Obtener todos los roles
    async getAllRoles(): Promise<Role[]> {
        return await this.repository.find();
    }

    // Eliminar rol
    async deleteRole(id: number): Promise<boolean> {
        const role = await this.repository.findOne({ where: { id } });
        if (!role) {
            throw new Error('Rol no encontrado');
        }

        await this.repository.remove(role);
        return true;
    }

    // Actualizar un rol
    async updateRole(id: number, roleData: Partial<Role>): Promise<Role | null> {
        const role = await this.repository.findOne({ where: { id } });
        if (!role) {
            throw new Error('Rol no encontrado');
        }

        Object.assign(role, roleData); // Actualiza los campos con los datos proporcionados
        const updatedRole = await this.repository.save(role);

        return updatedRole;
    }
}
