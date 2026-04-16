import { Repository } from 'typeorm';
import { Producto } from '../entities/Producto';
import { Categoria } from '../entities/Categoria';
import { ProductoPort } from '../../domain/ProductoPort';
import { AppDataSource } from '../config/data-base';

export class ProductoAdapter implements ProductoPort {
    private repository: Repository<Producto>;
    private categoriaRepository: Repository<Categoria>;

    constructor() {
        this.repository = AppDataSource.getRepository(Producto);
        this.categoriaRepository = AppDataSource.getRepository(Categoria);
    }

    async createProducto(productoData: any): Promise<number> {
        const producto = this.repository.create({ ...productoData, activo: productoData.activo !== false });
        const saved = await this.repository.save(producto);
        return (saved as unknown as Producto).id;
    }

    async getProductoById(id: number): Promise<any> {
        return this.repository.findOne({
            where: { id, activo: true },
            relations: ['categoria']
        });
    }

    async getAllProductos(): Promise<any[]> {
        return this.repository.find({
            where: { activo: true },
            relations: ['categoria']
        });
    }

    async updateProducto(id: number, productoData: any): Promise<boolean> {
        const producto = await this.repository.findOne({ where: { id } });
        if (!producto) throw new Error('Producto no encontrado');
        Object.assign(producto, productoData);
        await this.repository.save(producto);
        return true;
    }

    async deleteProducto(id: number): Promise<boolean> {
        const producto = await this.repository.findOne({ where: { id } });
        if (!producto) throw new Error('Producto no encontrado');
        if (!producto.activo) return true;
        producto.activo = false;
        await this.repository.save(producto);
        return true;
    }

    async getCatalogoPorCategoria(categoria: number | string): Promise<any[]> {
        console.log('🔍 ProductoAdapter - Recibido:', categoria, 'tipo:', typeof categoria);
        let categoriaId: number | null = null;
        
        if (typeof categoria === 'string') {
            console.log('🔍 Buscando categoría por nombre:', categoria);
            // COMPARACIÓN: Buscar categoría por nombre
            const cat = await this.categoriaRepository.findOne({
                where: { nombre: categoria, activo: true },
            });
            
            if (!cat) {
                console.log('❌ Categoría no encontrada en BD:', categoria);
                // ❌ NO HAY MATCH: Retorna array vacío
                return [];
            }
            
            console.log('✅ Categoría encontrada en BD:', cat);
            // ✅ HAY MATCH: Usa el ID encontrado
            categoriaId = cat.id;
        } else {
            console.log('🔍 Usando ID de categoría directamente:', categoria);
            categoriaId = categoria;
        }
        
        console.log('🔍 Filtrando productos por categoria_id:', categoriaId);
        // Filtrar productos por categoria_id usando la relación
        const productos = await this.repository
            .createQueryBuilder('producto')
            .leftJoinAndSelect('producto.categoria', 'categoria')
            .where('producto.categoria_id = :categoriaId', { categoriaId })
            .andWhere('producto.activo = :activo', { activo: true })
            .getMany();
        
        console.log('📦 Productos encontrados:', productos.length);
        return productos;
    }

    async buscarPorNombre(nombre: string): Promise<any[]> {
        return this.repository.createQueryBuilder('producto')
            .leftJoinAndSelect('producto.categoria', 'categoria')
            .where('LOWER(producto.nombre) LIKE :nombre', { nombre: `%${nombre.toLowerCase()}%` })
            .andWhere('producto.activo = :activo', { activo: true })
            .getMany();
    }
} 