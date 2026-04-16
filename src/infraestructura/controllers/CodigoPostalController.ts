import { Request, Response } from 'express';
import { CodigoPostalService } from '../../application/CodigoPostalService';

export class CodigoPostalController {
    private codigoPostalService: CodigoPostalService;

    constructor(codigoPostalService: CodigoPostalService) {
        this.codigoPostalService = codigoPostalService;
    }

    // Crear un nuevo código postal
    async createCodigoPostal(req: Request, res: Response): Promise<Response> {
        try {
            const { ciudad, codigo_postal } = req.body;
            const codigoPostal = await this.codigoPostalService.createCodigoPostal({ ciudad, codigo_postal });

            return res.status(201).json(codigoPostal);
        } catch (error) {
            return res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
        }
    }

    // Obtener código postal por ID
    async getCodigoPostalById(req: Request, res: Response): Promise<Response> {
        try {
            const id = parseInt(req.params.id);

            const codigoPostal = await this.codigoPostalService.getCodigoPostalById(id);

            if (!codigoPostal) {
                return res.status(404).json({ error: 'Código postal no encontrado' });
            }

            return res.json(codigoPostal);
        } catch (error) {
            return res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
        }
    }

    // Obtener códigos postales por ciudad
    async getCodigoPostalByCityId(req: Request, res: Response): Promise<Response> {
        try {
            const ciudadId = parseInt(req.params.ciudadId);

            const codigosPostales = await this.codigoPostalService.getCodigoPostalByCityId(ciudadId);

            if (!codigosPostales || codigosPostales.length === 0) {
                return res.status(404).json({ error: 'No se encontraron códigos postales para esta ciudad' });
            }

            return res.json(codigosPostales);
        } catch (error) {
            return res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
        }
    }

    // Obtener todos los códigos postales
    async getAllCodigosPostales(req: Request, res: Response): Promise<Response> {
        try {
            const codigosPostales = await this.codigoPostalService.getAllCodigosPostales();
            return res.json(codigosPostales);
        } catch (error) {
            return res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
        }
    }

    // Eliminar código postal
    async deleteCodigoPostal(req: Request, res: Response): Promise<Response> {
        try {
            const id = parseInt(req.params.id);

            const deleted = await this.codigoPostalService.deleteCodigoPostal(id);

            if (!deleted) {
                return res.status(404).json({ error: 'Código postal no encontrado' });
            }

            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
        }
    }
}
