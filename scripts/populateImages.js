const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

// Configuración de la base de datos PostgreSQL
const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'arthome_db',
    user: 'postgres',
    password: '1234'
});

async function populateImages() {
    try {
        // Conectar a la base de datos
        await client.connect();
        console.log('✅ Conexión a la base de datos establecida');

        // Leer las imágenes del directorio
        const imagesDir = path.join(__dirname, '..', 'public', 'images');
        const files = fs.readdirSync(imagesDir);
        
        // Filtrar solo archivos de imagen
        const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp'];
        const imageFiles = files.filter(file => {
            const ext = path.extname(file).toLowerCase();
            return imageExtensions.includes(ext);
        });

        console.log(`📁 Encontradas ${imageFiles.length} imágenes: ${imageFiles.join(', ')}`);

        // Obtener todos los productos
        const productosResult = await client.query('SELECT id, nombre FROM productos');
        const productos = productosResult.rows;
        console.log(`📦 Encontrados ${productos.length} productos en la base de datos`);

        // Para cada producto, asignar una imagen
        for (let i = 0; i < productos.length && i < imageFiles.length; i++) {
            const producto = productos[i];
            const imagenFile = imageFiles[i];
            const imagenUrl = `/images/${imagenFile}`;

            // Verificar si ya existe una imagen para este producto
            const existingImageResult = await client.query(
                'SELECT id FROM imagenes_productos WHERE producto_id = $1',
                [producto.id]
            );

            if (existingImageResult.rows.length === 0) {
                // Crear nueva imagen
                await client.query(
                    'INSERT INTO imagenes_productos (producto_id, url_imagen) VALUES ($1, $2)',
                    [producto.id, imagenUrl]
                );
                console.log(`✅ Imagen asignada a producto ${producto.nombre}: ${imagenUrl}`);
            } else {
                console.log(`ℹ️  Producto ${producto.nombre} ya tiene imagen`);
            }
        }

        console.log('🎉 Proceso completado exitosamente');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        // Cerrar la conexión
        await client.end();
    }
}

// Ejecutar el script
populateImages(); 