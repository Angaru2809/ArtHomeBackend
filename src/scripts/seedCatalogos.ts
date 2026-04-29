import { AppDataSource } from '../infraestructura/config/data-base';
import { Ciudad } from '../infraestructura/entities/Ciudad';
import { Role } from '../infraestructura/entities/Role';

async function seedRoles() {
  const roleRepo = AppDataSource.getRepository(Role);
  const existing = await roleRepo.count();
  if (existing > 0) return;

  const roles = ['Usuario', 'Administrador'].map((nombre) => roleRepo.create({ nombre }));
  await roleRepo.save(roles);
  console.log(`✅ Roles insertados: ${roles.map((r) => r.nombre).join(', ')}`);
}

async function seedCiudades() {
  const ciudadRepo = AppDataSource.getRepository(Ciudad);
  const existing = await ciudadRepo.count();
  if (existing > 0) return;

  const ciudades = [
    'Bogotá',
    'Medellín',
    'Cali',
    'Barranquilla',
    'Cartagena',
  ].map((nombre) => ciudadRepo.create({ nombre }));

  await ciudadRepo.save(ciudades);
  console.log(`✅ Ciudades insertadas: ${ciudades.map((c) => c.nombre).join(', ')}`);
}

async function main() {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    await seedRoles();
    await seedCiudades();

    console.log('✅ Seed completado');
  } catch (e) {
    console.error('❌ Error ejecutando seed:', e);
    process.exitCode = 1;
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

void main();

