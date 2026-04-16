import { Categoria } from './Categoria';

export interface CategoriaPort {
    createCategoria(categoria: Omit<Categoria, 'id'>): Promise<number>;
    getCategoriaById(id: number): Promise<Categoria | null>;
    getAllCategorias(): Promise<Categoria[]>;
    updateCategoria(id: number, categoria: Partial<Categoria>): Promise<boolean>;
    deleteCategoria(id: number): Promise<boolean>;
} 