import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Usuario } from './Usuario';

@Entity({ name: 'roles', schema: 'arthome' })
export class Role {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 50, unique: true })
    nombre!: string;

    @OneToMany(() => Usuario, usuario => usuario.rol)
    usuarios!: Usuario[];
} 