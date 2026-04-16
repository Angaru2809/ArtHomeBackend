import { Request, Response } from 'express';
import { CarritoAdapter } from '../adapter/CarritoAdapter';
import { CarritoService } from '../../application/CarritoService';

const carritoAdapter = new CarritoAdapter();
const carritoService = new CarritoService(carritoAdapter);

export class CarritoController {
    async createCarrito(req: Request, res: Response) {
        try {
            const carrito = await carritoService.createCarrito(req.body);
            res.status(201).json(carrito);
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    }

    async getAllCarritos(req: Request, res: Response) {
        try {
            const carritos = await carritoService.getAllCarritos();
            res.status(200).json(carritos);
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    }

    async getCarritoById(req: Request, res: Response) {
        try {
            const carrito = await carritoService.getCarritoById(Number(req.params.id));
            if (!carrito) return res.status(404).json({ error: 'Carrito no encontrado' });
            res.status(200).json(carrito);
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    }

    async updateCarrito(req: Request, res: Response) {
        try {
            await carritoService.updateCarrito(Number(req.params.id), req.body);
            res.status(200).json({ message: 'Carrito actualizado' });
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    }

    async deleteCarrito(req: Request, res: Response) {
        try {
            await carritoService.deleteCarrito(Number(req.params.id));
            res.status(200).json({ message: 'Carrito eliminado' });
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    }
} 