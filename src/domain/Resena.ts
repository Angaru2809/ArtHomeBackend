export interface Resena {
    id?: number;
    usuarioId: number;
    calificacion: number;
    comentario: string;
    fechaResena?: Date;
    activo?: boolean;
} 