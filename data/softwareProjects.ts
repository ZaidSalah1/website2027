import { projectHeroMedia, type ProjectHeroMedia } from "./projectHeroMedia";

export type SoftwareProject = {
  id: string;
  name: string;
  displayTitle: string;
  category: string;
  description: string;
  technologies: string[];
  heroMedia: ProjectHeroMedia;
  accent: string;
  ambient: string;
  order: number;
  visible: boolean;
  featured: boolean;
  temporary: boolean;
};

// These entries intentionally use temporary public labels until the final
// project names and verified case-study copy are supplied.
export const softwareProjects: SoftwareProject[] = [
  {
    id: "restaurant-preview",
    name: "PROJECT PREVIEW 01",
    displayTitle: "RESTAURANT APP",
    category: "MOBILE PRODUCT / TEMPORARY LABEL",
    description: "A mobile restaurant interface presented with its original application artwork.",
    technologies: ["MOBILE", "TEMPORARY TITLE"],
    heroMedia: projectHeroMedia["restaurant-preview"],
    accent: "#ff6868",
    ambient: "rgba(255, 88, 88, .18)",
    order: 1,
    visible: true,
    featured: false,
    temporary: true,
  },
  {
    id: "commerce-preview",
    name: "PROJECT PREVIEW 02",
    displayTitle: "COMMERCE STORE",
    category: "COMMERCE SYSTEM / TEMPORARY LABEL",
    description: "A multi-device commerce interface shown with its existing responsive mockups.",
    technologies: ["RESPONSIVE", "TEMPORARY TITLE"],
    heroMedia: projectHeroMedia["commerce-preview"],
    accent: "#f7bd45",
    ambient: "rgba(247, 189, 69, .16)",
    order: 2,
    visible: true,
    featured: false,
    temporary: true,
  },
  {
    id: "rental-preview",
    name: "PROJECT PREVIEW 03",
    displayTitle: "CAR RENTAL APP",
    category: "MOBILITY INTERFACE / TEMPORARY LABEL",
    description: "A mobile car-rental interface presented with its original application mockup.",
    technologies: ["MOBILE", "TEMPORARY TITLE"],
    heroMedia: projectHeroMedia["rental-preview"],
    accent: "#6bb8ff",
    ambient: "rgba(107, 184, 255, .17)",
    order: 3,
    visible: true,
    featured: false,
    temporary: true,
  },
  {
    id: "athkar",
    name: "ATHKAR",
    displayTitle: "ATHKAR",
    category: "ISLAMIC MOBILE APPLICATION",
    description: "A thoughtfully designed mobile experience for exploring daily Athkar, Quran-related content, and Islamic reminders.",
    technologies: ["MOBILE", "ISLAMIC APP"],
    heroMedia: projectHeroMedia.athkar,
    accent: "#45c66a",
    ambient: "rgba(69, 198, 106, .15)",
    order: 4,
    visible: true,
    featured: false,
    temporary: false,
  },
];

export const visibleSoftwareProjects = softwareProjects
  .filter((project) => project.visible && !project.featured)
  .sort((a, b) => a.order - b.order);
