import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Usuario } from './Usuario';

@Entity({ name: 'resenas', schema: 'arthome' })
export class Resena {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Usuario, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'usuario_id' })
    usuario!: Usuario;

    @Column({ type: 'int' })
    calificacion!: number;

    @Column({ length: 255 })
    comentario!: string;

    @CreateDateColumn({ name: 'fecha_resena', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    fechaResena!: Date;

    /** false = reseña oculta (borrado lógico) */
    @Column({ default: true })
    activo!: boolean;
} 