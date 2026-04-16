import { Request, Response } from 'express';
import { ContribucionService } from '../../application/ContribucionService';


export class ContribucionController {
    private contribucionService: ContribucionService;

    constructor(contribucionService: ContribucionService) {
        this.contribucionService = contribucionService;
    }

    // Crear una nueva contribución
    async createContribucion(req: Request, res: Response): Promise<Response> {
        try {
            console.log('Datos recibidos en el controlador:', req.body);
            
            // Obtener el usuarioId del usuario autenticado
            if (!req.user || !req.user.id) {
                return res.status(401).json({ 
                    error: 'Usuario no autenticado',
                    timestamp: new Date().toISOString()
                });
            }
            
            const contribucionData = {
                ...req.body,
                usuarioId: req.user.id
            };
            
            console.log('Datos de contribución con usuarioId:', contribucionData);
            
            const contribucion = await this.contribucionService.createContribucion(contribucionData);
            return res.status(201).json(contribucion);
        } catch (error) {
            console.error('Error en el controlador de contribuciones:', error);
            const errorMessage = (error as Error).message;
            
            // Determinar el código de estado apropiado
            let statusCode = 500;
            if (errorMessage.includes('es requerido')) {
                statusCode = 400;
            } else if (errorMessage.includes('no encontrada')) {
                statusCode = 404;
            }
            
            return res.status(statusCode).json({ 
                error: errorMessage,
                timestamp: new Date().toISOString()
            });
        }
    }

    // Obtener todas las contribuciones
    async getAllContribuciones(req: Request, res: Response): Promise<Response> {
        try {
            const contribuciones = await this.contribucionService.getAllContribuciones();
            return res.status(200).json(contribuciones);
        } catch (error) {
            return res.status(500).json({ error: (error as Error).message });
        }
    }

    // Obtener una contribución por ID
    async getContribucionById(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const contribucion = await this.contribucionService.getContribucionById(Number(id));
            if (!contribucion) {
                return res.status(404).json({ error: 'Contribución no encontrada' });
            }
            return res.status(200).json(contribucion);
        } catch (error) {
            return res.status(500).json({ error: (error as Error).message });
        }
    }

    // Actualizar una contribución
    async updateContribucion(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const contribucionData = req.body;
            await this.contribucionService.updateContribucion(Number(id), contribucionData);
            return res.status(200).json({ message: 'Contribución actualizada' });
        } catch (error) {
            return res.status(500).json({ error: (error as Error).message });
        }
    }

    // Eliminar una contribución
    async deleteContribucion(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            await this.contribucionService.deleteContribucion(Number(id));
            return res.status(200).json({ message: 'Contribución eliminada' });
        } catch (error) {
            return res.status(500).json({ error: (error as Error).message });
        }
    }

    // Obtener contribuciones por usuario
    async getContribucionesByUsuario(req: Request, res: Response): Promise<Response> {
        try {
            const { usuarioId } = req.params;
            const contribuciones = await this.contribucionService.getContribucionesByUsuario(Number(usuarioId));
            return res.status(200).json(contribuciones);
        } catch (error) {
            return res.status(500).json({ error: (error as Error).message });
        }
    }

    // Obtener contribuciones por estado
    async getContribucionesByEstado(req: Request, res: Response): Promise<Response> {
        try {
            const { estado } = req.params;
            const contribuciones = await this.contribucionService.getContribucionesByEstado(estado);
            return res.status(200).json(contribuciones);
        } catch (error) {
            return res.status(500).json({ error: (error as Error).message });
        }
    }

    // Obtener contribuciones por tipo de material
    async getContribucionesByTipoMaterial(req: Request, res: Response): Promise<Response> {
        try {
            const { tipoMaterial } = req.params;
            const contribuciones = await this.contribucionService.getContribucionesByTipoMaterial(tipoMaterial);
            return res.status(200).json(contribuciones);
        } catch (error) {
            return res.status(500).json({ error: (error as Error).message });
        }
    }

    // Cambiar estado de una contribución (solo para administradores)
    async changeEstadoContribucion(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const { estado } = req.body;
            
            // Validar que el estado sea válido
            const estadosValidos = ['pendiente', 'aprobada', 'rechazada', 'completada'];
            if (!estadosValidos.includes(estado)) {
                return res.status(400).json({ 
                    error: `Estado inválido. Estados válidos: ${estadosValidos.join(', ')}`,
                    timestamp: new Date().toISOString()
                });
            }
            
            // Verificar que el usuario sea administrador
            if (!req.user || req.user.rol.nombre !== 'admin') {
                return res.status(403).json({ 
                    error: 'Solo los administradores pueden cambiar el estado de las contribuciones',
                    timestamp: new Date().toISOString()
                });
            }
            
            await this.contribucionService.updateContribucion(Number(id), { estado });
            return res.status(200).json({ 
                message: `Estado de contribución cambiado a: ${estado}`,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            console.error('Error cambiando estado de contribución:', error);
            const errorMessage = (error as Error).message;
            return res.status(500).json({ 
                error: errorMessage,
                timestamp: new Date().toISOString()
            });
        }
    }

    // Obtener las contribuciones del usuario autenticado
    async getMisContribuciones(req: Request, res: Response): Promise<Response> {
        try {
            if (!req.user || !req.user.id) {
                return res.status(401).json({ error: 'Usuario no autenticado' });
            }
            const usuarioId = req.user.id;
            const contribuciones = await this.contribucionService.getContribucionesByUsuario(usuarioId);
            return res.status(200).json(contribuciones);
        } catch (error) {
            return res.status(500).json({ error: (error as Error).message });
        }
    }
}
