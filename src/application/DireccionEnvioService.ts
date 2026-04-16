import { DireccionEnvioPort } from '../domain/DireccionEnvioPort';

export class DireccionEnvioService {
    private direccionEnvioPort: DireccionEnvioPort;

    constructor(direccionEnvioPort: DireccionEnvioPort) {
        this.direccionEnvioPort = direccionEnvioPort;
    }

    async createDireccionEnvio(direccionData: any) {
        const id = await this.direccionEnvioPort.createDireccionEnvio(direccionData);
        return this.direccionEnvioPort.getDireccionEnvioById(id);
    }

    async getAllDireccionesEnvio() {
        return this.direccionEnvioPort.getAllDireccionesEnvio();
    }

    async getDireccionEnvioById(id: number) {
        return this.direccionEnvioPort.getDireccionEnvioById(id);
    }

    async updateDireccionEnvio(id: number, direccionData: any) {
        await this.direccionEnvioPort.updateDireccionEnvio(id, direccionData);
    }

    async deleteDireccionEnvio(id: number) {
        await this.direccionEnvioPort.deleteDireccionEnvio(id);
    }
} 