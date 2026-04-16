import { Ciudad } from './Ciudad';

export interface CiudadPort {
    createCiudad(ciudad: Omit<Ciudad, 'id'>): Promise<number>;
    getCiudadById(id: number): Promise<Ciudad | null>;
    getCiudadByName(name: string): Promise<Ciudad | null>;
    getAllCiudades(): Promise<Ciudad[]>;  // Método que devuelve todas las ciudades con relaciones
    deleteCiudad(id: number): Promise<boolean>;
}
