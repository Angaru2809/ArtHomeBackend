import { Request, Response } from 'express';
import { ProductosPedidoAdapter } from '../adapter/ProductosPedidoAdapter';
import { ProductosPedidoService } from '../../application/ProductosPedidoService';

const productosPedidoAdapter = new ProductosPedidoAdapter();
const productosPedidoService = new ProductosPedidoService(productosPedidoAdapter);

export class ProductosPedidoController {
    async createProductosPedido(req: Request, res: Response) {
        try {
            const pp = await productosPedidoService.createProductosPedido(req.body);
            res.status(201).json(pp);
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    }

    async getAllProductosPedido(req: Request, res: Response) {
        try {
            const pps = await productosPedidoService.getAllProductosPedido();
            res.status(200).json(pps);
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    }

    async getProductosPedidoById(req: Request, res: Response) {
        try {
            const pp = await productosPedidoService.getProductosPedidoById(Number(req.params.id));
            if (!pp) return res.status(404).json({ error: 'Producto en pedido no encontrado' });
            res.status(200).json(pp);
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    }

    async updateProductosPedido(req: Request, res: Response) {
        try {
            await productosPedidoService.updateProductosPedido(Number(req.params.id), req.body);
            res.status(200).json({ message: 'Producto en pedido actualizado' });
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    }

    async deleteProductosPedido(req: Request, res: Response) {
        try {
            await productosPedidoService.deleteProductosPedido(Number(req.params.id));
            res.status(200).json({ message: 'Producto en pedido eliminado' });
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    }
} 