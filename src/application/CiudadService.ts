import { CiudadPort } from '../domain/CiudadPort';
import { Ciudad } from '../domain/Ciudad';

export class CiudadService {
    private ciudadPort: CiudadPort;

    constructor(ciudadPort: CiudadPort) {
        this.ciudadPort = ciudadPort;
    }

    // Crear una nueva ciudad
    async createCiudad(ciudadData: Omit<Ciudad, 'id'>): Promise<Ciudad> {
        const existingCiudad = await this.ciudadPort.getCiudadByName(ciudadData.nombre);
        if (existingCiudad) {
            throw new Error('La ciudad ya existe');
        }

        const ciudadId = await this.ciudadPort.createCiudad(ciudadData);
        const ciudad = await this.ciudadPort.getCiudadById(ciudadId);

        if (!ciudad) {
            throw new Error('Error al crear ciudad');
        }

        return ciudad;
    }

    // Obtener ciudad por ID con relaciones
    async getCiudadById(id: number): Promise<Ciudad | null> {
        return await this.ciudadPort.getCiudadById(id);
    }

    // Obtener todas las ciudades con relaciones
    async getAllCiudades(): Promise<Ciudad[]> {
        return await this.ciudadPort.getAllCiudades();
    }

    // Eliminar ciudad
    async deleteCiudad(id: number): Promise<boolean> {
        const ciudad = await this.ciudadPort.getCiudadById(id);
        if (!ciudad) {
            throw new Error('Ciudad no encontrada');
        }

        return await this.ciudadPort.deleteCiudad(id);
    }
}
