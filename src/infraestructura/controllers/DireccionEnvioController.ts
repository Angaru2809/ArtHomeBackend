import { Request, Response } from 'express';
import { DireccionEnvioAdapter } from '../adapter/DireccionEnvioAdapter';
import { DireccionEnvioService } from '../../application/DireccionEnvioService';

const direccionEnvioAdapter = new DireccionEnvioAdapter();
const direccionEnvioService = new DireccionEnvioService(direccionEnvioAdapter);

export class DireccionEnvioController {
    async createDireccionEnvio(req: Request, res: Response) {
        try {
            const usuarioId = (req as any).user?.id;
            if (!usuarioId) return res.status(401).json({ error: 'Usuario no autenticado' });
            req.body.usuario_id = usuarioId;
            const direccion = await direccionEnvioService.createDireccionEnvio(req.body);
            res.status(201).json(direccion);
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    }

    async getAllDireccionesEnvio(req: Request, res: Response) {
        try {
            const direcciones = await direccionEnvioService.getAllDireccionesEnvio();
            res.status(200).json(direcciones);
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    }

    async getDireccionEnvioById(req: Request, res: Response) {
        try {
            const direccion = await direccionEnvioService.getDireccionEnvioById(Number(req.params.id));
            if (!direccion) return res.status(404).json({ error: 'Dirección de envío no encontrada' });
            res.status(200).json(direccion);
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    }

    async updateDireccionEnvio(req: Request, res: Response) {
        try {
            await direccionEnvioService.updateDireccionEnvio(Number(req.params.id), req.body);
            res.status(200).json({ message: 'Dirección de envío actualizada' });
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    }

    async deleteDireccionEnvio(req: Request, res: Response) {
        try {
            await direccionEnvioService.deleteDireccionEnvio(Number(req.params.id));
            res.status(200).json({ message: 'Dirección de envío eliminada' });
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    }
} 