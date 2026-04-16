import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Usuario } from './Usuario';
import { ProductosCarrito } from './ProductosCarrito';

@Entity({ name: 'carritos', schema: 'arthome' })
export class Carrito {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Usuario, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'usuario_id' })
    usuario!: Usuario;

    @OneToMany(() => ProductosCarrito, pc => pc.carrito)
    productosCarrito!: ProductosCarrito[];
} 