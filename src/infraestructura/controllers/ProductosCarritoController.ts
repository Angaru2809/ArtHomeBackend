import { Request, Response } from 'express';
import { ProductosCarritoAdapter } from '../adapter/ProductosCarritoAdapter';
import { ProductosCarritoService } from '../../application/ProductosCarritoService';

const productosCarritoAdapter = new ProductosCarritoAdapter();
const productosCarritoService = new ProductosCarritoService(productosCarritoAdapter);

export class ProductosCarritoController {
    async createProductosCarrito(req: Request, res: Response) {
        try {
            const pc = await productosCarritoService.createProductosCarrito(req.body);
            res.status(201).json(pc);
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    }

    async getAllProductosCarrito(req: Request, res: Response) {
        try {
            const pcs = await productosCarritoService.getAllProductosCarrito();
            res.status(200).json(pcs);
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    }

    async getProductosCarritoById(req: Request, res: Response) {
        try {
            const pc = await productosCarritoService.getProductosCarritoById(Number(req.params.id));
            if (!pc) return res.status(404).json({ error: 'Producto en carrito no encontrado' });
            res.status(200).json(pc);
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    }

    async updateProductosCarrito(req: Request, res: Response) {
        try {
            await productosCarritoService.updateProductosCarrito(Number(req.params.id), req.body);
            res.status(200).json({ message: 'Producto en carrito actualizado' });
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    }

    async deleteProductosCarrito(req: Request, res: Response) {
        try {
            await productosCarritoService.deleteProductosCarrito(Number(req.params.id));
            res.status(200).json({ message: 'Producto en carrito eliminado' });
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    }
} 