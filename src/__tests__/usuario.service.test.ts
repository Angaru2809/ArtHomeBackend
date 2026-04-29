import { UsuarioService } from '../application/UsuarioService';
import type { UserPort } from '../domain/UserPort';
import type { User } from '../domain/User';

jest.mock('../infraestructura/config/config', () => ({
  config: {
    jwt: { secret: 'test-secret', expiresIn: '3600' },
    bcrypt: { saltRounds: 10 },
  },
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => 'token'),
  verify: jest.fn(() => ({ id: 1 })),
}));

jest.mock('bcrypt', () => ({
  genSalt: jest.fn(async () => 'salt'),
  hash: jest.fn(async () => 'hashed'),
  compare: jest.fn(async () => true),
}));

function makeUser(overrides: Partial<User> = {}): User {
  return {
    id: 1,
    cedula: '123',
    nombre: 'Test User',
    email: 'test@example.com',
    telefono: '3001234567',
    direccion: 'Calle 1',
    ciudadId: 1,
    ciudad: {} as any,
    rolId: 1,
    rol: { nombre: 'cliente' } as any,
    contrasenaHash: 'HASH',
    estado: true,
    fechaRegistro: new Date(),
    ...overrides,
  };
}

function makePort(overrides: Partial<UserPort> = {}): UserPort {
  const base: UserPort = {
    createUser: jest.fn(async () => 1),
    getUserById: jest.fn(async () => makeUser()),
    getUserByEmail: jest.fn(async (): Promise<User | null> => null),
    getUserByCedula: jest.fn(async (): Promise<User | null> => null),
    getUserByTelefono: jest.fn(async (): Promise<User | null> => null),
    updateUser: jest.fn(async () => true),
    deleteUser: jest.fn(async () => true),
    getAllUsers: jest.fn(async () => [makeUser()]),
    validateCiudadExists: jest.fn(async () => true),
    validateRoleExists: jest.fn(async () => true),
    ...overrides,
  };
  return base;
}

describe('UsuarioService (unit)', () => {
  beforeEach(async () => {
    const bcrypt = await import('bcrypt');
    (bcrypt.compare as any).mockResolvedValue(true);
  });

  test('crearUsuario falla si el email ya existe', async () => {
    const port = makePort({
      getUserByEmail: jest.fn(async () => makeUser()),
    });
    const service = new UsuarioService(port);

    await expect(
      service.crearUsuario({ email: 'test@example.com', contrasena: 'x', nombre: 'A' })
    ).rejects.toThrow('El correo electrónico ya está registrado');
  });

  test('crearUsuario falla si la cédula ya existe', async () => {
    const port = makePort({
      getUserByCedula: jest.fn(async () => makeUser({ cedula: '999' })),
    });
    const service = new UsuarioService(port);

    await expect(
      service.crearUsuario({
        email: 'nuevo@example.com',
        contrasena: 'x',
        nombre: 'A',
        cedula: '999',
      })
    ).rejects.toThrow('La cédula ya está registrada');
  });

  test('crearUsuario falla si la ciudad no existe', async () => {
    const port = makePort({
      validateCiudadExists: jest.fn(async () => false),
    });
    const service = new UsuarioService(port);

    await expect(
      service.crearUsuario({
        email: 'nuevo@example.com',
        contrasena: 'x',
        nombre: 'A',
        ciudadId: 123,
      })
    ).rejects.toThrow('La ciudad especificada no existe');
  });

  test('login falla si el usuario no existe', async () => {
    const port = makePort({
      getUserByEmail: jest.fn(async (): Promise<User | null> => null),
    });
    const service = new UsuarioService(port);

    await expect(service.login('x@example.com', 'pass')).rejects.toThrow('Credenciales inválidas');
  });

  test('login falla si la contraseña no coincide', async () => {
    const bcrypt = await import('bcrypt');
    (bcrypt.compare as any).mockResolvedValueOnce(false);

    const port = makePort({
      getUserByEmail: jest.fn(async () => makeUser()),
    });
    const service = new UsuarioService(port);

    await expect(service.login('x@example.com', 'pass')).rejects.toThrow('Credenciales inválidas');
  });

  test('login devuelve tokens y usuario sin contrasenaHash', async () => {
    const bcrypt = await import('bcrypt');
    (bcrypt.compare as any).mockResolvedValueOnce(true);

    const port = makePort({
      getUserByEmail: jest.fn(async () => makeUser({ contrasenaHash: 'SECRET_HASH' })),
    });
    const service = new UsuarioService(port);

    const res = await service.login('x@example.com', 'pass');

    expect(res).toHaveProperty('accessToken');
    expect(res).toHaveProperty('refreshToken');
    expect(res).toHaveProperty('usuario');
    expect(res.usuario).not.toHaveProperty('contrasenaHash');
  });
});

