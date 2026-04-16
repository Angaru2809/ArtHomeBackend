import { Request, Response } from 'express';
import { CategoriaAdapter } from '../adapter/CategoriaAdapter';
import { CategoriaService } from '../../application/CategoriaService';
import { getRepository } from 'typeorm';
import { Categoria } from '../entities/Categoria';

const categoriaAdapter = new CategoriaAdapter();
const categoriaService = new CategoriaService(categoriaAdapter);

export class CategoriaController {
    async createCategoria(req: Request, res: Response) {
        try {
            const categoria = await categoriaService.createCategoria(req.body);
            res.status(201).json(categoria);
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    }

    async getAllCategorias(req: Request, res: Response) {
        try {
            const categorias = await categoriaService.getAllCategorias();
            res.status(200).json(categorias);
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    }

    async getCategoriaById(req: Request, res: Response) {
        try {
            const categoria = await categoriaService.getCategoriaById(Number(req.params.id));
            if (!categoria) return res.status(404).json({ error: 'Categoría no encontrada' });
            res.status(200).json(categoria);
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    }

    async updateCategoria(req: Request, res: Response) {
        try {
            await categoriaService.updateCategoria(Number(req.params.id), req.body);
            res.status(200).json({ message: 'Categoría actualizada' });
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    }

    async deleteCategoria(req: Request, res: Response) {
        try {
            await categoriaService.deleteCategoria(Number(req.params.id));
            res.status(200).json({ message: 'Categoría retirada (borrado lógico)' });
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    }
}

export const getCategorias = async (req: Request, res: Response) => {
    const repo = getRepository(Categoria);
    const categorias = await repo.find({ where: { activo: true } });
    res.json({ categorias });
}; 