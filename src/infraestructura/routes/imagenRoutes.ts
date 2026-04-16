import { Router } from 'express';
import { ImagenController } from '../controllers/ImagenController';
import { getImageStorage } from '../storage/imageStorageFactory';

const router = Router();
const imagenController = new ImagenController(getImageStorage());

// Obtener todas las imágenes
router.get('/', async (req, res) => {
    try {
        await imagenController.obtenerListaImagenes(req, res);
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Error interno del servidor',
            error: (error as Error).message 
        });
    }
});

// Obtener imágenes por categoría
router.get('/categoria/:categoria', async (req, res) => {
    try {
        await imagenController.obtenerImagenesPorCategoria(req, res);
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Error interno del servidor',
            error: (error as Error).message 
        });
    }
});

export default router; 