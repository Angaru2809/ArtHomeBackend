import { ProductoService } from '../application/ProductoService';
import type { ProductoPort } from '../domain/ProductoPort';

describe('ProductoService (unit)', () => {
  test('obtenerProductosConImagenes filtra productos sin imagenUrl', async () => {
    const port: ProductoPort = {
      createProducto: jest.fn(async () => 1),
      getAllProductos: jest.fn(async () => [
        { id: 1, nombre: 'A', descripcion: '', precio: 1, cantidad_stock: 1, estado_stock: 'ok', fecha_agregado: new Date(), categoria_id: 1, categoria: {} as any, activo: true, imagenUrl: '' } as any,
        { id: 2, nombre: 'B', descripcion: '', precio: 1, cantidad_stock: 1, estado_stock: 'ok', fecha_agregado: new Date(), categoria_id: 1, categoria: {} as any, activo: true, imagenUrl: 'http://x/img.png' } as any,
        { id: 3, nombre: 'C', descripcion: '', precio: 1, cantidad_stock: 1, estado_stock: 'ok', fecha_agregado: new Date(), categoria_id: 1, categoria: {} as any, activo: true } as any,
      ]),
      getProductoById: jest.fn(async (): Promise<any> => null),
      updateProducto: jest.fn(async () => true),
      deleteProducto: jest.fn(async () => true),
      getCatalogoPorCategoria: jest.fn(async (): Promise<any[]> => []),
      buscarPorNombre: jest.fn(async (): Promise<any[]> => []),
    };

    const service = new ProductoService(port);
    const res = await service.obtenerProductosConImagenes();

    expect(res.map((p: any) => p.id)).toEqual([2]);
  });
});

