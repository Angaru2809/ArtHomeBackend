const fs = require('fs');
const path = require('path');

// Función para generar el archivo JSON de imágenes
function generateImageUrls() {
    const imagesDir = path.join(__dirname, '..', 'public', 'images');
    const outputFile = path.join(__dirname, '..', 'public', 'images.json');
    
    // Leer archivos del directorio public/images
    const files = fs.readdirSync(imagesDir);
    
    // Filtrar solo archivos de imagen
    const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp'];
    const imageFiles = files.filter(file => {
        const ext = path.extname(file).toLowerCase();
        return imageExtensions.includes(ext);
    });
    
    // Generar rutas de imágenes
    const imageUrls = imageFiles.map(file => `/images/${file}`);
    
    // Escribir el archivo JSON solo con las rutas
    fs.writeFileSync(outputFile, JSON.stringify(imageUrls, null, 2));

    console.log(`✅ Archivo images.json generado exitosamente`);
    console.log(`📁 Ubicación: ${outputFile}`);
    console.log(`🖼️  Total de imágenes encontradas: ${imageFiles.length}`);
    console.log(`📋 Imágenes: ${imageFiles.join(', ')}`);
}

try {
    generateImageUrls();
} catch (error) {
    console.error('❌ Error al generar el archivo images.json:', error.message);
}