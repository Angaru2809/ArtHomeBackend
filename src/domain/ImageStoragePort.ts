/** Resultado de listar imágenes: rutas para la API (relativas /images/... o URLs absolutas si el backing es CDN). */
export interface ImageListResult {
    /** Rutas que devuelve la API en `imagenes` (p. ej. `/images/x.png` o URL https completa). */
    imagePaths: string[];
    fileNames: string[];
}

export interface ImageStoragePort {
    listImages(): Promise<ImageListResult>;
    listImagesByCategory(categoria: string): Promise<ImageListResult>;
}
