import { Request, Response } from 'express';
import { ProductoService } from '../../application/ProductoService';
import { getRepository } from 'typeorm';
import { Producto } from '../entities/Producto';
import { Categoria } from '../entities/Categoria';

export class ProductoController {
    constructor(private productoService: ProductoService) {}

    async crearProducto(req: Request, res: Response): Promise<void> {
        try {
            const { nombre, descripcion, precio, cantidad_stock, categoria_id, imagenUrl } = req.body;

            // Crear el producto con la imagen incluida
            const productoId = await this.productoService.crearProducto({
                nombre,
                descripcion,
                precio: parseFloat(precio),
                cantidad_stock: parseInt(cantidad_stock),
                categoria_id: parseInt(categoria_id),
                imagenUrl
            });

            // Obtener el producto creado
            const producto = await this.productoService.obtenerPorId(productoId);

            res.status(201).json({
                success: true,
                message: 'Producto creado exitosamente',
                producto
            });
        } catch (error) {
            console.error('Error al crear producto:', error);
            res.status(500).json({
                success: false,
                message: 'Error al crear el producto',
                error: error instanceof Error ? error.message : 'Error desconocido'
            });
        }
    }

    async getCatalogoPorCategoria(req: Request, res: Response) {
        try {
            const categoriaNombre = req.query.categoria as string;
            console.log('🔍 Buscando categoría:', categoriaNombre);
            
            if (!categoriaNombre) {
                console.log('📋 No hay filtro, devolviendo todos los productos');
                // Si no hay parámetro → devuelve todos
                const productos = await this.productoService.obtenerTodos();
                return res.json({ productos: Array.isArray(productos) ? productos : [] });
            }
            
            console.log('🔍 Hay filtro, usando servicio para filtrar...');
            
            // Usar directamente el servicio que ya maneja la búsqueda por nombre
            const productos = await this.productoService.getCatalogoPorCategoria(categoriaNombre);
            console.log('📦 Productos encontrados:', productos.length);
            res.json({ productos: Array.isArray(productos) ? productos : [] });
            
        } catch (error) {
            console.error('❌ Error en getCatalogoPorCategoria:', error);
            res.status(500).json({ error: 'Error al obtener productos por categoría' });
        }
    }

    async obtenerProductos(req: Request, res: Response): Promise<void> {
        try {
            const productos = await this.productoService.obtenerTodos();
            
            res.json({
                success: true,
                productos,
                total: productos.length
            });
        } catch (error) {
            console.error('Error al obtener productos:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener los productos',
                error: error instanceof Error ? error.message : 'Error desconocido'
            });
        }
    }

    async obtenerProductoPorId(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const producto = await this.productoService.obtenerPorId(id);

            if (!producto) {
                res.status(404).json({
                    success: false,
                    message: 'Producto no encontrado'
                });
                return;
            }

            res.json({
                success: true,
                producto
            });
        } catch (error) {
            console.error('Error al obtener producto:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener el producto',
                error: error instanceof Error ? error.message : 'Error desconocido'
            });
        }
    }

    async obtenerProductosConImagenes(req: Request, res: Response): Promise<void> {
        try {
            const productos = await this.productoService.obtenerProductosConImagenes();
            
            res.json({
                success: true,
                productos,
                total: productos.length
            });
        } catch (error) {
            console.error('Error al obtener productos con imágenes:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener los productos con imágenes',
                error: error instanceof Error ? error.message : 'Error desconocido'
            });
        }
    }

    async actualizarProducto(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const datosActualizacion = req.body;

            const resultado = await this.productoService.actualizarProducto(id, datosActualizacion);

            if (resultado) {
                const productoActualizado = await this.productoService.obtenerPorId(id);
                res.json({
                    success: true,
                    message: 'Producto actualizado exitosamente',
                    producto: productoActualizado
                });
            } else {
                res.status(404).json({
                    success: false,
                    message: 'Producto no encontrado'
                });
            }
        } catch (error) {
            console.error('Error al actualizar producto:', error);
            res.status(500).json({
                success: false,
                message: 'Error al actualizar el producto',
                error: error instanceof Error ? error.message : 'Error desconocido'
            });
        }
    }

    async eliminarProducto(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const resultado = await this.productoService.eliminarProducto(id);

            if (resultado) {
                res.json({
                    success: true,
                    message: 'Producto retirado del catálogo (borrado lógico)'
                });
            } else {
                res.status(404).json({
                    success: false,
                    message: 'Producto no encontrado'
                });
            }
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            res.status(500).json({
                success: false,
                message: 'Error al eliminar el producto',
                error: error instanceof Error ? error.message : 'Error desconocido'
            });
        }
    }

    async buscarPorNombre(req: Request, res: Response): Promise<void> {
        try {
            const nombre = (req.query.nombre as string) || '';
            const productos = await this.productoService.buscarPorNombre(nombre);
            res.json({ productos });
        } catch (error) {
            console.error('Error al buscar productos por nombre:', error);
            res.status(500).json({ error: 'Error al buscar productos por nombre' });
        }
    }
} 