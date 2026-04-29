import { AppDataSource } from '../infraestructura/config/data-base';
import { Producto } from '../infraestructura/entities/Producto';

const SILLAS = [
  '/images/Silla1.png',
  '/images/Silla2.png',
  '/images/Silla3.png',
  '/images/Silla4.png',
  '/images/Silla5.png',
  '/images/Silla6.png',
] as const;

function hashSeed(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

async function main() {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const repo = AppDataSource.getRepository(Producto);
    const productos = await repo.find({ order: { id: 'ASC' } });

    if (!productos.length) {
      console.log('⚠️ No hay productos para actualizar.');
      return;
    }

    for (let i = 0; i < productos.length; i++) {
      const producto = productos[i];
      // Asignación "aleatoria" pero estable por producto (no cambia entre ejecuciones)
      // para que se vea variado en todo el catálogo.
      const seed = hashSeed(`${producto.id}|${producto.nombre}|${producto.categoria_id}`);
      const imagenUrl = SILLAS[seed % SILLAS.length];
      producto.imagenUrl = imagenUrl as any;
    }

    await repo.save(productos);

    console.log(`✅ Productos actualizados: ${productos.length}`);
    console.log(`✅ Asignación: Silla1..Silla6 (hash estable por producto)`);
  } catch (e) {
    console.error('❌ Error asignando imágenes a productos:', e);
    process.exitCode = 1;
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

void main();

