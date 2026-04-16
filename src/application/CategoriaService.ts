import { CategoriaPort } from '../domain/CategoriaPort';

export class CategoriaService {
    private categoriaPort: CategoriaPort;

    constructor(categoriaPort: CategoriaPort) {
        this.categoriaPort = categoriaPort;
    }
    
    async createCategoria(categoriaData: any) {
        const id = await this.categoriaPort.createCategoria(categoriaData);
        return this.categoriaPort.getCategoriaById(id);
    }

    async getAllCategorias() {
        return this.categoriaPort.getAllCategorias();
    }

    async getCategoriaById(id: number) {
        return this.categoriaPort.getCategoriaById(id);
    }

    async updateCategoria(id: number, categoriaData: any) {
        await this.categoriaPort.updateCategoria(id, categoriaData);
    }

    async deleteCategoria(id: number) {
        await this.categoriaPort.deleteCategoria(id);
    }
} 