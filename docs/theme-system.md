# Portfolio theme system

Theme presets are defined in [`styles/themes.css`](../styles/themes.css). The active preset is selected by `DEFAULT_THEME` in [`lib/theme.ts`](../lib/theme.ts) and applied to the root `<html>` element by `app/layout.tsx`.

## Switching themes

Set the single exported value in `lib/theme.ts`:

```ts
export const DEFAULT_THEME: ThemePreset = "obsidian-blue";
```

Use `"original-lime"` to restore the approved Black × Lime palette. No component changes are required.

## Adjusting a preset

Edit the semantic tokens under the corresponding `html[data-theme="..."]` block in `styles/themes.css`. The core contract includes backgrounds, surfaces, text levels, accents, borders, glows, grids, and shadows.

The legacy aliases `--ink`, `--paper`, `--lime`, and `--muted` intentionally point to semantic tokens. This preserves existing component styling while allowing every preset to recolor shared CSS, SVG fills/strokes, focus states, progress indicators, and GSAP-animated elements.

GSAP only animates transforms, opacity, clipping, and SVG dash offsets; it does not hold theme-specific color constants. Animated elements therefore inherit their colors from CSS throughout the animation lifecycle.

## Adding another theme

1. Add its name to `THEME_PRESETS` in `lib/theme.ts`.
2. Define the full semantic token contract in `styles/themes.css`.
3. Add only the preset-specific art-direction overrides required for diagrams or high-impact panels.
4. Set `DEFAULT_THEME` to the new preset and run the visual regression checks for desktop, mobile, and reduced motion.
