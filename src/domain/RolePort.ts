import { Role } from './Role';  // Importamos la entidad Role

export interface RolePort {
    createRole(role: Omit<Role, 'id'>): Promise<number>;  // Crear rol
    getRoleById(id: number): Promise<Role | null>;  // Obtener rol por ID
    getRoleByName(name: string): Promise<Role | null>;  // Obtener rol por nombre
    getAllRoles(): Promise<Role[]>;  // Obtener todos los roles
    updateRole(id: number, roleData: Partial<Role>): Promise<Role | null>;  // Actualizar rol
    deleteRole(id: number): Promise<boolean>;  // Eliminar rol
}
