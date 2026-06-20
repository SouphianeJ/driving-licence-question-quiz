#!/usr/bin/env node
/**
 * Valide l'intégrité de data/questions.json.
 * Sort en code 1 si une anomalie est détectée (utilisable en CI).
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_PATH = join(__dirname, "..", "data", "questions.json");
const POSITIONS = new Set(["Intérieure", "Extérieure"]);

/** @returns {string[]} liste des erreurs */
export function validate(questions) {
  const errors = [];
  if (!Array.isArray(questions)) {
    return ["Le fichier doit contenir un tableau de fiches."];
  }

  const seen = new Set();
  questions.forEach((q, i) => {
    const where = `Fiche #${q?.number ?? `(index ${i})`}`;

    if (typeof q.number !== "number") errors.push(`${where} : "number" manquant ou invalide.`);
    else if (seen.has(q.number)) errors.push(`${where} : numéro dupliqué.`);
    else seen.add(q.number);

    if (!POSITIONS.has(q?.verification?.position)) {
      errors.push(`${where} : position de vérification invalide.`);
    }

    for (const theme of ["verification", "securite", "premiers_secours"]) {
      const sub = q?.[theme];
      if (!sub || typeof sub.question !== "string" || sub.question.trim() === "") {
        errors.push(`${where} : "${theme}.question" manquante.`);
      }
      if (!sub || typeof sub.answer !== "string" || sub.answer.trim() === "") {
        errors.push(`${where} : "${theme}.answer" manquante.`);
      }
    }
  });

  return errors;
}

export function loadQuestions() {
  return JSON.parse(readFileSync(DATA_PATH, "utf8"));
}

// Exécution directe (pas en import).
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const questions = loadQuestions();
  const errors = validate(questions);
  if (errors.length > 0) {
    console.error(`❌ ${errors.length} erreur(s) détectée(s) :`);
    for (const e of errors) console.error(`  - ${e}`);
    process.exit(1);
  }
  console.log(`✅ ${questions.length} fiches valides.`);
}
