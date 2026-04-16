import { Usuario } from '../infraestructura/entities/Usuario';  // Relación con la entidad Usuario

export interface Contribucion {
    id: number;
    usuarioId: number;              // ID del usuario que realiza la contribución
    nombreDonante: string;          // Nombre del donante
    correoDonante: string;          // Correo del donante
    tipoMaterial: string;           // Tipo de material donado
    descripcion: string;            // Descripción de la contribución
    cantidad: number;               // Cantidad de material donado
    telefono: string;               // Teléfono del donante
    fechaContribucion: Date;        // Fecha de la contribución
    estado: string;                 // Estado de la contribución (pendiente, completado, etc.)
    usuario?: Usuario;             // Relación con el usuario que hace la contribución
}
