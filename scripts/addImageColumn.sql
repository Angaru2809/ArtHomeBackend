-- Script para agregar la columna imagen_url a la tabla productos
-- Ejecutar este script en tu base de datos PostgreSQL

-- Agregar la columna imagen_url a la tabla productos
ALTER TABLE arthome.productos 
ADD COLUMN imagen_url VARCHAR(255);

-- Comentario para documentar la columna
COMMENT ON COLUMN arthome.productos.imagen_url IS 'URL de la imagen del producto';

-- Verificar que la columna se agregó correctamente
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_schema = 'arthome' 
AND table_name = 'productos' 
AND column_name = 'imagen_url'; 