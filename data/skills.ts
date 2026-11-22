import type { IconType } from "react-icons";
import { MdOutlineNotificationsActive, MdOutlineSchedule } from "react-icons/md";
import {
  SiApache, SiExpo, SiExpress, SiFirebase, SiGit, SiGithub, SiGreensock,
  SiI18Next, SiJavascript, SiJsonwebtokens, SiLinux, SiMongodb, SiNextdotjs,
  SiNodedotjs, SiPm2, SiPostgresql, SiPrisma, SiReact,
  SiRedux, SiSocketdotio, SiTailwindcss, SiTypescript, SiVite,
} from "react-icons/si";
import { TbApi, TbCloudComputing } from "react-icons/tb";

export type SkillGroup = "Frontend & Mobile" | "Backend & APIs" | "Database & Services" | "Tools & Infrastructure";
export type Skill = { name: string; use: string; group: SkillGroup; icon: IconType; tone?: string };
export type ExpertiseCategory = { id: string; short: string; label: string; technologies: string[] };

export const skills: Skill[] = [
  { name:"React", use:"INTERFACE SYSTEMS", group:"Frontend & Mobile", icon:SiReact, tone:"#61dafb" },
  { name:"Next.js", use:"FULL-STACK WEB", group:"Frontend & Mobile", icon:SiNextdotjs, tone:"#f4f7fb" },
  { name:"React Native", use:"CROSS-PLATFORM MOBILE", group:"Frontend & Mobile", icon:SiReact, tone:"#61dafb" },
  { name:"Expo", use:"MOBILE DELIVERY", group:"Frontend & Mobile", icon:SiExpo, tone:"#f4f7fb" },
  { name:"JavaScript", use:"WEB APPLICATIONS", group:"Frontend & Mobile", icon:SiJavascript, tone:"#f7df1e" },
  { name:"TypeScript", use:"TYPED APPLICATIONS", group:"Frontend & Mobile", icon:SiTypescript, tone:"#3178c6" },
  { name:"Tailwind CSS", use:"DESIGN SYSTEMS", group:"Frontend & Mobile", icon:SiTailwindcss, tone:"#38bdf8" },
  { name:"Redux Toolkit", use:"STATE MANAGEMENT", group:"Frontend & Mobile", icon:SiRedux, tone:"#8b5cf6" },
  { name:"React Navigation", use:"MOBILE NAVIGATION", group:"Frontend & Mobile", icon:SiReact, tone:"#61dafb" },
  { name:"Expo Router", use:"FILE-BASED ROUTING", group:"Frontend & Mobile", icon:SiExpo, tone:"#f4f7fb" },
  { name:"Vite", use:"FRONTEND TOOLING", group:"Frontend & Mobile", icon:SiVite, tone:"#a78bfa" },
  { name:"GSAP", use:"MOTION SYSTEMS", group:"Frontend & Mobile", icon:SiGreensock, tone:"#88ce02" },
  { name:"i18next", use:"LOCALIZATION", group:"Frontend & Mobile", icon:SiI18Next, tone:"#26a69a" },
  { name:"Node.js", use:"SERVER RUNTIMES", group:"Backend & APIs", icon:SiNodedotjs, tone:"#5fa04e" },
  { name:"Express.js", use:"API SERVICES", group:"Backend & APIs", icon:SiExpress, tone:"#f4f7fb" },
  { name:"REST APIs", use:"SERVICE CONTRACTS", group:"Backend & APIs", icon:TbApi, tone:"#5aa7ff" },
  { name:"Socket.IO", use:"REAL-TIME EVENTS", group:"Backend & APIs", icon:SiSocketdotio, tone:"#f4f7fb" },
  { name:"JWT", use:"AUTHENTICATION", group:"Backend & APIs", icon:SiJsonwebtokens, tone:"#d45cff" },
  { name:"Agenda", use:"BACKGROUND JOBS", group:"Backend & APIs", icon:MdOutlineSchedule, tone:"#70b7ff" },
  { name:"PostgreSQL", use:"RELATIONAL DATA", group:"Database & Services", icon:SiPostgresql, tone:"#4169e1" },
  { name:"MongoDB", use:"DOCUMENT DATA", group:"Database & Services", icon:SiMongodb, tone:"#47a248" },
  { name:"Prisma", use:"DATA TOOLING", group:"Database & Services", icon:SiPrisma, tone:"#8bb8e8" },
  { name:"Firebase", use:"AUTH & SERVICES", group:"Database & Services", icon:SiFirebase, tone:"#ffca28" },
  { name:"Firebase Cloud Messaging", use:"PUSH DELIVERY", group:"Database & Services", icon:SiFirebase, tone:"#ffca28" },
  { name:"Notifee", use:"MOBILE NOTIFICATIONS", group:"Database & Services", icon:MdOutlineNotificationsActive, tone:"#5aa7ff" },
  { name:"Git", use:"VERSION CONTROL", group:"Tools & Infrastructure", icon:SiGit, tone:"#f05032" },
  { name:"GitHub", use:"SOURCE COLLABORATION", group:"Tools & Infrastructure", icon:SiGithub, tone:"#f4f7fb" },
  { name:"Linux / Ubuntu", use:"SERVER ENVIRONMENTS", group:"Tools & Infrastructure", icon:SiLinux, tone:"#fcc624" },
  { name:"Apache", use:"WEB SERVER", group:"Tools & Infrastructure", icon:SiApache, tone:"#d22128" },
  { name:"PM2", use:"PROCESS MANAGEMENT", group:"Tools & Infrastructure", icon:SiPm2, tone:"#5aa7ff" },
  { name:"VPS Deployment", use:"PRODUCTION DELIVERY", group:"Tools & Infrastructure", icon:TbCloudComputing, tone:"#70b7ff" },
];

export const skillGroups: SkillGroup[] = ["Frontend & Mobile", "Backend & APIs", "Database & Services", "Tools & Infrastructure"];

export const expertiseCategories: ExpertiseCategory[] = [
  { id:"mobile", short:"Mobile", label:"MOBILE DEVELOPMENT", technologies:["React Native","Expo","Expo Router","Redux Toolkit","Notifee","i18next","Firebase"] },
  { id:"web", short:"Web", label:"WEB DEVELOPMENT", technologies:["React","Next.js","TypeScript","JavaScript","Tailwind CSS","GSAP","Vite"] },
  { id:"backend", short:"Backend", label:"BACKEND ENGINEERING", technologies:["Node.js","Express.js","REST APIs","Socket.IO","JWT","Agenda","Prisma","Firebase Services"] },
  { id:"systems", short:"Systems", label:"SYSTEMS & INFRASTRUCTURE", technologies:["PostgreSQL","MongoDB","Linux / Ubuntu","Apache","PM2","Git / GitHub","VPS Deployment"] },
];
