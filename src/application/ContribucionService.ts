import { ContribucionPort } from '../domain/ContribucionPort';

export class ContribucionService {
    private contribucionPort: ContribucionPort;

    constructor(contribucionPort: ContribucionPort) {
        this.contribucionPort = contribucionPort;
    }

    // Crear una nueva contribución
    async createContribucion(contribucionData: any): Promise<any> {
        const id = await this.contribucionPort.createContribucion(contribucionData);
        return this.contribucionPort.getContribucionById(id);
    }

    // Obtener todas las contribuciones
    async getAllContribuciones(): Promise<any[]> {
        return this.contribucionPort.getAllContribuciones();
    }

    // Obtener una contribución por ID
    async getContribucionById(id: number): Promise<any> {
        return this.contribucionPort.getContribucionById(id);
    }

    // Actualizar una contribución
    async updateContribucion(id: number, contribucionData: any): Promise<void> {
        await this.contribucionPort.updateContribucion(id, contribucionData);
    }

    // Eliminar una contribución
    async deleteContribucion(id: number): Promise<void> {
        await this.contribucionPort.deleteContribucion(id);
    }

    // Obtener contribuciones por usuario
    async getContribucionesByUsuario(usuarioId: number): Promise<any[]> {
        return this.contribucionPort.getContribucionesByUsuario(usuarioId);
    }

    // Obtener contribuciones por estado
    async getContribucionesByEstado(estado: string): Promise<any[]> {
        return this.contribucionPort.getContribucionesByEstado(estado);
    }

    // Obtener contribuciones por tipo de material
    async getContribucionesByTipoMaterial(tipoMaterial: string): Promise<any[]> {
        return this.contribucionPort.getContribucionesByTipoMaterial(tipoMaterial);
    }
}
