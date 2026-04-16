import { ProductosCarritoPort } from '../domain/ProductosCarritoPort';

export class ProductosCarritoService {
    private productosCarritoPort: ProductosCarritoPort;

    constructor(productosCarritoPort: ProductosCarritoPort) {
        this.productosCarritoPort = productosCarritoPort;
    }

    async createProductosCarrito(pcData: any) {
        const id = await this.productosCarritoPort.createProductosCarrito(pcData);
        return this.productosCarritoPort.getProductosCarritoById(id);
    }

    async getAllProductosCarrito() {
        return this.productosCarritoPort.getAllProductosCarrito();
    }

    async getProductosCarritoById(id: number) {
        return this.productosCarritoPort.getProductosCarritoById(id);
    }

    async updateProductosCarrito(id: number, pcData: any) {
        await this.productosCarritoPort.updateProductosCarrito(id, pcData);
    }

    async deleteProductosCarrito(id: number) {
        await this.productosCarritoPort.deleteProductosCarrito(id);
    }
} 