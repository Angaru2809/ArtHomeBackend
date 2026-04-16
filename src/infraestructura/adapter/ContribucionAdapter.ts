import { Repository } from 'typeorm';
import { Contribucion } from '../entities/Contribucion';
import { ContribucionPort } from '../../domain/ContribucionPort';
import { AppDataSource } from '../config/data-base';

export class ContribucionAdapter implements ContribucionPort {
    private repository: Repository<Contribucion>;

    constructor() {
        this.repository = AppDataSource.getRepository(Contribucion);
    }

    // Crear una nueva contribución
    async createContribucion(contribucionData: any): Promise<number> {
        try {
            console.log('Datos recibidos para crear contribución:', contribucionData);
            
            // Validar datos requeridos (solo los que proporciona el usuario)
            if (!contribucionData.nombreDonante) {
                throw new Error('nombreDonante es requerido');
            }
            if (!contribucionData.correoDonante) {
                throw new Error('correoDonante es requerido');
            }
            if (!contribucionData.tipoMaterial) {
                throw new Error('tipoMaterial es requerido');
            }
            if (!contribucionData.descripcion) {
                throw new Error('descripcion es requerido');
            }
            if (!contribucionData.cantidad) {
                throw new Error('cantidad es requerido');
            }
            if (!contribucionData.telefono) {
                throw new Error('telefono es requerido');
            }

            const contribucion = this.repository.create({
                usuarioId: contribucionData.usuarioId, // Se obtendrá del usuario autenticado
                nombreDonante: contribucionData.nombreDonante,
                correoDonante: contribucionData.correoDonante,
                tipoMaterial: contribucionData.tipoMaterial,
                descripcion: contribucionData.descripcion,
                cantidad: contribucionData.cantidad,
                telefono: contribucionData.telefono,
                estado: 'pendiente' // Siempre se establece como pendiente por el backend
            });
            
            console.log('Entidad contribución creada:', contribucion);
            
            const contribucionGuardada = await this.repository.save(contribucion);
            console.log('Contribución guardada exitosamente:', contribucionGuardada);
            
            return contribucionGuardada.id;
        } catch (error) {
            console.error('Error detallado creando contribución:', {
                message: (error as any).message,
                code: (error as any).code,
                detail: (error as any).detail,
                constraint: (error as any).constraint,
                table: (error as any).table,
                column: (error as any).column,
                stack: (error as any).stack
            });
            throw new Error(`Error al crear la contribución: ${(error as any).message}`);
        }
    }

    // Obtener contribución por ID
    async getContribucionById(id: number): Promise<any> {
        try {
            const contribucion = await this.repository.findOne({ 
                where: { id },
                relations: ['usuario']
            });
            return contribucion || null;
        } catch (error) {
            console.error('Error obteniendo contribución:', error);
            throw new Error('Error al obtener la contribución');
        }
    }

    // Obtener todas las contribuciones
    async getAllContribuciones(): Promise<any[]> {
        try {
            return await this.repository.find({
                relations: ['usuario'],
                order: { fechaContribucion: 'DESC' }
            });
        } catch (error) {
            console.error('Error obteniendo contribuciones:', error);
            throw new Error('Error al obtener las contribuciones');
        }
    }

    // Actualizar una contribución
    async updateContribucion(id: number, contribucionData: any): Promise<boolean> {
        try {
            const contribucion = await this.repository.findOne({ where: { id } });
            if (!contribucion) {
                throw new Error('Contribución no encontrada');
            }
            
            Object.assign(contribucion, contribucionData);
            await this.repository.save(contribucion);
            return true;
        } catch (error) {
            console.error('Error actualizando contribución:', error);
            throw new Error('Error al actualizar la contribución');
        }
    }

    // Eliminar una contribución
    async deleteContribucion(id: number): Promise<boolean> {
        try {
            const contribucion = await this.repository.findOne({ where: { id } });
            if (!contribucion) {
                throw new Error('Contribución no encontrada');
            }
            
            await this.repository.remove(contribucion);
            return true;
        } catch (error) {
            console.error('Error eliminando contribución:', error);
            throw new Error('Error al eliminar la contribución');
        }
    }

    // Obtener contribuciones por usuario
    async getContribucionesByUsuario(usuarioId: number): Promise<any[]> {
        try {
            return await this.repository.find({
                where: { 
                    usuario: {
                        id: usuarioId 
                    }
                },
                relations: ['usuario'],
                order: { fechaContribucion: 'DESC' }
            });
        } catch (error) {
            console.error('Error obteniendo contribuciones por usuario:', error);
            throw new Error('Error al obtener las contribuciones del usuario');
        }
    }

    // Obtener contribuciones por estado
    async getContribucionesByEstado(estado: string): Promise<any[]> {
        try {
            return await this.repository.find({
                where: { estado },
                relations: ['usuario'],
                order: { fechaContribucion: 'DESC' }
            });
        } catch (error) {
            console.error('Error obteniendo contribuciones por estado:', error);
            throw new Error('Error al obtener las contribuciones por estado');
        }
    }

    // Obtener contribuciones por tipo de material
    async getContribucionesByTipoMaterial(tipoMaterial: string): Promise<any[]> {
        try {
            return await this.repository.find({
                where: { tipoMaterial },
                relations: ['usuario'],
                order: { fechaContribucion: 'DESC' }
            });
        } catch (error) {
            console.error('Error obteniendo contribuciones por tipo de material:', error);
            throw new Error('Error al obtener las contribuciones por tipo de material');
        }
    }
}
