import { config } from '../config/config';
import { ImageStoragePort } from '../../domain/ImageStoragePort';
import { LocalImageStorageAdapter } from '../adapters/LocalImageStorageAdapter';
import { CdnManifestImageStorageAdapter } from '../adapters/CdnManifestImageStorageAdapter';

let instance: ImageStoragePort | null = null;

export function getImageStorage(): ImageStoragePort {
    if (!instance) {
        if (config.storage.provider === 'cdn') {
            if (!config.storage.manifestUrl) {
                throw new Error('STORAGE_PROVIDER=cdn requiere IMAGE_MANIFEST_URL');
            }
            instance = new CdnManifestImageStorageAdapter(
                config.storage.manifestUrl,
                config.storage.publicBaseUrl
            );
        } else {
            instance = new LocalImageStorageAdapter(config.storage.localRoot);
        }
    }
    return instance;
}
