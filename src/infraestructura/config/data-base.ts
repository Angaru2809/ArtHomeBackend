import { DataSource } from "typeorm";
import { config } from "./config";
import { Usuario } from "../entities/Usuario";
import { Role } from "../entities/Role";
import { Ciudad } from "../entities/Ciudad";
import { CodigoPostal } from "../entities/CodigoPostal";
import { Contribucion } from "../entities/Contribucion";
import { Producto } from "../entities/Producto";

import { Carrito } from "../entities/Carrito";
import { ProductosCarrito } from "../entities/ProductosCarrito";
import { ProductosPedido } from "../entities/ProductosPedido";
import { Resena } from "../entities/Resena";
import { Categoria } from "../entities/Categoria";
import { DireccionEnvio } from "../entities/DireccionEnvio";
import { Pedido } from "../entities/Pedido";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: config.database.host,
    port: config.database.port,
    username: config.database.username,
    password: config.database.password,
    database: config.database.database,
    schema: config.database.schema,
    synchronize: false,
    logging: true,
    entities: [Usuario, Role, Ciudad, CodigoPostal, Contribucion, Producto, Carrito, ProductosCarrito, ProductosPedido, Resena, Categoria, DireccionEnvio, Pedido],
    migrations: [],
    subscribers: []
});

// Función para conectar a la base de datos
export const connectDB = async () => {
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
            console.log("✅ Conexión a PostgreSQL establecida correctamente");
        }
    } catch (error: any) {
        console.error("❌ Error al conectar con PostgreSQL:", {
            message: error.message,
            code: error.code,
            stack: error.stack
        });
        throw error;
    }
}