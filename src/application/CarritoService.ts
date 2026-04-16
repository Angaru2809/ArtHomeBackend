import { CarritoPort } from '../domain/CarritoPort';

export class CarritoService {
    private carritoPort: CarritoPort;

    constructor(carritoPort: CarritoPort) {
        this.carritoPort = carritoPort;
    }

    async createCarrito(carritoData: any) {
        const id = await this.carritoPort.createCarrito(carritoData);
        return this.carritoPort.getCarritoById(id);
    }

    async getAllCarritos() {
        return this.carritoPort.getAllCarritos();
    }

    async getCarritoById(id: number) {
        return this.carritoPort.getCarritoById(id);
    }

    async updateCarrito(id: number, carritoData: any) {
        await this.carritoPort.updateCarrito(id, carritoData);
    }

    async deleteCarrito(id: number) {
        await this.carritoPort.deleteCarrito(id);
    }
} 