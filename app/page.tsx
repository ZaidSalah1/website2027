import Hero from "../components/Hero";
import ProjectsShowcase from "../components/ProjectsShowcase";
import ReadyTransition from "../components/ReadyTransition";
import TechMatrix from "../components/TechMatrix";
import BehindTheBuild from "../components/BehindTheBuild";
import ContactConclusion from "../components/ContactConclusion";

export default function Home() {
  return (
    <main>
      <a className="skip-link" href="#hero-end">Skip introduction</a>
      <Hero />
      <ProjectsShowcase />
      <ReadyTransition />
      <TechMatrix />
      <BehindTheBuild />
      <ContactConclusion />
    </main>
  );
}
