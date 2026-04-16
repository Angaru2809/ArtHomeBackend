import { AppDataSource } from '../infraestructura/config/data-base';
import { Usuario } from '../infraestructura/entities/Usuario';

function normEmail(email: unknown): string | null {
  if (typeof email !== 'string') return null;
  const e = email.trim().toLowerCase();
  return e.length ? e : null;
}

function normString(v: unknown): string | null {
  if (typeof v !== 'string') return null;
  const s = v.trim();
  return s.length ? s : null;
}

type DupeReason = 'email' | 'cedula' | 'telefono';

function addMap(map: Map<string, number[]>, key: string, userId: number) {
  const arr = map.get(key);
  if (arr) arr.push(userId);
  else map.set(key, [userId]);
}

async function main() {
  const apply = process.env.DEDUP_APPLY === 'YES';

  console.log(`🧹 Deduplicación de usuarios (apply=${apply ? 'YES' : 'NO'})`);
  console.log('Regla: mantener el usuario con menor fecha_registro (o menor id).');
  console.log('Criterios: email (normalizado), cédula, teléfono. Solo usuarios con estado=true.');

  await AppDataSource.initialize();
  const repo = AppDataSource.getRepository(Usuario);

  const users = await repo.find({
    where: { estado: true },
    order: { fechaRegistro: 'ASC', id: 'ASC' },
  });

  const byEmail = new Map<string, number[]>();
  const byCedula = new Map<string, number[]>();
  const byTelefono = new Map<string, number[]>();

  for (const u of users) {
    const e = normEmail(u.email);
    if (e) addMap(byEmail, e, u.id);
    const c = normString(u.cedula);
    if (c) addMap(byCedula, c, u.id);
    const t = normString(u.telefono);
    if (t) addMap(byTelefono, t, u.id);
  }

  const toDeactivate = new Map<number, Set<DupeReason>>();

  const markDupes = (m: Map<string, number[]>, reason: DupeReason) => {
    for (const [, ids] of m.entries()) {
      if (ids.length <= 1) continue;
      // ids ya están en orden "mantener primero"
      for (const id of ids.slice(1)) {
        const r = toDeactivate.get(id) ?? new Set<DupeReason>();
        r.add(reason);
        toDeactivate.set(id, r);
      }
    }
  };

  markDupes(byEmail, 'email');
  markDupes(byCedula, 'cedula');
  markDupes(byTelefono, 'telefono');

  const ids = [...toDeactivate.keys()];
  console.log(`Encontrados ${ids.length} usuarios duplicados para desactivar.`);

  if (!ids.length) {
    await AppDataSource.destroy();
    return;
  }

  if (!apply) {
    console.log('Dry-run: no se hicieron cambios. Para aplicar: set DEDUP_APPLY=YES');
    // mostrar un preview corto
    console.log(
      'Preview (primeros 20):',
      ids.slice(0, 20).map((id) => ({
        id,
        reasons: [...(toDeactivate.get(id) ?? [])],
      }))
    );
    await AppDataSource.destroy();
    return;
  }

  await repo
    .createQueryBuilder()
    .update(Usuario)
    .set({ estado: false })
    .whereInIds(ids)
    .execute();

  console.log(`✅ Desactivados (estado=false): ${ids.length}`);
  await AppDataSource.destroy();
}

main().catch((err) => {
  console.error('❌ Error en deduplicateUsuarios:', err);
  process.exitCode = 1;
});

