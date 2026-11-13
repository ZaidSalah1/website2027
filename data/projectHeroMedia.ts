import type { StaticImageData } from "next/image";
import seha1 from "../imgs/seha1.png";
import seha2 from "../imgs/seha2.png";
import seha3 from "../imgs/seha3.png";

import drevr1 from "../imgs/drevr1.png";
import foodApo from "../imgs/foodApo.png";
import foodApo1 from "../imgs/foodApo1.png";
import store1 from "../imgs/store1.png";
import store2 from "../imgs/store2.png";
import carRental from "../imgs/carRental.png";
import carRental1 from "../imgs/carRental1.png";
import athkar1 from "../imgs/athkar1.png";

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
  "restaurant-preview": { images: [foodApo, foodApo1], transition: "glitch", intervalMs: 4500, temporaryTestImages: true },
  "commerce-preview": { images: [store1, store2], transition: "glitch", intervalMs: 4700, temporaryTestImages: true },
  "rental-preview": { images: [carRental, carRental1], transition: "glitch", intervalMs: 4900, temporaryTestImages: true },
  athkar: { images: [athkar1], transition: "static" },
};
