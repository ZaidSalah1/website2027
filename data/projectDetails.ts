import type { StaticImageData } from "next/image";
import sehaArtwork from "../imgs/seha1.png";
import drevrArtwork from "../imgs/drevr1.png";
import restaurantArtwork from "../imgs/foodApo.png";
import commerceArtwork from "../imgs/store1.png";
import carRentalArtwork from "../imgs/carRental.png";
import athkarArtwork from "../imgs/athkar1.png";

export type ProjectScreenshot = {
  src: StaticImageData;
  alt: string;
  caption?: string;
  kind: "screenshot" | "presentation";
};

export type ProjectScreenshotGroup = {
  id: string;
  label: string;
  screenshots: ProjectScreenshot[];
};

export type ProjectDetails = {
  id: string;
  title: string;
  category: string;
  description: string;
  summary: string;
  role?: string;
  features?: string[];
  systems?: string[];
  technologies?: Record<string, string[]>;
  engineeringHighlights?: string[];
  challenges?: { challenge: string; approach: string; outcome?: string }[];
  screenshotGroups?: ProjectScreenshotGroup[];
  links?: Partial<Record<"website" | "github" | "appStore" | "googlePlay" | "demo", string>>;
  accent: string;
};

export const projectDetails: Record<string, ProjectDetails> = {
  "seha-plus": {
    id: "seha-plus",
    title: "SEHA PLUS",
    category: "DIGITAL HEALTH / PRODUCT SYSTEM",
    description: "A healthcare product focused on clearer access to care.",
    summary: "SEHA PLUS is presented as a mobile healthcare experience connecting appointment-oriented flows, medical services, and patient-facing information in one interface.",
    features: ["Appointment-oriented mobile flows", "Healthcare service discovery", "Patient-facing service information"],
    systems: ["Mobile healthcare experience"],
    screenshotGroups: [{ id: "presentation", label: "Presentation", screenshots: [{ src: sehaArtwork, alt: "SEHA PLUS healthcare application presentation showing three mobile screens", caption: "Existing SEHA PLUS presentation artwork", kind: "presentation" }] }],
    accent: "#61a0ff",
  },
  drevr: {
    id: "drevr",
    title: "DREVR",
    category: "MOBILITY / REAL-TIME PLATFORM",
    description: "A mobility product connecting people, routes, and decisions.",
    summary: "DREVR is presented as a mobile mobility platform centered on maps, route selection, and passenger-facing trip interactions.",
    features: ["Map-led mobility interface", "Route and destination selection", "Passenger-facing trip flows"],
    systems: ["Mobile mobility experience"],
    screenshotGroups: [{ id: "presentation", label: "Presentation", screenshots: [{ src: drevrArtwork, alt: "DREVR mobility application presentation showing two map-based mobile screens", caption: "Existing DREVR presentation artwork", kind: "presentation" }] }],
    accent: "#e07a32",
  },
  "restaurant-preview": {
    id: "restaurant-preview",
    title: "RESTAURANT APP",
    category: "MOBILE PRODUCT / TEMPORARY TITLE",
    description: "A mobile restaurant interface shown with its original artwork.",
    summary: "This temporary project entry presents the available restaurant application artwork while its final identity and verified case-study content are being prepared.",
    screenshotGroups: [{ id: "presentation", label: "Presentation", screenshots: [{ src: restaurantArtwork, alt: "Restaurant application presentation showing three mobile interfaces", caption: "Original project presentation asset", kind: "presentation" }] }],
    accent: "#ff6868",
  },
  "commerce-preview": {
    id: "commerce-preview",
    title: "COMMERCE STORE",
    category: "COMMERCE SYSTEM / TEMPORARY TITLE",
    description: "A responsive commerce interface shown across several devices.",
    summary: "This temporary project entry presents the available multi-device commerce artwork while final project details remain unverified.",
    screenshotGroups: [{ id: "presentation", label: "Presentation", screenshots: [{ src: commerceArtwork, alt: "Commerce store presentation across desktop, tablet, laptop, and mobile devices", caption: "Original responsive presentation asset", kind: "presentation" }] }],
    accent: "#f7bd45",
  },
  "rental-preview": {
    id: "rental-preview",
    title: "CAR RENTAL APP",
    category: "MOBILITY INTERFACE / TEMPORARY TITLE",
    description: "A car-rental mobile interface shown with its original artwork.",
    summary: "This temporary project entry presents the available car-rental application artwork while its final identity and implementation details are being confirmed.",
    screenshotGroups: [{ id: "presentation", label: "Presentation", screenshots: [{ src: carRentalArtwork, alt: "Car rental application presentation showing two mobile interfaces", caption: "Original project presentation asset", kind: "presentation" }] }],
    accent: "#6bb8ff",
  },
  athkar: {
    id: "athkar",
    title: "ATHKAR",
    category: "ISLAMIC MOBILE APPLICATION",
    description: "A mobile experience for daily Athkar and Islamic content.",
    summary: "Athkar is a mobile application designed for exploring daily Athkar, Quran-related content, and Islamic reminders through a focused green interface.",
    screenshotGroups: [{ id: "presentation", label: "Presentation", screenshots: [{ src: athkarArtwork, alt: "Athkar Islamic mobile application presentation showing three mobile interfaces", caption: "Existing Athkar presentation artwork", kind: "presentation" }] }],
    accent: "#45c66a",
  },
};

export const getProjectDetails = (id: string) => projectDetails[id];
