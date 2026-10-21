# eso-ai

Aplicacion web Next.js (eso-ai).

## Requisitos
- Node.js 20+

## Instalacion
```bash
git clone https://github.com/belentani7/eso-ai.git
cd eso-ai
npm install
```

## Uso
```bash
npm run dev
```

## Licencia
MIT - ver [LICENSE](LICENSE)

## Privacidad y modo de funcionamiento (2026)

DANI es un tutor de práctica guiada por reglas y contenido educativo. **No** conecta actualmente con un modelo de lenguaje externo: el endpoint `/api/chat` responde con material predeterminado según el tema, con `mode: guided-rules`. Las rutas `/api/stt` y `/api/tts` son adaptadores informativos para las funciones de voz del navegador; no procesan audio mediante un proveedor remoto. Las estadísticas de demostración del endpoint `/api/progress` no acreditan rendimiento real de ningún estudiante.

El inicio público y las descripciones ya no incluyen la identidad, la edad o una ficha personal específica de un menor. El navegador guarda estado local con Zustand; elimina sus datos desde las preferencias del navegador. El nuevo contrato `src/lib/chat-payload.mjs` acepta mensajes de hasta 2000 caracteres, limita el historial a 20 entradas y descarta un posible `userProfile` recibido en la API.

Antes de abrir una versión pública para menores: implementar política de privacidad, consentimiento y protección de datos apropiados, revisión editorial del currículo, control antiabuso y pruebas de accesibilidad/experiencia con educadores. No se anuncia un sistema de aprendizaje personalizado verificable sin implementarlo.

```bash
npm ci
npm run lint
npm run typecheck
npm test
npm run build
```
