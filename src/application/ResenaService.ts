import { ResenaPort } from '../domain/ResenaPort';

export class ResenaService {
    private resenaPort: ResenaPort;

    constructor(resenaPort: ResenaPort) {
        this.resenaPort = resenaPort;
    }

    async createResena(resenaData: any) {
        const id = await this.resenaPort.createResena(resenaData);
        return this.resenaPort.getResenaById(id);
    }

    async getResenaById(id: number) {
        return this.resenaPort.getResenaById(id);
    }

    async getAllResenas() {
        return this.resenaPort.getAllResenas();
    }

    async updateResena(id: number, resenaData: any) {
        await this.resenaPort.updateResena(id, resenaData);
    }

    async deleteResena(id: number) {
        await this.resenaPort.deleteResena(id);
    }
} 