import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, JoinColumn, ManyToOne } from 'typeorm';
import { ProductosCarrito } from './ProductosCarrito';
import { ProductosPedido } from './ProductosPedido';
import { Categoria } from './Categoria';

@Entity({ name: 'productos', schema: 'arthome' })
export class Producto {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 100 })
    nombre!: string;

    @Column({ length: 255 })
    descripcion!: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    precio!: number;

    @Column({ type: 'int' })
    cantidad_stock!: number;

    @Column({ name: 'estado_stock', length: 20 })
    estadoStock!: string;

    @CreateDateColumn({ name: 'fecha_agregado', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    fechaAgregado!: Date;

    @Column({ name: 'categoria_id' })
    categoria_id!: number;

    @Column({ name: 'imagen_url', length: 255, nullable: true })
    imagenUrl!: string;

    /** false = retirado del catálogo (borrado lógico); no se borra la fila. */
    @Column({ default: true })
    activo!: boolean;

    @ManyToOne(() => Categoria)
    @JoinColumn({ name: 'categoria_id' })
    categoria!: Categoria;

    @OneToMany(() => ProductosCarrito, pc => pc.producto)
    productosCarrito!: ProductosCarrito[];

    @OneToMany(() => ProductosPedido, pp => pp.producto)
    productosPedido!: ProductosPedido[];
} 