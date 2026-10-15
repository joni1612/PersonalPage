import { projects } from "../data/projects";
import ProjectCard from "../components/ProjectCard";
import styles from "./Projects.module.css";

export default function Projects() {
  return (
    <div className="shell">
      <header className={`${styles.intro} rise`}>
        <h1 className={styles.heading}>Projects</h1>
        <p className={`${styles.lede} measure`}>
          A few things I have built outside of client and product work. Hover or
          tap a card to see the stack and explore the app or its code.
        </p>
      </header>

      <section aria-label="Personal projects">
        <ul className={styles.grid}>
          {projects.map((project) => (
            <li key={project.name}>
              <ProjectCard project={project} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
