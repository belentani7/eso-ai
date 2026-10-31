#!/usr/bin/env node
// Export de datos principales de eso-ai (protocolo de ecosistema Belentani).
//
// Uso:
//   npm run export                     → resumen JSON por stdout
//   npm run export -- --out datos.json → escribe el JSON completo en el fichero
//
// Necesita el loader de tsx para importar los módulos TS de src/
// (así se define en package.json: "node --import tsx scripts/export.mjs").

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const { LANGUAGES, FALSE_FRIENDS, MATH_VOCABULARY, SCIENCE_VOCABULARY, SCHOOL_VOCABULARY, PHONETIC_RULES, CATALAN_ADVANTAGES, CULTURAL_BRIDGES, MUSIC_LESSONS, GAMES, ACHIEVEMENTS, SYSTEM_PROMPT } = await import('../src/data/index.ts');

function contarIdiomas(items, claves = ['pt', 'es', 'ca', 'en']) {
  return claves.filter((k) => items.every((item) => Boolean(item[k]))).length;
}

const datos = {
  proyecto: 'eso-ai',
  descripcion: 'DANI — tutor de IA para 2º/3º ESO: español, catalán e inglés apoyándose en el portugués, más matemáticas, ciencias, cultura y música.',
  generadoEn: new Date().toISOString(),
  idiomas: LANGUAGES.map(({ code, name, nativeName }) => ({ code, name, nativeName })),
  contenido: {
    falsosAmigos: FALSE_FRIENDS.length,
    vocabulario: {
      matematicas: MATH_VOCABULARY.length,
      ciencias: SCIENCE_VOCABULARY.length,
      escolar: SCHOOL_VOCABULARY.length,
    },
    reglasFoneticas: PHONETIC_RULES.length,
    ventajasCatalan: CATALAN_ADVANTAGES.length,
    puentesCulturales: CULTURAL_BRIDGES.map((b) => ({ id: b.id, titulo: b.title })),
    leccionesMusica: MUSIC_LESSONS.map(({ id, title, artist, language }) => ({ id, title, artist, language })),
    juegos: GAMES.map(({ id, name, difficulty }) => ({ id, name, difficulty })),
    logros: ACHIEVEMENTS.map(({ id, name, rarity }) => ({ id, name, rarity })),
  },
  coberturaIdiomas: {
    falsosAmigos: `${contarIdiomas(FALSE_FRIENDS, ['pt', 'esWrong', 'esCorrect', 'ca', 'en'])}/5`,
    vocabularioMatematicas: `${contarIdiomas(MATH_VOCABULARY)}/4`,
    vocabularioCiencias: `${contarIdiomas(SCIENCE_VOCABULARY)}/4`,
    vocabularioEscolar: `${contarIdiomas(SCHOOL_VOCABULARY)}/4`,
  },
  systemPrompt: SYSTEM_PROMPT,
};

const outIndex = process.argv.indexOf('--out');
if (outIndex !== -1 && process.argv[outIndex + 1]) {
  const ruta = resolve(process.argv[outIndex + 1]);
  mkdirSync(dirname(ruta), { recursive: true });
  writeFileSync(ruta, JSON.stringify(datos, null, 2) + '\n', 'utf8');
  console.log(`Export escrito en ${ruta}`);
} else {
  const { systemPrompt, ...resumen } = datos;
  console.log(JSON.stringify(resumen, null, 2));
}
