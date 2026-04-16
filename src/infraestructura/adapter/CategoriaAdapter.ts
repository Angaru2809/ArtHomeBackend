import { Repository } from 'typeorm';
import { Categoria } from '../entities/Categoria';
import { CategoriaPort } from '../../domain/CategoriaPort';
import { AppDataSource } from '../config/data-base';

export class CategoriaAdapter implements CategoriaPort {
    private repository: Repository<Categoria>;

    constructor() {
        this.repository = AppDataSource.getRepository(Categoria);
    }

    async createCategoria(categoriaData: any): Promise<number> {
        const categoria = this.repository.create({ ...categoriaData, activo: categoriaData.activo !== false });
        const saved = await this.repository.save(categoria) as Categoria | Categoria[];
        if (Array.isArray(saved)) {
            return saved[0]?.id;
        }
        return saved.id;
    }

    async getCategoriaById(id: number): Promise<any> {
        return this.repository.findOne({ where: { id, activo: true } });
    }

    async getAllCategorias(): Promise<any[]> {
        return this.repository.find({ where: { activo: true } });
    }

    async updateCategoria(id: number, categoriaData: any): Promise<boolean> {
        const categoria = await this.repository.findOne({ where: { id } });
        if (!categoria) throw new Error('Categoría no encontrada');
        Object.assign(categoria, categoriaData);
        await this.repository.save(categoria);
        return true;
    }

    async deleteCategoria(id: number): Promise<boolean> {
        const categoria = await this.repository.findOne({ where: { id } });
        if (!categoria) throw new Error('Categoría no encontrada');
        if (!categoria.activo) return true;
        categoria.activo = false;
        await this.repository.save(categoria);
        return true;
    }
} 