# eso-ai — DANI, tu amigo de estudio con IA

Aplicación web Next.js que implementa **DANI**, un tutor de IA personal para un alumno de 2º/3º de ESO recién llegado de Brasil a Cataluña. Le enseña español, catalán e inglés usando su portugués nativo como puente, y refuerza matemáticas, ciencias, cultura y música con gamificación (XP, niveles, logros y 5 juegos educativos).

## Qué hace

- **Landing con hero** en `/` que presenta el proyecto y sus características.
- **Dashboard** con 6 secciones: chat con el tutor, juegos, currículo ESO, cultura (puentes Brasil-España), música (lecciones en 4 idiomas) y progreso (XP, nivel, rachas, logros).
- **Chat con DANI** (`/api/chat`): tutor socrático basado en reglas que detecta matemáticas, falsos amigos PT→ES y vocabulario; el prompt pedagógico completo vive en `src/data/index.ts` (`SYSTEM_PROMPT`). La respuesta se **simula localmente** — no requiere clave de API externa.
- **5 juegos educativos**: Caza-Falsos-Amigos, Mate-Escape, Trilingüe Express, Catalán Challenge y Super Quiz Integral (`src/components/games/`).
- **Voz en el navegador**: reconocimiento y síntesis vía Web Speech API (las rutas `/api/stt` y `/api/tts` devuelven la configuración de idioma; no llaman a servicios externos).
- **Progreso persistente en el navegador** con zustand + `persist` (localStorage): XP, nivel, rachas, logros y vocabulario aprendido. No hay base de datos.

## Stack

- **Framework**: Next.js 15 (App Router) + React 18 + TypeScript
- **Estilos**: Tailwind CSS 4 (con `@tailwindcss/postcss`) + componentes Radix UI
- **Estado**: zustand (con middleware `persist`)
- **Otros**: framer-motion (animaciones), recharts (gráficas de progreso), howler + tone (audio), lucide-react (iconos), react-speech-recognition (voz)
- **Calidad**: ESLint (`eslint-config-next`), tests con `node:test`, CodeQL

## Instalación

Requiere Node.js 20+ (el CI usa Node 22).

```bash
git clone https://github.com/belentani7/eso-ai.git
cd eso-ai
npm install
```

## Uso

```bash
npm run dev        # servidor de desarrollo en http://localhost:3000
npm run build      # build de producción (verificado: 15 rutas)
npm start          # sirve el build de producción
```

Sin variables de entorno ni claves de API: el tutor y el progreso funcionan en local.

## Estructura

```
src/
├── app/
│   ├── page.tsx              # landing con hero
│   ├── layout.tsx            # layout raíz (lang="es", PWA manifest)
│   ├── dashboard/            # chat, culture, curriculum, games, music, progress
│   └── api/                  # chat, games, progress, stt, tts
├── components/
│   ├── games/                # los 5 juegos educativos
│   ├── chat/                 # interfaz de chat
│   ├── layout/               # DashboardLayout
│   └── ui/                   # botones, cards, tabs… (Radix + Tailwind)
├── data/index.ts             # vocabularios, falsos amigos, juegos, logros, SYSTEM_PROMPT
├── lib/
│   ├── store.ts              # estado global (zustand + persist)
│   └── utils.ts              # cn, XP/niveles, formato, voz…
└── hooks/index.ts            # (vacío, reservado)
test/basic.test.mjs           # tests con node:test
scripts/export.mjs            # export de datos principales
```

## Scripts

| Comando       | Qué hace                                                    |
| ------------- | ----------------------------------------------------------- |
| `npm run dev`     | Servidor de desarrollo de Next.js                          |
| `npm run build`   | Build de producción                                        |
| `npm start`       | Sirve el build de producción                               |
| `npm run lint`    | ESLint sobre `.js/.jsx/.ts/.tsx`                           |
| `npm test`        | Tests con `node:test` + `tsx` (18 tests sobre utilidades y datos) |
| `npm run export`  | Exporta un resumen JSON del contenido (`--out fichero.json` para escribirlo a disco) |

## Utilidad

**Utilidad social:** acompaña la integración educativa de alumnos migrantes: aprovecha la transferencia lingüística portugués→español/catalán (~89% de similitud léxica), corrige los falsos amigos típicos y sigue el currículo oficial catalán (Decret 175/2022) con metodología AICLE y filtro afectivo de Krashen. Todo el progreso queda en el dispositivo del alumno, sin cuentas ni servidores.

**Utilidad comercial:** base de un producto educativo B2C/B2B (familias y centros de acogida) que puede monetizarse como servicio de suscripción o licencia para institutes; la arquitectura API (`/api/chat`, `/api/stt`, `/api/tts`) está preparada para enchufar proveedores de IA/voz de pago sin cambiar el frontend.

## CI

`.github/workflows/ci.yml` ejecuta en cada push/PR a `main`: `npm install`, `npm run lint`, `npm run build` y `npm test`. CodeQL analiza el código JavaScript/TypeScript semanalmente en cada push.

## Licencia

MIT — ver [LICENSE](LICENSE).
