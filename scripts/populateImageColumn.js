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

async function populateImageColumn() {
    try {
        // Conectar a la base de datos
        await client.connect();
        console.log('✅ Conexión a la base de datos establecida');

        // Primero, agregar la columna si no existe
        try {
            await client.query(`
                ALTER TABLE arthome.productos 
                ADD COLUMN IF NOT EXISTS imagen_url VARCHAR(255)
            `);
            console.log('✅ Columna imagen_url agregada o ya existía');
        } catch (error) {
            console.log('ℹ️  La columna imagen_url ya existe o hubo un error:', error.message);
        }

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
        const productosResult = await client.query('SELECT id, nombre FROM arthome.productos');
        const productos = productosResult.rows;
        console.log(`📦 Encontrados ${productos.length} productos en la base de datos`);

        // Para cada producto, asignar una imagen
        for (let i = 0; i < productos.length && i < imageFiles.length; i++) {
            const producto = productos[i];
            const imagenFile = imageFiles[i];
            const imagenUrl = `/images/${imagenFile}`;

            // Actualizar el producto con la URL de la imagen
            await client.query(
                'UPDATE arthome.productos SET imagen_url = $1 WHERE id = $2',
                [imagenUrl, producto.id]
            );
            console.log(`✅ Imagen asignada a producto ${producto.nombre}: ${imagenUrl}`);
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
populateImageColumn(); 