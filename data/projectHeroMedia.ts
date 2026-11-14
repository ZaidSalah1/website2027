import type { StaticImageData } from "next/image";
import seha1 from "../imgs/optimized/seha1.webp";
import seha2 from "../imgs/optimized/seha2.webp";
import seha3 from "../imgs/optimized/seha3.webp";

import drevr1 from "../imgs/optimized/drevr1.webp";
import foodApo from "../imgs/optimized/foodApo.webp";
import foodApo1 from "../imgs/optimized/foodApo1.webp";
import store1 from "../imgs/optimized/store1.webp";
import store2 from "../imgs/optimized/store2.webp";
import carRental from "../imgs/optimized/carRental.webp";
import carRental1 from "../imgs/optimized/carRental1.webp";
import athkar1 from "../imgs/optimized/athkar1.webp";

export type ProjectHeroMedia = {
  images: StaticImageData[];
  transition: "glitch" | "static";
  intervalMs?: number;
  temporaryTestImages?: boolean;
};

// This is the single edit point for showcase artwork and transition behavior.
// The three multi-image entries use existing same-project alternatives while
// final showcase image sets are being prepared.
export const projectHeroMedia: Record<string, ProjectHeroMedia> = {
  "seha-plus": { images: [seha1, seha2,seha3], transition: "glitch", intervalMs: 2500, temporaryTestImages: true},
  drevr: { images: [drevr1], transition: "static" },
  "restaurant-preview": { images: [foodApo,], transition: "glitch", intervalMs: 4500, temporaryTestImages: true },
  "commerce-preview": { images: [store1, store2], transition: "glitch", intervalMs: 4700, temporaryTestImages: true },
  "rental-preview": { images: [carRental,], transition: "glitch", intervalMs: 4900, temporaryTestImages: true },
  athkar: { images: [athkar1], transition: "static" },
};
