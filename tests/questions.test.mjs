import { test } from "node:test";
import assert from "node:assert/strict";
import { loadQuestions, validate } from "../scripts/validate-questions.mjs";

test("la banque de fiches est intègre", () => {
  const questions = loadQuestions();
  assert.ok(questions.length > 0, "au moins une fiche");
  assert.deepEqual(validate(questions), [], "aucune erreur de validation");
});

test("les numéros de fiche sont uniques", () => {
  const questions = loadQuestions();
  const numbers = questions.map((q) => q.number);
  assert.equal(new Set(numbers).size, numbers.length);
});

test("validate détecte une fiche incomplète", () => {
  const errors = validate([
    { number: 1, verification: { position: "Intérieure" }, securite: {}, premiers_secours: {} },
  ]);
  assert.ok(errors.length > 0);
});
