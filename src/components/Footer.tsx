import { social } from "../data/site";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`shell ${styles.inner}`}>
        <nav aria-label="Elsewhere" className={styles.links}>
          <a href={social.github} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a href={social.linkedin} target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
          <a href={`mailto:${social.email}`}>Email</a>
        </nav>
      </div>
    </footer>
  );
}
