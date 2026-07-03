/**
 * Génère une palette tonale (50 → 900) à partir d'une seule couleur primaire.
 * Les valeurs sont produites au format « r g b » attendu par Tailwind
 * (rgb(var(--brand-500) / <alpha-value>)), ce qui permet à chaque auto-école
 * de personnaliser toute l'interface via une unique couleur hexadécimale.
 */

type Rgb = [number, number, number];

function parseHex(hex: string): Rgb {
  const clean = hex.replace("#", "").trim();
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;
  const value = Number.parseInt(full, 16);
  if (full.length !== 6 || Number.isNaN(value)) {
    // Repli sur l'indigo si la valeur fournie est invalide.
    return [79, 70, 229];
  }
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

function mix([r, g, b]: Rgb, target: number, amount: number): Rgb {
  const m = (channel: number) => Math.round(channel + (target - channel) * amount);
  return [m(r), m(g), m(b)];
}

const STOPS: Array<[number, number, number]> = [
  // [stop, cible (255 = blanc, 0 = noir), proportion de mélange]
  [50, 255, 0.92],
  [100, 255, 0.82],
  [200, 255, 0.64],
  [300, 255, 0.46],
  [400, 255, 0.22],
  [500, 0, 0],
  [600, 0, 0.12],
  [700, 0, 0.26],
  [800, 0, 0.4],
  [900, 0, 0.54],
];

export function buildPalette(primaryHex: string): Record<number, string> {
  const base = parseHex(primaryHex);
  const palette: Record<number, string> = {};
  for (const [stop, target, amount] of STOPS) {
    const [r, g, b] = amount === 0 ? base : mix(base, target, amount);
    palette[stop] = `${r} ${g} ${b}`;
  }
  return palette;
}

/** Variables CSS `--brand-*` à injecter dans :root. */
export function paletteToCssVars(primaryHex: string): string {
  const palette = buildPalette(primaryHex);
  return Object.entries(palette)
    .map(([stop, rgb]) => `--brand-${stop}: ${rgb};`)
    .join(" ");
}
