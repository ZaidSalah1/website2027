import Hero from "../components/Hero";
import ProjectsShowcase from "../components/ProjectsShowcase";
import ReadyTransition from "../components/ReadyTransition";
import TechMatrix from "../components/TechMatrix";
import BehindTheBuild from "../components/BehindTheBuild";
import ContactConclusion from "../components/ContactConclusion";
import GlobalDock from "../components/GlobalDock";
import CinematicProjectGallery from "../components/CinematicProjectGallery";
import DesignExhibition from "../components/DesignExhibition";
import ProjectDetailsProvider from "../components/ProjectDetailsProvider";

export default function Home() {
  return (
    <ProjectDetailsProvider><main>
      <a className="skip-link" href="#hero-end">Skip introduction</a>
      <Hero />
      <ProjectsShowcase />
      <CinematicProjectGallery />
      <DesignExhibition />
      <ReadyTransition />
      <TechMatrix />
      <BehindTheBuild />
      <ContactConclusion />
      <GlobalDock />
    </main></ProjectDetailsProvider>
  );
}
