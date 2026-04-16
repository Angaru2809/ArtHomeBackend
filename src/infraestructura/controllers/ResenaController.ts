import { Request, Response } from 'express';
import { ResenaAdapter } from '../adapter/ResenaAdapter';
import { ResenaService } from '../../application/ResenaService';

const resenaAdapter = new ResenaAdapter();
const resenaService = new ResenaService(resenaAdapter);

export class ResenaController {
    async createResena(req: Request, res: Response) {
        try {
            const resena = await resenaService.createResena(req.body);
            res.status(201).json(resena);
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    }

    async getAllResenas(req: Request, res: Response) {
        try {
            const resenas = await resenaService.getAllResenas();
            res.status(200).json(resenas);
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    }

    async getResenaById(req: Request, res: Response) {
        try {
            const resena = await resenaService.getResenaById(Number(req.params.id));
            if (!resena) return res.status(404).json({ error: 'Reseña no encontrada' });
            res.status(200).json(resena);
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    }

    async updateResena(req: Request, res: Response) {
        try {
            await resenaService.updateResena(Number(req.params.id), req.body);
            res.status(200).json({ message: 'Reseña actualizada' });
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    }

    async deleteResena(req: Request, res: Response) {
        try {
            await resenaService.deleteResena(Number(req.params.id));
            res.status(200).json({ message: 'Reseña oculta (borrado lógico)' });
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    }
} 