import type { StaticImageData } from "next/image";
import seha1 from "../imgs/optimized/seha-plus/patient/seha1.webp";
import seha2 from "../imgs/optimized/seha-plus/facility/seha2.webp";
import seha3 from "../imgs/optimized/seha-plus/patient/seha3.webp";
import seha4 from "../imgs/optimized/seha-plus/doctor/seha4.webp";
import drevr1 from "../imgs/optimized/drevr/passenger/drevr1.webp";
import drevr3 from "../imgs/optimized/drevr/passenger/drevr3.webp";
import drevr2 from "../imgs/optimized/drevr/driver/drevr2.webp";
import dashboard1 from "../imgs/optimized/dashboards/dashboard1.webp";
import dashboard2 from "../imgs/optimized/dashboards/dashboard2.webp";

import foodApo from "../imgs/optimized/restaurant/foodApo.webp";
import foodApo1 from "../imgs/optimized/restaurant/foodApo1.webp";
import store1 from "../imgs/optimized/ecommerce/store1.webp";
import store2 from "../imgs/optimized/ecommerce/store2.webp";
import carRental from "../imgs/optimized/car-rental/carRental.webp";
import carRental1 from "../imgs/optimized/car-rental/carRental1.webp";
import athkar1 from "../imgs/optimized/athkar/athkar1.webp";

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
  "seha-plus": {
    images: [seha1, seha4, seha2, seha3],
    transition: "glitch",
    intervalMs: 3500,
    temporaryTestImages: true,
  },
  drevr: {
    images: [drevr1,drevr3, drevr2],
    transition: "glitch",
    intervalMs: 3500,
    temporaryTestImages: true,
  },
  "dashboard-systems": {
    images: [dashboard1, dashboard2],
    transition: "glitch",
    intervalMs: 3500,
  },
  "restaurant-preview": {
    images: [foodApo],
    transition: "glitch",
    intervalMs: 3500,
    temporaryTestImages: true,
  },
  "commerce-preview": {
    images: [store1, store2],
    transition: "glitch",
    intervalMs: 4700,
    temporaryTestImages: true,
  },
  "rental-preview": {
    images: [carRental],
    transition: "glitch",
    intervalMs: 4900,
    temporaryTestImages: true,
  },
  athkar: { images: [athkar1], transition: "static" },
};
