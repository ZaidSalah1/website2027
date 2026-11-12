export const THEME_PRESETS = ["original-lime", "obsidian-blue"] as const;

export type ThemePreset = (typeof THEME_PRESETS)[number];

/**
 * Developer-level theme switch.
 * Change this single value to "original-lime" to restore the approved lime palette.
 */
export const DEFAULT_THEME: ThemePreset = "obsidian-blue";
