import { Link } from "react-router-dom";

import { cv } from "../data/cv";
import TechStack from "../components/TechStack";
import ExperienceItem from "../components/ExperienceItem";
import portrait from "../assets/portrait.jpg";
import portraitSmall from "../assets/portrait-small.jpg";
import styles from "./Home.module.css";

export default function Home() {
  return (
    <div className="shell">
      {/* Hero */}
      <section className={`${styles.hero} rise`} aria-labelledby="hero-name">
        <figure className={styles.heroPortrait}>
          <img
            src={portrait}
            srcSet={`${portraitSmall} 900w, ${portrait} 1600w`}
            sizes="(max-width: 860px) 90vw, 40vw"
            width={1600}
            height={1067}
            alt="Jonathan Griesinger, smiling, in a navy blazer beside a glass railing in a bright modern building."
            loading="eager"
          />
        </figure>
        <div className={styles.heroText}>
          <p className={styles.eyebrow}>{cv.location}</p>
          <h1 id="hero-name" className={styles.name}>
            {cv.name}
          </h1>
          <p className={styles.tagline}>{cv.tagline}</p>
          <ul className={styles.primary}>
            {cv.primaryStack.map((tech) => (
              <li key={tech}>{tech}</li>
            ))}
          </ul>
          <Link to="/projects" className={styles.cta}>
            See selected projects &rarr;
          </Link>
        </div>
      </section>

      {/* About */}
      <section className={styles.section} aria-labelledby="about-heading">
        <h2 id="about-heading" className={styles.sectionHeading}>
          About
        </h2>
        <div className={`${styles.about} measure`}>
          {cv.summary.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </section>

      {/* Tech stack */}
      <section className={styles.section} aria-labelledby="stack-heading">
        <h2 id="stack-heading" className={styles.sectionHeading}>
          Tech stack
        </h2>
        <TechStack groups={cv.techGroups} />
      </section>

      {/* Experience */}
      <section className={styles.section} aria-labelledby="experience-heading">
        <h2 id="experience-heading" className={styles.sectionHeading}>
          Experience
        </h2>
        <div className={styles.experience}>
          {cv.roles.map((role) => (
            <ExperienceItem key={role.company} role={role} />
          ))}
        </div>
      </section>
    </div>
  );
}
