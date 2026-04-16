export interface ContribucionPort {
    createContribucion(contribucion: any): Promise<number>;
    getContribucionById(id: number): Promise<any>;
    getAllContribuciones(): Promise<any[]>;
    updateContribucion(id: number, contribucionData: any): Promise<boolean>;
    deleteContribucion(id: number): Promise<boolean>;
    getContribucionesByUsuario(usuarioId: number): Promise<any[]>;
    getContribucionesByEstado(estado: string): Promise<any[]>;
    getContribucionesByTipoMaterial(tipoMaterial: string): Promise<any[]>;
}
