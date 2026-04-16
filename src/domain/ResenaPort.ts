import { Resena } from './Resena';

export interface ResenaPort {
    createResena(resena: Omit<Resena, 'id'>): Promise<number>;
    getResenaById(id: number): Promise<Resena | null>;
    getAllResenas(): Promise<Resena[]>;
    updateResena(id: number, resena: Partial<Resena>): Promise<boolean>;
    deleteResena(id: number): Promise<boolean>;
} 