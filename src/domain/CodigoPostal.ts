import { Ciudad } from './Ciudad';  // Importa la entidad Ciudad

export interface CodigoPostal {
  id?: number;                  // ID del código postal
  ciudad: Ciudad;               // Relación con la entidad Ciudad completa
  codigo_postal: string;        // El código postal
}