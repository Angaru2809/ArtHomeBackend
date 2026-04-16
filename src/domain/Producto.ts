import { Categoria } from './Categoria';

export interface Producto {
    id?: number;
    nombre: string;
    descripcion?: string;
    precio: number;
    cantidad_stock: number;
    estado_stock?: string;
    categoria_id: number;
    fecha_agregado?: Date;
    imagenUrl?: string;
    /** Catálogo: false si fue eliminado lógicamente */
    activo?: boolean;
    categoria?: Categoria;
}

