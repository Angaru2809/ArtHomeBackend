import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'categorias', schema: 'arthome' })
export class Categoria {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 100 })
    nombre!: string;

    @Column({ length: 255 })
    descripcion!: string;

    /** false = categoría retirada (borrado lógico) */
    @Column({ default: true })
    activo!: boolean;
} 