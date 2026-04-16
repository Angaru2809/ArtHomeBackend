-- Borrado lógico: categorías, pedidos y reseñas (columna activo).
-- Ejecutar una vez en PostgreSQL. Esquema: arthome

ALTER TABLE arthome.categorias
ADD COLUMN IF NOT EXISTS activo boolean NOT NULL DEFAULT true;

COMMENT ON COLUMN arthome.categorias.activo IS 'false = categoría retirada (DELETE lógico)';

ALTER TABLE arthome.pedidos
ADD COLUMN IF NOT EXISTS activo boolean NOT NULL DEFAULT true;

COMMENT ON COLUMN arthome.pedidos.activo IS 'false = pedido anulado/oculto (DELETE lógico)';

ALTER TABLE arthome.resenas
ADD COLUMN IF NOT EXISTS activo boolean NOT NULL DEFAULT true;

COMMENT ON COLUMN arthome.resenas.activo IS 'false = reseña oculta (DELETE lógico)';
