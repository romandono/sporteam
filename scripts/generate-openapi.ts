/**
 * Genera public/openapi.json con la especificación OpenAPI actual.
 * Ejecutar tras cambiar rutas o anotaciones @openapi.
 *
 * Uso: npx ts-node scripts/generate-openapi.ts
 */
import swaggerSpec from '../src/docs/swagger';
import fs from 'fs';
import path from 'path';

const outputPath = path.resolve(__dirname, '../public/openapi.json');

fs.writeFileSync(outputPath, JSON.stringify(swaggerSpec, null, 2), 'utf-8');
console.log(`OpenAPI spec generada en ${outputPath}`);