# Contribuir a eso-ai

Gracias por tu interés en contribuir. Este repo es una app Next.js 15 + React 18 + TypeScript; esto es lo que necesitas para trabajar con ella de verdad.

## Requisitos

- Node.js 20+ (el CI usa Node 22)
- npm (el repo usa npm como único gestor de paquetes; no uses pnpm/yarn)

## Puesta en marcha

```bash
git clone https://github.com/belentani7/eso-ai.git
cd eso-ai
npm install
npm run dev   # http://localhost:3000
```

## Verificaciones antes de enviar cambios

El CI (`.github/workflows/ci.yml`) ejecuta estos pasos en cada push/PR a `main`; ejecútalos en local primero:

```bash
npm run lint    # ESLint sobre js/jsx/ts/tsx
npm run build   # build de producción de Next.js (debe completar las 15 rutas)
npm test        # tests con node:test (test/basic.test.mjs)
```

Los tres deben pasar sin errores. Si añades funcionalidad con lógica nueva, añade tests en `test/basic.test.mjs` (o un fichero `test/*.test.mjs` adicional y actualiza el script `test`).

Si tocas datos pedagógicos (`src/data/index.ts`), comprueba también el export:

```bash
npm run export   # debe imprimir un resumen JSON válido
```

## Cómo enviar cambios

1. Crea una rama descriptiva desde `main`:
   ```bash
   git checkout -b feat/mi-cambio
   ```
2. Haz tus cambios con commits claros (mensajes en español, ej. `feat: añadir juego de sinónimos`).
3. Verifica lint + build + test en local.
4. Abre un Pull Request contra `main` usando la plantilla (`.github/PULL_REQUEST_TEMPLATE.md`), describiendo qué cambia y cómo lo probaste.

## Buenas prácticas del repo

- Español para contenido y documentación; términos técnicos en inglés.
- No commitear `node_modules/`, `.next/`, `.env` ni secretos (el `.gitignore` ya los cubre).
- El contenido pedagógico debe basarse en el currículo real (Decret 175/2022, 2º/3º ESO).
- La app no debe requerir claves de API para funcionar en local: el tutor es una simulación local y la voz usa Web Speech API.
