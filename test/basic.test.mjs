// Tests básicos de eso-ai — corren con: npm test
// (node:test + node:assert, con tsx como loader para importar los módulos TS del repo)
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  cn,
  formatTime,
  calculateLevel,
  xpForNextLevel,
  getXpProgress,
  getLanguageColor,
  getLanguageFlag,
  getSpeechLangCode,
  shuffleArray,
  generateId,
  debounce,
} from '../src/lib/utils.ts';

import {
  LANGUAGES,
  FALSE_FRIENDS,
  MATH_VOCABULARY,
  SCIENCE_VOCABULARY,
  SCHOOL_VOCABULARY,
  PHONETIC_RULES,
  GAMES,
  ACHIEVEMENTS,
  MUSIC_LESSONS,
  SYSTEM_PROMPT,
} from '../src/data/index.ts';

describe('utilidades de progreso (src/lib/utils.ts)', () => {
  it('formatTime formatea segundos como m:ss', () => {
    assert.equal(formatTime(0), '0:00');
    assert.equal(formatTime(65), '1:05');
    assert.equal(formatTime(599), '9:59');
  });

  it('calculateLevel: nivel 1 con 0 XP y sube con sqrt(xp/100)', () => {
    assert.equal(calculateLevel(0), 1);
    assert.equal(calculateLevel(99), 1);
    assert.equal(calculateLevel(100), 2);
    assert.equal(calculateLevel(400), 3);
  });

  it('xpForNextLevel devuelve nivel² * 100', () => {
    assert.equal(xpForNextLevel(1), 100);
    assert.equal(xpForNextLevel(2), 400);
    assert.equal(xpForNextLevel(3), 900);
  });

  it('getXpProgress calcula progreso coherente dentro del nivel', () => {
    const p = getXpProgress(250); // nivel 2: entre 100 y 400 XP
    assert.equal(p.current, 150);
    assert.equal(p.next, 300);
    assert.equal(p.progress, 50);
    const borde = getXpProgress(400); // XP exacto para nivel 3: progreso a 0
    assert.equal(borde.current, 0);
    assert.equal(borde.progress, 0);
  });
});

describe('utilidades de idiomas y UI (src/lib/utils.ts)', () => {
  it('getLanguageColor y getLanguageFlag conocen los 4 idiomas', () => {
    assert.equal(getLanguageColor('es'), '#AA151B');
    assert.equal(getLanguageColor('pt'), '#009C3B');
    assert.equal(getLanguageColor('zz'), '#6366f1'); // fallback
    assert.equal(getLanguageFlag('en'), '🇬🇧');
  });

  it('getSpeechLangCode mapea códigos a locales BCP-47', () => {
    assert.equal(getSpeechLangCode('pt'), 'pt-BR');
    assert.equal(getSpeechLangCode('ca'), 'ca-ES');
    assert.equal(getSpeechLangCode('desconocido'), 'es-ES');
  });

  it('cn combina clases y tailwind-merge resuelve conflictos', () => {
    assert.equal(cn('p-4', 'p-2'), 'p-2');
    assert.equal(cn('px-2', false && 'oculto', 'py-1'), 'px-2 py-1');
  });

  it('shuffleArray mantiene longitud y elementos, sin mutar el original', () => {
    const original = [1, 2, 3, 4, 5];
    const mezclado = shuffleArray(original);
    assert.equal(mezclado.length, original.length);
    assert.deepEqual([...mezclado].sort(), original);
    assert.notEqual(mezclado, original);
  });

  it('generateId genera identificadores no vacíos y únicos', () => {
    const a = generateId();
    const b = generateId();
    assert.ok(a.length > 0);
    assert.notEqual(a, b);
  });

  it('debounce retrasa la ejecución al debounce indicado', async () => {
    let llamadas = 0;
    const incrementar = debounce(() => { llamadas += 1; }, 50);
    incrementar();
    incrementar();
    incrementar();
    assert.equal(llamadas, 0); // aún no se ha ejecutado
    await new Promise((r) => setTimeout(r, 120));
    assert.equal(llamadas, 1); // solo la última llamada
  });
});

describe('integridad de los datos (src/data/index.ts)', () => {
  it('hay 4 idiomas con códigos únicos pt/es/ca/en', () => {
    assert.equal(LANGUAGES.length, 4);
    assert.deepEqual(
      [...new Set(LANGUAGES.map((l) => l.code))].sort(),
      ['ca', 'en', 'es', 'pt']
    );
    for (const l of LANGUAGES) {
      assert.ok(l.name && l.nativeName && l.flag && l.color);
    }
  });

  it('los falsos amigos tienen traducción correcta en los 4 idiomas', () => {
    assert.ok(FALSE_FRIENDS.length >= 5);
    for (const f of FALSE_FRIENDS) {
      assert.ok(f.pt && f.esCorrect && f.ca && f.en, `falso amigo incompleto: ${f.pt}`);
    }
  });

  it('los glosarios de mates, ciencias y escuela no están vacíos', () => {
    for (const glosario of [MATH_VOCABULARY, SCIENCE_VOCABULARY, SCHOOL_VOCABULARY]) {
      assert.ok(glosario.length > 0);
      for (const item of glosario) {
        assert.ok(item.concept && item.pt && item.es && item.ca && item.en);
      }
    }
  });

  it('hay 5 juegos con ids únicos y dificultad válida', () => {
    assert.equal(GAMES.length, 5);
    const ids = GAMES.map((g) => g.id);
    assert.equal(new Set(ids).size, 5);
    for (const g of GAMES) {
      assert.ok(['Fácil', 'Medio', 'Difícil'].includes(g.difficulty));
      assert.ok(g.skills.length > 0);
    }
  });

  it('los logros tienen ids únicos y rareza válida', () => {
    assert.ok(ACHIEVEMENTS.length >= 10);
    const ids = ACHIEVEMENTS.map((a) => a.id);
    assert.equal(new Set(ids).size, ids.length);
    for (const a of ACHIEVEMENTS) {
      assert.ok(['common', 'rare', 'epic', 'legendary'].includes(a.rarity));
    }
  });

  it('las lecciones de música cubren los 4 idiomas', () => {
    assert.deepEqual(
      [...new Set(MUSIC_LESSONS.map((m) => m.language))].sort(),
      ['ca', 'en', 'es', 'pt']
    );
    for (const m of MUSIC_LESSONS) {
      assert.ok(m.title && m.artist && m.youtubeId);
    }
  });

  it('las reglas fonéticas PT-ES incluyen ejemplo y truco', () => {
    assert.ok(PHONETIC_RULES.length >= 5);
    for (const r of PHONETIC_RULES) {
      assert.ok(r.rule && r.example && r.tip);
    }
  });

  it('el SYSTEM_PROMPT define a DANI como tutor ESO', () => {
    assert.ok(SYSTEM_PROMPT.includes('DANI'));
    assert.ok(SYSTEM_PROMPT.includes('ESO'));
  });
});
