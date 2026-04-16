import { Repository } from 'typeorm';
import { Carrito } from '../entities/Carrito';
import { CarritoPort } from '../../domain/CarritoPort';
import { AppDataSource } from '../config/data-base';

export class CarritoAdapter implements CarritoPort {
    private repository: Repository<Carrito>;

    constructor() {
        this.repository = AppDataSource.getRepository(Carrito);
    }

    async createCarrito(carritoData: any): Promise<number> {
        const carrito = this.repository.create(carritoData);
        const saved = await this.repository.save(carrito) as Carrito | Carrito[];
        if (Array.isArray(saved)) {
            return saved[0]?.id;
        }
        return saved.id;
    }

    async getCarritoById(id: number): Promise<any> {
        return this.repository.findOne({ where: { id }, relations: ['usuario'] });
    }

    async getAllCarritos(): Promise<any[]> {
        return this.repository.find({ relations: ['usuario'] });
    }

    async updateCarrito(id: number, carritoData: any): Promise<boolean> {
        const carrito = await this.repository.findOne({ where: { id } });
        if (!carrito) throw new Error('Carrito no encontrado');
        Object.assign(carrito, carritoData);
        await this.repository.save(carrito);
        return true;
    }

    async deleteCarrito(id: number): Promise<boolean> {
        const carrito = await this.repository.findOne({ where: { id } });
        if (!carrito) throw new Error('Carrito no encontrado');
        await this.repository.remove(carrito);
        return true;
    }
} 