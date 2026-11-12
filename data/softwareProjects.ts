export type SoftwareProject = {
  id: string;
  name: string;
  category: string;
  description: string;
  technologies: string[];
  mainMedia: string;
  secondaryMedia?: string;
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
    category: "MOBILE PRODUCT / TEMPORARY LABEL",
    description: "Existing restaurant application artwork presented as a development preview. Final project identity and verified case-study copy are pending.",
    technologies: ["STACK PENDING", "MOBILE", "ASSET READY"],
    mainMedia: "/imgs/foodApo.png",
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
    category: "COMMERCE SYSTEM / TEMPORARY LABEL",
    description: "Existing multi-device commerce artwork prepared for the cinematic gallery. Final project details will replace this temporary publication copy.",
    technologies: ["STACK PENDING", "RESPONSIVE", "ASSET READY"],
    mainMedia: "/imgs/store.png",
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
    category: "MOBILITY INTERFACE / TEMPORARY LABEL",
    description: "Existing car-rental application artwork used to validate the flexible gallery system. Project title, stack, and outcomes remain intentionally unclaimed.",
    technologies: ["STACK PENDING", "MOBILE", "ASSET READY"],
    mainMedia: "/imgs/carRental.png",
    accent: "#6bb8ff",
    ambient: "rgba(107, 184, 255, .17)",
    order: 3,
    visible: true,
    featured: false,
    temporary: true,
  },
];

export const visibleSoftwareProjects = softwareProjects
  .filter((project) => project.visible && !project.featured)
  .sort((a, b) => a.order - b.order);
