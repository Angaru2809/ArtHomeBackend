import { CodigoPostalPort } from '../domain/CodigoPostalPort';
import { CodigoPostal } from '../domain/CodigoPostal';

export class CodigoPostalService {
    private codigoPostalPort: CodigoPostalPort;

    constructor(codigoPostalPort: CodigoPostalPort) {
        this.codigoPostalPort = codigoPostalPort;
    }

    // Crear un nuevo código postal
    async createCodigoPostal(codigoPostalData: Omit<CodigoPostal, 'id'>): Promise<CodigoPostal> {
        const existingCodigoPostal = await this.codigoPostalPort.getCodigoPostalByCityId(codigoPostalData.ciudad.id);
        if (existingCodigoPostal) {
            throw new Error('El código postal ya existe para esta ciudad');
        }

        const codigoPostalId = await this.codigoPostalPort.createCodigoPostal(codigoPostalData);
        const codigoPostal = await this.codigoPostalPort.getCodigoPostalById(codigoPostalId);

        if (!codigoPostal) {
            throw new Error('Error al crear código postal');
        }

        return codigoPostal;
    }

    // Obtener código postal por ID
    async getCodigoPostalById(id: number): Promise<CodigoPostal | null> {
        return await this.codigoPostalPort.getCodigoPostalById(id);
    }

    // Obtener códigos postales por ciudad
    async getCodigoPostalByCityId(ciudadId: number): Promise<CodigoPostal[]> {
        return await this.codigoPostalPort.getCodigoPostalByCityId(ciudadId);
    }

    // Obtener todos los códigos postales
    async getAllCodigosPostales(): Promise<CodigoPostal[]> {
        return await this.codigoPostalPort.getAllCodigosPostales();
    }

    // Eliminar código postal
    async deleteCodigoPostal(id: number): Promise<boolean> {
        const codigoPostal = await this.codigoPostalPort.getCodigoPostalById(id);
        if (!codigoPostal) {
            throw new Error('Código postal no encontrado');
        }

        return await this.codigoPostalPort.deleteCodigoPostal(id);
    }
}
