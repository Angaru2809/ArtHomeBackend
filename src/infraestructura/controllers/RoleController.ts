import { Request, Response } from 'express';
import { RoleService } from '../../application/RoleService';

export class RoleController {
    private roleService: RoleService;

    constructor(roleService: RoleService) {
        this.roleService = roleService;
    }

    // Crear un nuevo rol
    async createRole(req: Request, res: Response): Promise<Response> {
        try {
            const { nombre } = req.body;

            const role = await this.roleService.createRole({ nombre });

            return res.status(201).json(role);
        } catch (error) {
            return res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
        }
    }

    // Obtener rol por ID
    async getRoleById(req: Request, res: Response): Promise<Response> {
        try {
            const id = parseInt(req.params.id);

            const role = await this.roleService.getRoleById(id);

            if (!role) {
                return res.status(404).json({ error: 'Rol no encontrado' });
            }

            return res.json(role);
        } catch (error) {
            return res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
        }
    }

    // Obtener todos los roles
    async getAllRoles(req: Request, res: Response): Promise<Response> {
        try {
            const roles = await this.roleService.getAllRoles();
            return res.json(roles);
        } catch (error) {
            return res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
        }
    }

    // Actualizar un rol
    async updateRole(req: Request, res: Response): Promise<Response> {
        try {
            const id = parseInt(req.params.id);
            const { nombre } = req.body;

            // Llamamos al servicio para actualizar el rol
            const updatedRole = await this.roleService.updateRole(id, { nombre });

            return res.json(updatedRole);
        } catch (error) {
            return res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
        }
    }

    // Eliminar rol
    async deleteRole(req: Request, res: Response): Promise<Response> {
        try {
            const id = parseInt(req.params.id);

            const deleted = await this.roleService.deleteRole(id);

            if (!deleted) {
                return res.status(404).json({ error: 'Rol no encontrado' });
            }

            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
        }
    }
}
