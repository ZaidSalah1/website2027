import type { IconType } from "react-icons";
import {
  SiDocker, SiExpo, SiFirebase, SiGithub, SiGreensock, SiMongodb,
  SiNextdotjs, SiNodedotjs, SiPostgresql, SiPrisma, SiReact, SiTailwindcss,
  SiTypescript,
} from "react-icons/si";

export type SkillGroup = "Frontend & Mobile" | "Backend & Database" | "Infrastructure" | "UI & Motion";
export type Skill = { code: string; name: string; use: string; group: SkillGroup; icon: IconType };
export type ExpertiseCategory = { id: string; short: string; label: string; technologies: string[] };

export const skills: Skill[] = [
  { code:"RE", name:"React", use:"INTERFACE SYSTEMS", group:"Frontend & Mobile", icon:SiReact },
  { code:"RN", name:"React Native", use:"CROSS-PLATFORM MOBILE", group:"Frontend & Mobile", icon:SiReact },
  { code:"TS", name:"TypeScript", use:"TYPED APPLICATIONS", group:"Frontend & Mobile", icon:SiTypescript },
  { code:"NO", name:"Node.js", use:"SERVER RUNTIMES", group:"Backend & Database", icon:SiNodedotjs },
  { code:"NX", name:"Next.js", use:"FULL-STACK WEB", group:"Frontend & Mobile", icon:SiNextdotjs },
  { code:"EX", name:"Expo", use:"MOBILE DELIVERY", group:"Frontend & Mobile", icon:SiExpo },
  { code:"MO", name:"MongoDB", use:"DOCUMENT DATA", group:"Backend & Database", icon:SiMongodb },
  { code:"PG", name:"PostgreSQL", use:"RELATIONAL DATA", group:"Backend & Database", icon:SiPostgresql },
  { code:"PR", name:"Prisma", use:"DATA TOOLING", group:"Backend & Database", icon:SiPrisma },
  { code:"FB", name:"Firebase", use:"AUTH & REAL-TIME", group:"Backend & Database", icon:SiFirebase },
  { code:"DO", name:"Docker", use:"CONTAINER WORKFLOWS", group:"Infrastructure", icon:SiDocker },
  { code:"GS", name:"GSAP", use:"MOTION SYSTEMS", group:"UI & Motion", icon:SiGreensock },
  { code:"TW", name:"Tailwind CSS", use:"DESIGN SYSTEMS", group:"UI & Motion", icon:SiTailwindcss },
  { code:"GI", name:"Git / GitHub", use:"VERSION CONTROL", group:"Infrastructure", icon:SiGithub },
];

export const skillGroups: SkillGroup[] = ["Frontend & Mobile", "Backend & Database", "Infrastructure", "UI & Motion"];

export const expertiseCategories: ExpertiseCategory[] = [
  { id:"mobile", short:"Mobile", label:"MOBILE DEVELOPMENT", technologies:["React Native","Expo","Expo Router","Redux Toolkit","Notifee","i18next","Firebase"] },
  { id:"web", short:"Web", label:"WEB DEVELOPMENT", technologies:["React","Next.js","TypeScript","JavaScript","Tailwind CSS","GSAP","Vite"] },
  { id:"backend", short:"Backend", label:"BACKEND ENGINEERING", technologies:["Node.js","Express.js","REST APIs","Socket.IO","JWT","Agenda","Prisma","Firebase Services"] },
  { id:"systems", short:"Systems", label:"SYSTEMS & INFRASTRUCTURE", technologies:["PostgreSQL","MongoDB","Linux / Ubuntu","Apache","PM2","Git / GitHub","VPS Deployment"] },
];
