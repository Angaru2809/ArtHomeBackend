import * as express from 'express';
import * as path from 'path';
import * as http from 'http';
import * as cors from 'cors';
import helmet from 'helmet';
import * as morgan from 'morgan';
import { AppDataSource } from './infraestructura/config/data-base';
import usuarioRoutes from './infraestructura/routes/usuarioRoutes';
import roleRoutes from './infraestructura/routes/roleRoutes';
import ciudadRoutes from './infraestructura/routes/ciudadRoutes';
import contribucionRoutes from './infraestructura/routes/contribucionRoutes';
import { config } from './infraestructura/config/config';
import productoRoutes from './infraestructura/routes/productoRoutes';
import carritoRoutes from './infraestructura/routes/carritoRoutes';
import pedidoRoutes from './infraestructura/routes/pedidoRoutes';
import direccionRoutes from './infraestructura/routes/direccionEnvioRoutes';
import categoriaRoutes from './infraestructura/routes/categoriaRoutes';
import reseñaRoutes from './infraestructura/routes/resenaRoutes';
import imagenDirectorioRoutes from './infraestructura/routes/imagenRoutes';
import codigoPostalRoutes from './infraestructura/routes/codigopostalRoutes';

class Server {
    private app: express.Application;
    private readonly PORT: number;
    private httpServer?: http.Server;
    private shuttingDown = false;

    constructor() {
        this.app = express();
        this.PORT = config.server.port;
        this.configurarMiddlewares();
        this.configurarArchivosEstaticosLocales();
        this.configurarRutas();
        this.configurarManejoErrores();
    }

    private configurarMiddlewares(): void {
        this.app.use(cors());
        this.app.use(helmet());
        this.app.use(morgan('dev'));
        this.app.use(express.json());
    }

    /** Solo con STORAGE_PROVIDER=local: servir public/ e imágenes desde disco (factor IV: local es un backing concreto). */
    private configurarArchivosEstaticosLocales(): void {
        if (config.storage.provider !== 'local') {
            return;
        }
        this.app.use(express.static(path.join(process.cwd(), 'public')));
        const imgAbs = path.isAbsolute(config.storage.localRoot)
            ? config.storage.localRoot
            : path.join(process.cwd(), config.storage.localRoot);
        this.app.use('/images', express.static(imgAbs));
    }

    private configurarRutas(): void {
        this.app.use('/api/usuarios', usuarioRoutes);
        this.app.use('/api/roles', roleRoutes);
        this.app.use('/api/ciudades', ciudadRoutes);
        this.app.use('/api/contribuciones', contribucionRoutes);
        this.app.use('/api/productos', productoRoutes);
        this.app.use('/api/carritos', carritoRoutes);
        this.app.use('/api/pedidos', pedidoRoutes);
        this.app.use('/api/direcciones-envio', direccionRoutes);
        this.app.use('/api/categorias', categoriaRoutes);
        this.app.use('/api/resenas', reseñaRoutes);
        this.app.use('/api/imagenes-directorio', imagenDirectorioRoutes);
        this.app.use('/api/codigos-postales', codigoPostalRoutes);
    }

    private configurarManejoErrores(): void {
        this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
            console.error('Error en la aplicación:', err);
            
            const statusCode = err.statusCode || 500;
            const message = err.message || 'Error interno del servidor';
            
            res.status(statusCode).json({
                error: {
                    message,
                    status: statusCode,
                    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
                }
            });
        });
    }

    private registrarApagadoOrdenado(): void {
        const cerrar = async (signal: string) => {
            if (this.shuttingDown) {
                return;
            }
            this.shuttingDown = true;
            console.log(`Recibido ${signal}, cerrando conexiones...`);

            try {
                if (this.httpServer) {
                    await new Promise<void>((resolve, reject) => {
                        this.httpServer!.close((err) => (err ? reject(err) : resolve()));
                    });
                }
                if (AppDataSource.isInitialized) {
                    await AppDataSource.destroy();
                    console.log('✅ Conexión a la base de datos cerrada');
                }
            } catch (e) {
                console.error('Error durante el apagado:', e);
            } finally {
                process.exit(0);
            }
        };

        process.on('SIGTERM', () => {
            void cerrar('SIGTERM');
        });
        process.on('SIGINT', () => {
            void cerrar('SIGINT');
        });
    }

    public async iniciar(): Promise<void> {
        try {
            // Inicializar conexión a la base de datos
            await AppDataSource.initialize();
            console.log('✅ Conexión a la base de datos establecida');

            const host = process.env.HOST;
            const onListening = () => {
                const where = host ? `${host}:${this.PORT}` : `puerto ${this.PORT}`;
                console.log(`🚀 Servidor escuchando en ${where}`);
            };

            // HOST opcional (p. ej. 0.0.0.0 en contenedor). Si no se define, usa el comportamiento por defecto de Node.
            if (host) {
                this.httpServer = this.app.listen(this.PORT, host, onListening);
            } else {
                this.httpServer = this.app.listen(this.PORT, onListening);
            }

            this.registrarApagadoOrdenado();
        } catch (error) {
            console.error('❌ Error al iniciar el servidor:', error);
            process.exit(1);
        }
    }
}

// Crear e iniciar instancia del servidor
const server = new Server();
server.iniciar();
