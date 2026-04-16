import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from './Usuario';
import { Ciudad } from './Ciudad';
import { CodigoPostal } from './CodigoPostal';

@Entity({ name: 'direcciones_envio', schema: 'arthome' })
export class DireccionEnvio {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Usuario, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'usuario_id' })
    usuario!: Usuario;

    @Column({ length: 255 })
    direccion!: string;

    @ManyToOne(() => Ciudad, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'ciudad_id' })
    ciudad!: Ciudad;

    @ManyToOne(() => CodigoPostal, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'codigo_postal_id' })
    codigoPostal!: CodigoPostal;

    @Column({ length: 20 })
    telefonoContacto!: string;
} 