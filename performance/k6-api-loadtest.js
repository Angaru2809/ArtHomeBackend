import http from 'k6/http';
import { check, sleep } from 'k6';

/**
 * k6 - Prueba de rendimiento para el backend ArtHome
 *
 * Requisitos:
 * - Backend corriendo (por defecto en http://localhost:4000)
 *
 * Ejecutar:
 *   C:\Tools\k6\k6.exe run .\performance\k6-api-loadtest.js
 *
 * Opcional:
 *   set K6_BASE_URL=http://localhost:4000
 */

const BASE_URL = (__ENV.K6_BASE_URL || 'http://localhost:4000').replace(/\/+$/, '');

export const options = {
  scenarios: {
    api_smoke: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '10s', target: 5 },
        { duration: '20s', target: 10 },
        { duration: '10s', target: 0 },
      ],
      gracefulRampDown: '5s',
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.01'], // <1% fallos
    http_req_duration: ['p(95)<800'], // p95 < 800ms (ajustable)
  },
};

export default function () {
  const endpoints = [
    `${BASE_URL}/api/productos`,
    `${BASE_URL}/api/categorias`,
  ];

  const url = endpoints[Math.floor(Math.random() * endpoints.length)];
  const res = http.get(url, { tags: { name: url.replace(BASE_URL, '') } });

  check(res, {
    'status is 2xx': (r) => r.status >= 200 && r.status < 300,
  });

  sleep(0.5);
}

