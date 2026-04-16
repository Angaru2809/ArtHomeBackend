-- Borrado lógico en catálogo (productos).
-- Ejecutar una vez en PostgreSQL antes de levantar el API con la nueva entidad.
-- Esquema: arthome (ajusta si usas otro).

ALTER TABLE arthome.productos
ADD COLUMN IF NOT EXISTS activo boolean NOT NULL DEFAULT true;

COMMENT ON COLUMN arthome.productos.activo IS 'false = retirado del catálogo (DELETE lógico)';
