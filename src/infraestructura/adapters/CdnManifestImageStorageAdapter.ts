import { ImageListResult, ImageStoragePort } from '../../domain/ImageStoragePort';

/**
 * Manifiesto remoto (JSON) servido por CDN u object storage público.
 * Sustituye el listado desde filesystem: el recurso anexo es la URL del manifiesto.
 *
 * Formato soportado:
 * - `{ "urls": ["https://cdn/.../a.png", ...] }`
 * - `{ "files": ["a.png", ...] }` + publicBaseUrl → se construyen URLs absolutas.
 */
export class CdnManifestImageStorageAdapter implements ImageStoragePort {
    constructor(
        private readonly manifestUrl: string,
        private readonly publicBaseUrl: string | undefined
    ) {}

    private async fetchManifest(): Promise<{ urls?: string[]; files?: string[] }> {
        const res = await fetch(this.manifestUrl, { method: 'GET' });
        if (!res.ok) {
            throw new Error(`Manifiesto de imágenes HTTP ${res.status}: ${this.manifestUrl}`);
        }
        return (await res.json()) as { urls?: string[]; files?: string[] };
    }

    private toImagePaths(data: { urls?: string[]; files?: string[] }): { imagePaths: string[]; fileNames: string[] } {
        if (data.urls && data.urls.length > 0) {
            const imagePaths = data.urls.map((u) => u.trim()).filter(Boolean);
            const fileNames = imagePaths.map((u) => u.split('/').pop() || u);
            return { imagePaths, fileNames };
        }
        if (data.files && data.files.length > 0) {
            if (!this.publicBaseUrl) {
                throw new Error(
                    'El manifiesto usa "files" pero falta IMAGE_PUBLIC_BASE_URL para construir URLs absolutas'
                );
            }
            const base = this.publicBaseUrl.replace(/\/+$/, '');
            const imagePaths = data.files.map((f) => `${base}/images/${f.replace(/^\//, '')}`);
            return { imagePaths, fileNames: data.files };
        }
        return { imagePaths: [], fileNames: [] };
    }

    async listImages(): Promise<ImageListResult> {
        const data = await this.fetchManifest();
        return this.toImagePaths(data);
    }

    async listImagesByCategory(categoria: string): Promise<ImageListResult> {
        const full = await this.listImages();
        const cat = categoria.toLowerCase();
        const idx = full.fileNames
            .map((name, i) => ({ name, i }))
            .filter(({ name }) => name.toLowerCase().includes(cat));
        return {
            imagePaths: idx.map(({ i }) => full.imagePaths[i]),
            fileNames: idx.map(({ name }) => name)
        };
    }
}
