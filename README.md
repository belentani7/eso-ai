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

## Estado real y privacidad (2026-10-22)

La interfaz es una demostración educativa basada en reglas, no un LLM conectado. El chat no persiste mensajes y rechaza entradas excesivas. El endpoint de progreso devuelve datos ficticios e indica `demo: true` / `persisted: false`, incluso cuando reconoce una actualización. **No introducir nombres reales, direcciones ni datos personales de menores**. No publicar materiales o repositorios con información identificable sin revisión y consentimiento adecuado. La sección `/privacy` explica estas limitaciones a los visitantes. Las integraciones de voz dependen de las capacidades del navegador; los endpoints de servidor STT/TTS son demostrativos, no generan audio.
