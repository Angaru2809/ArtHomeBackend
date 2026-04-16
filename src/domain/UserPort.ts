import { User } from './User';

export interface UserPort {
  createUser(user: Omit<User, 'id'>): Promise<number>;
  getUserById(id: number): Promise<User | null>;
  getUserByEmail(email: string): Promise<User | null>;
  getUserByCedula(cedula: string): Promise<User | null>;
  getUserByTelefono(telefono: string): Promise<User | null>;
  updateUser(id: number, user: Partial<User>): Promise<boolean>;
  deleteUser(id: number): Promise<boolean>;
  getAllUsers(): Promise<User[]>;
  validateCiudadExists(ciudadId: number): Promise<boolean>;
  validateRoleExists(rolId: number): Promise<boolean>;
}
