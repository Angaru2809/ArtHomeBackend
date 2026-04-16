import * as dotenv from 'dotenv';

// Única carga de variables de entorno para toda la app
dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';
const requireFullEnv = isProduction || process.env.REQUIRE_FULL_ENV === 'true';

function requireEnv(name: string): string {
    const v = process.env[name];
    if (v === undefined) {
        throw new Error(`Falta la variable de entorno obligatoria: ${name}`);
    }
    return v;
}

function envOrDevDefault(name: string, devDefault: string): string {
    const v = process.env[name];
    if (v !== undefined && v !== '') {
        return v;
    }
    if (requireFullEnv) {
        throw new Error(`Falta la variable de entorno obligatoria: ${name}`);
    }
    return devDefault;
}

// JWT: sin valores por defecto en código; debe venir del entorno (.env local o variables del despliegue)
const jwtSecretRaw = requireEnv('JWT_SECRET');
if (!jwtSecretRaw.trim()) {
    throw new Error('JWT_SECRET no puede estar vacío');
}

// Contraseña de BD: en producción es obligatoria; en desarrollo puede ser cadena vacía (Postgres local sin password)
const dbPassword = requireFullEnv
    ? requireEnv('DB_PASSWORD')
    : process.env.DB_PASSWORD !== undefined
      ? process.env.DB_PASSWORD
      : '';

const storageProviderRaw = (process.env.STORAGE_PROVIDER || 'local').toLowerCase();
if (storageProviderRaw !== 'local' && storageProviderRaw !== 'cdn') {
    throw new Error('STORAGE_PROVIDER debe ser "local" o "cdn"');
}
const storageProvider = storageProviderRaw as 'local' | 'cdn';

const imageManifestUrl = process.env.IMAGE_MANIFEST_URL?.trim() || undefined;
const imagePublicBaseUrl = process.env.IMAGE_PUBLIC_BASE_URL?.trim().replace(/\/+$/, '') || undefined;

if (storageProvider === 'cdn' && requireFullEnv && !imageManifestUrl) {
    throw new Error('STORAGE_PROVIDER=cdn requiere IMAGE_MANIFEST_URL en este entorno');
}

export const config = {
    server: {
        port: Number(process.env.PORT) || 4000
    },

    database: {
        type: 'postgres' as const,
        host: envOrDevDefault('DB_HOST', 'localhost'),
        port: Number(envOrDevDefault('DB_PORT', '5432')),
        username: envOrDevDefault('DB_USER', 'postgres'),
        password: dbPassword,
        database: envOrDevDefault('DB_NAME', 'arthome_db'),
        schema: envOrDevDefault('DB_SCHEMA', 'arthome')
    },

    jwt: {
        secret: jwtSecretRaw,
        expiresIn: envOrDevDefault('JWT_EXPIRES_IN', '3600')
    },

    bcrypt: {
        saltRounds: 10
    },

    /** Factor IV: backing service de imágenes sustituible (disco local vs manifiesto CDN). */
    storage: {
        provider: storageProvider,
        localRoot: envOrDevDefault('IMAGE_STORAGE_LOCAL_ROOT', 'public/images'),
        manifestUrl: imageManifestUrl,
        publicBaseUrl: imagePublicBaseUrl
    }
};
