# Pruebas API automatizadas (Postman + Newman)

Este folder contiene una colección Postman y un runner Newman para ejecutar pruebas funcionales de la API desde consola.

## Qué valida la colección
1. **GET /api/productos**: disponibilidad del backend y respuesta con array de productos.
2. **POST /api/usuarios/login**: login JWT (si se configuran credenciales en el environment).
3. **POST /api/usuarios/login** (inválido): valida respuesta **401** ante credenciales incorrectas.

## Configurar credenciales (opcional)
Edita `ArtHome.postman_environment.json` y llena:
- `email`
- `contrasena`

> Si `email`/`contrasena` están vacíos, el request de login se omite y solo se corre el health + login inválido.

## Ejecutar
Desde la raíz del backend:

```powershell
npm run test:api
```

## Evidencia
El runner genera un JSON en `postman/results/` con el resumen (PASS/FAIL) para adjuntarlo en el informe.

