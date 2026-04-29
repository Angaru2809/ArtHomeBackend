# Pruebas de rendimiento (k6)

Este folder contiene un test de carga básico para la API del backend.

## Requisitos
- Backend corriendo (por defecto): `http://localhost:4000`
- k6 instalado (portable): `C:\Tools\k6\k6.exe`

Si no lo tienes, ejecuta:

```powershell
powershell -ExecutionPolicy Bypass -File c:\Users\angie\sonarqube-docker\install-k6.ps1
```

## Ejecutar (recomendado)
Desde la raíz del backend:

```powershell
powershell -ExecutionPolicy Bypass -File .\performance\run-k6.ps1
```

Opcional (si tu backend usa otro host/puerto):

```powershell
$env:K6_BASE_URL='http://localhost:4000'
powershell -ExecutionPolicy Bypass -File .\performance\run-k6.ps1
```

## Qué mide
- `GET /api/productos`
- `GET /api/categorias`

## Evidencia
Genera un resumen JSON en `performance/results/` para adjuntarlo como evidencia de rendimiento.

