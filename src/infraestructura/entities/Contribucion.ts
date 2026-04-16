import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Usuario } from './Usuario';  // Relación con la tabla usuarios

@Entity({ name: 'contribuciones', schema: 'arthome' })
export class Contribucion {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: 'usuario_id' })
    usuarioId!: number;

    @ManyToOne(() => Usuario, usuario => usuario.contribuciones, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'usuario_id' })
    usuario!: Usuario;

    @Column({ name: 'nombre_donante', length: 100, nullable: false })
    nombreDonante!: string;

    @Column({ name: 'correo_donante', length: 100, nullable: false })
    correoDonante!: string;

    @Column({ name: 'tipo_material', length: 100, nullable: false })
    tipoMaterial!: string;

    @Column({ name: 'descripcion', length: 255, nullable: false })
    descripcion!: string;

    @Column({ name: 'cantidad', type: 'int', nullable: false })
    cantidad!: number;

    @Column({ name: 'telefono', length: 15, nullable: false })
    telefono!: string;

    @CreateDateColumn({ name: 'fecha_contribucion', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    fechaContribucion!: Date;

    @Column({ name: 'estado', length: 20, default: 'pendiente' })
    estado!: string;
}
