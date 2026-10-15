import { useState } from "react";
import { Link } from "react-router-dom";
import type { Project } from "../types";
import styles from "./ProjectCard.module.css";

export default function ProjectCard({ project }: { project: Project }) {
  // Tap-to-flip fallback for touch devices without hover.
  const [tapped, setTapped] = useState(false);

  return (
    <article
      className={`${styles.card} ${tapped ? styles.isFlipped : ""}`}
      onClick={() => setTapped((v) => !v)}
    >
      <div className={styles.inner}>
        {/* Front */}
        <div className={`${styles.face} ${styles.front}`}>
          <h2 className={styles.name}>{project.name}</h2>
          <p className={styles.blurb}>{project.blurb}</p>
          <span className={styles.hint} aria-hidden="true">
            {project.pagePath ? "Tech & app →" : "Tech & code →"}
          </span>
        </div>

        {/* Back */}
        <div className={`${styles.face} ${styles.back}`}>
          <h3 className={styles.backTitle}>
            <span className="visually-hidden">{project.name} — </span>Built with
          </h3>
          <ul className={styles.tech}>
            {project.tech.map((tech) => (
              <li key={tech}>{tech}</li>
            ))}
          </ul>
          {project.pagePath ? <Link
            className={styles.repo}
            to={project.pagePath}
            onClick={(e) => e.stopPropagation()}
          >
            Explore the app &rarr;
            <span className="visually-hidden"> ({project.name})</span>
          </Link> : <a
            className={styles.repo}
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            View on GitHub &rarr;
            <span className="visually-hidden"> ({project.name})</span>
          </a>}
        </div>
      </div>
    </article>
  );
}
