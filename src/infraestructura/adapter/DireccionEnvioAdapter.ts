import { Repository } from 'typeorm';
import { DireccionEnvio } from '../entities/DireccionEnvio';
import { DireccionEnvioPort } from '../../domain/DireccionEnvioPort';
import { AppDataSource } from '../config/data-base';

export class DireccionEnvioAdapter implements DireccionEnvioPort {
    private repository: Repository<DireccionEnvio>;

    constructor() {
        this.repository = AppDataSource.getRepository(DireccionEnvio);
    }

    async createDireccionEnvio(direccionData: any): Promise<number> {
        const direccion = this.repository.create(direccionData);
        const saved = await this.repository.save(direccion) as DireccionEnvio | DireccionEnvio[];
        if (Array.isArray(saved)) {
            return saved[0]?.id;
        }
        return saved.id;
    }

    async getDireccionEnvioById(id: number): Promise<any> {
        return this.repository.findOne({ where: { id }, relations: ['usuario', 'ciudad', 'codigoPostal'] });
    }

    async getAllDireccionesEnvio(): Promise<any[]> {
        return this.repository.find({ relations: ['usuario', 'ciudad', 'codigoPostal'] });
    }

    async updateDireccionEnvio(id: number, direccionData: any): Promise<boolean> {
        const direccion = await this.repository.findOne({ where: { id } });
        if (!direccion) throw new Error('Dirección de envío no encontrada');
        Object.assign(direccion, direccionData);
        await this.repository.save(direccion);
        return true;
    }

    async deleteDireccionEnvio(id: number): Promise<boolean> {
        const direccion = await this.repository.findOne({ where: { id } });
        if (!direccion) throw new Error('Dirección de envío no encontrada');
        await this.repository.remove(direccion);
        return true;
    }
} 