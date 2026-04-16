import { Repository } from 'typeorm';
import { Ciudad } from '../entities/Ciudad';
import { CiudadPort } from '../../domain/CiudadPort';
import { AppDataSource } from '../config/data-base';

export class CiudadAdapter implements CiudadPort {
    private repository: Repository<Ciudad>;

    constructor() {
        this.repository = AppDataSource.getRepository(Ciudad);
    }

    // Crear una nueva ciudad
    async createCiudad(ciudad: Omit<Ciudad, 'id'>): Promise<number> {
        const newCiudad = this.repository.create(ciudad);
        const savedCiudad = await this.repository.save(newCiudad);
        return savedCiudad.id;
    }

    // Obtener ciudad por ID con relaciones
    async getCiudadById(id: number): Promise<Ciudad | null> {
        const ciudad = await this.repository.findOne({
            where: { id },
            relations: ['codigosPostales', 'usuarios'] // Incluyendo relaciones
        });
        return ciudad || null;
    }

    // Obtener ciudad por nombre
    async getCiudadByName(name: string): Promise<Ciudad | null> {
        const ciudad = await this.repository.findOne({
            where: { nombre: name },
            relations: ['codigosPostales', 'usuarios']
        });
        return ciudad || null;
    }

    // Obtener todas las ciudades con relaciones
    async getAllCiudades(): Promise<Ciudad[]> {
        return await this.repository.find({
            relations: ['codigosPostales', 'usuarios'] // Incluyendo relaciones
        });
    }

    // Eliminar ciudad
    async deleteCiudad(id: number): Promise<boolean> {
        const ciudad = await this.repository.findOne({ where: { id } });
        if (!ciudad) {
            throw new Error('Ciudad no encontrada');
        }

        await this.repository.remove(ciudad);
        return true;
    }
}
