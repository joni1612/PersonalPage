import { NavLink } from "react-router-dom";
import styles from "./Header.module.css";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? `${styles.link} ${styles.active}` : styles.link;

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={`shell ${styles.inner}`}>
        <NavLink to="/" className={styles.wordmark}>
          Jonathan Griesinger
        </NavLink>
        <nav aria-label="Primary" className={styles.nav}>
          <NavLink to="/" end className={linkClass}>
            CV
          </NavLink>
          <NavLink to="/projects" className={linkClass}>
            Projects
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
