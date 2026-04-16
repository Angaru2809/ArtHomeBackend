import * as express from "express";
import * as cors from "cors";
import * as path from "path";

class App {
    private app: express.Application;

    constructor() {
        this.app = express();
        this.middleware();
    }

    private middleware(): void {
        // Middleware de seguridad
        this.app.use(cors());
        
        // Middleware para parsear JSON
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));

        // Servir archivos estáticos desde public
        this.app.use(express.static(path.join(process.cwd(), 'public')));
        
        // Servir imágenes desde public/images
        this.app.use('/images', express.static(path.join(process.cwd(), 'public/images')));

    }

    getApp() {
        return this.app;
    }
}

export default new App().getApp();