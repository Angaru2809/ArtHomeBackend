import { CodigoPostal } from './CodigoPostal';

export interface CodigoPostalPort {
    createCodigoPostal(codigoPostal: Omit<CodigoPostal, 'id'>): Promise<number>;
    getCodigoPostalById(id: number): Promise<CodigoPostal | null>;
    getCodigoPostalByCityId(ciudadId: number): Promise<CodigoPostal[]>;
    getAllCodigosPostales(): Promise<CodigoPostal[]>;
    deleteCodigoPostal(id: number): Promise<boolean>;
}
