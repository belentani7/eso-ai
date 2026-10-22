/**
 * DANI — bounded deterministic linear-equation tutor.
 * Supports ax +/- b = c with nonnegative integer coefficients.
 * Unsupported forms return null rather than invented answers.
 */
export function solveLinearEquation(value) {
  if (typeof value !== "string" || value.length > 2000) return null;
  const match = /(?:^|[^a-z0-9])(\d{0,9})\s*x\s*([+-])\s*(\d{1,9})\s*=\s*(\d{1,9})(?!\d)/i.exec(value);
  if (!match) return null;
  const [, rawCoefficient, operation, rawOffset, rawRight] = match;
  const coefficient = rawCoefficient === "" ? 1 : Number(rawCoefficient);
  const offset = Number(rawOffset);
  const right = Number(rawRight);
  if (![coefficient, offset, right].every(Number.isSafeInteger)) return null;

  const constant = operation === "+" ? offset : -offset;
  const numerator = right - constant;
  const initial = "Tenemos " + coefficient + "x " + operation + " " + offset + " = " + right;
  const subtract = operation === "+"
    ? "Restamos " + offset + " a ambos lados"
    : "Sumamos " + offset + " a ambos lados";
  if (coefficient === 0) {
    return {
      kind: numerator === 0 ? "identity" : "impossible",
      steps: [initial, subtract + " → 0x = " + numerator,
        numerator === 0
          ? "La igualdad es verdadera para cualquier valor de x: infinitas soluciones."
          : "No existe ningún valor de x que pueda satisfacer esta igualdad."],
    };
  }
  const solution = numerator / coefficient;
  if (!Number.isFinite(solution)) return null;
  return {
    kind: "unique",
    solution,
    steps: [initial, subtract + " → " + coefficient + "x = " + numerator,
      "Dividimos por " + coefficient + " → x = " + solution],
  };
}
