import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { Role } from './Role';
import { Ciudad } from './Ciudad';
import { Contribucion } from './Contribucion';

@Entity({ name: 'usuarios', schema: 'arthome' })
export class Usuario {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 20, unique: true, nullable: true })
    cedula!: string;

    @Column({ length: 100 })
    nombre!: string;

    @Column({ length: 100, unique: true })
    email!: string;

    @Column({ length: 15, nullable: true })
    telefono!: string;

    @Column({ length: 255, nullable: true })
    direccion!: string;

    @ManyToOne(() => Ciudad, ciudad => ciudad.usuarios, { nullable: true })
    @JoinColumn({ name: 'ciudad_id' })
    ciudad!: Ciudad;

    @CreateDateColumn({ name: 'fecha_registro' })
    fechaRegistro!: Date;

    @ManyToOne(() => Role)
    @JoinColumn({ name: 'rol_id' })
    rol!: Role;

    @Column({ name: 'contrasena_hash', length: 255 })
    contrasenaHash!: string;

    @Column({ default: true })
    estado!: boolean;

    @OneToMany(() => Contribucion, contribucion => contribucion.usuario)
    contribuciones!: Contribucion[];
} 