import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { config } from '../config/config';

// Definir la interfaz para el payload del token
interface TokenPayload {
    id: number;
    email: string;
    rol: {
        id: number;
        nombre: string;
    };
}

// Extender la interfaz Request para incluir la propiedad user
declare global {
    namespace Express {
        interface Request {
            user?: TokenPayload;
        }
    }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            res.status(401).json({ mensaje: 'No se proporcionó un token de autenticación' });
            return;
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            res.status(401).json({ mensaje: 'Formato de token inválido' });
            return;
        }

        const decoded = jwt.verify(token, config.jwt.secret) as TokenPayload;
        req.user = decoded;
        return next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            res.status(401).json({ mensaje: 'Token expirado' });
            return;
        }
        if (error instanceof jwt.JsonWebTokenError) {
            res.status(401).json({ mensaje: 'Token inválido' });
            return;
        }
        res.status(500).json({ mensaje: 'Error en la autenticación' });
        return;
    }
}; 