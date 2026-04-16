import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Ciudad } from './Ciudad';

@Entity({ name: 'codigos_postales', schema: 'arthome' })
export class CodigoPostal {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Ciudad, ciudad => ciudad.codigosPostales, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'ciudad_id' })
    ciudad!: Ciudad;

    @Column({ length: 20 })
    codigo_postal!: string;
} 