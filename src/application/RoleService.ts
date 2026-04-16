import { RolePort } from '../domain/RolePort';
import { Role } from '../domain/Role';

export class RoleService {
    private rolePort: RolePort;

    constructor(rolePort: RolePort) {
        this.rolePort = rolePort;
    }

    // Crear un nuevo rol
    async createRole(roleData: Omit<Role, 'id'>): Promise<Role> {
        const existingRole = await this.rolePort.getRoleByName(roleData.nombre);
        if (existingRole) {
            throw new Error('El rol ya existe');
        }

        const roleId = await this.rolePort.createRole(roleData);
        const role = await this.rolePort.getRoleById(roleId);

        if (!role) {
            throw new Error('Error al crear rol');
        }

        return role;
    }

    // Obtener un rol por ID
    async getRoleById(id: number): Promise<Role | null> {
        return await this.rolePort.getRoleById(id);
    }

    // Obtener todos los roles
    async getAllRoles(): Promise<Role[]> {
        return await this.rolePort.getAllRoles();
    }

    // Eliminar un rol
    async deleteRole(id: number): Promise<boolean> {
        const role = await this.rolePort.getRoleById(id);
        if (!role) {
            throw new Error('Rol no encontrado');
        }

        return await this.rolePort.deleteRole(id);
    }

    // Actualizar un rol
    async updateRole(id: number, roleData: Partial<Role>): Promise<Role> {
        const role = await this.rolePort.getRoleById(id);
        if (!role) {
            throw new Error('Rol no encontrado');
        }

        const updatedRole = await this.rolePort.updateRole(id, roleData);

        if (!updatedRole) {
            throw new Error('Error al actualizar el rol');
        }

        return updatedRole;
    }
}
