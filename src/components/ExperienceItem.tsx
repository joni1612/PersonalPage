import type { Role } from "../types";
import styles from "./ExperienceItem.module.css";

export default function ExperienceItem({ role }: { role: Role }) {
  return (
    <article className={styles.item}>
      <div className={styles.meta}>
        <p className={styles.dates}>{role.dates}</p>
      </div>
      <div className={styles.body}>
        <h3 className={styles.company}>{role.company}</h3>
        <p className={styles.title}>
          {role.title}
          <span className={styles.context}> · {role.context}</span>
        </p>
        <div className={styles.lines}>
          {role.lines.map((line, i) => (
            <p key={i} className="measure">
              {line}
            </p>
          ))}
        </div>
        <ul className={styles.stack}>
          {role.stack.map((tech) => (
            <li key={tech}>{tech}</li>
          ))}
        </ul>
      </div>
    </article>
  );
}
