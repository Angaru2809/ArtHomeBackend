import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { CodigoPostal } from './CodigoPostal';
import { Usuario } from './Usuario';

@Entity({ name: 'ciudades', schema: 'arthome' })
export class Ciudad {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 100, unique: true })
    nombre!: string;

    @OneToMany(() => CodigoPostal, cp => cp.ciudad)
    codigosPostales!: CodigoPostal[];

    @OneToMany(() => Usuario, usuario => usuario.ciudad)
    usuarios!: Usuario[];
} 