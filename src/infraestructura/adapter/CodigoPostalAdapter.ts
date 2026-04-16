// infraestructura/adapter/CodigoPostalAdapter.ts

import { Repository } from 'typeorm';
import { CodigoPostal } from '../entities/CodigoPostal';
import { CodigoPostalPort } from '../../domain/CodigoPostalPort';
import { AppDataSource } from '../config/data-base';

export class CodigoPostalAdapter implements CodigoPostalPort {
    private repository: Repository<CodigoPostal>;

    constructor() {
        this.repository = AppDataSource.getRepository(CodigoPostal);
    }

    // Crear un nuevo código postal
    async createCodigoPostal(codigoPostal: Omit<CodigoPostal, 'id'>): Promise<number> {
        const newCodigoPostal = this.repository.create(codigoPostal);
        const savedCodigoPostal = await this.repository.save(newCodigoPostal);
        return savedCodigoPostal.id;  // Retornamos el ID del código postal recién creado
    }

    // Obtener código postal por ID con relaciones
    async getCodigoPostalById(id: number): Promise<CodigoPostal | null> {
        const codigoPostal = await this.repository.findOne({
            where: { id },
            relations: ['ciudad']  // Incluimos la relación con la ciudad
        });
        return codigoPostal || null;
    }

    // Obtener todos los códigos postales
    async getAllCodigosPostales(): Promise<CodigoPostal[]> {
        return await this.repository.find({
            relations: ['ciudad']  // Incluimos la relación con la ciudad
        });
    }

    // Obtener códigos postales por ciudad (usando el ID de la ciudad)
    async getCodigoPostalByCityId(ciudadId: number): Promise<CodigoPostal[]> {
        return await this.repository.find({
            where: { ciudad: { id: ciudadId } },
            relations: ['ciudad']  // Incluimos la relación con la ciudad
        });
    }

    // Eliminar un código postal
    async deleteCodigoPostal(id: number): Promise<boolean> {
        const codigoPostal = await this.repository.findOne({ where: { id } });
        if (!codigoPostal) {
            throw new Error('Código postal no encontrado');
        }

        await this.repository.remove(codigoPostal);  // Eliminamos el código postal
        return true;
    }
}
