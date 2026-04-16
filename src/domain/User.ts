import { Role } from './Role';
import { Ciudad } from './Ciudad';

export interface User {
  id: number;
  cedula: string;
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  ciudadId: number;
  ciudad: Ciudad;
  rolId: number;
  rol: Role;
  contrasenaHash: string;
  estado: boolean;
  fechaRegistro: Date;
}
