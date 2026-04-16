import { Request, Response } from 'express';
import { CiudadService } from '../../application/CiudadService';

export class CiudadController {
    private ciudadService: CiudadService;

    constructor(ciudadService: CiudadService) {
        this.ciudadService = ciudadService;
    }

    // Crear una nueva ciudad
    async createCiudad(req: Request, res: Response): Promise<Response> {
        try {
            const { nombre } = req.body;

            const ciudad = await this.ciudadService.createCiudad({ nombre });

            return res.status(201).json(ciudad);
        } catch (error) {
            return res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
        }
    }

    // Obtener ciudad por ID con relaciones (Usuarios y Códigos Postales)
    async getCiudadById(req: Request, res: Response): Promise<Response> {
        try {
            const id = parseInt(req.params.id);

            const ciudad = await this.ciudadService.getCiudadById(id);

            if (!ciudad) {
                return res.status(404).json({ error: 'Ciudad no encontrada' });
            }

            return res.json(ciudad);
        } catch (error) {
            return res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
        }
    }

    // Obtener todas las ciudades con relaciones
    async getAllCiudades(req: Request, res: Response): Promise<Response> {
        try {
            const ciudades = await this.ciudadService.getAllCiudades();
            return res.json(ciudades);
        } catch (error) {
            return res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
        }
    }

    // Eliminar ciudad
    async deleteCiudad(req: Request, res: Response): Promise<Response> {
        try {
            const id = parseInt(req.params.id);

            const deleted = await this.ciudadService.deleteCiudad(id);

            if (!deleted) {
                return res.status(404).json({ error: 'Ciudad no encontrada' });
            }

            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
        }
    }
}
