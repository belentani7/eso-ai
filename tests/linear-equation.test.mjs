import test from "node:test";
import assert from "node:assert/strict";
import { solveLinearEquation } from "../src/lib/linear-equation.mjs";

test("solves ax + b = c", () => {
  assert.equal(solveLinearEquation("Resuelve 2x + 5 = 15").solution, 5);
  assert.equal(solveLinearEquation("x + 10 = 25").solution, 15);
});
test("solves ax - b = c", () => {
  assert.equal(solveLinearEquation("3x - 7 = 14").solution, 7);
});
test("never divides by zero: identifies infinitely many solutions", () => {
  const answer = solveLinearEquation("0x + 5 = 5");
  assert.equal(answer.kind, "identity");
  assert.equal(answer.solution, undefined);
});
test("never invents x for an inconsistent equation", () => {
  const answer = solveLinearEquation("0x + 5 = 15");
  assert.equal(answer.kind, "impossible");
  assert.equal(answer.solution, undefined);
});
test("returns null for unsupported expressions or overflowing operands", () => {
  for (const value of ["x² + 4 = 5", "999999999999999999x + 2 = 3", "x + 1 = 123456789876", null]) {
    assert.equal(solveLinearEquation(value), null);
  }
});
test("math steps never contain NaN or Infinity", () => {
  for (const value of ["0x + 5 = 15", "0x + 5 = 5", "2x + 5 = 15"]) {
    const ans = solveLinearEquation(value);
    assert.ok(!ans.steps.join(" ").includes("NaN"));
    assert.ok(!ans.steps.join(" ").includes("Infinity"));
  }
});
