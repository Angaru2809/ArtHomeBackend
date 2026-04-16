import { Request, Response } from 'express';
import { PedidoAdapter } from '../adapter/PedidoAdapter';
import { PedidoService } from '../../application/PedidoService';

const pedidoAdapter = new PedidoAdapter();
const pedidoService = new PedidoService(pedidoAdapter);

export class PedidoController {
    async createPedido(req: Request, res: Response) {
        try {
            const usuarioId = (req as any).user?.id;
            if (!usuarioId) return res.status(401).json({ error: 'Usuario no autenticado' });
            req.body.usuario_id = usuarioId;
            const pedido = await pedidoService.createPedido(req.body);
            res.status(201).json(pedido);
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    }

    async getAllPedidos(req: Request, res: Response) {
        try {
            const pedidos = await pedidoService.getAllPedidos();
            res.status(200).json(pedidos);
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    }

    async getPedidoById(req: Request, res: Response) {
        try {
            const pedido = await pedidoService.getPedidoById(Number(req.params.id));
            if (!pedido) return res.status(404).json({ error: 'Pedido no encontrado' });
            res.status(200).json(pedido);
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    }

    async updatePedido(req: Request, res: Response) {
        try {
            await pedidoService.updatePedido(Number(req.params.id), req.body);
            res.status(200).json({ message: 'Pedido actualizado' });
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    }

    async deletePedido(req: Request, res: Response) {
        try {
            await pedidoService.deletePedido(Number(req.params.id));
            res.status(200).json({ message: 'Pedido anulado (borrado lógico)' });
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    }
} 