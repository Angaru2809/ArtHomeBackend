import { DireccionEnvio } from './DireccionEnvio';

export interface DireccionEnvioPort {
    createDireccionEnvio(direccion: Omit<DireccionEnvio, 'id'>): Promise<number>;
    getDireccionEnvioById(id: number): Promise<DireccionEnvio | null>;
    getAllDireccionesEnvio(): Promise<DireccionEnvio[]>;
    updateDireccionEnvio(id: number, direccion: Partial<DireccionEnvio>): Promise<boolean>;
    deleteDireccionEnvio(id: number): Promise<boolean>;
} 