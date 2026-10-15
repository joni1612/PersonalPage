import { Link } from "react-router-dom";
import styles from "./Projects.module.css";

export default function NotFound() {
  return <div className={`shell ${styles.intro}`}>
    <h1 className={styles.heading}>Page not found</h1>
    <p className="measure">This address doesn’t lead to a page on this site.</p>
    <p><Link to="/">Back to CV</Link></p>
  </div>;
}
