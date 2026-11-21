import type { StaticImageData } from "next/image";
import seha1 from "../imgs/optimized/seha-plus/patient/seha1.webp";
import seha2 from "../imgs/optimized/seha-plus/facility/seha2.webp";
import seha22 from "../imgs/optimized/seha-plus/facility/seha2.webp";
import patient2 from "../imgs/optimized/seha-plus/patient/patient2.webp";
import patient3 from "../imgs/optimized/seha-plus/patient/patient3.webp";
import patient4 from "../imgs/optimized/seha-plus/modal/patient4.webp";
import patient5 from "../imgs/optimized/seha-plus/patient/patient5.webp";
import patient6 from "../imgs/optimized/seha-plus/patient/patient6.webp";
import patient7 from "../imgs/optimized/seha-plus/patient/patient7.webp";
import patient8 from "../imgs/optimized/seha-plus/patient/patient8.webp";
import patient9 from "../imgs/optimized/seha-plus/patient/patient9.webp";
import patient10 from "../imgs/optimized/seha-plus/patient/patient10.webp";
import patient11 from "../imgs/optimized/seha-plus/patient/patient11.webp";

import seha4 from "../imgs/optimized/seha-plus/doctor/seha4.webp";
import dr1 from "../imgs/optimized/seha-plus/doctor/dr1.webp";
import dr2 from "../imgs/optimized/seha-plus/doctor/dr2.webp";
import dr3 from "../imgs/optimized/seha-plus/doctor/dr3.webp";
import dr4 from "../imgs/optimized/seha-plus/doctor/dr4.webp";

import facility2 from "../imgs/optimized/seha-plus/facility/facility2.webp";
import facility3 from "../imgs/optimized/seha-plus/facility/facility3.webp";
import facility4 from "../imgs/optimized/seha-plus/facility/facility4.webp";
import facility6 from "../imgs/optimized/seha-plus/facility/facility6.webp";
import facility7 from "../imgs/optimized/seha-plus/facility/facility7.webp";

import drevr5 from "../imgs/optimized/drevr/passenger/drevr5.webp";
import drevr6 from "../imgs/optimized/drevr/passenger/drevr6.webp";
import drevr7 from "../imgs/optimized/drevr/passenger/drevr7.webp";
import drevr8 from "../imgs/optimized/drevr/passenger/drevr8.webp";
import drevr9 from "../imgs/optimized/drevr/passenger/drevr9.webp";

import drevr2 from "../imgs/optimized/drevr/driver/drevr2.webp";
import drevr22 from "../imgs/optimized/drevr/driver/drevr22.webp";
import drevr222 from "../imgs/optimized/drevr/driver/drevr222.webp";

import athkar1 from "../imgs/optimized/athkar/modal/athkar1.webp";
import athkar2 from "../imgs/optimized/athkar/athkar2.webp";
import food1 from "../imgs/optimized/restaurant/foodApo.webp";
import food2 from "../imgs/optimized/restaurant/foodApo1.webp";
import store1 from "../imgs/optimized/ecommerce/modal/store1.webp";
import store2 from "../imgs/optimized/ecommerce/modal/store2.webp";
import car1 from "../imgs/optimized/car-rental/modal/carRental.webp";
import car2 from "../imgs/optimized/car-rental/modal/carRental1.webp";
import dashboard1 from "../imgs/optimized/dashboards/dashboard1.webp";
import dashboard2 from "../imgs/optimized/dashboards/dashboard2.webp";

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
export type ProjectFeatureGroup = { label: string; items: string[] };
export type ProjectSystem = { name: string; description: string };
export type ProjectHighlight = { title: string; description: string };
export type ProjectActionKind =
  | "appStore"
  | "googlePlay"
  | "github"
  | "demo"
  | "website";
export type ProjectAction = {
  kind: ProjectActionKind;
  label: string;
  href?: string;
  state: "available" | "unavailable" | "coming-soon";
  note?: string;
};
export type ProjectDetails = {
  id: string;
  title: string;
  category: string;
  type: string;
  description: string;
  summary: string;
  role: string;
  status: string;
  featureGroups: ProjectFeatureGroup[];
  systems: ProjectSystem[];
  technologies?: Record<string, string[]>;
  architecture?: string[];
  engineeringHighlights?: ProjectHighlight[];
  challenges?: { challenge: string; approach: string; outcome?: string }[];
  integrations?: string[];
  screenshotGroups: ProjectScreenshotGroup[];
  access: {
    heading: string;
    description: string;
    status: string;
    releaseTarget?: string;
    note?: string;
    actions: ProjectAction[];
  };
  accent: string;
};
const unavailable = (
  kind: ProjectActionKind,
  label: string,
): ProjectAction => ({
  kind,
  label,
  state: "unavailable",
  note: "Public link not configured",
});
const soon = (kind: ProjectActionKind, label: string): ProjectAction => ({
  kind,
  label,
  state: "coming-soon",
  note: "Coming soon",
});
const available = (
  kind: ProjectActionKind,
  label: string,
  href: string,
): ProjectAction => ({ kind, label, href, state: "available" });
const shot = (
  src: StaticImageData,
  alt: string,
  caption: string,
): ProjectScreenshot => ({ src, alt, caption, kind: "presentation" });

export const projectDetails: Record<string, ProjectDetails> = {
  "seha-plus": {
    id: "seha-plus",
    title: "SEHA PLUS",
    category: "HEALTHCARE SAAS PLATFORM",
    type: "FULL-STACK / MOBILE / SAAS",
    description:
      "A connected healthcare ecosystem for patients, doctors, facilities, and platform teams.",
    summary:
      "Seha Plus is an integrated healthcare SaaS platform connecting patients, doctors, and medical facilities through a complete digital ecosystem. It combines appointment scheduling, virtual consultations, healthcare services, payments, clinical documentation, and centralized facility management.",
    role: "Full-Stack Developer — end-to-end product development across mobile applications, backend APIs, database models and business logic, administrative dashboards, third-party integrations, deployment, operations, feature delivery, and maintenance.",
    status:
      "Published mobile applications. Verified public store URLs have not yet been added to this portfolio.",
    featureGroups: [
      {
        label: "Care access",
        items: [
          "Doctor discovery and specialty browsing",
          "In-person and virtual consultation scheduling",
          "Laboratory and healthcare service booking",
        ],
      },
      {
        label: "Appointment operations",
        items: [
          "Configurable availability and schedules",
          "Confirmation, cancellation, and rescheduling",
          "Push reminders and appointment notifications",
        ],
      },
      {
        label: "Clinical workflows",
        items: [
          "Video consultations",
          "Prescriptions and clinical documentation",
          "Investigations and sick-note management",
        ],
      },
      {
        label: "Platform management",
        items: [
          "Facility and doctor administration",
          "Role-based operational controls",
          "Payments, transactions, refunds, and cancellations",
          "Arabic and English interfaces with RTL support",
        ],
      },
    ],
    systems: [
      {
        name: "Patient App",
        description:
          "Discovery, consultation booking, appointment management, healthcare services, and patient-facing information.",
      },
      {
        name: "Doctor App",
        description:
          "Appointment management, virtual consultations, and structured clinical documentation workflows.",
      },
      {
        name: "Facility Admin Dashboard",
        description:
          "Facility, doctor, schedule, appointment, and operational management.",
      },
      {
        name: "Super Admin Dashboard",
        description:
          "Platform-level administration for the wider healthcare ecosystem.",
      },
      {
        name: "Centralized Backend",
        description:
          "Shared REST services, business rules, persistence, payments, notifications, and scheduled work.",
      },
    ],
    technologies: {
      Mobile: [
        "React Native",
        "JavaScript / TypeScript",
        "Redux Toolkit",
        "i18next",
        "Firebase Cloud Messaging",
        "Notifee",
      ],
      "Web dashboards": ["React", "Vite"],
      Backend: ["Node.js", "Express", "REST APIs", "JWT"],
      Data: ["MongoDB", "MongoDB Atlas"],
      Infrastructure: ["Ubuntu VPS", "PM2", "Apache", "Agenda"],
    },
    architecture: [
      "Patient & Doctor apps",
      "REST API + JWT authorization",
      "Healthcare domain services",
      "MongoDB Atlas",
      "Facility & Super Admin dashboards",
      "Payments, video, notifications & jobs",
    ],
    engineeringHighlights: [
      {
        title: "Multi-application ecosystem",
        description:
          "Separate patient, doctor, facility, and platform interfaces share a centralized backend while enforcing responsibilities by user type.",
      },
      {
        title: "Appointment scheduling engine",
        description:
          "Consultation schedules, configurable slot durations, availability, and virtual or in-person booking lifecycles use shared business rules.",
      },
      {
        title: "Real-time consultations",
        description:
          "ZEGOCLOUD video sessions are integrated with appointment state and consultation progression.",
      },
      {
        title: "Healthcare documentation",
        description:
          "Clinical notes, prescriptions, investigations, and sick notes move through structured role-aware workflows.",
      },
      {
        title: "Payment and refund orchestration",
        description:
          "Lahza payments, transaction state, cancellations, and scheduled refund work are coordinated in the backend.",
      },
      {
        title: "Localization and scheduling",
        description:
          "Arabic/English RTL presentation, notifications, and Agenda jobs support reminders and time-sensitive work.",
      },
    ],
    challenges: [
      {
        challenge: "Keeping role-specific products consistent",
        approach:
          "Centralized domain rules and REST contracts while preserving focused interfaces and permissions.",
      },
      {
        challenge: "Coordinating time-sensitive care workflows",
        approach:
          "Explicit appointment and payment states supported by background jobs and notifications.",
      },
    ],
    integrations: [
      "ZEGOCLOUD video consultations",
      "Lahza payments",
      "Firebase Cloud Messaging",
      "Notifee notifications",
    ],
    screenshotGroups: [
      {
        id: "patient",
        label: "Patient App",
        screenshots: [
          shot(
            seha1,
            "Seha Plus patient application shown across three phones",
            "Patient care and service discovery",
          ),
          shot(
            patient2,
            "Seha Plus appointments, specialties, and laboratory services",
            "Patient application presentation",
          ),
          shot(
            patient3,
            "Seha Plus appointments, specialties, and laboratory services",
            "Patient application presentation",
          ),
          shot(
            patient4,
            "Seha Plus appointments, specialties, and laboratory services",
            "Patient application presentation",
          ),
          shot(
            patient5,
            "Seha Plus appointments, specialties, and laboratory services",
            "Patient application presentation",
          ),
          shot(
            patient6,
            "Seha Plus appointments, specialties, and laboratory services",
            "Patient application presentation",
          ),
          shot(
            patient7,
            "Seha Plus appointments, specialties, and laboratory services",
            "Patient application presentation",
          ),
          shot(
            patient8,
            "Seha Plus appointments, specialties, and laboratory services",
            "Patient application presentation",
          ),
          shot(
            patient9,
            "Seha Plus appointments, specialties, and laboratory services",
            "Patient application presentation",
          ),
          shot(
            patient10,
            "Seha Plus appointments, specialties, and laboratory services",
            "Patient application presentation",
          ),
          shot(
            patient11,
            "Seha Plus appointments, specialties, and laboratory services",
            "Patient application presentation",
          ),
        ],
      },
      {
        id: "doctor",
        label: "Doctor App",
        screenshots: [
          shot(
            seha4,
            "Seha Plus Doctor App appointment and clinical workflow interface",
            "Doctor application experience",
          ),
          shot(
            dr1,
            "Seha Plus Doctor App appointment and clinical workflow interface",
            "Doctor application experience",
          ),
          shot(
            dr2,
            "Seha Plus Doctor App appointment and clinical workflow interface",
            "Doctor application experience",
          ),
          shot(
            dr3,
            "Seha Plus Doctor App appointment and clinical workflow interface",
            "Doctor application experience",
          ),
          shot(
            dr4,
            "Seha Plus Doctor App appointment and clinical workflow interface",
            "Doctor application experience",
          ),
        ],
      },
      {
        id: "facility",
        label: "Facility Admin",
        screenshots: [
          shot(
            seha2,
            "Seha Plus facility dashboard displayed on a laptop",
            "Facility operations dashboard",
          ),
          shot(
            seha22,
            "Seha Plus clinic dashboard with activity and requests",
            "Dashboard interface presentation",
          ),
          shot(
            facility2,
            "Seha Plus clinic dashboard with activity and requests",
            "Dashboard interface presentation",
          ),
          shot(
            facility3,
            "Seha Plus clinic dashboard with activity and requests",
            "Dashboard interface presentation",
          ),
          shot(
            facility4,
            "Seha Plus clinic dashboard with activity and requests",
            "Dashboard interface presentation",
          ),
          shot(
            facility6,
            "Seha Plus clinic dashboard with activity and requests",
            "Dashboard interface presentation",
          ),
          shot(
            facility7,
            "Seha Plus clinic dashboard with activity and requests",
            "Dashboard interface presentation",
          ),
        ],
      },
    ],
    access: {
      heading: "EXPERIENCE SEHA PLUS",
      description:
        "Explore the healthcare platform through its available mobile applications.",
      status: "Published — store links awaiting configuration",
      note: "Patient and Doctor listings will be separated when their verified public URLs are added.",
      actions: [
        available("website", "Visit Website", "https://sehaplusapp.com"),
        unavailable("appStore", "App Store"),
        unavailable("googlePlay", "Google Play"),
      ],
    },
    accent: "#61a0ff",
  },
  drevr: {
    id: "drevr",
    title: "DREVR",
    category: "RIDE-HAILING & MOBILITY PLATFORM",
    type: "FULL-STACK / MOBILE / REAL-TIME SYSTEMS",
    description:
      "A real-time passenger, driver, and operations platform built for Saudi Arabia.",
    summary:
      "Drevr is a full-stack ride-hailing platform developed for the Saudi Arabian market. It connects passengers and drivers through dedicated mobile applications, real-time trip management, location tracking, integrated payments, and a centralized administration system.",
    role: "Full-Stack Developer — end-to-end platform development spanning passenger and driver applications, backend services, PostgreSQL architecture, administration, real-time communication, payments, mapping, deployment, and testing.",
    status:
      "Pre-launch. Passenger and Driver applications are being prepared for public availability.",
    featureGroups: [
      {
        label: "Booking",
        items: [
          "Immediate and scheduled rides",
          "One-way, round-trip, and multi-day journeys",
          "Distance- and duration-based fare estimation",
        ],
      },
      {
        label: "Live journey",
        items: [
          "Interactive maps and route visualization",
          "Live driver tracking and trip status",
          "Geolocation-based pickup validation",
        ],
      },
      {
        label: "Driver operations",
        items: [
          "Availability and heartbeat management",
          "Driver reassignment workflows",
          "Earnings and withdrawal requests",
        ],
      },
      {
        label: "Platform",
        items: [
          "Payment and administrative finance workflows",
          "Push notifications",
          "Arabic and English localization with RTL support",
        ],
      },
    ],
    systems: [
      {
        name: "Passenger Application",
        description:
          "Request or schedule trips, view estimated fares, track a driver, and manage the journey.",
      },
      {
        name: "Driver Application",
        description:
          "Manage availability, requests, pickup navigation, trip states, and earnings.",
      },
      {
        name: "Admin Dashboard",
        description:
          "Operational oversight for users, drivers, trips, payouts, and financial activity.",
      },
      {
        name: "Backend Services",
        description:
          "Centralized REST APIs and Socket.IO communication for the mobility ecosystem.",
      },
    ],
    technologies: {
      Mobile: [
        "React Native",
        "Expo",
        "TypeScript",
        "Expo Router",
        "Firebase notifications",
      ],
      Backend: ["Node.js", "Express", "REST APIs", "JWT", "Socket.IO"],
      Data: ["PostgreSQL", "Prisma ORM"],
      "Maps & location": [
        "Google Maps",
        "Google routing and distance services",
        "GPS services",
      ],
      Payments: ["Moyasar"],
      Infrastructure: ["Ubuntu VPS", "PM2"],
    },
    architecture: [
      "Passenger & Driver apps",
      "REST API + Socket.IO",
      "Trip, fare, location & finance services",
      "PostgreSQL via Prisma",
      "Admin dashboard",
      "Maps, payments & notifications",
    ],
    engineeringHighlights: [
      {
        title: "Real-time trip tracking",
        description:
          "Socket.IO and location updates keep passenger and driver views synchronized during active trips.",
      },
      {
        title: "Trip lifecycle management",
        description:
          "Explicit states coordinate acceptance, arrival, journey start, completion, and related transitions.",
      },
      {
        title: "Advanced booking models",
        description:
          "Immediate, scheduled, round-trip, and multi-day journeys share core rules while preserving different state needs.",
      },
      {
        title: "Driver availability",
        description:
          "Online state, heartbeats, location updates, and distance-aware operations support assignment decisions.",
      },
      {
        title: "Fare and finance workflows",
        description:
          "Route estimates feed pricing while payments, earnings, withdrawals, and administration form a connected workflow.",
      },
      {
        title: "Multi-day reassignment",
        description:
          "Remaining trip days and related financial calculations are handled when driver assignments change.",
      },
    ],
    challenges: [
      {
        challenge: "Maintaining a shared trip state",
        approach:
          "A structured lifecycle and real-time events keep passenger, driver, and backend transitions explicit.",
      },
      {
        challenge: "Combining live location with mobile usability",
        approach:
          "Map updates, route refreshes, pickup validation, marker direction, and navigation follow the active trip state.",
      },
    ],
    integrations: [
      "Google Maps and routing services",
      "Moyasar payments",
      "Firebase notifications",
      "Socket.IO",
    ],
    screenshotGroups: [
      {
        id: "passenger",
        label: "Passenger App",
        screenshots: [
          shot(
            drevr5,
            "Drevr passenger application booking and route interfaces",
            "Passenger booking experience",
          ),
          shot(
            drevr6,
            "Drevr passenger application booking and route interfaces",
            "Passenger booking experience",
          ),
          shot(
            drevr7,
            "Drevr passenger application booking and route interfaces",
            "Passenger booking experience",
          ),
          shot(
            drevr8,
            "Drevr passenger application booking and route interfaces",
            "Passenger booking experience",
          ),
          shot(
            drevr9,
            "Drevr passenger application booking and route interfaces",
            "Passenger booking experience",
          ),
        ],
      },
      {
        id: "driver",
        label: "Driver App",
        screenshots: [
          shot(
            drevr2,
            "Drevr driver application active trip and navigation interface",
            "Driver trip experience",
          ),
                    shot(
            drevr22,
            "Drevr driver application active trip and navigation interface",
            "Driver trip experience",
          ),
                    shot(
            drevr222,
            "Drevr driver application active trip and navigation interface",
            "Driver trip experience",
          ),
        ],
      },
    ],
    access: {
      heading: "DREVR — COMING SOON",
      description: "Preparing for the official launch in Saudi Arabia.",
      status: "Pre-launch",
      releaseTarget: "Target launch: March 2027 (tentative)",
      note: "Passenger and Driver applications are being prepared for public availability. Release is subject to final testing, platform approvals, and operational readiness.",
      actions: [
        soon("appStore", "App Store"),
        soon("googlePlay", "Google Play"),
      ],
    },
    accent: "#e07a32",
  },
  "dashboard-systems": {
    id: "dashboard-systems",
    title: "DASHBOARD SYSTEMS",
    category: "FULL-STACK / ADMIN PLATFORMS",
    type: "ADMINISTRATION PLATFORMS",
    description:
      "Custom administration platforms designed for analytics, product management, order workflows, and operational control.",
    summary:
      "A paired presentation of the Nexus Fashion and QTech administration dashboards, bringing analytics, product management, order workflows, and operational control into focused interfaces.",
    role: "Design and implementation of custom administration interfaces for two distinct product environments.",
    status:
      "Portfolio presentation. Verified public repositories and live deployments are not configured.",
    featureGroups: [
      {
        label: "Nexus Fashion",
        items: [
          "Analytics overview",
          "Product and catalog management",
          "Order and inventory workflows",
        ],
      },
      {
        label: "QTech E-Commerce",
        items: [
          "Product administration",
          "Order status workflows",
          "Sales reporting and operational views",
        ],
      },
    ],
    systems: [
      {
        name: "Nexus Fashion Admin Dashboard",
        description:
          "A dark administration interface for analytics, commerce operations, products, orders, inventory, and customers.",
      },
      {
        name: "QTech E-Commerce Admin Dashboard",
        description:
          "A light e-commerce administration interface for products, orders, customers, reports, and operational control.",
      },
    ],
    architecture: [
      "Administration interface",
      "Analytics and reporting views",
      "Product and order workflows",
      "Operational controls",
    ],
    engineeringHighlights: [
      {
        title: "Distinct dashboard environments",
        description:
          "Two administration products use their own visual language while keeping dense operational information clear and navigable.",
      },
      {
        title: "Workflow-oriented information design",
        description:
          "Analytics, products, orders, inventory, customers, and reporting are organized around frequent administration tasks.",
      },
    ],
    screenshotGroups: [
      {
        id: "dashboards",
        label: "Dashboard Systems",
        screenshots: [
          shot(
            dashboard1,
            "Nexus Fashion dark admin dashboard shown across four devices",
            "Nexus Fashion administration platform",
          ),
          shot(
            dashboard2,
            "QTech light e-commerce admin dashboard shown across four devices",
            "QTech e-commerce administration platform",
          ),
        ],
      },
    ],
    access: {
      heading: "VIEW THE DASHBOARDS",
      description:
        "No verified repository or live deployment is configured for these portfolio presentations.",
      status: "Portfolio presentation",
      actions: [
        unavailable("github", "GitHub Repository"),
        unavailable("demo", "Live Demo"),
      ],
    },
    accent: "#9b73ff",
  },
  athkar: {
    id: "athkar",
    title: "ATHKAR",
    category: "ISLAMIC MOBILE APPLICATION",
    type: "MOBILE APPLICATION",
    description: "Daily Islamic remembrance in a clear mobile experience.",
    summary:
      "A mobile application designed to make daily Islamic remembrance and devotional content accessible through a clear, easy-to-use experience.",
    role: "Mobile development focused on navigation, reusable interface components, content organization, and Arabic-first presentation.",
    status:
      "Portfolio project. No verified public store or repository link is configured.",
    featureGroups: [
      {
        label: "Devotional content",
        items: [
          "Morning and evening Athkar",
          "Daily remembrance categories",
          "Prayer-related Athkar",
          "Quran-related content",
        ],
      },
      {
        label: "Interaction",
        items: [
          "Tasbih and remembrance counters",
          "Arabic reading experience",
          "Category-led navigation",
        ],
      },
    ],
    systems: [
      {
        name: "Mobile Application",
        description:
          "An Arabic-first interface organizing remembrance categories, reading content, and counters.",
      },
    ],
    technologies: { Mobile: ["React Native"] },
    architecture: [
      "Category navigation",
      "Reusable mobile UI",
      "Content presentation",
      "Local interface state",
    ],
    engineeringHighlights: [
      {
        title: "Arabic-first presentation",
        description:
          "RTL-aware layout and Arabic typography keep devotional content readable.",
      },
      {
        title: "Reusable content patterns",
        description:
          "Shared category, reading, and counter components maintain consistency.",
      },
      {
        title: "Focused interface state",
        description:
          "Navigation and counter interactions use small, understandable states.",
      },
    ],
    screenshotGroups: [
      {
        id: "mobile",
        label: "Mobile App",
        screenshots: [
          shot(
            athkar1,
            "Athkar category, reading, and counter screens",
            "Athkar mobile experience",
          ),
          shot(
            athkar2,
            "Athkar shown on three mobile devices",
            "Arabic content and remembrance categories",
          ),
        ],
      },
    ],
    access: {
      heading: "EXPLORE ATHKAR",
      description:
        "Public access links have not yet been configured for this mobile project.",
      status: "Portfolio project",
      actions: [unavailable("github", "GitHub Repository")],
    },
    accent: "#45c66a",
  },
  "commerce-preview": smallProject(
    "commerce-preview",
    "E-COMMERCE PLATFORM",
    "E-COMMERCE WEB APPLICATION",
    "RESPONSIVE WEB EXPERIENCE",
    "A responsive storefront centered on product discovery and clear catalog navigation.",
    "An e-commerce web experience focused on product discovery, clear catalog navigation, and a streamlined shopping interface across desktop and mobile.",
    "Interface implementation and responsive presentation based on the available multi-device storefront work.",
    "Portfolio presentation. A production backend or public deployment is not verified.",
    "Storefront",
    [
      "Product browsing",
      "Category-led navigation",
      "Responsive product presentation",
      "Desktop, tablet, and mobile layouts",
    ],
    "Responsive Storefront",
    "A multi-device catalog interface for browsing products and navigating commerce content.",
    [
      "Responsive presentation layer",
      "Catalog navigation",
      "Product discovery interface",
    ],
    [
      {
        title: "Multi-device composition",
        description:
          "The same catalog hierarchy adapts across desktop, tablet, laptop, and mobile.",
      },
      {
        title: "Discovery hierarchy",
        description:
          "Product imagery, categories, and navigation remain prominent without overloading the storefront.",
      },
    ],
    "responsive",
    "Responsive Store",
    [
      shot(
        store1,
        "Storefront across desktop, tablet, laptop, and mobile",
        "Responsive storefront presentation",
      ),
      shot(
        store2,
        "Alternative multi-device commerce presentation",
        "Multi-device catalog experience",
      ),
    ],
    "#f7bd45",
  ),
  "rental-preview": smallProject(
    "rental-preview",
    "CAR RENTAL APP",
    "MOBILITY / VEHICLE RENTAL",
    "MOBILE INTERFACE",
    "A car-focused mobile experience for discovering vehicles and details.",
    "A mobile interface for discovering rental vehicles, exploring car details, and navigating a streamlined vehicle selection experience.",
    "Mobile interface development and product presentation for the available vehicle-discovery experience.",
    "Portfolio presentation. Booking, payments, availability, and deployment are not verified.",
    "Vehicle discovery",
    [
      "Vehicle browsing",
      "Brand-led discovery",
      "Vehicle detail screens",
      "Car-focused mobile navigation",
    ],
    "Mobile Interface",
    "A focused browsing and detail experience built around vehicle imagery and selection.",
    [
      "Mobile navigation",
      "Vehicle catalog presentation",
      "Vehicle detail interface",
    ],
    [
      {
        title: "Visual browsing",
        description:
          "Vehicle imagery and brand cues lead discovery while details stay easy to scan.",
      },
      {
        title: "Compact mobile hierarchy",
        description:
          "Browse and detail views prioritize decision-making information in a small viewport.",
      },
    ],
    "mobile",
    "Mobile App",
    [
      shot(
        car1,
        "Car rental application with two mobile screens",
        "Vehicle discovery and detail experience",
      ),
      shot(
        car2,
        "Alternative car rental mobile presentation",
        "Car-focused mobile interface",
      ),
    ],
    "#6bb8ff",
  ),
  "restaurant-preview": smallProject(
    "restaurant-preview",
    "RESTAURANT APP",
    "FOOD ORDERING / RESTAURANT EXPERIENCE",
    "MOBILE INTERFACE",
    "A mobile restaurant experience for food discovery and menu browsing.",
    "A mobile restaurant experience bringing food discovery, menu browsing, and restaurant-related interactions into an accessible interface.",
    "Mobile interface implementation and product presentation based on the available restaurant application work.",
    "Portfolio presentation. Ordering, payments, delivery tracking, and backend services are not verified.",
    "Visible experience",
    [
      "Food categories",
      "Menu browsing",
      "Food item listings",
      "Restaurant and food discovery",
      "Authentication and registration interfaces",
    ],
    "Mobile Interface",
    "A category-led food discovery and menu-browsing experience with account screens.",
    [
      "Mobile navigation",
      "Category and menu presentation",
      "Authentication interface",
    ],
    [
      {
        title: "Menu discoverability",
        description:
          "Category cues and food imagery create a direct route to item browsing.",
      },
      {
        title: "Reusable interface language",
        description:
          "Shared cards, navigation patterns, and account screens maintain continuity.",
      },
    ],
    "mobile",
    "Mobile App",
    [
      shot(
        food1,
        "Restaurant application with three mobile interfaces",
        "Food discovery and menu experience",
      ),
      shot(
        food2,
        "Alternative restaurant application presentation",
        "Mobile restaurant interface",
      ),
    ],
    "#ff6868",
  ),
};

function smallProject(
  id: string,
  title: string,
  category: string,
  type: string,
  description: string,
  summary: string,
  role: string,
  status: string,
  featureLabel: string,
  features: string[],
  systemName: string,
  systemDescription: string,
  architecture: string[],
  highlights: ProjectHighlight[],
  groupId: string,
  groupLabel: string,
  screenshots: ProjectScreenshot[],
  accent: string,
): ProjectDetails {
  return {
    id,
    title,
    category,
    type,
    description,
    summary,
    role,
    status,
    featureGroups: [{ label: featureLabel, items: features }],
    systems: [{ name: systemName, description: systemDescription }],
    architecture,
    engineeringHighlights: highlights,
    screenshotGroups: [{ id: groupId, label: groupLabel, screenshots }],
    access: {
      heading: "VIEW THE PROJECT",
      description:
        "No verified repository or live demo is configured for this portfolio presentation.",
      status: "Portfolio presentation",
      actions: [
        unavailable("github", "GitHub Repository"),
        unavailable("demo", "Live Demo"),
      ],
    },
    accent,
  };
}
export const getProjectDetails = (id: string) => projectDetails[id];
