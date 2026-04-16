# Node.js Project

## Project Structure
```
/src
  /aplicacion
    /servicios
      - UsuarioService.ts
      - RoleService.ts
  /domain
    /entidades
      - Usuario.ts
      - Role.ts
  /infraestructura
    /controllers
      - UsuarioController.ts
      - RoleController.ts
    /routes
      - usuarioRoutes.ts
      - roleRoutes.ts
    /middleware
      - auth.middleware.ts
    /config
      - database.ts
```

## Backup Instructions

### Manual Backup Process
1. Create a backup folder with the current date:
   ```
   /backups/YYYY-MM-DD/
   ```

2. Copy the following folders to the backup:
   - /src
   - /package.json
   - /package-lock.json
   - /tsconfig.json
   - /CHANGELOG.md
   - /README.md

3. Document any changes in CHANGELOG.md before making backups

### Important Notes
1. Always make a backup before making significant changes
2. Keep the CHANGELOG.md updated
3. Document any configuration changes
4. Keep a copy of the database schema

### Development Guidelines
1. Use English for method names and variables
2. Keep entity names in Spanish
3. Document all API endpoints
4. Follow the established folder structure
5. Update documentation when making changes

### Backup Schedule
- Daily: Quick backup of changed files
- Weekly: Full project backup
- Monthly: Complete backup with database dump

### **Explicación de cada sección**

1. **Agregar al .env las nuevas variables de entorno**
    - PORT=4000
    - DB_HOST=localhost
    - DB_PORT=3306
    - DB_USER=root
    - DB_PASSWORD=
    - DB_NAME=pattems_class

2. **Instalar mysql2**
    - npm install mysql2

3. **Vamos a environment-vars.ts y recofiguramos el archivo con las nuevas variables de entorno**

4. **reorganizacion en el proyecto de la arquitectura hexagonal**

5. **Desconectamos en el tsconfig.tslas sigientes opciones:**
    - "experimentalDecorators": true,
    - "emitDescoratorMetadata": true,
