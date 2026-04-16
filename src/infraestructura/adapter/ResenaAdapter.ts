import { Repository } from 'typeorm';
import { Resena } from '../entities/Resena';
import { ResenaPort } from '../../domain/ResenaPort';
import { AppDataSource } from '../config/data-base';
import { Usuario } from '../entities/Usuario';

export class ResenaAdapter implements ResenaPort {
    private repository: Repository<Resena>;

    constructor() {
        this.repository = AppDataSource.getRepository(Resena);
    }

    async createResena(resenaData: any): Promise<number> {
        let usuario = null;
        if (resenaData.usuarioId) {
            usuario = await AppDataSource.getRepository(Usuario).findOne({ where: { id: resenaData.usuarioId } });
        }
        const resena = this.repository.create({
            ...resenaData,
            activo: resenaData.activo !== false,
            usuario: usuario || undefined,
        });
        const saved = await this.repository.save(resena) as Resena | Resena[];
        if (Array.isArray(saved)) {
            return saved[0]?.id;
        }
        return saved.id;
    }

    async getResenaById(id: number): Promise<any> {
        return this.repository.findOne({ where: { id, activo: true }, relations: ['usuario'] });
    }

    async getAllResenas(): Promise<any[]> {
        return this.repository.find({ where: { activo: true }, relations: ['usuario'] });
    }

    async updateResena(id: number, resenaData: any): Promise<boolean> {
        const resena = await this.repository.findOne({ where: { id } });
        if (!resena) throw new Error('Reseña no encontrada');
        Object.assign(resena, resenaData);
        await this.repository.save(resena);
        return true;
    }

    async deleteResena(id: number): Promise<boolean> {
        const resena = await this.repository.findOne({ where: { id } });
        if (!resena) throw new Error('Reseña no encontrada');
        if (!resena.activo) return true;
        resena.activo = false;
        await this.repository.save(resena);
        return true;
    }
} 